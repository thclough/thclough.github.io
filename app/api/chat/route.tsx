import { streamText, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { TEMPLATE } from "@/lib/chatData";
import { generateText, generateObject } from "ai";
import { getCvText, getHtmlContent } from "@/lib/utils/api-utils";
import { links } from "@/lib/clientData";

import { z } from "zod";

type generateMaterialProps = {
  messages: UIMessage[];
  html: string;
  activeSection: string;
  cvText: string;
};

async function generateMaterial({
  messages,
  html,
  activeSection,
  cvText,
}: generateMaterialProps) {
  const initialModel = groq("llama-3.1-8b-instant");

  const { object: cvSourceObject } = await generateObject({
    model: initialModel,
    messages,
    schema: z.object({
      canUseCV: z.boolean(),
      infoToUse: z.string().optional(),
    }),
    system: `You are the digital version of Tighe Clough named /taɪɡ/ on Tighe Clough's website answering visitor questions as a chatbot. 
    The chatbot UI is found on the website. Tighe Clough's CV is available for download on the website but not directly viewable.
    Evaluate whether or not material from Tighe Clough's pdf CV text found below can be used to answer the most recent user query.

    If you can use information from the below CV to answer the question WITHOUT INFERRING, state the information in infoToUse.
    Do not provided information if it is not valuable or you are unsure.
    
    The CV text is separate from the website. The tigheclough.com link in the CV is just a link to his website.
    The CV is not a website but a pdf file.

    START OF PDF CV TO EVALUATE: 
    ${cvText}
    END OF CV TO EVALUATE`,
  });

  const { object: htmlSourceObject } = await generateObject({
    model: initialModel,
    messages,
    schema: z.object({
      canUseHtml: z.boolean(),
      infoToUse: z.string().optional(),
    }),
    system: `You are the digital version of Tighe Clough named /taɪɡ/ on Tighe Clough's website answering visitor questions as a chatbot. 
    The chatbot UI is found on the website.
    Evaluate whether or not (true or false) you can use information found in Tighe Clough's website html below to answer the most recent user query. 
    
    Answer false if this most recent user query is not about Tighe Clough or his website.

    If true, state the information from the website html (or lack of information in the website html) in terms of how it answers the query. 
    
    entire website html: ${html}

    END OF HTML

    Here are some examples for you to follow:

    START OF EXAMPLES

    User: "Where can I find more details about Tighe's background?"
    Assistant: { canUseHtml: true, infoToUse: "Tighe's resume and CV are available for download in the Home section. Links to his linkedin and github are also included in the Home section." }

    User: "Where is Tighe's blog?"
    Assistant: { canUseHtml: true, infoToUse: "No blog appears on Tighe Clough's website according to the website html" }

    END OF EXAMPLES

    Your answer:
    `,
  });

  console.log(cvSourceObject);
  console.log(htmlSourceObject);

  if (
    htmlSourceObject.canUseHtml &&
    typeof htmlSourceObject.infoToUse === "string" &&
    htmlSourceObject.infoToUse.length > 0
  ) {
    var sectionNames = links.map((link) => link.name) as string[];
    sectionNames = [...sectionNames, "null"];

    const { object: sourceSectionObject } = await generateObject({
      model: initialModel,
      messages,
      schema: z.object({
        mainSectionWhereInfoComesFrom: z
          .enum(sectionNames as [string, ...string[]])
          .optional()
          .describe(
            "Main section where information comes from in the website (if there is one)"
          ),
      }),
      system: `You are the digital version of Tighe Clough named /taɪɡ/ on Tighe Clough's website answering visitor questions as a chatbot. 
    The chatbot UI is found on the website.

    Below is the Tighe Clough website html and information based on the html that can be used to answer the visitor's most recent query.

    If the information to answer the query mostly comes from one and only one specific html section with section tag, state the html section in mainInfoSection (do not answer if part of website is not an html section with section tag)
    If the html information cannot be mainly attributed to one section, do not provide an answer for mainInfoSection.

    You can only answer with ONE section if you decide to attribute the information to a section.

    You must answer with one of ${sectionNames}. Choose null if the main sections do not apply.

    website html: ${html}
    
    information based on html to answer query: ${htmlSourceObject.infoToUse}`,
    });

    console.log(sourceSectionObject);
  }

  // information you can use stated as third peroson

  // check whether you can use new material
  // if can use material, separate conditionals for each
  // CV just array of info

  // const { htmlBoolObject } = await generateObject({

  // })
}

export async function POST(req: Request) {
  const {
    messages,
    activeSection,
  }: { messages: UIMessage[]; activeSection: string } = await req.json();

  const htmlContent = await getHtmlContent();
  const cvText = await getCvText();

  await generateMaterial({
    messages,
    html: htmlContent,
    activeSection,
    cvText,
  });

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system: TEMPLATE,
    messages,
  });

  return result.toDataStreamResponse();
}

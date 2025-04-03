import { LanguageModel, LanguageModelV1, streamText, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { TEMPLATE } from "@/lib/chatData";
import { generateText, generateObject } from "ai";
import { getCvText, getHtmlContent } from "@/lib/utils/api-utils";
import { links } from "@/lib/clientData";
import { StringValidation, z } from "zod";

const htmlEvidenceSchema = z.object({
  canUseHtml: z.boolean(),
  infoToUse: z.string().optional(),
});

type htmlEvidenceType = z.infer<typeof htmlEvidenceSchema> | null;

var sectionNames = links.map((link) => link.name) as string[];
sectionNames = [...sectionNames, "null"];

const sectionSourceSchema = z.object({
  mainSectionWhereInfoComesFrom: z
    .enum(sectionNames as [string, ...string[]])
    .optional()
    .describe(
      "Main section where information comes from in the website (if there is one)"
    ),
});

type sectionSourceType = z.infer<typeof sectionSourceSchema> | null;

const cvEvidenceSchema = z.object({
  canUseCV: z.boolean(),
  infoToUse: z.string().optional(),
});

type cvEvidenceType = z.infer<typeof cvEvidenceSchema> | null;

async function generateHtmlEvidence({
  model,
  messages,
}: {
  messages: UIMessage[];
  model: LanguageModelV1;
}) {
  let htmlEvidenceObject: htmlEvidenceType;
  let sectionSourceObject: sectionSourceType;

  const htmlContent = await getHtmlContent();

  try {
    const { object } = await generateObject({
      model,
      messages,
      schema: htmlEvidenceSchema,
      system: `You are the digital version of Tighe Clough named /taɪɡ/ on Tighe Clough's website answering visitor questions as a chatbot. 
      The chatbot UI is found on the website.
      Evaluate whether or not (true or false) you can use information found in Tighe Clough's website html below to answer the most recent user query. 
      
      Answer false if this most recent user query is not about Tighe Clough or his website.

      If true, state the information from the website html (or lack of information in the website html) in terms of how it answers the query. 
      
      entire website html: ${htmlContent}

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
    htmlEvidenceObject = object;
  } catch (error) {
    htmlEvidenceObject = null;
  }

  if (
    htmlEvidenceObject &&
    htmlEvidenceObject.canUseHtml &&
    typeof htmlEvidenceObject.infoToUse === "string" &&
    htmlEvidenceObject.infoToUse.length > 0
  ) {
    try {
      const { object } = await generateObject({
        model,
        messages,
        schema: sectionSourceSchema,
        system: `You are the digital version of Tighe Clough named /taɪɡ/ on Tighe Clough's website answering visitor questions as a chatbot. 
      The chatbot UI is found on the website.

      Below is the Tighe Clough website html and information based on the html that can be used to answer the visitor's most recent query.

      If the information to answer the query mostly comes from one and only one specific html section with section tag, state the html section in mainInfoSection (do not answer if part of website is not an html section with section tag)
      If the html information cannot be mainly attributed to one section, do not provide an answer for mainInfoSection.

      You can only answer with ONE section if you decide to attribute the information to a section.

      You must answer with one of ${sectionNames}. Choose null if the main sections do not apply.

      website html: ${htmlContent}
      
      information based on html to answer query: ${htmlEvidenceObject.infoToUse}`,
      });
      sectionSourceObject = object;
    } catch (error) {
      sectionSourceObject = null;
    }
  } else {
    sectionSourceObject = null;
  }

  return { htmlEvidenceObject, sectionSourceObject };
}

function createSystemAddition({
  cvEvidenceObject,
  htmlEvidenceObject,
  sectionSourceObject,
}: {
  cvEvidenceObject: cvEvidenceType;
  htmlEvidenceObject: htmlEvidenceType;
  sectionSourceObject: sectionSourceType;
}): string {
  let systemAddition: string;
  let cvPart: string;
  let htmlPart: string;

  if (cvEvidenceObject) {
    if (cvEvidenceObject.canUseCV && cvEvidenceObject.infoToUse) {
      cvPart = `The following information gained from looking at Tighe's pdf CV can help you answer the most recent query:
      START OF CV INFORMATION
      ${cvEvidenceObject.infoToUse}
      END OF CV INFORMATION`;
    } else {
      cvPart =
        "You have access to information from Tighe's CV, but no information from the CV can be used to answer the most recent visitor query";
    }
  } else {
    cvPart =
      "If there is a question specifically asking about Tighe's CV, respond that have trouble accessing it currently";
  }

  if (htmlEvidenceObject) {
    if (htmlEvidenceObject.canUseHtml && htmlEvidenceObject.infoToUse) {
      htmlPart = `The following information gained from looking at Tighe's website html can help you answer the most recent query:
      START OF WEBSITE HTML INFORMATION
      ${htmlEvidenceObject.infoToUse}
      END OF WEBSITE HTML INFORMATION`;
    } else {
      htmlPart =
        "You have access to html information from Tighe's website, but no information from the website html can be used to answer the most recent visitor query";
    }
  } else {
    htmlPart =
      "If there is a question specifically asking about the content on Tighe's website, respond that have trouble accessing the website html currently";
  }

  // if (sectionSourceObject && sectionSourceObject.mainSectionWhereInfoComesFrom !== "null") {
  //     sourcePart = `You can tell the user that this html website information mainly comes from the ${sectionSourceObject.mainSectionWhereInfoComesFrom} section of the website if helpful.`
  // } else {
  //   sourcePart = ''
  // }

  systemAddition = cvPart + "\n" + htmlPart;

  return systemAddition;
}

async function generateCvEvidence({
  model,
  messages,
}: {
  messages: UIMessage[];
  model: LanguageModelV1;
}) {
  let cvEvidenceObject: cvEvidenceType;

  try {
    const cvText = await getCvText();

    const { object } = await generateObject({
      model,
      messages,
      schema: cvEvidenceSchema,
      system: `You are the digital version of Tighe Clough named /taɪɡ/ on Tighe Clough's website answering visitor questions as a chatbot. 
    The chatbot UI is found on the website. Tighe Clough's CV is available for download on the website but not directly viewable.
    Evaluate whether or not material from Tighe Clough's pdf CV text found below can be used to answer the most recent user query.

    If you can use information from the below CV to answer the question WITHOUT INFERRING, state the information in infoToUse.
    Do not provided information if it is not valuable or you are unsure.
    
    The CV text is separate from the website. The tigheclough.com link in the CV is just a link to his website.
    The CV is not a website but a pdf file.

    START OF PDF CV TO EVALUATE: 
    ${cvText}
    END OF PDF CV TO EVALUATE`,
    });

    cvEvidenceObject = object;
  } catch (error) {
    cvEvidenceObject = null;
  }

  return cvEvidenceObject;
}

export async function POST(req: Request) {
  const {
    messages,
    activeSection,
  }: { messages: UIMessage[]; activeSection: string } = await req.json();

  const initialModel = groq("llama-3.1-8b-instant");

  // if you can't get either one, insert something in template
  const cvEvidenceObject = await generateCvEvidence({
    model: initialModel,
    messages,
  });

  const { htmlEvidenceObject, sectionSourceObject } =
    await generateHtmlEvidence({
      model: initialModel,
      messages,
    });

  const systemString = createSystemAddition({
    cvEvidenceObject,
    htmlEvidenceObject,
    sectionSourceObject,
  });

  console.log(systemString);

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system: TEMPLATE + "\n" + systemString,
    messages,
  });

  return result.toDataStreamResponse();
}

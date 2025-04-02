import { streamText, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { TEMPLATE } from "@/lib/chatData";
import { generateText, generateObject } from "ai";
import { getCvText, getHtmlContent } from "@/lib/utils/api-utils";
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
  const reasonModel = groq("llama-3.1-8b-instant");

  const { object: cvBoolObject } = await generateObject({
    model: reasonModel,
    messages,
    schema: z.object({
      canUseCV: z
        .boolean()
        .describe(
          "whether or not you can use information from the CV to reply to the most recent user input"
        ),
    }),
    system: `You are the digital version of Tighe Clough named /taɪɡ/ on Tighe Clough's website fielding a visitor. 
    Evaluate whether or not material from the following CV can be used to answer the most recent user input 

    CV to evaluate: ${cvText}`,
  });

  console.log(cvBoolObject);

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

  // await generateMaterial({
  //   messages,
  //   html: htmlContent,
  //   activeSection,
  //   cvText,
  // });

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system: TEMPLATE,
    messages,
  });

  return result.toDataStreamResponse();
}

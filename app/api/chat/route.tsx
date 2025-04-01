import { streamText, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { TEMPLATE } from "@/lib/chatData";
import { generateText, generateObject } from "ai";
import { getCvText, getHtmlContent } from "@/lib/utils/api-utils";

async function generateAnswer(
  input: string,
  html: string,
  activeSection: string,
  pdftext: string
) {
  const reasonModel = groq("llama-3.1-8b-instant");

  console.log("placeholder");
}

export async function POST(req: Request) {
  const {
    messages,
    activeSection,
  }: { messages: UIMessage[]; activeSection: string } = await req.json();

  const htmlContent = await getHtmlContent();
  const cvText = await getCvText();

  console.log(htmlContent.slice(0, 20));
  console.log(cvText.slice(0, 300));

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system: TEMPLATE,
    messages,
  });

  return result.toDataStreamResponse();
}

import { streamText, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { TEMPLATE } from "@/lib/chatData";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  console.log(messages);

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system: TEMPLATE,
    messages,
  });

  return result.toDataStreamResponse();
}

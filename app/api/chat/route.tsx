import { streamText, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { TEMPLATE } from "@/lib/chatData";
import { createClient } from "redis";
import { parse, HTMLElement } from "node-html-parser";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.connect().catch((err) => {
  console.error("Redis connection failed:", err);
});

function parseHtml(html: string) {
  const root = parse(html);
  //sanitize for safety (even though it isn't user input)
  root
    .querySelectorAll("script, style, iframe, path")
    .forEach((el) => el.remove());

  root.querySelectorAll("*").forEach((element) => {
    element.removeAttribute("class");
  });

  return root.toString();
}

async function getHtmlContent(
  pageUrl: string,
  redisKey: string
): Promise<string> {
  // look in redis store, if no
  let htmlContent = await redis.get(redisKey);

  if (!htmlContent) {
    console.log("NO HTML");
    const response = await fetch(pageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch HTML: ${response.statusText}`);
    }
    htmlContent = await response.text();

    //parse html
    const cleanHtml = parseHtml(htmlContent);

    await redis.set(redisKey, cleanHtml);

    return cleanHtml;
  }

  return htmlContent;
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[]; html: string } =
    await req.json();

  // change url based on development stage
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

  const pageUrl = `${baseUrl}/`;
  const redisKey = "html:root";
  const htmlContent = await getHtmlContent(pageUrl, redisKey);

  console.log(htmlContent);

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system: TEMPLATE,
    messages,
  });

  return result.toDataStreamResponse();
}

process.on("SIGTERM", async () => {
  await redis.disconnect();
});

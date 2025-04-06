import { createClient } from "redis";
import { parse } from "node-html-parser";
import { RedisClientType } from "@redis/client";

let redis: RedisClientType | null = null;

async function initRedis() {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
      },
    });

    redis.on("error", (err) => console.error("Redis Client Error", err));
    await redis.connect().then(() => console.log("connected to redis"));
  }
  return redis;
}

async function getRedisClient() {
  return await initRedis();
}

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

export async function getHtmlContent(): Promise<string> {
  // get the html
  const redisKey = "html:root";

  // get the client
  const redis = await getRedisClient();

  // look in redis store, if no key for html, generate new html
  let htmlContent = await redis.get(redisKey);

  // fallback, can parse and add new html if not available
  if (!htmlContent) {
    // change url based on development stage
    const isProduction = process.env.NODE_ENV === "production";
    const baseUrl = isProduction
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";

    const pageUrl = `${baseUrl}/`;

    console.log("Setting new html..");
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

export async function getCvText() {
  const redis = await getRedisClient();

  const cvText = await redis.get("pdf:CV");

  if (!cvText) {
    throw new Error(`Failed to fetch cv text`);
  }

  return cvText;
}

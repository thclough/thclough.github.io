import { parse } from "node-html-parser";
import { createClient } from "redis";
import axios from "axios";

async function fetchAndProcessHtml() {
  if (!process.env.TARGET_URL) throw new Error("TARGET_URL not set");
  if (!process.env.REDIS_URL) throw new Error("REDIS_URL not set");

  const redis = createClient({ url: process.env.REDIS_URL });

  try {
    await redis.connect();

    // 1. Fetch live HTML
    const response = await axios.get(process.env.TARGET_URL, {
      headers: { "User-Agent": "HTML-Processor" },
      timeout: 10000,
    });

    // 2. Parse and sanitize
    const sanitizedHtml = parseHtml(response.data);

    // 3. Store in Redis (24h TTL)
    await redis.set("html:root", sanitizedHtml);
    console.log("✅ HTML processed and stored");
  } catch (error) {
    console.error(
      "❌ Processing failed:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  } finally {
    await redis.quit();
  }
}

function parseHtml(html: string): string {
  const root = parse(html);

  // Remove unwanted elements
  root
    .querySelectorAll("script, style, iframe, path")
    .forEach((el) => el.remove());

  // Remove all class attributes
  root.querySelectorAll("*").forEach((el) => el.removeAttribute("class"));

  return root.toString();
}

// Execute
fetchAndProcessHtml();

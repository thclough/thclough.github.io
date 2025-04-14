import { parse } from "node-html-parser";
import { createClient } from "redis";
import axios from "axios";
import path from "path";

async function fetchAndProcessHtml() {
  // Load environment variables
  if (process.env.NODE_ENV !== "production" && !process.env.GITHUB_ACTIONS) {
    require("dotenv").config({ path: path.join(__dirname, "../.env.local") });
  }

  console.log(Object.keys(process.env));

  // Validate env vars
  const REDIS_URL = process.env.REDIS_URL;
  if (!REDIS_URL) throw new Error("REDIS_URL is missing");

  const TARGET_URL = process.env.TARGET_URL;
  if (!TARGET_URL) throw new Error("TARGET_URL not set");

  const redis = createClient({ url: REDIS_URL });

  try {
    await redis.connect();

    // 1. Fetch live HTML
    const response = await axios.get(TARGET_URL, {
      headers: { "User-Agent": "HTML-Processor" },
      timeout: 10000,
    });

    // 2. Parse and sanitize
    const sanitizedHtml = parseHtml(response.data);

    // 3. Store in Redis
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

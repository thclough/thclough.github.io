import fs from "fs";
import parse from "pdf-parse";
import { createClient, RedisClientType } from "redis";
import path from "path";

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, "../.env.local") });
}

// Validate env vars
const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) throw new Error("REDIS_URL is missing");

// Redis client setup
const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL,
});

// Specify the single PDF file to process
const pdfPath: string = "public/TigheCloughCVPublic.pdf";

async function parseCV() {
  try {
    // Check if the file exists
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found at: ${pdfPath}`);
    }

    // Read and parse the PDF
    const dataBuffer: Buffer = fs.readFileSync(pdfPath);
    const data = await parse(dataBuffer);

    return data.text;
  } catch (error) {
    console.error("Error processing PDF:", error);
  }
}

async function main() {
  try {
    await redisClient.connect();
    console.log("connected to redis");

    const text = await parseCV();

    if (text) {
      // Use the filename (without extension) as the Redis key
      const key: string = "pdf:CV";
      await redisClient.set(key, text);
      console.log(`Stored text from CV in Redis under key: ${key}`);
    }
  } catch (error) {
    console.error("Error in main process:", error);
  } finally {
    await redisClient.quit();
    console.log("Disconnected from Redis");
  }
}

main().catch(console.error);

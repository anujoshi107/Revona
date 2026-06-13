import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env");
}

export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const genAIModel = "gemini-2.5-flash";
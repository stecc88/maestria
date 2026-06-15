import { GoogleGenerativeAI } from "@google/generative-ai"
import { z } from "zod"

export const getGeminiClient = () => {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
}

/**
 * Robustly parses JSON from a Gemini response string,
 * stripping potential markdown wrappers.
 */
export const safeParseJson = (text: string) => {
  try {
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim()
    return JSON.parse(cleanText)
  } catch (e) {
    console.error("Failed to parse Gemini JSON:", e, "Raw text:", text)
    return null
  }
}

/**
 * Parses and validates Gemini JSON response against a Zod schema.
 */
export async function validateAiResponse<T>(
  rawText: string,
  schema: z.Schema<T>
): Promise<T | null> {
  const json = safeParseJson(rawText)
  if (!json) return null

  const result = schema.safeParse(json)
  if (!result.success) {
    console.error("AI Response validation failed:", result.error.format())
    return null
  }

  return result.data
}

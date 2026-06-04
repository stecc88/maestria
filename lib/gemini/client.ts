import { GoogleGenerativeAI } from "@google/generative-ai"

export const getGeminiClient = () => {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
}

export const safeParseJson = (text: string) => {
  try {
    const cleanText = text.replace(/```json|```/g, "").trim()
    return JSON.parse(cleanText)
  } catch (e) {
    console.error("Failed to parse JSON from Gemini:", text)
    return null
  }
}

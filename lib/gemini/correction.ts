import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function getCorrectionFromGemini(
  content: string,
  level: string,
  type: string,
  prompt?: string
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json",
    }
  })

  const systemPrompt = `You are an expert Italian language examiner with 20 years of experience evaluating written Italian as a foreign language, following international assessment standards equivalent to CILS and PLIDA certification exams. You assess writing with the rigor of a professional examiner.

Evaluate the following Italian text written by a student.

TARGET LEVEL: ${level}
TEXT TYPE: ${type}
ASSIGNMENT INSTRUCTIONS (if any): ${prompt || 'None'}

STUDENT TEXT:
"${content}"

Respond ONLY with a valid JSON object with this exact structure (no markdown, no extra text, just the JSON):
{
  "detected_level": "B1",
  "overall_score": 72,
  "exam_compliant": true,
  "score_coherence": 18,
  "score_vocabulary": 17,
  "score_grammar": 16,
  "score_task_completion": 21,
  "examiner_comment": "Professional and constructive comment in Spanish (150-200 words), as if from an official examiner.",
  "pros": [
    "Strength 1 with specific example from text in quotes",
    "Strength 2",
    "Strength 3"
  ],
  "cons": [
    "Weakness 1 with explanation and example from text in quotes",
    "Weakness 2",
    "Weakness 3"
  ],
  "suggestions": [
    { "category": "Conectores", "tip": "Specific suggestion", "example": "Improvement example" },
    { "category": "Vocabulario", "tip": "Specific suggestion", "example": "Example" },
    { "category": "Estructura", "tip": "Specific suggestion", "example": "Example" }
  ],
  "corrected_text": "Fully corrected version of the text",
  "inline_corrections": [
    { "original": "phrase with error", "corrected": "corrected phrase", "explanation": "explanation in Spanish", "error_type": "gramatica" }
  ],
  "error_categories": {
    "gramatica": "description of main grammatical error",
    "vocabulario": "description of main vocabulary error",
    "ortografia": "description of main spelling error",
    "registro": "register issue if any",
    "estructura": "structural issue if any"
  },
  "next_steps": [
    "Concrete action 1 to improve",
    "Action 2",
    "Action 3"
  ],
  "meets_level_requirements": {
    "A1": true, "A2": true, "B1": true, "B2": false, "C1": false, "C2": false
  }
}`

  try {
    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    const text = response.text()

    // Attempt to parse JSON
    try {
      return JSON.parse(text)
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", text)
      throw new Error("La IA devolvió un formato inválido. Reintentá por favor.")
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error)
    throw new Error("Error al conectar con la IA: " + error.message)
  }
}

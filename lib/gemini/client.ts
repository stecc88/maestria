import { z } from "zod"

/**
 * Utility to perform fetch with retries for Gemini API,
 * specifically handling 429 (Rate Limit) and 503 (High Demand).
 */
export async function fetchGeminiWithRetry(url: string, options: any, maxRetries = 15) {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      // If success or non-retriable error (anything other than 429 or 503), return response
      if (response.ok || (response.status !== 429 && response.status !== 503)) {
        return response;
      }

      // Try to parse error message from response
      let errorMsg = `Gemini API returned ${response.status}`;
      try {
        const errorJson = await response.clone().json();
        if (errorJson.error?.message) errorMsg = errorJson.error.message;
        else if (errorJson.message) errorMsg = errorJson.message;
      } catch (e) {}

      lastError = new Error(errorMsg);

      // Even more aggressive exponential backoff for sustained high demand
      // We limit the max delay to 60 seconds
      const jitter = Math.random() * 5000;
      const delay = Math.min(Math.pow(2.5, i) * 1000 + jitter, 60000);

      console.warn(`Gemini API busy (${response.status}): ${errorMsg}. Retrying in ${Math.round(delay)}ms... (Attempt ${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));

    } catch (err: any) {
      lastError = err;
      // Network errors retry with jitter
      const jitter = Math.random() * 3000;
      const delay = Math.pow(2, i) * 1000 + jitter;
      console.error(`Gemini Network Error: ${err.message}. Retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
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

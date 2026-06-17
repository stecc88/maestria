import { z } from "zod";

export const correctionSchema = z.object({
  detected_level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  overall_score: z.number().min(0).max(100),
  exam_compliant: z.boolean(),
  score_coherence: z.number().min(0).max(25),
  score_vocabulary: z.number().min(0).max(25),
  score_grammar: z.number().min(0).max(25),
  score_task_completion: z.number().min(0).max(25),
  examiner_comment: z.string(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  suggestions: z.array(z.object({
    category: z.string(),
    tip: z.string(),
    example: z.string()
  })),
  corrected_text: z.string(),
  inline_corrections: z.array(z.object({
    original: z.string(),
    corrected: z.string(),
    explanation: z.string(),
    error_type: z.string()
  })),
  error_categories: z.object({
    grammatica: z.string(),
    lessico: z.string(),
    ortografia: z.string(),
    registro: z.string().optional(),
    struttura: z.string().optional()
  }),
  next_steps: z.array(z.string()),
  meets_level_requirements: z.record(z.string(), z.boolean())
});

export const taskGenerationSchema = z.object({
  title: z.string(),
  theory_explanation: z.string(),
  exercise_instructions: z.string(),
  exercise_content: z.any(),
  error_focus: z.string()
});

export const taskEvaluationSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
  error_overcome: z.boolean()
});

export const writingAssistantSchema = z.object({
  outline: z.array(z.object({
    section: z.string(),
    suggestions: z.array(z.string()),
    key_vocabulary: z.array(z.string()),
    useful_phrases: z.array(z.string())
  })),
  cultural_tips: z.array(z.string()).optional(),
  grammar_focus: z.array(z.string()).optional()
});

export type CorrectionResponse = z.infer<typeof correctionSchema>;
export type TaskGenerationResponse = z.infer<typeof taskGenerationSchema>;
export type TaskEvaluationResponse = z.infer<typeof taskEvaluationSchema>;
export type WritingAssistantResponse = z.infer<typeof writingAssistantSchema>;

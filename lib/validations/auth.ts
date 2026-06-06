import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email({
    message: "Email non valido",
  }),
  password: z.string().min(1, {
    message: "La password è obbligatoria",
  }),
})

export const registerSchema = z.object({
  role: z.enum(["student", "teacher"]),
  full_name: z.string().min(2, {
    message: "Il nome completo deve avere almeno 2 caratteri",
  }),
  email: z.string().email({
    message: "Email non valido",
  }),
  password: z.string().min(8, {
    message: "La password deve avere almeno 8 caratteri",
  }),
  confirm_password: z.string(),
  // Student specific
  target_level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
  teacher_code: z.string().optional(),
  // Teacher specific
  institution: z.string().optional(),
  bio: z.string().max(200, {
    message: "La biografia non può superare i 200 caratteri",
  }).optional(),
  accept_terms: z.boolean().refine((val) => val === true, {
    message: "Devi accettare i termini e le condizioni",
  }),
}).refine((data) => data.password === data.confirm_password, {
  message: "Le password non corrispondono",
  path: ["confirm_password"],
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>

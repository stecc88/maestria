import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email({
    message: "Email no válido",
  }),
  password: z.string().min(1, {
    message: "La contraseña es obligatoria",
  }),
})

export const registerSchema = z.object({
  role: z.enum(["student", "teacher"]),
  full_name: z.string().min(2, {
    message: "El nombre completo debe tener al menos 2 caracteres",
  }),
  email: z.string().email({
    message: "Email no válido",
  }),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
  confirm_password: z.string(),
  // Student specific
  target_level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
  teacher_code: z.string().optional(),
  // Teacher specific
  institution: z.string().optional(),
  bio: z.string().max(200, {
    message: "La biografía no puede superar los 200 caracteres",
  }).optional(),
  accept_terms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
}).refine((data) => data.password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>

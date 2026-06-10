"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { loginSchema, registerSchema } from "@/lib/validations/auth"
import { redirect } from "next/navigation"

export async function signIn(formData: any) {
  const supabase = createClient()
  const validatedFields = loginSchema.safeParse(formData)

  if (!validatedFields.success) {
    return { error: "Dati non validi" }
  }

  const { email, password } = validatedFields.data

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Fetch profile to get role and status
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', data.user.id)
    .single()

  if (profileError || !profile) {
    return { error: "Profilo utente non trovato. Contatta il supporto." }
  }

  return {
    success: true,
    profile
  }
}

export async function signUp(formData: any) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const validatedFields = registerSchema.safeParse(formData)

  if (!validatedFields.success) {
    return { error: "Dati non validi" }
  }

  const { email, password, full_name, role, ...extra } = validatedFields.data

  // Check if user already exists in profiles
  const { data: existingProfile } = await adminSupabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (existingProfile) {
    return { error: "Questa email è già registrata. Prova ad accedere." }
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        role,
      }
    }
  })

  if (authError) {
    return { error: authError.message + " (codice: " + authError.status + ")" }
  }

  // If user is null but no error, it usually means the user exists in Auth but not confirmed
  if (!authData.user) {
    return { error: "L'utente esiste già o richiede la conferma via email. Controlla la tua casella postale." }
  }

  const userId = authData.user.id

  // 1. Create Profile
  const { error: profileError } = await adminSupabase.from('profiles').insert({
    id: userId,
    full_name,
    email,
    role,
    status: 'pending'
  })

  if (profileError) return { error: profileError.message }

  // 2. Role specific data
  if (role === 'student') {
    let teacher_id = null
    if (extra.teacher_code) {
      const { data: teacher } = await adminSupabase
        .from('teachers')
        .select('id')
        .ilike('teacher_code', extra.teacher_code.trim())
        .single()

      if (teacher) {
        teacher_id = teacher.id
      }
    }

    await adminSupabase.from('students').insert({
      id: userId,
      teacher_id,
      teacher_code_used: extra.teacher_code,
      target_level: extra.target_level,
    })
  } else if (role === 'teacher') {
    const teacherCode = `${full_name.substring(0, 3).toUpperCase()}${new Date().getFullYear()}${Math.floor(100 + Math.random() * 900)}`

    await adminSupabase.from('teachers').insert({
      id: userId,
      teacher_code: teacherCode,
      bio: extra.bio,
      institution: extra.institution,
    })
  }

  // 3. Try to notify first available admin
  const { data: admin } = await adminSupabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)
    .single()

  if (admin) {
    await adminSupabase.from('notifications').insert({
      user_id: admin.id,
      type: 'new_registration',
      title: 'Nuova registrazione',
      message: `Nuovo ${role} registrato: ${full_name}`,
    })
  }

  return { success: true }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function validateTeacherCode(code: string) {
  if (!code) return { exists: false }

  // Use admin client to bypass RLS during registration validation
  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('teachers')
    .select('id, profiles(full_name)')
    .ilike('teacher_code', code.trim())
    .single()

  if (error || !data) return { exists: false }

  // Handle potential array response for profiles (Supabase join behavior)
  const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;

  return {
    exists: true,
    teacherName: profile?.full_name || "Insegnante"
  }
}

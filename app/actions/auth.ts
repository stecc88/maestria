"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { loginSchema, registerSchema } from "@/lib/validations/auth"
import { redirect } from "next/navigation"

export async function signIn(formData: any) {
  const supabase = createClient()
  const validatedFields = loginSchema.safeParse(formData)

  if (!validatedFields.success) {
    return { error: "Datos inválidos" }
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
    return { error: "No se encontró el perfil de usuario. Contacte a soporte." }
  }

  return {
    success: true,
    profile
  }
}

export async function signUp(formData: any) {
  console.log("signUp llamado con:", { email: formData.email, role: formData.role })
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const validatedFields = registerSchema.safeParse(formData)

  if (!validatedFields.success) {
    return { error: "Datos inválidos" }
  }

  const { email, password, full_name, role, ...extra } = validatedFields.data
  console.log("1. Iniciando registro", { email, role })

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
    console.log("Error de Supabase Auth:", authError.code, authError.message, authError.status)
    return { error: authError.message }
  }

  const userId = authData.user?.id
  if (!userId) return { error: "Error al crear el usuario" }
  console.log("2. Usuario creado en Auth", { userId })

  // 1. Create Profile
  const { error: profileError } = await adminSupabase.from('profiles').insert({
    id: userId,
    full_name,
    email,
    role,
    status: 'pending'
  })

  if (profileError) return { error: profileError.message }
  console.log("3. Perfil creado")

  // 2. Role specific data
  if (role === 'student') {
    let teacher_id = null
    if (extra.teacher_code) {
      const { data: teacher } = await adminSupabase
        .from('teachers')
        .select('id')
        .eq('teacher_code', extra.teacher_code)
        .single()
      if (teacher) teacher_id = teacher.id
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
  console.log("4. Datos de rol creados")

  // 3. Try to notify first available admin
  const { data: admin } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)
    .single()

  if (admin) {
    await supabase.from('notifications').insert({
      user_id: admin.id,
      type: 'new_registration',
      title: 'Nuevo registro',
      message: `Nuevo ${role} registrado: ${full_name}`,
    })
  }

  console.log("5. Registro completo")
  return { success: true }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function validateTeacherCode(code: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('teachers')
    .select('id, profiles(full_name)')
    .eq('teacher_code', code)
    .single()

  if (error || !data) return { exists: false }

  return {
    exists: true,
    teacherName: (data.profiles as any).full_name
  }
}

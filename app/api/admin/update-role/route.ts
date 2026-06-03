import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Check authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { userId, newRole } = await request.json();

    if (!userId || !newRole) {
      return NextResponse.json({ error: "User ID and new role are required" }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    // Update role in profiles table
    const { error: updateError } = await adminSupabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (updateError) throw updateError;

    // If changing to student, we might need to ensure they have a record in students table
    if (newRole === 'student') {
        const { data: existingStudent } = await adminSupabase.from('students').select('id').eq('id', userId).single();
        if (!existingStudent) {
            await adminSupabase.from('students').insert({ id: userId, target_level: 'A1' });
        }
    }

    // If changing to teacher, we might need to ensure they have a record in teachers table
    if (newRole === 'teacher') {
        const { data: existingTeacher } = await adminSupabase.from('teachers').select('id').eq('id', userId).single();
        if (!existingTeacher) {
            const teacherCode = `TEA${Math.floor(1000000 + Math.random() * 9000000)}`;
            await adminSupabase.from('teachers').insert({ id: userId, teacher_code: teacherCode });
        }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

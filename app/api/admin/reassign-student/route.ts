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

    const { studentId, newTeacherId } = await request.json();

    if (!studentId || !newTeacherId) {
      return NextResponse.json({ error: "Student ID and Teacher ID are required" }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    // Update teacher_id in students table
    const { error: updateError } = await adminSupabase
      .from("students")
      .update({ teacher_id: newTeacherId })
      .eq("id", studentId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

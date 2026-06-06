import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    // Update profile status to approved
    const { error: profileError } = await adminSupabase
      .from("profiles")
      .update({ status: "approved" })
      .eq("id", userId);

    if (profileError) throw profileError;

    // If it's a teacher, we might want to update approved_at in teachers table
    const { data: targetProfile } = await adminSupabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (targetProfile?.role === "teacher") {
      await adminSupabase
        .from("teachers")
        .update({ approved_at: new Date().toISOString() })
        .eq("id", userId);
    }

    // Create a notification for the user
    await adminSupabase.from("notifications").insert({
      user_id: userId,
      type: "system",
      title: "Account Approvato",
      message: "Il tuo account è stato approvato! Ora puoi accedere a tutte le funzioni di Maestria.",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error approving user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

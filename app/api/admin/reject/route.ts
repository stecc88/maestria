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

    const { userId, reason } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!reason) {
      return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    // Update profile status to rejected and set reason
    const { error: profileError } = await adminSupabase
      .from("profiles")
      .update({
        status: "rejected",
        rejection_reason: reason
      })
      .eq("id", userId);

    if (profileError) throw profileError;

    // Create a notification for the user
    await adminSupabase.from("notifications").insert({
      user_id: userId,
      type: "system",
      title: "Account non approvato",
      message: `La tua richiesta di registrazione non è stata approvata. Motivo: ${reason}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error rejecting user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

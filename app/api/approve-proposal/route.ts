import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    const { error } = await supabase
      .from("leads")
      .update({
        proposal_status: "Approved",
      })
      .eq("id", id);

    if (error) {
      throw error;
    }

    await fetch("http://localhost:5678/webhook-test/approve-proposal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to approve proposal",
      },
      {
        status: 500,
      },
    );
  }
}

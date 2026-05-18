import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to delete lead",
      },
      {
        status: 500,
      },
    );
  }
}

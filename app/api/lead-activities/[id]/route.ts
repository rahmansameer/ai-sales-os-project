import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { data, error } = await supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_id", params.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch activities",
      },
      {
        status: 500,
      },
    );
  }
}

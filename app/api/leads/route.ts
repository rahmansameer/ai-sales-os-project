import { NextResponse } from "next/server";
import base from "@/lib/airtable";

export async function GET() {
  try {
    const records = await base("Leads")
      .select({
        maxRecords: 50,
        view: "Grid view",
      })
      .all();

    const leads = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    return NextResponse.json(leads);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 },
    );
  }
}

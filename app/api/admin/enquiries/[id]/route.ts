import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const validStatuses = ["NEW", "RESPONDED", "CLOSED"];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return NextResponse.json({ success: false, error: "Invalid status." }, { status: 400 });
    }

    const updated = await db.contactEnquiry.update({
      where: { id },
      data: { status: status.toUpperCase() },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Failed to update enquiry status:", err);
    return NextResponse.json({ success: false, error: "Failed to update status." }, { status: 500 });
  }
}

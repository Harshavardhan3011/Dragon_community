import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactFormSchema } from "@/lib/validations";
import { rateLimit, generateReferenceId, sanitizeInput } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const { allowed } = rateLimit(`contact:${ip}`, 5, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid form data.", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, type, subject, message, socialLink } = result.data;
    const reference = generateReferenceId();

    await db.contactEnquiry.create({
      data: {
        name: sanitizeInput(name),
        email: sanitizeInput(email),
        type,
        subject: sanitizeInput(subject),
        message: sanitizeInput(message),
        status: "NEW",
        reference,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been received. We will get back to you soon.",
      data: { referenceId: reference },
    });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

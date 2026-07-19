import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loginFormSchema } from "@/lib/validations";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials." },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const admin = await db.admin.findUnique({ where: { email } });
    if (!admin) {
      // Delay to prevent timing attacks
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    await createSession(admin.id);

    return NextResponse.json({ success: true, message: "Login successful." });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}

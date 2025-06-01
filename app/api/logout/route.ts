import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // Expira inmediatamente
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json({ success: true });
}

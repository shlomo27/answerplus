import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username, avatarId, interests } = await req.json();

  if (!username || username.length < 3) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }
  if (!interests || interests.length === 0) {
    return NextResponse.json({ error: "Select at least one interest" }, { status: 400 });
  }

  // Find user by email (more reliable than ID which may be OAuth sub)
  const email = session.user.email;
  if (!email) {
    return NextResponse.json({ error: "No email in session" }, { status: 400 });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = await prisma.user.findFirst({
      where: { username, NOT: { id: dbUser.id } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: "Username taken" }, { status: 409 });
    }

    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        username,
        avatarId: avatarId ?? null,
        interests: JSON.stringify(interests),
        onboarded: true,
      },
    });
  } catch (e) {
    console.error("[profile] DB error:", e);
    return NextResponse.json({ error: "DB error: " + String(e) }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

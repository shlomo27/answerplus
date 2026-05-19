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

  // Check username uniqueness (excluding current user)
  const existing = await prisma.user.findFirst({
    where: { username, NOT: { id: session.user.id } },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: "Username taken" }, { status: 409 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      username,
      avatarId: avatarId ?? null,
      interests: JSON.stringify(interests),
      onboarded: true,
    },
  });

  return NextResponse.json({ ok: true });
}

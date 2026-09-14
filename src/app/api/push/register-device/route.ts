import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token, platform } = await req.json();
  if (!token || !platform) {
    return NextResponse.json({ error: "Missing token or platform" }, { status: 400 });
  }

  await prisma.deviceToken.upsert({
    where: { token },
    update: { userId: session.user.id, platform },
    create: { userId: session.user.id, token, platform },
  });

  return NextResponse.json({ ok: true });
}

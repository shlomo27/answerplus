import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ onboarded: false, username: null });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { onboarded: true, username: true },
    });
    return NextResponse.json({ onboarded: user?.onboarded ?? false, username: user?.username ?? null });
  } catch {
    return NextResponse.json({ onboarded: false, username: null });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAIL = "shlomo2708@gmail.com";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email || session.user.email.toLowerCase() !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      onboarded: true,
      accounts: { select: { provider: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalQuestions = await prisma.question.count();
  const totalComments = await prisma.comment.count();

  return NextResponse.json({ users, totalQuestions, totalComments });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const question = await prisma.question.findUnique({ where: { id } });
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const existing = await prisma.like.findUnique({
      where: { questionId_userId: { questionId: id, userId: user.id } },
    });

    let liked: boolean;
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      liked = false;
    } else {
      await prisma.like.create({ data: { questionId: id, userId: user.id } });
      liked = true;

      // Create notification for question owner if different user
      if (question.userId && question.userId !== user.id) {
        await prisma.notification.create({
          data: {
            userId: question.userId,
            type: "like",
            questionId: id,
            actorName: user.username || user.name || user.email || "Someone",
          },
        });
      }
    }

    const count = await prisma.like.count({ where: { questionId: id } });
    return NextResponse.json({ liked, count });
  } catch (err) {
    console.error("Like error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

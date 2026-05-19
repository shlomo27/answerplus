import { notFound } from "next/navigation";
import QuestionPageClient from "./QuestionPageClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      responses: { orderBy: { createdAt: "asc" } },
      summary: true,
      comments: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!question) notFound();

  return (
    <QuestionPageClient
      question={{
        id: question.id,
        text: question.text,
        category: question.category,
        type: question.type,
        isPublic: question.isPublic,
        authorName: question.authorName,
        userId: question.userId,
        createdAt: question.createdAt.toISOString(),
        imageUrl: question.imageUrl,
        videoUrl: question.videoUrl,
        responses: question.responses.map((r) => ({
          id: r.id,
          provider: r.provider,
          content: r.content,
          error: r.error,
        })),
        summary: question.summary
          ? { content: question.summary.content, conclusion: question.summary.conclusion }
          : null,
        comments: question.comments.map((c) => ({
          id: c.id,
          authorName: c.authorName,
          content: c.content,
          createdAt: c.createdAt.toISOString(),
          parentId: c.parentId ?? null,
        })),
      }}
    />
  );
}

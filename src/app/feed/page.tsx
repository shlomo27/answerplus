import FeedClient from "./FeedClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const questions = await prisma.question.findMany({
    where: { isPublic: true, ...(category ? { category } : {}) },
    include: {
      summary: { select: { conclusion: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <FeedClient
      questions={questions.map((q) => ({
        id: q.id,
        text: q.text,
        category: q.category,
        authorName: q.authorName,
        createdAt: q.createdAt.toISOString(),
        conclusion: q.summary?.conclusion,
        commentCount: q._count.comments,
      }))}
      activeCategory={category}
    />
  );
}

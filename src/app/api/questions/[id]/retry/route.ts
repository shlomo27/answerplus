import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { querySingleProvider } from "@/lib/ai/providers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { provider, responseId } = await req.json();

  if (!provider || !responseId) {
    return NextResponse.json({ error: "Missing provider or responseId" }, { status: 400 });
  }

  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await querySingleProvider(question.text, provider);

  const updated = await prisma.aIResponse.update({
    where: { id: responseId },
    data: { content: result.content, error: result.error },
  });

  return NextResponse.json(updated);
}

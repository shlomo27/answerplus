import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateSuggestions(base: string): string[] {
  const clean = base.replace(/[^a-zA-Z0-9_֐-׿]/g, "");
  const year = new Date().getFullYear().toString().slice(-2);
  return [
    `${clean}${Math.floor(Math.random() * 90 + 10)}`,
    `${clean}_${year}`,
    `${clean}__`,
    `the_${clean}`,
  ].slice(0, 3);
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")?.trim();
  if (!username) return NextResponse.json({ available: false });

  if (username.length < 3) return NextResponse.json({ available: false, error: "short" });
  if (!/^[a-zA-Z0-9_֐-׿]+$/.test(username))
    return NextResponse.json({ available: false, error: "invalid" });

  const existing = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!existing) return NextResponse.json({ available: true });

  return NextResponse.json({
    available: false,
    suggestions: generateSuggestions(username),
  });
}

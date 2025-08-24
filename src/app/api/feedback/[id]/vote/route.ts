import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const { id: feedbackId } = params;
    const body = await req.json();
    const userId: string | undefined = body?.userId;

    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    // Toggle upvote (no downvote)
    const existing = await prisma.vote.findUnique({
        where: { userId_feedbackId: { userId, feedbackId } },
    });

    if (existing) {
        await prisma.vote.delete({ where: { userId_feedbackId: { userId, feedbackId } } });
    } else {
        await prisma.vote.create({ data: { userId, feedbackId } });
    }

    // New score = total upvotes
    const score = await prisma.vote.count({ where: { feedbackId } });

    await prisma.feedback.update({
        where: { id: feedbackId },
        data: { score },
    });

    return NextResponse.json({ score }); // <- important
}

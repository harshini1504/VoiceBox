// src/app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const items = await prisma.feedback.findMany({
        orderBy: [{ score: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.title || !body.description) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const created = await prisma.feedback.create({
        data: {
            title: body.title,
            description: body.description,
            category: body.category ?? "FEATURE",
            status: "BACKLOG",
            tags: Array.isArray(body.tags) ? body.tags : [],
            authorId: body.authorId ?? null, // we'll replace with session later
        },
    });

    return NextResponse.json(created, { status: 201 });
}

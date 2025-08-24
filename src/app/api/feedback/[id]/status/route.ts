import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { status } = (await req.json()) as {
        status?: "BACKLOG" | "NOW" | "NEXT" | "LATER" | "DONE";
    };

    if (!status) {
        return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    const updated = await prisma.feedback.update({
        where: { id: params.id },
        data: { status },
    });

    return NextResponse.json(updated);
}

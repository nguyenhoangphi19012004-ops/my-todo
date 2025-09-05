// src/app/api/todos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";

// Schema validate khi update
const UpdateTodoSchema = z.object({
  title: z.string().min(1, "Title không được bỏ trống"),
  description: z.string().optional().nullable(),
});

// PATCH /api/todos/[id]
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> } // <-- dùng Promise hoặc trực tiếp
) {
  try {
    // nếu params là Promise, resolve nó
    const resolvedParams = "then" in context.params ? await context.params : context.params;
    const { id } = resolvedParams;

    const body = await req.json();
    const data = UpdateTodoSchema.parse(body);

    const updated = await prisma.todo.update({
      where: { id },
      data: {
        ...data,
        description: data.description ?? null,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 400 });
  }
}

// DELETE /api/todos/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = "then" in context.params ? await context.params : context.params;
    const { id } = resolvedParams;

    await prisma.todo.delete({ where: { id } });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";

// Schema tạo Todo mới
const CreateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
});

// Schema update Todo
const UpdateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// Schema validate id
const IdSchema = z.string().min(1);

// -------------------- GET --------------------
export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(todos);
}

// -------------------- PATCH --------------------
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params là Promise
) {
  try {
    const { id } = await context.params; // await params
    const validId = IdSchema.parse(id);

    const body = await req.json();
    const data = UpdateTodoSchema.parse(body);

    const updated = await prisma.todo.update({
      where: { id: validId },
      data: {
        ...data,
        updatedAt: new Date(),
        description:
          data.description === undefined ? undefined : data.description ?? null,
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

// -------------------- DELETE --------------------
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params là Promise
) {
  try {
    const { id } = await context.params; // await params
    const validId = IdSchema.parse(id);

    await prisma.todo.delete({
      where: { id: validId },
    });

    return NextResponse.json({ message: "Todo deleted successfully" });
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

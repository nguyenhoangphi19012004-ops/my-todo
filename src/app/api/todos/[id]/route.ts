import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";

const UpdateTodoSchema = z.object({
  title: z.string().min(1, "Title không được để trống"),
  description: z.string().optional().nullable(),
});

async function getIdFromContext(context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return params.id;
}

// GET một todo
export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = await getIdFromContext(context);
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PATCH update
export async function PATCH(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = await getIdFromContext(context);
    const body = await _req.json();
    const data = UpdateTodoSchema.parse(body);

    const updated = await prisma.todo.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const id = await getIdFromContext(context);
    await prisma.todo.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

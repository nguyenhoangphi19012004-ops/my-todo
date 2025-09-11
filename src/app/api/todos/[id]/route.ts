import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z, ZodError } from "zod";
import { desc, eq } from "drizzle-orm";
import { todos } from "@/lib/schema";

const UpdateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

const IdSchema = z.string().min(1);

// ---------------- GET one todo ----------------
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ phải là Promise
) {
  try {
    const { id } = await params; // ✅ phải await
    const todoId = parseInt(IdSchema.parse(id));

    const [todo] = await db.select().from(todos).where(eq(todos.id, todoId));

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...todo,
      createdAt: new Date(todo.created_at).toISOString(),
      updatedAt: new Date(todo.updated_at).toISOString(),
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch todo" },
      { status: 500 }
    );
  }
}

// ---------------- PATCH todo ----------------
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todoId = parseInt(IdSchema.parse(id));
    const data = UpdateTodoSchema.parse(await req.json());

    await db
      .update(todos)
      .set({
        ...data,
        description:
          data.description === undefined ? undefined : data.description ?? null,
        updated_at: new Date(),
      })
      .where(eq(todos.id, todoId));

    const [updated] = await db.select().from(todos).where(eq(todos.id, todoId));

    if (!updated) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...updated,
      createdAt: new Date(updated.created_at).toISOString(),
      updatedAt: new Date(updated.updated_at).toISOString(),
    });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: e.flatten().fieldErrors },
        { status: 400 }
      );
    }
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 400 });
  }
}

// ---------------- DELETE todo ----------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todoId = parseInt(IdSchema.parse(id));

    await db.delete(todos).where(eq(todos.id, todoId));

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: e.flatten().fieldErrors },
        { status: 400 }
      );
    }
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 400 });
  }
}

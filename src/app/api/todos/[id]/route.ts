import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z, ZodError } from "zod";
import { desc, eq } from "drizzle-orm";
import { todos } from "@/lib/schema"

// ---------------- Schemas ----------------
const CreateTodoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
});

const UpdateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

const IdSchema = z.string().min(1);

// ---------------- GET all todos ----------------
export async function GET() {
  try {
    const allTodos = await db.select().from(todos).orderBy(desc(todos.id));
    return NextResponse.json(allTodos);
  } catch (e: unknown) {
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}



// ---------------- PATCH todo ----------------
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(IdSchema.parse(params.id));
    const data = UpdateTodoSchema.parse(await req.json());

    await db.update(todos)
      .set({
        ...data,
        description: data.description === undefined ? undefined : data.description ?? null,
      })
      .where(eq(todos.id, id));

    const [updated] = await db.select().from(todos).where(eq(todos.id, id));
    return NextResponse.json(updated);
  } catch (e: unknown) {
    if (e instanceof ZodError) return NextResponse.json({ error: e.flatten().fieldErrors }, { status: 400 });
    if (e instanceof Error) return NextResponse.json({ error: e.message }, { status: 400 });
    return NextResponse.json({ error: "Unknown error" }, { status: 400 });
  }
}

// ---------------- DELETE todo ----------------
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(IdSchema.parse(params.id));
    await db.delete(todos).where(eq(todos.id, id));
    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (e: unknown) {
    if (e instanceof ZodError) return NextResponse.json({ error: e.flatten().fieldErrors }, { status: 400 });
    if (e instanceof Error) return NextResponse.json({ error: e.message }, { status: 400 });
    return NextResponse.json({ error: "Unknown error" }, { status: 400 });
  }
}

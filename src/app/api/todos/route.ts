import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { todos } from "@/lib/schema"
import { z, ZodError } from "zod";
import { desc } from "drizzle-orm";

// Schema validate
const CreateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const allTodos = await db.select().from(todos).orderBy(desc(todos.id));

    const formattedTodos = allTodos.map((todo) => ({
      ...todo,
      createdAt: new Date(todo.created_at).toISOString(),
      updatedAt: new Date(todo.updated_at).toISOString(),
    }));

    return NextResponse.json(formattedTodos);
  } catch (e: unknown) {
    console.error("GET /api/todos error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const parsed = CreateTodoSchema.parse(await req.json());

    await db.insert(todos).values({
      title: parsed.title,
      description: parsed.description ?? "",
    });

    const [newTodo] = await db.select().from(todos).orderBy(desc(todos.id)).limit(1);
    return NextResponse.json(newTodo, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof ZodError) return NextResponse.json({ error: e.flatten().fieldErrors }, { status: 400 });
    if (e instanceof Error) return NextResponse.json({ error: e.message }, { status: 400 });
    return NextResponse.json({ error: "Unknown error" }, { status: 400 });
  }
}
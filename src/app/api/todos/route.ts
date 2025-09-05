import { NextResponse } from "next/server";
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
// Lấy danh sách todo
export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(todos);
}

// -------------------- POST --------------------
// Tạo Todo mới
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateTodoSchema.parse(body);

    const todo = await prisma.todo.create({
      data: {
        title: parsed.title,
        description: parsed.description ?? null,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: e.flatten().fieldErrors }, { status: 400 });
    }
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 400 });
  }
}



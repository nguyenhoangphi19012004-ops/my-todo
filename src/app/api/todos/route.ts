// src/app/api/todos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";

// Schema validate khi tạo todo
const CreateTodoSchema = z.object({
  title: z.string().min(1, "Title không được bỏ trống"),
  description: z.string().optional().nullable(),
});

// GET tất cả todos
export async function GET(req: NextRequest) {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(todos);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 400 });
  }
}

// POST tạo todo mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = CreateTodoSchema.parse(body);

    const newTodo = await prisma.todo.create({
      data: {
        title: data.title,
        description: data.description ?? null,
      },
    });

    return NextResponse.json(newTodo, { status: 201 });
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

// src/app/api/todos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";

// Schema validate khi tạo todo
const CreateTodoSchema = z.object({
  title: z.string().min(1, "Title không được để trống").max(200),
  description: z.string().optional().nullable(),
});

// ---------------- GET /api/todos ----------------
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(todos);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}

// ---------------- POST /api/todos ----------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = CreateTodoSchema.parse(body);

    const newTodo = await prisma.todo.create({
      data,
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}

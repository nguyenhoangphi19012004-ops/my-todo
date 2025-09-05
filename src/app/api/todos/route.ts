import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";

// Schema tạo mới
const CreateTodoSchema = z.object({
  title: z.string().min(1, "Title không được để trống"),
  description: z.string().optional().nullable(),
});

// GET tất cả todos
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}

// POST tạo mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = CreateTodoSchema.parse(body);

    const newTodo = await prisma.todo.create({ data });
    return NextResponse.json(newTodo);
  } catch (error) {
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

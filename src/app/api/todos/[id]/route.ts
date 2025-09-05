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


// -------------------- PATCH --------------------
// Cập nhật Todo theo id
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate id
    const id = IdSchema.parse(params.id);

    // Validate body
    const body = await req.json();
    const data = UpdateTodoSchema.parse(body);

    // Update trong DB
    const updated = await prisma.todo.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
        // Nếu không gửi description thì giữ nguyên
        description:
          data.description === undefined
            ? undefined
            : data.description ?? null,
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
// Xóa Todo theo id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = IdSchema.parse(params.id);

    await prisma.todo.delete({
      where: { id },
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

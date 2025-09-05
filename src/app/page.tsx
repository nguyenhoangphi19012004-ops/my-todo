"use client";
import { useEffect, useState } from "react";

type Todo = {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;

};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [addError, setAddError] = useState(""); // lỗi khi add
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({}); // lỗi khi edit

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // Load todos
  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data: Todo[]) => setTodos(data));
  }, []);

  // Add todo
  const addTodo = async () => {
    if (!title.trim()) {
      setAddError("Không được để trống mục này!");
      return;
    }
    setAddError("");

    const res = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const { error } = await res.json();
      setAddError(error || "Có lỗi xảy ra khi thêm todo");
      return;
    }

    const newTodo: Todo = await res.json();
    setTodos([newTodo, ...todos]);
    setTitle("");
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter((t) => t.id !== id));
  };

  // Update todo
  const updateTodo = async (id: string) => {
    if (!editTitle.trim()) {
      setEditErrors((prev) => ({ ...prev, [id]: "Title không được để trống!" }));
      return;
    }
    setEditErrors((prev) => ({ ...prev, [id]: "" }));

    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title: editTitle }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const { error } = await res.json();
      setEditErrors((prev) => ({ ...prev, [id]: error || "Có lỗi khi update" }));
      return;
    }

    const updated: Todo = await res.json();
    setTodos(todos.map((t) => (t.id === id ? updated : t)));
    setEditingId(null);
  };

  return (      
  <div className="w-4/5 mx-auto mt-10">
  {/* Form thêm mới */}
  <div className="flex gap-2 mb-4">
  <input
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="border p-2 flex-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    placeholder="New todo"
  />
  <button
    onClick={addTodo}
    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
  >
    Add
  </button>
</div>

  {addError && <p className="text-red-500 text-sm mb-4">{addError}</p>}

  {/* Danh sách todo dạng grid */}
  {/* Danh sách todo dạng grid */}
<div className="grid grid-cols-3 gap-4">
  {todos.map((todo) => (
    <div
      key={todo.id}
      className="p-4 rounded-xl bg-white shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-gray-100"
    >
      <div className="flex items-center justify-between gap-3">
        {editingId === todo.id ? (
          <div className="flex-1">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="border p-2 w-full rounded"
              autoFocus
            />
            {editErrors[todo.id] && (
              <p className="text-red-500 text-xs mt-1">{editErrors[todo.id]}</p>
            )}
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg truncate">{todo.title}</p>
            <div className="text-xs text-gray-500 mt-0.5 flex flex-wrap gap-x-2">
              <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(todo.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {/* Bên phải: nút (ngang hàng với chữ) */}
        <div className="flex items-center gap-2 shrink-0">
          {editingId === todo.id ? (
            <button
              onClick={() => updateTodo(todo.id)}
              className="px-3 py-1 rounded bg-green-500 text-white text-sm"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingId(todo.id);
                setEditTitle(todo.title);
              }}
              className="px-3 py-1 rounded bg-blue-500 text-white text-sm"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => deleteTodo(todo.id)}
            className="px-3 py-1 rounded bg-red-500 text-white text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

</div>
  );
}

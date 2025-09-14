"use client";
import { useEffect, useState } from "react";
import MyChart from '@/components/MyChart';
import ChartToDo from '@/components/ChartToDo';
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
  const [description, setDescription] = useState("");
  const [addError, setAddError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});

 useEffect(() => {
  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();

      if (Array.isArray(data)) {
        setTodos(data);
      } else {
        console.error("API không trả về mảng:", data);
        setTodos([]);
      }
    } catch (err) {
      console.error("Lỗi fetch todos:", err);
      setTodos([]);
    }
  };

  fetchTodos();
}, []);

  function groupTodosByDate(todos: Todo[]) {
    const map: Record<string, number> = {};
    todos.forEach((todo) => {
      const date = new Date(todo.createdAt).toLocaleDateString();
      map[date] = (map[date] || 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }
  const chartData = groupTodosByDate(todos);
  // Thêm todo mới
  const addTodo = async () => {
    if (!title.trim()) {
      setAddError("Title không được để trống!");
      return;
    }
    setAddError("");

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      setAddError(error || "Có lỗi khi thêm todo");
      return;
    }

    const newTodo: Todo = await res.json();
    setTodos([newTodo, ...todos]);
    setTitle("");
    setDescription("");
  };

  // Xoá todo
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, description: editDescription }),
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
      
      <div className="flex flex-col gap-2 mb-4 p-5 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold">Add todo</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="New todo title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Description"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          Add
        </button>
      {addError && <p className="text-red-500">{addError}</p>}
    </div>
      <div className="flex flex-col gap-2 mb-4 p-5 bg-white rounded-xl shadow-md">
        
      </div>

      {/* Danh sách todos */}
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold m-3">Todo list</h1>
      </div>

      <div className="grid grid-cols-3 ">
        {Array.isArray(todos) && todos.map((todo) => (
          <div
            key={todo.id}
            className="p-4 rounded-xl bg-white shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-gray-100"
          >
            <div className="flex items-center justify-between gap-3">
              {editingId === todo.id ? (
                <div className="flex-1 flex flex-col gap-1">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="border p-2 w-full rounded"
                    autoFocus
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="border p-2 w-full rounded"
                  />
                  {editErrors[todo.id] && (
                    <p className="text-red-500 text-xs mt-1">{editErrors[todo.id]}</p>
                  )}
                </div>
              ) : (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg truncate">{todo.title}</p>
                 {todo.description && (
                    <p className="text-gray-700 mt-1 line-clamp-2">{todo.description}</p>
                  )}
                  <div className="text-xs text-gray-500 mt-0.5 flex flex-wrap gap-x-2">
                    <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(todo.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 items-start">
                {editingId === todo.id ? (
                  <button
                    onClick={() => updateTodo(todo.id)}
                    className="px-3 py-1 rounded bg-green-500 text-white text-sm w-full sm:w-auto"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditTitle(todo.title);
                      setEditDescription(todo.description || "");
                    }}
                    className="px-3 py-1 rounded bg-blue-500 text-white text-sm w-full sm:w-auto"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 rounded bg-red-500 text-white text-sm w-full sm:w-auto"
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
          
        ))}
        
      </div>
      <div className="grid grid-cols-1 gap-1 mt-6">
        <div className="p-5 bg-white rounded-xl shadow-md">
          <MyChart />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-1 mt-6">
        <div className="p-5 bg-white rounded-xl shadow-md">
           <ChartToDo data={chartData} />
        </div>
      </div>
    </div>
  );
}
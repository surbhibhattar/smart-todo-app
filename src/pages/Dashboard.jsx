import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableItem from "../components/SortableItem";
import Analytics from "../components/Analytics";

import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodoById,
  reorderTodos,
} from "../services/todoService";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const res = await getTodos();
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ➕ Add
  const handleAddTodo = async () => {
    if (!title.trim()) return;
  
    await createTodo({
      title,
      category,
      dueDate,
    });
  
    setTitle("");
    setCategory("");
    setDueDate("");
  
    fetchTodos();
  };

  // ✅ Toggle complete
  const toggleTodo = async (todo) => {
    try {
      await updateTodo(todo._id, {
        isCompleted: !todo.isCompleted,
      });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑️ Delete
  const deleteTodo = async (id) => {
    try {
      await deleteTodoById(id);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  // ✏️ Start edit
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.title);
  };

  // 💾 Save edit
  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      await updateTodo(id, { title: editText });
      setEditingId(null);
      setEditText("");
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔀 Drag end
  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((t) => t._id === active.id);
    const newIndex = todos.findIndex((t) => t._id === over.id);

    const newTodos = arrayMove(todos, oldIndex, newIndex);
    setTodos(newTodos);

    const updatedOrder = newTodos.map((todo, index) => ({
      id: todo._id,
      order: index,
    }));

    try {
      await reorderTodos(updatedOrder);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.header}>Smart Todo</h2>

        {/* Add Todo */}
        <div style={styles.inputWrapper}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task..."
            style={styles.input}
          />

          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            style={styles.input}
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={styles.input}
          />

          <button onClick={handleAddTodo} style={styles.addButton}>
            Add
          </button>
        </div>

        {/* Todo List */}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={todos.map((t) => t._id)}
            strategy={verticalListSortingStrategy}
          >
            <ul style={styles.list}>
              {todos.map((todo) => (
                <SortableItem
                  key={todo._id}
                  todo={todo}
                  toggleTodo={toggleTodo}
                  startEdit={startEdit}
                  deleteTodo={deleteTodo}
                  editingId={editingId}
                  editText={editText}
                  setEditText={setEditText}
                  saveEdit={saveEdit}
                  setEditingId={setEditingId}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        {/* Empty State */}
        {todos.length === 0 && (
          <div style={styles.empty}>No tasks yet. Add one above 👆</div>
        )}

        <Analytics todos={todos} />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f8",
    padding: "40px 20px",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  container: {
    maxWidth: "640px",
    margin: "0 auto",
  },
  header: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#111",
  },
  inputWrapper: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  addButton: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  empty: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: "20px",
  },
};

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({
  todo,
  toggleTodo,
  startEdit,
  deleteTodo,
  editingId,
  editText,
  setEditText,
  saveEdit,
  setEditingId,
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: todo._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "transform 200ms ease",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    marginBottom: "10px",
    borderRadius: "10px",
    background: "#fff",
    border: "1px solid #eee",
    boxShadow: isDragging
      ? "0 12px 30px rgba(0,0,0,0.12)"
      : "0 2px 6px rgba(0,0,0,0.04)",
  };

  return (
    <li ref={setNodeRef} style={style}>
      {/* Drag Handle */}
      <div {...attributes} {...listeners} style={styles.dragHandle}>
        ⋮⋮
      </div>

      {/* Checkbox */}
      <div
        onClick={() => toggleTodo(todo)}
        style={{
          ...styles.checkbox,
          background: todo.isCompleted ? "#4f46e5" : "transparent",
        }}
      />

      {/* Text / Edit */}
      {editingId === todo._id ? (
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={() => saveEdit(todo._id)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit(todo._id);
            if (e.key === "Escape") {
              setEditText("");
              setEditingId(null);
            }
          }}
          autoFocus
          style={styles.editInput}
        />
      ) : (
        <span
          onClick={() => toggleTodo(todo)}
          style={{
            flex: 1,
            fontSize: "14px",
            color: todo.isCompleted ? "#9ca3af" : "#111",
            textDecoration: todo.isCompleted ? "line-through" : "none",
            cursor: "pointer",
          }}
        >
          {todo.title}
          <div style={{ display: "flex", gap: "10px", fontSize: "12px" }}>
            {todo.category && <span style={styles.badge}>{todo.category}</span>}

            {todo.dueDate && (
              <span
                style={{
                  ...styles.badge,
                  background:
                    !todo.isCompleted && new Date(todo.dueDate) < new Date()
                      ? "#ef4444"
                      : "#e5e7eb",
                  color:
                    !todo.isCompleted && new Date(todo.dueDate) < new Date()
                      ? "#fff"
                      : "#333",
                }}
              >
                {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </span>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <button onClick={() => startEdit(todo)} style={styles.iconBtn}>
          ✏️
        </button>
        <button onClick={() => deleteTodo(todo._id)} style={styles.iconBtn}>
          🗑️
        </button>
      </div>
    </li>
  );
}

const styles = {
  dragHandle: {
    cursor: "grab",
    color: "#9ca3af",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    borderRadius: "4px",
    border: "1.5px solid #d1d5db",
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    gap: "6px",
  },
  iconBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "6px",
  },
  editInput: {
    flex: 1,
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
};

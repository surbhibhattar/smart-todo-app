import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
  } from "recharts";
  
  export default function Analytics({ todos }) {
    // 1️⃣ Todos per category
    const categoryMap = {};
    todos.forEach((t) => {
      const cat = t.category || "Uncategorized";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
  
    const categoryData = Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    }));
  
    // 2️⃣ Completed vs Pending
    const completed = todos.filter((t) => t.isCompleted).length;
    const pending = todos.length - completed;
  
    const statusData = [
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
    ];
  
    // 3️⃣ Completed over time
    const now = new Date();
  
    const week = todos.filter(
      (t) =>
        t.isCompleted &&
        new Date(t.updatedAt) > new Date(now - 7 * 24 * 60 * 60 * 1000)
    ).length;
  
    const month = todos.filter(
      (t) =>
        t.isCompleted &&
        new Date(t.updatedAt) > new Date(now - 30 * 24 * 60 * 60 * 1000)
    ).length;
  
    const year = todos.filter(
      (t) =>
        t.isCompleted &&
        new Date(t.updatedAt) > new Date(now - 365 * 24 * 60 * 60 * 1000)
    ).length;
  
    const timeData = [
      { name: "Week", value: week },
      { name: "Month", value: month },
      { name: "Year", value: year },
    ];
  
    // 4️⃣ Avg completion time
    const completedTodos = todos.filter((t) => t.isCompleted);
  
    const avgTime =
      completedTodos.length > 0
        ? (
            completedTodos.reduce((acc, t) => {
              const created = new Date(t.createdAt);
              const updated = new Date(t.updatedAt);
              return acc + (updated - created);
            }, 0) /
            completedTodos.length /
            (1000 * 60 * 60)
          ).toFixed(1)
        : 0;
  
    // 5️⃣ Overdue
    const overdue = todos.filter(
      (t) =>
        !t.isCompleted &&
        t.dueDate &&
        new Date(t.dueDate) < new Date()
    ).length;
  
    const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444"];
  
    return (
      <div style={styles.container}>
        <h3>Analytics</h3>
  
        {/* Category Pie */}
        <div style={styles.card}>
          <h4>Todos by Category</h4>
          <PieChart width={250} height={200}>
            <Pie data={categoryData} dataKey="value">
              {categoryData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
  
        {/* Status Pie */}
        <div style={styles.card}>
          <h4>Status</h4>
          <PieChart width={250} height={200}>
            <Pie data={statusData} dataKey="value">
              <Cell fill="#22c55e" />
              <Cell fill="#ef4444" />
            </Pie>
          </PieChart>
        </div>
  
        {/* Completion Trend */}
        <div style={styles.card}>
          <h4>Completed Tasks</h4>
          <BarChart width={300} height={200} data={timeData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="value" fill="#4f46e5" />
          </BarChart>
        </div>
  
        {/* Stats */}
        <div style={styles.card}>
          <h4>Insights</h4>
          <p>Avg Completion Time: {avgTime} hrs</p>
          <p>Overdue Tasks: {overdue}</p>
        </div>
      </div>
    );
  }
  
  const styles = {
    container: {
      marginTop: "30px",
    },
    card: {
      background: "#fff",
      padding: "16px",
      borderRadius: "10px",
      marginBottom: "16px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    },
  };
const Todo = require("../models/Todo");


// ✅ Create Todo
exports.createTodo = async (req, res) => {
  try {
    const { title, category, dueDate } = req.body;

    const todo = await Todo.create({
      title,
      category,
      dueDate,
    });

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get Single Todo
exports.getTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get All Todos
exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ order: 1, createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Update Todo
exports.updateTodo = async (req, res) => {
  try {
    // Handle completion toggle
    if (req.body.isCompleted === true) {
      req.body.completedAt = new Date();
    }

    if (req.body.isCompleted === false) {
      req.body.completedAt = null;
    }

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Delete One Todo
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Delete All Todos
exports.deleteAllTodos = async (req, res) => {
  try {
    await Todo.deleteMany();
    res.json({ message: "All todos deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reorderTodos = async (req, res) => {
  try {
    const { todos } = req.body;

    const bulkOps = todos.map((t) => ({
      updateOne: {
        filter: { _id: t.id },
        update: { order: t.order },
      },
    }));

    await Todo.bulkWrite(bulkOps);

    res.json({ message: "Order updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
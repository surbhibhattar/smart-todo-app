const express = require("express");
const router = express.Router();

const {
  createTodo,
  getTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
  reorderTodos
} = require("../controllers/todo.controller");

router.post("/", createTodo);
router.get("/", getAllTodos);
router.get("/:id", getTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);
router.delete("/", deleteAllTodos);
router.patch("/reorder", reorderTodos);

module.exports = router;
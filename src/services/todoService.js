import axios from "../apis/axios";

export const getTodos = () => axios.get("/todos");

export const createTodo = (data) =>
  axios.post("/todos", data);

export const updateTodo = (id, data) =>
  axios.put(`/todos/${id}`, data);

export const deleteTodoById = (id) =>
  axios.delete(`/todos/${id}`);

export const reorderTodos = (todos) =>
  axios.patch("/todos/reorder", { todos });
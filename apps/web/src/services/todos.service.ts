import type {
  CreateTodoInput,
  Todo,
  UpdateTodoInput,
} from "@/types/todo.types";

const API_URL = "http://localhost:3001/api/todos";

const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) throw new Error("Failed to fetch todos");

  const data = await response.json();

  return data.todos;
};

const createTodo = async ({
  title,
  description,
}: CreateTodoInput): Promise<Todo> => {
  const response = await fetch(API_URL, {
    body: JSON.stringify({ title, description }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  if (!response.ok) throw new Error("Failed to create todo");

  const data = await response.json();

  return data.todo;
};

const updateTodo = async (id: string, data: UpdateTodoInput): Promise<Todo> => {
  const response = await fetch(`${API_URL}/${id}`, {
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    method: "PUT",
  });

  if (!response.ok) throw new Error("Failed to update todo");

  const result = await response.json();

  return result.todo;
};

const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete todo");
};

const todosService = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};

export default todosService;

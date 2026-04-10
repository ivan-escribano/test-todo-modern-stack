"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { TodoForm } from "@/components/custom/todo-form";
import { TodoItem } from "@/components/custom/todo-item";
import todosService from "@/services/todos.service";
import type { CreateTodoInput, Todo } from "@/types/todo.types";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleSubmit = async (data: CreateTodoInput) => {
    try {
      await todosService.createTodo(data);
      toast.success("Tarea creada correctamente");
      handleGetTodos();
    } catch {
      toast.error("Error al crear la tarea");
    }
  };

  const handleUpdate = async (id: string, completed: boolean) => {
    try {
      await todosService.updateTodo(id, { completed });
      handleGetTodos();
    } catch {
      toast.error("Error al actualizar la tarea");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await todosService.deleteTodo(id);
      toast.success("Tarea eliminada");
      handleGetTodos();
    } catch {
      toast.error("Error al eliminar la tarea");
    }
  };

  const handleGetTodos = async () => {
    try {
      const data = await todosService.getTodos();
      setTodos(data);
    } catch {
      toast.error("Error al obtener las tareas");
    }
  };

  useEffect(() => {
    handleGetTodos();
  }, []);

  const pending = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Mis tareas</h1>
        <p className="text-sm text-muted-foreground">
          {pending.length} pendiente{pending.length !== 1 ? "s" : ""}
        </p>
      </div>

      <TodoForm onSubmit={handleSubmit} />

      {todos.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">No hay tareas aún.</p>
      )}

      {pending.length > 0 && (
        <section className="flex flex-col gap-2">
          {pending.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onDelete={handleDelete} onToggle={handleUpdate} />
          ))}
        </section>
      )}

      {completed.length > 0 && (
        <section className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Completadas
          </p>
          {completed.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onDelete={handleDelete} onToggle={handleUpdate} />
          ))}
        </section>
      )}
    </main>
  );
}

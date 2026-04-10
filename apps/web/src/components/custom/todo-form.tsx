"use client";

import type { CreateTodoInput } from "@/types/todo.types";
import { useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface TodoFormProps {
  onSubmit: (data: CreateTodoInput) => void;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onSubmit({ title, description });

    setTitle("");
    setDescription("");
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <Input
        placeholder="Nueva tarea..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        className="resize-none"
        placeholder="Descripción (opcional)"
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button className="w-full" disabled={!title.trim()} type="submit">
        Añadir tarea
      </Button>
    </form>
  );
}

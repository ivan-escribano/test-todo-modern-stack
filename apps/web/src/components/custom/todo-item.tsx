"use client";

import type { Todo } from "@/types/todo.types";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const { id, title, description, completed } = todo;

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-opacity duration-200">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={completed}
          className="mt-0.5"
          onCheckedChange={() => onToggle(id, !completed)}
        />
        <div className="flex flex-col gap-0.5">
          <span className={`text-sm font-medium leading-snug ${completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
            {title}
          </span>
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      </div>
      <Button
        className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
        size="sm"
        variant="ghost"
        onClick={() => onDelete(id)}
      >
        Eliminar
      </Button>
    </div>
  );
}

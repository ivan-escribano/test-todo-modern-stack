interface CreateTodoInput {
  title: string;
  description?: string;
}

interface UpdateTodoInput {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
}

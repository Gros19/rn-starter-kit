export type TodoStatus = 'todo' | 'in_progress' | 'done';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  createdAt: string;
  updatedAt: string;
}

export interface TodoFilter {
  status?: TodoStatus;
  priority?: TodoPriority;
  search?: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
  priority: TodoPriority;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
}

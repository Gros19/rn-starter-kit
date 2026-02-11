export type TodoStatus = 'todo' | 'in_progress' | 'done';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  parentId?: string; // 서브태스크용
  subtasks?: Todo[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TodoFilter {
  status?: TodoStatus;
  priority?: TodoPriority;
  search?: string;
  tag?: string;
  dateRange?: { start: string; end: string };
}

/** 칸반 컬럼 */
export const KANBAN_COLUMNS: { key: TodoStatus; label: string }[] = [
  { key: 'todo', label: '할 일' },
  { key: 'in_progress', label: '진행 중' },
  { key: 'done', label: '완료' },
];

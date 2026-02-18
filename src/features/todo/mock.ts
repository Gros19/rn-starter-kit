import type { Todo, TodoFilter, CreateTodoPayload, UpdateTodoPayload } from './types';
import { mockDelay } from '@/lib/mock/delay';

let todos: Todo[] = [
  { id: '1', title: '프로젝트 기획서 작성', description: '스타터킷 기능 명세 정리', status: 'done', priority: 'high', createdAt: '2026-02-10T09:00:00Z', updatedAt: '2026-02-12T14:00:00Z' },
  { id: '2', title: 'API 클라이언트 구현', description: 'fetch 기반 HTTP 클라이언트 래핑', status: 'done', priority: 'high', createdAt: '2026-02-10T10:00:00Z', updatedAt: '2026-02-13T10:00:00Z' },
  { id: '3', title: '인증 플로우 구현', status: 'in_progress', priority: 'high', createdAt: '2026-02-11T09:00:00Z', updatedAt: '2026-02-14T16:00:00Z' },
  { id: '4', title: 'Todo CRUD 기능', description: '할 일 생성/수정/삭제 기능 개발', status: 'in_progress', priority: 'medium', createdAt: '2026-02-12T09:00:00Z', updatedAt: '2026-02-15T11:00:00Z' },
  { id: '5', title: '파일 업로드 기능', status: 'todo', priority: 'medium', createdAt: '2026-02-13T09:00:00Z', updatedAt: '2026-02-13T09:00:00Z' },
  { id: '6', title: '알림 시스템 구현', description: '로컬 + 푸시 알림', status: 'todo', priority: 'medium', createdAt: '2026-02-13T10:00:00Z', updatedAt: '2026-02-13T10:00:00Z' },
  { id: '7', title: '다크 모드 테스트', status: 'done', priority: 'low', createdAt: '2026-02-11T14:00:00Z', updatedAt: '2026-02-11T16:00:00Z' },
  { id: '8', title: 'E2E 테스트 작성', description: 'Maestro 플로우 작성', status: 'todo', priority: 'high', createdAt: '2026-02-14T09:00:00Z', updatedAt: '2026-02-14T09:00:00Z' },
  { id: '9', title: '성능 최적화', description: 'FlatList 최적화, 메모이제이션', status: 'todo', priority: 'low', createdAt: '2026-02-14T10:00:00Z', updatedAt: '2026-02-14T10:00:00Z' },
  { id: '10', title: '접근성 개선', status: 'todo', priority: 'low', createdAt: '2026-02-14T11:00:00Z', updatedAt: '2026-02-14T11:00:00Z' },
  { id: '11', title: '코드 리뷰', description: '팀원 PR 리뷰', status: 'in_progress', priority: 'medium', createdAt: '2026-02-15T09:00:00Z', updatedAt: '2026-02-16T10:00:00Z' },
  { id: '12', title: 'README 업데이트', status: 'todo', priority: 'low', createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-02-15T10:00:00Z' },
  { id: '13', title: '구독 시스템 설계', description: 'Free/Premium 기능 제한 설계', status: 'todo', priority: 'high', createdAt: '2026-02-15T14:00:00Z', updatedAt: '2026-02-15T14:00:00Z' },
  { id: '14', title: '에러 핸들링 개선', status: 'in_progress', priority: 'medium', createdAt: '2026-02-16T09:00:00Z', updatedAt: '2026-02-16T14:00:00Z' },
  { id: '15', title: '배포 파이프라인 구성', description: 'EAS Build + Submit 설정', status: 'todo', priority: 'medium', createdAt: '2026-02-16T10:00:00Z', updatedAt: '2026-02-16T10:00:00Z' },
];

let nextId = 16;

function filterTodos(filter?: TodoFilter): Todo[] {
  let result = [...todos];
  if (filter?.status) {
    result = result.filter((t) => t.status === filter.status);
  }
  if (filter?.priority) {
    result = result.filter((t) => t.priority === filter.priority);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q),
    );
  }
  return result.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getTodos(filter?: TodoFilter): Promise<Todo[]> {
  await mockDelay(400);
  return filterTodos(filter);
}

export async function getTodo(id: string): Promise<Todo | null> {
  await mockDelay(200);
  return todos.find((t) => t.id === id) ?? null;
}

export async function createTodo(payload: CreateTodoPayload): Promise<Todo> {
  await mockDelay(300);
  const now = new Date().toISOString();
  const todo: Todo = {
    id: String(nextId++),
    title: payload.title,
    description: payload.description,
    status: 'todo',
    priority: payload.priority,
    createdAt: now,
    updatedAt: now,
  };
  todos.unshift(todo);
  return todo;
}

export async function updateTodo(
  id: string,
  payload: UpdateTodoPayload,
): Promise<Todo> {
  await mockDelay(300);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('Todo not found');
  todos[index] = {
    ...todos[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  return todos[index];
}

export async function deleteTodo(id: string): Promise<void> {
  await mockDelay(200);
  todos = todos.filter((t) => t.id !== id);
}

export function getTodoCount(): number {
  return todos.length;
}

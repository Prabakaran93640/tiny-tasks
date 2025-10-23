const BASE = import.meta.env.VITE_API_URL; // e.g., http://localhost:4000

async function jsonOrThrow(res, defaultMessage) {
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || defaultMessage || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export async function listTasks() {
  const res = await fetch(`${BASE}/api/tasks`);
  return jsonOrThrow(res, 'Failed to load tasks');
}

export async function createTask(title) {
  const res = await fetch(`${BASE}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  return jsonOrThrow(res, 'Failed to create task');
}

export async function updateTask(id, data) {
  const res = await fetch(`${BASE}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return jsonOrThrow(res, 'Failed to update task');
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE}/api/tasks/${id}`, { method: 'DELETE' });
  return jsonOrThrow(res, 'Failed to delete task');
}

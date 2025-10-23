import { useEffect, useState } from 'react';
import { listTasks, createTask, updateTask, deleteTask } from './api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // Load tasks on first render
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const data = await listTasks();
        setTasks(data);
      } catch (e) {
        setErr(String(e.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onAdd(e) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    try {
      setErr('');
      const created = await createTask(title);
      setTasks((t) => [created, ...t]); // newest first
      setNewTitle('');
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  async function toggleCompleted(task) {
    try {
      setErr('');
      const updated = await updateTask(task.id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  async function removeTask(id) {
    try {
      setErr('');
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, Arial', margin: '24px auto', maxWidth: 720 }}>
      <h1 style={{ marginBottom: 8 }}>TinyTasks</h1>
      <p style={{ marginTop: 0, color: '#555' }}>
        Add tasks, mark done, or delete. Data is stored in PostgreSQL via your Node/Express API.
      </p>

      <form onSubmit={onAdd} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="What do you need to do?"
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #ccc'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid #111',
            background: '#111',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </form>

      {err && (
        <div style={{ background: '#ffe8e8', border: '1px solid #f5bcbc', padding: 12, borderRadius: 8, color: '#a40000', marginBottom: 12 }}>
          {err}
        </div>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet — add one above.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
          {tasks.map((t) => (
            <li
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 10,
                background: '#fafafa'
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleCompleted(t)}
                />
                <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>
                  {t.title}
                </span>
              </label>
              <button
                onClick={() => removeTask(t.id)}
                style={{
                  marginLeft: 12,
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: '1px solid #c00',
                  background: 'white',
                  color: '#c00',
                  cursor: 'pointer'
                }}
                title="Delete task"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

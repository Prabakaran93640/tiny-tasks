import { useEffect, useState } from 'react';

export default function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_URL}/api/health`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setHealth(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, Arial', padding: 24 }}>
      <h1>TinyTasks (Frontend)</h1>
      <p>This page calls the backend <code>/api/health</code>.</p>

      {!health && !error && <p>Loading…</p>}
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
      {health && (
        <pre
          style={{
            background: '#f6f8fa',
            padding: 16,
            borderRadius: 8,
            overflowX: 'auto'
          }}
        >
{JSON.stringify(health, null, 2)}
        </pre>
      )}
    </div>
  );
}

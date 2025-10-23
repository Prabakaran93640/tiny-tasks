require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Mount routes under /api
const tasksRouter = require('./routes/tasks');
app.use('/api', tasksRouter);

const db = require('./db'); // add this near the top after other requires

app.get('/api/db-check', async (_req, res) => {
  try {
    const now = await db.query('SELECT NOW() as now');
    const cnt = await db.query('SELECT COUNT(*) FROM tasks');
    res.json({ ok: true, now: now.rows[0].now, task_count: Number(cnt.rows[0].count) });
  } catch (e) {
    console.error('DB check error:', e); // will print details in the server console
    res.status(500).json({ ok: false, message: e.message });
  }
});


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TinyTasks API is alive!', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`TinyTasks API running on http://localhost:${PORT}`);
});

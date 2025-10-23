const express = require('express');
const router = express.Router();
const db = require('../db');

console.log('Tasks router loaded'); // debug message

// GET /api/tasks
router.get('/tasks', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, title, completed, created_at FROM tasks ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// POST /api/tasks
router.post('/tasks', async (req, res) => {
  const title = (req.body.title || '').trim();
  if (!title) return res.status(400).json({ error: 'title is required' });

  try {
    const { rows } = await db.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, completed, created_at',
      [title]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// PATCH /api/tasks/:id
router.patch('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = [];
  const values = [];
  let i = 1;

  if (typeof req.body.title === 'string') {
    updates.push(`title = $${i++}`);
    values.push(req.body.title);
  }
  if (typeof req.body.completed === 'boolean') {
    updates.push(`completed = $${i++}`);
    values.push(req.body.completed);
  }
  if (updates.length === 0) return res.status(400).json({ error: 'nothing to update' });

  values.push(id);

  try {
    const { rows } = await db.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${i} RETURNING id, title, completed, created_at`,
      values
    );
    if (rows.length === 0) return res.status(404).json({ error: 'not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// DELETE /api/tasks/:id
router.delete('/tasks/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

module.exports = router;

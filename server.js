const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();

const VALID_ROLES = ['operator', 'storyteller', 'advocate', 'builder', 'creative', 'scholar'];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/submit', (req, res) => {
  const { firstName, lastName, topRole, secondRole } = req.body || {};

  const validName = (value) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 100;

  if (!validName(firstName) || !validName(lastName) ||
      !VALID_ROLES.includes(topRole) || !VALID_ROLES.includes(secondRole)) {
    return res.status(400).json({ error: 'Invalid submission.' });
  }

  const insert = db.prepare(`
    INSERT INTO submissions (first_name, last_name, top_role, second_role)
    VALUES (?, ?, ?, ?)
  `);
  insert.run(firstName.trim(), lastName.trim(), topRole, secondRole);

  res.status(201).json({ ok: true });
});

app.post('/api/results', (req, res) => {
  const configuredPassword = process.env.RESULTS_PASSWORD;

  if (!configuredPassword) {
    return res.status(500).json({ error: 'RESULTS_PASSWORD is not set on the server.' });
  }

  const { password } = req.body || {};
  if (password !== configuredPassword) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  const submissions = db.prepare(`
    SELECT first_name AS firstName, last_name AS lastName, top_role AS topRole,
           second_role AS secondRole, created_at AS createdAt
    FROM submissions
    ORDER BY created_at DESC
  `).all();

  const summary = {};
  VALID_ROLES.forEach((role) => { summary[role] = 0; });
  submissions.forEach((row) => { summary[row.topRole] = (summary[row.topRole] || 0) + 1; });

  res.json({ submissions, summary });
});

// Clean facilitator URL, kept separate from anything the quiz links to.
app.get('/results', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'results.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Think Beyond the Game listening on port ${PORT}`);
});

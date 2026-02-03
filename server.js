const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Serve all assets in /public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/yes', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'yes.html'));
});

app.get('/memories', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'memories.html'));
});

app.get('/love-song', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'love-song.html'));
});

app.get('/message-from-past', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'message-from-past.html'));
});

app.get('/love-letter', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'love-letter.html'));
});

// Fallback to home for anything else
app.use((_req, res) => {
  res.redirect('/');
});

app.listen(PORT, HOST, () => {
  console.log(`Valentine app running at http://localhost:${PORT}`);
});

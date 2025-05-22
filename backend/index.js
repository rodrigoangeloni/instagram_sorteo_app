const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { getLoginUrl, getAccessToken, getUserMedia, getComments } = require('./instagram');

dotenv.config();
const app = express();
app.use(express.static(path.join(__dirname, '../frontend')));

let ACCESS_TOKEN = process.env.ACCESS_TOKEN;

app.get('/login', (req, res) => {
  res.redirect(getLoginUrl());
});

app.get('/auth', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Falta el código de autorización.');

  try {
    const data = await getAccessToken(code);
    ACCESS_TOKEN = data.access_token;
    res.redirect('/'); // Redirige a frontend
  } catch (err) {
    res.status(500).send('Error al obtener token de acceso.');
  }
});

app.get('/media', async (req, res) => {
  if (!ACCESS_TOKEN) return res.status(401).send('No autorizado.');
  const media = await getUserMedia(ACCESS_TOKEN);
  res.json(media);
});

app.get('/comments/:id', async (req, res) => {
  const mediaId = req.params.id;
  if (!ACCESS_TOKEN) return res.status(401).send('No autorizado.');
  const comments = await getComments(mediaId, ACCESS_TOKEN);
  res.json(comments);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

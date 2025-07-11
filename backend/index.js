const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const { getLoginUrl, getAccessToken, getInstagramUserAccount, getUserMedia, getComments, getPostFromUrl, getPostLikes, getUserFollowers, isUserFollowing } = require('./instagram');

dotenv.config();
const app = express();

// Session middleware setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_very_secret_key_123!',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.json());

// --- Endpoint para sorteo manual ---
app.post('/api/sorteo-manual', (req, res) => {
  const comentarios = req.body.comentarios;
  if (!Array.isArray(comentarios) || comentarios.length === 0) {
    return res.status(400).json({ error: 'No se recibieron comentarios válidos.' });
  }
  // Filtrar usuarios únicos
  const usuariosUnicos = new Set();
  const participantes = comentarios.filter(c => {
    if (!c.username || !c.comment) return false;
    if (usuariosUnicos.has(c.username)) return false;
    usuariosUnicos.add(c.username);
    return true;
  });
  // Seleccionar ganador aleatorio
  let ganador = null;
  if (participantes.length > 0) {
    const indiceGanador = Math.floor(Math.random() * participantes.length);
    ganador = participantes[indiceGanador];
  }
  res.json({
    ganador,
    participantesValidos: participantes.length,
    totalComentarios: comentarios.length,
    participantes
  });
});
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/login', (req, res) => {
  res.redirect(getLoginUrl());
});

app.get('/auth/facebook/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Falta el código de autorización.');
  }

  try {
    const fbTokenData = await getAccessToken(code);
    const fbUserAccessToken = fbTokenData.access_token;

    if (!fbUserAccessToken) {
      return res.status(500).send('Error al obtener el token de acceso de Facebook.');
    }

    const igAccountInfo = await getInstagramUserAccount(fbUserAccessToken);

    // Store necessary IG info and Page Access Token in session
    req.session.igUserId = igAccountInfo.igUserId;
    req.session.igUsername = igAccountInfo.igUsername;
    req.session.igProfilePictureUrl = igAccountInfo.igProfilePictureUrl;
    req.session.pageAccessToken = igAccountInfo.pageAccessToken;
    req.session.fbUserAccessToken = fbUserAccessToken;
    req.session.isLoggedIn = true;

    res.redirect('/');
  } catch (err) {
    console.error('Error during Facebook auth callback:', err);
    let errorMessage = 'Error during authentication.';
    if (err.message && err.message.includes('Facebook API Error:')) {
      errorMessage = err.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    if (errorMessage.includes("No Instagram Business Account linked")) {
        res.status(400).send("Authentication failed: No Instagram Business or Creator account was found linked to your Facebook Pages. Please ensure your Instagram account is a Professional (Business or Creator) account and properly linked to a Facebook Page you manage.");
    } else if (errorMessage.includes("No Facebook Pages found")) {
        res.status(400).send("Authentication failed: No Facebook Pages were found for your account. An Instagram Professional account must be linked to a Facebook Page.");
    } else {
        res.status(500).send(errorMessage);
    }
  }
});

// Endpoint to check login status and get user info
app.get('/api/user', (req, res) => {
  if (req.session.isLoggedIn && req.session.igUserId) {
    res.json({
      isLoggedIn: true,
      igUserId: req.session.igUserId,
      igUsername: req.session.igUsername,
      igProfilePictureUrl: req.session.igProfilePictureUrl
    });
  } else {
    res.json({ isLoggedIn: false });
  }
});

// Nuevo endpoint para realizar sorteo
app.post('/api/sorteo', async (req, res) => {
  if (!req.session.isLoggedIn || !req.session.pageAccessToken || !req.session.igUserId) {
    return res.status(401).send('No autorizado. Por favor inicia sesión.');
  }

  const { postUrl } = req.body;
  
  if (!postUrl) {
    return res.status(400).send('URL del post es requerida.');
  }

  try {
    console.log('Iniciando sorteo para URL:', postUrl);
    
    // 1. Extraer ID del post desde la URL
    const postId = getPostFromUrl(postUrl);
    if (!postId) {
      return res.status(400).send('URL de Instagram inválida.');
    }

    console.log('Post ID extraído:', postId);

    // 2. Obtener comentarios del post
    const commentsData = await getComments(postId, req.session.pageAccessToken);
    const comentarios = commentsData.data || [];
    
    console.log(`Encontrados ${comentarios.length} comentarios`);

    if (comentarios.length === 0) {
      return res.json({
        ganador: null,
        totalComentarios: 0,
        participantesValidos: 0,
        seguidores: 0,
        likes: 0,
        mensaje: 'No hay comentarios en este post'
      });
    }

    // 3. Obtener likes del post (quiénes dieron like)
    let usuariosConLike = [];
    try {
      const likesData = await getPostLikes(postId, req.session.pageAccessToken);
      usuariosConLike = likesData.data || [];
      console.log(`Encontrados ${usuariosConLike.length} likes`);
    } catch (error) {
      console.log('No se pudieron obtener los likes del post:', error.message);
    }

    // 4. Obtener seguidores de la cuenta
    let seguidores = [];
    try {
      const seguidoresData = await getUserFollowers(req.session.igUserId, req.session.pageAccessToken);
      seguidores = seguidoresData.data || [];
      console.log(`Encontrados ${seguidores.length} seguidores`);
    } catch (error) {
      console.log('No se pudieron obtener los seguidores:', error.message);
    }

    // 5. Filtrar participantes válidos
    const participantesValidos = [];
    const usuariosUnicos = {};

    for (const comentario of comentarios) {
      const username = comentario.username;
      
      // Evitar duplicados
      if (usuariosUnicos[username]) {
        continue;
      }
      usuariosUnicos[username] = true;

      // Verificar si es el dueño del post (excluir)
      if (username === req.session.igUsername) {
        continue;
      }

      // Verificar si sigue la cuenta
      const sigueACuenta = seguidores.some(seguidor => seguidor.username === username);
      
      // Verificar si dio like
      const dioLike = usuariosConLike.some(like => like.username === username);

      // Para participar debe cumplir ambos requisitos: seguir Y dar like
      if (sigueACuenta && dioLike) {
        participantesValidos.push({
          username: username,
          comentario: comentario.text,
          timestamp: comentario.timestamp
        });
      }
    }

    console.log(`Participantes válidos: ${participantesValidos.length}`);

    // 6. Seleccionar ganador aleatorio
    let ganador = null;
    if (participantesValidos.length > 0) {
      const indiceGanador = Math.floor(Math.random() * participantesValidos.length);
      ganador = participantesValidos[indiceGanador];
    }

    // 7. Responder con resultado
    res.json({
      ganador: ganador,
      totalComentarios: comentarios.length,
      participantesValidos: participantesValidos.length,
      seguidores: seguidores.length,
      likes: usuariosConLike.length,
      mensaje: ganador ? `¡Ganador seleccionado!` : 'No hay participantes que cumplan todos los requisitos'
    });

  } catch (error) {
    console.error('Error en sorteo:', error);
    res.status(500).send(`Error al realizar sorteo: ${error.message}`);
  }
});

// Mantener endpoints existentes para compatibilidad
app.get('/api/media', async (req, res) => {
  if (!req.session.isLoggedIn || !req.session.pageAccessToken || !req.session.igUserId) {
    return res.status(401).send('No autorizado. Por favor inicia sesión.');
  }
  try {
    const media = await getUserMedia(req.session.igUserId, req.session.pageAccessToken);
    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).send('Error al obtener los medios.');
  }
});

app.get('/api/comments/:id', async (req, res) => {
  const mediaId = req.params.id;
  if (!req.session.isLoggedIn || !req.session.pageAccessToken) {
    return res.status(401).send('No autorizado. Por favor inicia sesión.');
  }
  try {
    const comments = await getComments(mediaId, req.session.pageAccessToken);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Error al obtener los comentarios.');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('No se pudo cerrar sesión.');
    }
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

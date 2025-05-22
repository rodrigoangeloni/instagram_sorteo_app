const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session'); // For session management
const { getLoginUrl, getAccessToken, getInstagramUserAccount, getUserMedia, getComments } = require('./instagram');

dotenv.config();
const app = express();

// Session middleware setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_very_secret_key_123!', // Use an environment variable for the secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS in production
}));

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/login', (req, res) => {
  res.redirect(getLoginUrl());
});

// Changed route to reflect Facebook callback
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
    req.session.isLoggedIn = true;

    res.redirect('/'); // Redirect to frontend, which should then fetch user info
  } catch (err) {
    console.error('Error during Facebook auth callback:', err);
    let errorMessage = 'Error during authentication.';
    if (err.message && err.message.includes('Facebook API Error:')) {
      errorMessage = err.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    // Provide more specific error messages to the user if possible
    if (errorMessage.includes("No Instagram Business Account linked")) {
        res.status(400).send("Authentication failed: No Instagram Business or Creator account was found linked to your Facebook Pages. Please ensure your Instagram account is a Professional (Business or Creator) account and properly linked to a Facebook Page you manage.");
    } else if (errorMessage.includes("No Facebook Pages found")) {
        res.status(400).send("Authentication failed: No Facebook Pages were found for your account. An Instagram Professional account must be linked to a Facebook Page.");
    }
    else {
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

const PORT = process.env.PORT || 3000; // Use environment variable for port
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

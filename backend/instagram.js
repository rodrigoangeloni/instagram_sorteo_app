const axios = require('axios');
const qs = require('querystring');
require('dotenv').config();

const {
  INSTAGRAM_APP_ID,
  INSTAGRAM_APP_SECRET,
  REDIRECT_URI,
  GRAPH_API_VERSION
} = process.env;

const API_VERSION = GRAPH_API_VERSION || 'v19.0';

function getLoginUrl() {
  // Scopes ampliados para obtener likes y seguidores
  const scopes = 'instagram_basic,pages_show_list,pages_read_engagement,instagram_manage_insights';
  const url = `https://www.facebook.com/${API_VERSION}/dialog/oauth?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes}&response_type=code`;
  return url;
}

async function getAccessToken(code) {
  try {
    const response = await axios.post(`https://graph.facebook.com/${API_VERSION}/oauth/access_token`,
      qs.stringify({
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting Facebook access token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getInstagramUserAccount(fbUserAccessToken) {
  try {
    const response = await axios.get(`https://graph.facebook.com/${API_VERSION}/me/accounts`, {
      params: {
        fields: 'instagram_business_account{id,username,profile_picture_url},access_token',
        access_token: fbUserAccessToken,
      }
    });

    const pages = response.data.data;
    if (!pages || pages.length === 0) {
      throw new Error('No Facebook Pages found for this user.');
    }

    const igAccountPage = pages.find(page => page.instagram_business_account);
    if (!igAccountPage) {
      throw new Error('No Instagram Business Account linked to any of the user\'s Facebook Pages. Please ensure the Instagram account is a Business or Creator account and linked to a Facebook Page.');
    }

    return {
      igUserId: igAccountPage.instagram_business_account.id,
      igUsername: igAccountPage.instagram_business_account.username,
      igProfilePictureUrl: igAccountPage.instagram_business_account.profile_picture_url,
      pageAccessToken: igAccountPage.access_token,
    };
  } catch (error) {
    console.error('Error getting Instagram User Account:', error.response ? error.response.data : error.message);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(`Facebook API Error: ${error.response.data.error.message}`);
    }
    throw error;
  }
}

async function getUserMedia(igUserId, pageAccessToken) {
  try {
    const response = await axios.get(`https://graph.facebook.com/${API_VERSION}/${igUserId}/media`, {
      params: {
        fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,comments_count,children{id,media_type,media_url,thumbnail_url}',
        access_token: pageAccessToken,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting user media:', error.response ? error.response.data : error.message);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(`Facebook API Error: ${error.response.data.error.message}`);
    }
    throw error;
  }
}

async function getComments(mediaId, pageAccessToken) {
  try {
    const response = await axios.get(`https://graph.facebook.com/${API_VERSION}/${mediaId}/comments`, {
      params: {
        fields: 'id,text,timestamp,username,like_count',
        access_token: pageAccessToken,
        limit: 100 // Obtener más comentarios
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting comments:', error.response ? error.response.data : error.message);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(`Facebook API Error: ${error.response.data.error.message}`);
    }
    throw error;
  }
}

// Nueva función para extraer ID del post desde URL con validaciones de seguridad
function getPostFromUrl(url) {
  try {
    // Validar que sea una URL válida
    if (!url || typeof url !== 'string') {
      return null;
    }
    
    // Limpiar la URL de caracteres potencialmente peligrosos
    const cleanUrl = url.trim().replace(/[<>\"']/g, '');
    
    // Verificar que la URL sea de Instagram
    if (!cleanUrl.includes('instagram.com')) {
      return null;
    }
    
    // Expresión regular para extraer el ID del post de una URL de Instagram
    // Formatos soportados:
    // https://www.instagram.com/p/POST_ID/
    // https://instagram.com/p/POST_ID/
    // instagram.com/p/POST_ID/
    const regex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/([A-Za-z0-9_-]+)/;
    const match = cleanUrl.match(regex);
    
    if (match && match[1]) {
      // Validar que el ID del post sea válido (solo caracteres permitidos)
      const postId = match[1];
      if (/^[A-Za-z0-9_-]+$/.test(postId) && postId.length >= 5 && postId.length <= 50) {
        return postId;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing Instagram URL:', error);
    return null;
  }
}

// Nueva función para obtener likes de un post
async function getPostLikes(mediaId, pageAccessToken) {
  try {
    // Nota: Esta funcionalidad puede estar limitada por la API de Instagram
    // En versiones recientes, obtener quien dio like requiere permisos especiales
    const response = await axios.get(`https://graph.facebook.com/${API_VERSION}/${mediaId}/likes`, {
      params: {
        fields: 'username',
        access_token: pageAccessToken,
        limit: 100
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting post likes:', error.response ? error.response.data : error.message);
    // Si no se pueden obtener los likes, devolver array vacío en lugar de error
    return { data: [] };
  }
}

// Nueva función para obtener seguidores
async function getUserFollowers(igUserId, pageAccessToken) {
  try {
    // Nota: Esta funcionalidad puede estar limitada por la API de Instagram
    // Obtener seguidores requiere permisos especiales que pueden no estar disponibles
    const response = await axios.get(`https://graph.facebook.com/${API_VERSION}/${igUserId}/followers`, {
      params: {
        fields: 'username',
        access_token: pageAccessToken,
        limit: 100
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting followers:', error.response ? error.response.data : error.message);
    // Si no se pueden obtener los seguidores, devolver array vacío
    return { data: [] };
  }
}

// Nueva función para verificar si un usuario sigue a otro
async function isUserFollowing(targetUserId, currentUserId, pageAccessToken) {
  try {
    // Esta función puede no estar disponible en la API pública
    // Se implementa como placeholder para funcionalidad futura
    const response = await axios.get(`https://graph.facebook.com/${API_VERSION}/${currentUserId}/following`, {
      params: {
        fields: 'id,username',
        access_token: pageAccessToken,
        limit: 100
      }
    });
    
    const following = response.data.data || [];
    return following.some(user => user.id === targetUserId);
  } catch (error) {
    console.error('Error checking if user is following:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Función alternativa para el sorteo básico (sin verificación de likes/seguidores)
async function sorteoBasico(mediaId, pageAccessToken, ownerUsername) {
  try {
    const commentsData = await getComments(mediaId, pageAccessToken);
    const comentarios = commentsData.data || [];
    
    // Filtrar comentarios únicos y excluir al dueño del post
    const participantes = [];
    const usuariosUnicos = new Set();
    
    comentarios.forEach(comentario => {
      if (comentario.username !== ownerUsername && !usuariosUnicos.has(comentario.username)) {
        usuariosUnicos.add(comentario.username);
        participantes.push({
          username: comentario.username,
          comentario: comentario.text,
          timestamp: comentario.timestamp
        });
      }
    });
    
    // Seleccionar ganador aleatorio
    let ganador = null;
    if (participantes.length > 0) {
      const indiceGanador = Math.floor(Math.random() * participantes.length);
      ganador = participantes[indiceGanador];
    }
    
    return {
      ganador,
      totalComentarios: comentarios.length,
      participantesValidos: participantes.length,
      participantes
    };
    
  } catch (error) {
    console.error('Error en sorteo básico:', error);
    throw error;
  }
}

module.exports = {
  getLoginUrl,
  getAccessToken,
  getInstagramUserAccount,
  getUserMedia,
  getComments,
  getPostFromUrl,
  getPostLikes,
  getUserFollowers,
  isUserFollowing,
  sorteoBasico
};

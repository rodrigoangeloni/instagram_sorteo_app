const axios = require('axios');
const qs = require('querystring');
require('dotenv').config();

const { INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET, REDIRECT_URI } = process.env;

function getLoginUrl() {
  const url = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  return url;
}

async function getAccessToken(code) {
  const response = await axios.post('https://api.instagram.com/oauth/access_token',
    qs.stringify({
      client_id: INSTAGRAM_APP_ID,
      client_secret: INSTAGRAM_APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      code,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return response.data;
}

async function getUserMedia(access_token) {
  const response = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption&access_token=${access_token}`);
  return response.data;
}

async function getComments(mediaId, access_token) {
  const response = await axios.get(`https://graph.instagram.com/${mediaId}/comments?access_token=${access_token}`);
  return response.data;
}

module.exports = {
  getLoginUrl,
  getAccessToken,
  getUserMedia,
  getComments,
};

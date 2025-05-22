const axios = require('axios');
const qs = require('querystring');
require('dotenv').config();

// IMPORTANT: These environment variables now refer to your Facebook App credentials
// and the Graph API version you want to use.
const {
  INSTAGRAM_APP_ID, // Should be your Facebook App ID
  INSTAGRAM_APP_SECRET, // Should be your Facebook App Secret
  REDIRECT_URI,
  GRAPH_API_VERSION // e.g., v19.0
} = process.env;

const API_VERSION = GRAPH_API_VERSION || 'v19.0'; // Default to v19.0 if not set

function getLoginUrl() {
  // Scopes needed for fetching IG user, their media, and comments.
  const scopes = 'instagram_basic,pages_show_list,pages_read_engagement';
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
    // This is the Facebook User Access Token
    return response.data; // Should contain access_token and token_type (Bearer)
  } catch (error) {
    console.error('Error getting Facebook access token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getInstagramUserAccount(fbUserAccessToken) {
  try {
    const response = await axios.get(`https://graph.facebook.com/${API_VERSION}/me/accounts`, {
      params: {
        fields: 'instagram_business_account{id,username,profile_picture_url},access_token', // access_token here is the Page Access Token
        access_token: fbUserAccessToken,
      }
    });

    const pages = response.data.data;
    if (!pages || pages.length === 0) {
      throw new Error('No Facebook Pages found for this user.');
    }

    // Find the first page that has an Instagram Business Account linked
    const igAccountPage = pages.find(page => page.instagram_business_account);
    if (!igAccountPage) {
      throw new Error('No Instagram Business Account linked to any of the user\'s Facebook Pages. Please ensure the Instagram account is a Business or Creator account and linked to a Facebook Page.');
    }

    return {
      igUserId: igAccountPage.instagram_business_account.id,
      igUsername: igAccountPage.instagram_business_account.username,
      igProfilePictureUrl: igAccountPage.instagram_business_account.profile_picture_url,
      pageAccessToken: igAccountPage.access_token, // This is the Page Access Token for the linked FB Page
    };
  } catch (error) {
    console.error('Error getting Instagram User Account:', error.response ? error.response.data : error.message);
    // It's good to check if the error is from Facebook's response or a network issue
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
        fields: 'id,text,timestamp,username,like_count,user{id,username}', // Requesting 'user' might require additional permissions/review
        access_token: pageAccessToken,
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

module.exports = {
  getLoginUrl,
  getAccessToken,
  getInstagramUserAccount,
  getUserMedia,
  getComments,
};

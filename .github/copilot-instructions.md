# 🤖 Copilot Instructions for Instagram Sorteo App

## 🏗️ Big Picture Architecture
- The project is split into two main components:
  - `backend/`: Node.js + Express server, handles OAuth, Instagram Graph API, business logic for giveaways, and API endpoints.
  - `frontend/`: Static HTML/CSS/JS, provides a responsive UI for login, post input, and displaying results.
- Data flow: User authenticates via Instagram (OAuth), backend fetches post/comments/likes via Graph API, applies business rules, and returns results to frontend.
- All Instagram API access requires a professional account linked to a Facebook Page and a properly configured Facebook Developer App.

## ⚙️ Developer Workflows
- **Install dependencies:**
  - Run `start.bat` (Windows) or manually: `cd backend && npm install`
- **Run server:**
  - `start.bat` or `cd backend && npm start`
- **Environment setup:**
  - Copy `backend/.env.example` to `backend/.env` and fill with Facebook App credentials (see README for details).
- **Frontend:**
  - Open `frontend/index.html` in browser (served via backend at `http://localhost:3000`).
- **Debugging:**
  - Backend logs errors to console; check for OAuth/API errors especially around credentials and permissions.

## 🧩 Project-Specific Patterns
- **OAuth callback:**
  - Handled at `/auth/facebook/callback` (see backend routing).
- **API endpoints:**
  - Main endpoints: `/api/user`, `/api/sorteo`, `/login`, `/logout` (see README and backend/index.js).
- **Business rules:**
  - Backend verifies: user follows account, liked post, commented (see backend/instagram.js).
- **Fallback mode:**
  - If API limits or permissions restrict data, backend falls back to comment-only giveaways.
- **Session management:**
  - Uses `SESSION_SECRET` from `.env` for Express sessions.

## 🔗 Integration Points
- **Instagram Graph API:**
  - Requires correct API version (`GRAPH_API_VERSION` in `.env`).
- **Facebook OAuth:**
  - App ID and Secret must match the Facebook Developer App used for login.
- **Frontend-backend communication:**
  - All business logic is in backend; frontend only calls endpoints and displays results.

## 📁 Key Files & Directories
- `backend/index.js`: Main server, routing, OAuth logic
- `backend/instagram.js`: Instagram API integration and business rules
- `backend/.env.example`: Template for environment variables
- `frontend/index.html`, `frontend/script.js`, `frontend/style.css`: UI and client logic
- `README.md`: Full setup, workflow, and usage documentation

## 📝 Example: Environment Setup
```env
INSTAGRAM_APP_ID=TU_ID_DE_APP_DE_FACEBOOK
INSTAGRAM_APP_SECRET=TU_SECRETO_DE_APP_DE_FACEBOOK
REDIRECT_URI=http://localhost:3000/auth/facebook/callback
GRAPH_API_VERSION=v21.0
SESSION_SECRET=UNA_CADENA_SECRETA_MUY_FUERTE
PORT=3000
```

---

For unclear workflows, missing conventions, or integration issues, check `README.md` or ask for clarification. Please suggest improvements if you find undocumented patterns or edge cases.

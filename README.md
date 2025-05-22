# 🎉 Instagram Sorteo App

Una aplicación web completa para realizar sorteos en Instagram utilizando la **Instagram Basic Display API**. Permite:

✅ Conectar tu cuenta de Instagram
✅ Obtener tus publicaciones
✅ Leer comentarios de un post
✅ Elegir un ganador al azar

---

## 📁 Estructura del proyecto

```
instagram_sorteo_app/
├── backend/            # Servidor Node.js + API Instagram
│   ├── .env            # Variables sensibles (NO subir)
│   ├── index.js        # Servidor Express
│   ├── instagram.js    # Funciones con API de Instagram
│   ├── Dockerfile      # Imagen Docker backend
│   └── package.json    # Dependencias y scripts
├── frontend/           # Interfaz simple HTML + JS
│   ├── index.html
│   └── style.css
├── docker-compose.yml  # Orquestador del contenedor
└── README.md
```

---

## 🚀 Requisitos previos

1. Tener una cuenta de Instagram
2. Crear una app en: [developers.facebook.com](https://developers.facebook.com/)
3. Obtener los siguientes datos:
   - `APP_ID`
   - `APP_SECRET`
   - `REDIRECT_URI` (ej: http://localhost:3000/auth)

---

## ⚙️ Configuración

1. Crear archivo `.env` en la carpeta `backend/`:

```env
INSTAGRAM_APP_ID=tu_app_id
INSTAGRAM_APP_SECRET=tu_app_secret
REDIRECT_URI=http://localhost:3000/auth
```

2. Construir y correr con Docker:

```bash
docker-compose up --build
```

---

## 🌐 Acceso a la app

📍 Ir a: [http://localhost:3000](http://localhost:3000)

- Presionar "Conectar con Instagram"
- Autorizar la aplicación
- Seleccionar un post
- Ver los comentarios y sortear el ganador 🎁

---

## 🛠️ Scripts útiles

```bash
# Instalar dependencias (sin Docker)
cd backend
npm install

# Ejecutar local sin Docker
npm start
```

---

## 📦 Tecnologías utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api/)
- [Docker](https://www.docker.com/)

---

## 🧠 Notas importantes

- Solo funciona con cuentas que autoricen la app.
- El token de acceso tiene una duración limitada (60 días aprox).
- Esta app está pensada para uso **personal**.

---

## 📮 Contacto

¿Dudas o sugerencias? ¡Abrí un issue o contactá al desarrollador! 💌

---

✨ ¡Suerte con tu sorteo! ✨

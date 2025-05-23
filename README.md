# 🎉 Instagram Sorteo App - Aplicación de Sorteos Instagram
**Versión: v2.0.0** 🏷️

Una aplicación web simplificada para realizar sorteos automáticos en Instagram con verificación de requisitos de participación.

## ✨ Características

*   🔐 **Login único**: Inicia sesión una vez con tu cuenta profesional de Instagram
*   🔗 **Sorteo por URL**: Simplemente pega la URL del post de Instagram  
*   🎯 **Verificación automática**: Verifica automáticamente que los participantes:
    - ✅ Sigan tu cuenta
    - ❤️ Hayan dado like al post
    - 💬 Hayan comentado en el post
*   🏆 **Ganador aleatorio**: Selección automática entre participantes válidos
*   📊 **Estadísticas**: Muestra métricas detalladas del sorteo
*   🌐 **Universal**: Funciona con cualquier cuenta profesional de Instagram

## 🚀 Flujo de Uso Simplificado

1. **Login único** → Conecta tu cuenta de Instagram profesional
2. **Pega URL** → Copia y pega la URL del post para el sorteo
3. **¡Sorteo automático!** → La app verifica todos los requisitos y selecciona un ganador

---

## ⚙️ Configuración e Instalación

### 📋 Requisitos Previos

*   💻 Node.js y npm instalados
*   🤳 **Cuenta Profesional de Instagram** (Empresa o Creador)
*   🔗 Cuenta de Instagram **vinculada a una Página de Facebook**
*   🔑 Aplicación de desarrollador de Facebook

### 🛠️ Configuración

1. **Clonar el Repositorio:**
    ```bash
    git clone <repository-url>
    cd instagram_sorteo_app
    ```

2. **Crear Aplicación de Facebook:**
    *   Ve a [developers.facebook.com/apps](https://developers.facebook.com/apps/)
    *   Crea una nueva aplicación
    *   Agrega **"Inicio de sesión de Facebook"**
    *   Agrega **"API Graph de Instagram"**
    *   Configura URI de redirección: `http://localhost:3000/auth/facebook/callback`

3. **Variables de Entorno:**
    *   Copia `backend/.env.example` como `backend/.env`
    *   Edita `backend/.env` con tus credenciales:
        ```env
        INSTAGRAM_APP_ID=TU_ID_DE_APP_DE_FACEBOOK
        INSTAGRAM_APP_SECRET=TU_SECRETO_DE_APP_DE_FACEBOOK
        REDIRECT_URI=http://localhost:3000/auth/facebook/callback
        GRAPH_API_VERSION=v20.0
        SESSION_SECRET=UNA_CADENA_SECRETA_MUY_FUERTE
        PORT=3000
        ```

4. **Inicio Rápido:**
    - **Windows:** Ejecuta `start.bat`
    - **Manual:**
        ```bash
        cd backend
        npm install
        npm start
        ```
    
    🌐 Aplicación disponible en: `http://localhost:3000`

---

## 🌐 Cómo Usar la Aplicación

### Paso 1: Conectar Instagram
- Abre `http://localhost:3000`
- Click en **"Conectar con Instagram"**
- Autoriza los permisos necesarios
- La app detectará automáticamente tu cuenta

### Paso 2: Configurar Sorteo
- Pega la URL del post de Instagram en el campo
- Los requisitos se actualizan automáticamente con tu @username:
  - ✅ Seguir la cuenta @tu_username
  - ❤️ Dar like al post  
  - 💬 Comentar en el post

### Paso 3: Realizar Sorteo
- Click en **"Realizar Sorteo"**
- La aplicación automáticamente:
  - Extrae todos los comentarios
  - Verifica seguidores y likes
  - Filtra participantes válidos
  - Selecciona un ganador aleatorio

### Paso 4: Ver Resultados
- 🏆 **Ganador**: Usuario que cumple todos los requisitos
- 📊 **Estadísticas**: Comentarios totales, participantes válidos, etc.

---

## 🔧 Funcionalidades Técnicas

### Backend (Node.js + Express)
- **Autenticación OAuth** con Instagram Graph API
- **Parser de URLs** para extraer IDs de posts
- **Verificación automática** de likes y seguidores
- **Algoritmo de sorteo** con filtrado inteligente
- **Soporte multi-cuenta** automático

### Frontend (HTML + CSS + JavaScript)
- **Interfaz responsive** con diseño moderno
- **Estados dinámicos** (login, sorteo, loading, resultados)
- **Validación de URLs** de Instagram
- **Feedback visual** en tiempo real
- **Actualización automática** de requisitos por cuenta

### API Endpoints
```
GET  /login                    - Redirige a autenticación Instagram
GET  /auth/facebook/callback   - Callback de OAuth
GET  /api/user                 - Estado de login del usuario
POST /api/sorteo               - Endpoint principal del sorteo
GET  /logout                   - Cerrar sesión
```

---

## ⚠️ Limitaciones y Consideraciones

### Limitaciones de la API de Instagram
*   **Solo cuentas profesionales**: No funciona con cuentas personales
*   **Permisos especiales**: Verificar likes y seguidores puede requerir revisión de Meta
*   **Límites de tasa**: Respeta los límites de la API de Instagram
*   **Datos limitados**: Algunas verificaciones pueden estar restringidas

### Modo de Fallback
Si las verificaciones de likes/seguidores no están disponibles:
- La aplicación realiza sorteo **solo con comentarios**
- Filtra participantes únicos
- Excluye al dueño del post
- Mantiene funcionalidad básica

---

## 🚀 Opciones de Despliegue

### Desarrollo Local
```bash
# Inicio rápido (Windows)
start.bat

# Manual
cd backend
npm install
npm start
```

### Docker (próximamente)
```bash
docker-compose up -d
```

### Producción
- Configurar HTTPS para URLs de callback
- Actualizar variables de entorno
- Solicitar revisión de permisos a Meta si es necesario

---

## 🔄 Changelog v2.0.0

### ✅ Nuevas Características
- **Interfaz simplificada**: Solo URL del post + sorteo automático
- **Verificación automática**: Likes, seguidores y comentarios
- **Mejor UX**: Estados de carga y feedback visual
- **Estadísticas**: Métricas detalladas del sorteo
- **Soporte universal**: Funciona con cualquier cuenta profesional
- **Requisitos dinámicos**: Se actualizan automáticamente por usuario

### 🔧 Mejoras Técnicas
- **Parser de URLs**: Extracción automática de IDs de posts
- **Manejo de errores**: Fallbacks para limitaciones de API
- **Optimización**: Menor fricción en el flujo de usuario
- **Centrado perfecto**: Interfaz completamente centrada

---

## 🎯 Casos de Uso

### Para Influencers
- Sorteos de productos
- Colaboraciones con marcas
- Engagement con seguidores

### Para Empresas
- Lanzamiento de productos
- Campañas promocionales
- Crecimiento de audiencia

### Para Creadores
- Sorteos de contenido
- Regalos a la comunidad
- Eventos especiales

---

## 📮 Soporte

¿Problemas o sugerencias? 
- Revisa la consola del navegador para errores
- Verifica configuración del archivo `.env`
- Asegúrate que la cuenta sea profesional y esté vinculada a Facebook
- Comprueba que tengas permisos de administrador en la página de Facebook

---

✨ **¡Listo para realizar sorteos justos y automáticos en Instagram con cualquier cuenta profesional!** ✨

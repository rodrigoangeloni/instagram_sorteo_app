# 🎉 Instagram Sorteo App - V2 (Graph API)

**⚠️ IMPORTANTE: Esta aplicación ha sido actualizada para usar la API Graph de Instagram. La versión anterior que utilizaba la API de Visualización Básica de Instagram ya no es funcional debido a la deprecación de la API por Meta.**

Esta aplicación permite a un usuario de Instagram con una **Cuenta Profesional (Empresa o Creador)** seleccionar una de sus publicaciones y elegir al azar un ganador entre los comentaristas.

## 🔑 Cambios Clave en la V2

*   **Migración de API**: Migrado de la obsoleta API de Visualización Básica de Instagram a la **API Graph de Instagram**.
*   **Autenticación**: Utiliza el inicio de sesión de Facebook para la autenticación. Los usuarios deberán otorgar permisos a la aplicación para acceder a su Página de Facebook vinculada a su Cuenta Profesional de Instagram.
*   **Tipo de Cuenta**: Esta aplicación ahora **solo funciona para cuentas de Instagram Empresariales o de Creador** que estén correctamente vinculadas a una Página de Facebook.
*   **Gestión de Sesiones**: Utiliza sesiones del lado del servidor para gestionar el estado de autenticación del usuario.

## ✨ Características

*   Inicio de sesión seguro con Instagram (a través del inicio de sesión de Facebook).
*   Mostrar los medios (publicaciones) de Instagram del usuario.
*   Seleccionar un medio para ver sus comentarios.
*   Elegir al azar un ganador entre los comentaristas únicos de la publicación seleccionada.
*   Mostrar el perfil del usuario (foto de perfil, nombre de usuario) y funcionalidad de cierre de sesión.

---

## 🚀 Requisitos previos

*   Node.js y npm instalados.
*   Una **Cuenta Profesional (Empresa o Creador)** de Instagram.
*   Tu Cuenta Profesional de Instagram **debe estar vinculada a una Página de Facebook** que administres.
*   Una aplicación de desarrollador de Facebook.

---

## ⚙️ Configuración e Instalación

1.  **Clonar el Repositorio (si aún no lo has hecho):**
    ```bash
    git clone <repository-url>
    cd instagram_sorteo_app
    ```

2.  **Crear una Aplicación de Desarrollador de Facebook:**
    *   Ve a [developers.facebook.com/apps](https://developers.facebook.com/apps/) y crea una nueva aplicación.
    *   Agrega el producto **"Inicio de sesión de Facebook"**.
    *   Agrega el producto **"API Graph de Instagram"**.
    *   En "Inicio de sesión de Facebook" > "Configuración", agrega tu **URI de redirección OAuth válida**. Esto será `http://localhost:3000/auth/facebook/callback` (o tu equivalente si usas un puerto o dominio diferente).
    *   Toma nota de tu **ID de App** y **Secreto de App**.

3.  **Configurar Variables de Entorno:**
    *   Navega al directorio `backend`: `cd backend`
    *   Crea un archivo `.env` en el directorio `backend` (`backend/.env`).
    *   Agrega las siguientes variables a tu archivo `.env`, reemplazando los marcadores de posición con tus credenciales y configuraciones reales:
        ```env
        INSTAGRAM_APP_ID=YOUR_FACEBOOK_APP_ID
        INSTAGRAM_APP_SECRET=YOUR_FACEBOOK_APP_SECRET
        REDIRECT_URI=http://localhost:3000/auth/facebook/callback
        GRAPH_API_VERSION=v19.0 # Verifica la última versión estable en la documentación de Meta para Desarrolladores. Ejemplo: v20.0
        SESSION_SECRET=your_very_strong_and_random_session_secret
        PORT=3000 # Opcional, por defecto es 3000
        ```

4.  **Instalar Dependencias:**
    *   En el directorio `backend`, ejecuta:
        ```bash
        npm install
        ```

5.  **Ejecutar la Aplicación:**
    *   Aún en el directorio `backend`, ejecuta:
        ```bash
        npm start
        ```
    *   La aplicación debería estar corriendo ahora en `http://localhost:3000` (o el puerto que especificaste).

---

## 🌐 Cómo Usar

1.  Abre tu navegador y ve a `http://localhost:3000`.
2.  Haz clic en "Conectar con Instagram".
3.  Serás redirigido a Facebook para autenticar y autorizar la aplicación.
    *   Asegúrate de iniciar sesión con la cuenta de Facebook que administra la Página vinculada a tu Cuenta Profesional de Instagram.
    *   Otorga los permisos solicitados (por ejemplo, `instagram_basic`, `pages_show_list`, `pages_read_engagement`).
4.  Una vez autenticado, aparecerá tu información de perfil de Instagram y se cargarán tus medios recientes.
5.  Haz clic en una publicación para seleccionarla para el sorteo.
6.  La aplicación buscará comentarios y seleccionará un ganador al azar.
7.  Haz clic en "Desconectar" para cerrar sesión.

---

## ⚠️ Notas Importantes y Limitaciones

*   **Solo Cuentas Profesionales**: Esta herramienta es exclusivamente para cuentas de Instagram Empresariales o de Creador. Las cuentas personales de Instagram no son soportadas debido a las limitaciones de la API Graph de Instagram.
*   **Página de Facebook Vinculada**: La cuenta Profesional de Instagram debe estar correctamente vinculada a una Página de Facebook.
*   **Permisos**: La aplicación solicita los permisos necesarios durante el flujo de inicio de sesión de Facebook. Estos son requeridos para obtener tu ID de Instagram, medios y comentarios.
*   **Límites de Tasa de la API**: Ten en cuenta los límites de tasa de la API de Instagram, especialmente si tienes un número muy grande de publicaciones o comentarios.
*   **Información del Comentarista**: La capacidad de recuperar información detallada sobre los comentaristas (más allá de su nombre de usuario) puede estar restringida por las políticas de la API de Instagram y puede requerir una revisión adicional de la aplicación por parte de Meta para permisos extendidos.
*   **Manejo de Errores**: Si encuentras problemas, verifica la consola del navegador y el terminal del backend en busca de mensajes de error. Los problemas comunes incluyen configuración incorrecta del archivo `.env`, URI de redirección desajustadas, o que la cuenta de Instagram no sea del tipo Profesional/no esté vinculada a una Página de Facebook.

---

## 📮 Contacto

¿Dudas o sugerencias? ¡Abrí un issue o contactá al desarrollador! 💌

---

✨ ¡Suerte con tu sorteo! ✨

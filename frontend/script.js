// Estado global de la aplicación
let appState = {
  isLoggedIn: false,
  user: null,
  currentSection: 'login'
};

// Elementos DOM
const elements = {
  loginSection: document.getElementById('login-section'),
  userSection: document.getElementById('user-section'),
  loadingSection: document.getElementById('loading-section'),
  resultadoSection: document.getElementById('resultado-section'),
  errorMessage: document.getElementById('error-message'),
  
  // Usuario
  userAvatar: document.getElementById('user-avatar'),
  userName: document.getElementById('user-name'),
  accountName: document.getElementById('account-name'),
  
  // Formulario
  sorteoForm: document.getElementById('sorteo-form'),
  postUrlInput: document.getElementById('post-url'),
  
  // Resultado
  ganadorContainer: document.getElementById('ganador-container'),
  noGanadorContainer: document.getElementById('no-ganador-container'),
  ganadorUsername: document.getElementById('ganador-username'),
  ganadorComentario: document.getElementById('ganador-comentario'),
  noGanadorMensaje: document.getElementById('no-ganador-mensaje'),
  
  // Estadísticas
  statComentarios: document.getElementById('stat-comentarios'),
  statParticipantes: document.getElementById('stat-participantes'),
  statSeguidores: document.getElementById('stat-seguidores'),
  statLikes: document.getElementById('stat-likes'),
  
  // Botones
  nuevoSorteoBtn: document.getElementById('nuevo-sorteo'),
  errorText: document.getElementById('error-text')
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Iniciando Instagram Sorteo App...');
  
  // Verificar estado de login
  await checkLoginStatus();
  
  // Configurar event listeners
  setupEventListeners();
  
  console.log('✅ App inicializada correctamente');
});

// Verificar estado de login del usuario
async function checkLoginStatus() {
  try {
    showLoading('Verificando estado de login...');
    
    const response = await fetch('/api/user');
    const data = await response.json();
    
    if (data.isLoggedIn) {
      appState.isLoggedIn = true;
      appState.user = data;
      updateUserInterface();
      showSection('user');
    } else {
      appState.isLoggedIn = false;
      showSection('login');
    }
    
    hideLoading();
  } catch (error) {
    console.error('Error verificando login:', error);
    showError('Error al verificar el estado de login');
    showSection('login');
    hideLoading();
  }
}

// Actualizar interfaz de usuario
function updateUserInterface() {
  if (appState.user) {
    elements.userAvatar.src = appState.user.igProfilePictureUrl || '';
    elements.userAvatar.alt = `Avatar de ${appState.user.igUsername}`;
    elements.userName.textContent = `@${appState.user.igUsername}`;
    elements.accountName.textContent = `@${appState.user.igUsername}`;
  }
}

// Configurar event listeners
function setupEventListeners() {
  // Formulario de sorteo
  if (elements.sorteoForm) {
    elements.sorteoForm.addEventListener('submit', handleSorteoSubmit);
  }
  
  // Botón nuevo sorteo
  if (elements.nuevoSorteoBtn) {
    elements.nuevoSorteoBtn.addEventListener('click', resetToSorteoForm);
  }
  
  // Validación en tiempo real de URL
  if (elements.postUrlInput) {
    elements.postUrlInput.addEventListener('input', validateInstagramUrl);
  }
}

// Manejar envío del formulario de sorteo
async function handleSorteoSubmit(event) {
  event.preventDefault();
  
  const postUrl = elements.postUrlInput.value.trim();
  
  if (!postUrl) {
    showError('Por favor ingresa la URL del post');
    return;
  }
  
  if (!isValidInstagramUrl(postUrl)) {
    showError('URL de Instagram inválida. Debe ser del formato: https://www.instagram.com/p/...');
    return;
  }
  
  await realizarSorteo(postUrl);
}

// Realizar sorteo
async function realizarSorteo(postUrl) {
  try {
    console.log('🎯 Iniciando sorteo para:', postUrl);
    
    showSection('loading');
    hideError();
    
    const response = await fetch('/api/sorteo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postUrl })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    
    const resultado = await response.json();
    console.log('📊 Resultado del sorteo:', resultado);
    
    mostrarResultado(resultado);
    
  } catch (error) {
    console.error('❌ Error en sorteo:', error);
    showError(error.message || 'Error al realizar el sorteo');
    showSection('user');
  }
}

// Mostrar resultado del sorteo
function mostrarResultado(resultado) {
  // Actualizar estadísticas
  elements.statComentarios.textContent = resultado.totalComentarios || 0;
  elements.statParticipantes.textContent = resultado.participantesValidos || 0;
  elements.statSeguidores.textContent = resultado.seguidores || 0;
  elements.statLikes.textContent = resultado.likes || 0;
  
  // Mostrar ganador o mensaje de sin ganador
  if (resultado.ganador) {
    elements.ganadorUsername.textContent = `@${resultado.ganador.username}`;
    elements.ganadorComentario.textContent = `"${resultado.ganador.comentario || 'Sin comentario'}"`;
    
    elements.ganadorContainer.style.display = 'block';
    elements.noGanadorContainer.style.display = 'none';
  } else {
    elements.noGanadorMensaje.textContent = resultado.mensaje || 'No hay participantes que cumplan todos los requisitos';
    
    elements.ganadorContainer.style.display = 'none';
    elements.noGanadorContainer.style.display = 'block';
  }
  
  showSection('resultado');
}

// Validar URL de Instagram
function isValidInstagramUrl(url) {
  const regex = /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?/;
  return regex.test(url);
}

// Validación en tiempo real
function validateInstagramUrl() {
  const url = elements.postUrlInput.value.trim();
  
  if (url && !isValidInstagramUrl(url)) {
    elements.postUrlInput.style.borderColor = '#dc3545';
  } else {
    elements.postUrlInput.style.borderColor = '#e1e5e9';
  }
}

// Resetear a formulario de sorteo
function resetToSorteoForm() {
  elements.postUrlInput.value = '';
  hideError();
  showSection('user');
}

// Mostrar sección específica
function showSection(sectionName) {
  // Ocultar todas las secciones
  const sections = ['login', 'user', 'loading', 'resultado'];
  sections.forEach(section => {
    const element = elements[`${section}Section`];
    if (element) {
      element.style.display = 'none';
    }
  });
  
  // Mostrar sección específica
  const targetSection = elements[`${sectionName}Section`];
  if (targetSection) {
    targetSection.style.display = 'flex';
    appState.currentSection = sectionName;
  }
}

// Mostrar loading con mensaje personalizado
function showLoading(mensaje = 'Cargando...') {
  const loadingCard = elements.loadingSection.querySelector('.loading-card');
  if (loadingCard) {
    const messageElement = loadingCard.querySelector('p');
    if (messageElement) {
      messageElement.textContent = mensaje;
    }
  }
  showSection('loading');
}

// Ocultar loading
function hideLoading() {
  if (appState.currentSection === 'loading') {
    if (appState.isLoggedIn) {
      showSection('user');
    } else {
      showSection('login');
    }
  }
}

// Mostrar error
function showError(mensaje) {
  elements.errorText.textContent = mensaje;
  elements.errorMessage.style.display = 'block';
  
  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    hideError();
  }, 5000);
}

// Ocultar error
function hideError() {
  elements.errorMessage.style.display = 'none';
  elements.errorText.textContent = '';
}

// Utilidades para debugging
window.appDebug = {
  getState: () => appState,
  showSection: showSection,
  showError: showError,
  checkLogin: checkLoginStatus
};

// Manejo de errores globales
window.addEventListener('error', (event) => {
  console.error('Error global:', event.error);
  showError('Ha ocurrido un error inesperado');
});

// Manejo de errores de fetch no capturados
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rechazada:', event.reason);
  showError('Error de conexión con el servidor');
});

console.log('📱 Script cargado - Instagram Sorteo App v2.0.0');

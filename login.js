 //===========================
// Archivo Específico de Login
// ===========================

// El archivo login.js no necesita contenido separado porque toda la lógica
// de login está integrada en script.js para mantener la consistencia.

// Sin embargo, aquí podrías agregar funciones adicionales específicas del login
// como validación avanzada, animaciones, etc.

// Ejemplo de funciones adicionales (opcional):
function animacionError(inputElement) {
    inputElement.style.animation = 'shake 0.5s';
    setTimeout(() => {
        inputElement.style.animation = '';
    }, 500);
}

// CSS para animaciones de error (opcional)
function agregarEstilosAnimacion() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s;
        }
    `;
    document.head.appendChild(style);
}

// Auto-agregar estilos al cargar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', agregarEstilosAnimacion);
} else {
    agregarEstilosAnimacion();
}

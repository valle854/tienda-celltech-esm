  //===========================
// Variables Globales
// ===========================
let productos = [];
let carrito = [];
let usuarioLogueado = null;
let categoriaActiva = 'all';
// ===========================
// Inicialización
// ===========================
document.addEventListener('DOMContentLoaded', () => {
inicializarApp();
});
// ===========================
// Inicialización Principal
// ===========================
async function inicializarApp() {
// Cargar datos
const response = await cargarProductos();
cargarCarrito();
// Configurar UI
actualizarContadorCarrito();
verificarSesionUsuario();
configurarEventListeners();
// Configurar funciones específicas por página
if (document.getElementById('productsContainer')) {
configurarFiltrosCategorias();
}
if (document.querySelector('.login-container')) {
configurarFormulariosLogin();
}
}
// ===========================
// Cargar Productos desde JSON
// ===========================
async function cargarProductos() {
const loading = document.getElementById('loading');
const productsContainer = document.getElementById('productsContainer');
const emptyState = document.getElementById('emptyState');
try {
const response = await fetch('productos.json');
if (!response.ok) {
throw new Error('No se pudo cargar el archivo productos.json');
}
productos = await response.json();
loading.style.display = 'none';
if (productos.length === 0) {
emptyState.style.display = 'block';
} else {
mostrarProductos(productos);
}
} catch (error) {
console.error('Error al cargar productos:', error);
loading.style.display = 'none';
emptyState.style.display = 'block';
emptyState.innerHTML = `
<p>Error al cargar los productos. Por favor, verifica que el archivo productos.json existe.</p>
`;
}
}
// ===========================
// Mostrar Productos en la Página
// ===========================
function mostrarProductos(productos) {
const productsContainer = document.getElementById('productsContainer');
if (!productsContainer) return;
productsContainer.innerHTML = '';
productos.forEach(producto => {
const productCard = document.createElement('div');
productCard.className = 'product-card';
productCard.innerHTML = `
<img src="${producto.imagen}" alt="${producto.nombre}" class="product-image" 
onerror="this.src='images/placeholder.jpg'">
<div class="product-info">
<div class="product-category">${producto.categoria}</div>
<h3 class="product-name">${producto.nombre}</h3>
<p class="product-description">${producto.descripcion}</p>
<div class="product-footer">
<span class="product-price">$${producto.precio.toFixed(2)}</span>
<button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">
Agregar
</button>
</div>
</div>
`;
productsContainer.appendChild(productCard);
});
}
// ===========================
// Filtrar por Categorías
// ===========================
function configurarFiltrosCategorias() {
const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(btn => {
btn.addEventListener('click', (e) => {
const categoria = e.target.dataset.category;
filtrarPorCategoria(categoria);
// Actualizar estado activo
categoryButtons.forEach(b => b.classList.remove('active'));
e.target.classList.add('active');
});
});
}
function filtrarPorCategoria(categoria) {
categoriaActiva = categoria;
let productosFiltrados;
if (categoria === 'all') {
productosFiltrados = productos;
} else {
productosFiltrados = productos.filter(producto => producto.categoria === categoria);
}
mostrarProductos(productosFiltrados);
const emptyState = document.getElementById('emptyState');
if (productosFiltrados.length === 0) {
document.getElementById('productsContainer').style.display = 'none';
if (emptyState) emptyState.style.display = 'block';
} else {
document.getElementById('productsContainer').style.display = 'grid';
if (emptyState) emptyState.style.display = 'none';
}
}
// ===========================
// Agregar Producto al Carrito
// ===========================
function agregarAlCarrito(idProducto) {
const producto = productos.find(p => p.id === idProducto);
if (!producto) {
mostrarToast('Producto no encontrado');
return;
}
// Verificar si el producto ya está en el carrito
const productoEnCarrito = carrito.find(item => item.id === idProducto);
if (productoEnCarrito) {
productoEnCarrito.cantidad++;
} else {
carrito.push({
...producto,
cantidad: 1
});
}
guardarCarrito();
actualizarContadorCarrito();
mostrarToast(`${producto.nombre} agregado al carrito`);
}
// ===========================
// Gestión del LocalStorage
// ===========================
function guardarCarrito() {
localStorage.setItem('carrito', JSON.stringify(carrito));
}
function cargarCarrito() {
const carritoGuardado = localStorage.getItem('carrito');
if (carritoGuardado) {
carrito = JSON.parse(carritoGuardado);
}
}
// ===========================
// Actualizar Contador del Carrito
// ===========================
function actualizarContadorCarrito() {
const cartCount = document.getElementById('cartCount');
const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
cartCount.textContent = totalItems;
}
// ===========================
// Notificaciones Toast
// ===========================
function mostrarToast(mensaje, tipo = 'success') {
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
if (!toast || !toastMessage) return;
// Remover clases anteriores
toast.classList.remove('success', 'error', 'warning');
toast.classList.add(tipo);
toastMessage.textContent = mensaje;
toast.classList.add('show');
setTimeout(() => {
toast.classList.remove('show');
}, 3000);
}
// ===========================
// Gestión de Usuario
// ===========================
function verificarSesionUsuario() {
const usuarioGuardado = localStorage.getItem('usuarioLogueado');
if (usuarioGuardado) {
usuarioLogueado = JSON.parse(usuarioGuardado);
mostrarUsuarioLogueado();
} else {
mostrarBotonLogin();
}
}
function iniciarSesion(usuario) {
usuarioLogueado = usuario;
localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
mostrarUsuarioLogueado();
mostrarToast(`¡Bienvenido, ${usuario.nombre}!`);
}
function cerrarSesion() {
usuarioLogueado = null;
localStorage.removeItem('usuarioLogueado');
mostrarBotonLogin();
mostrarToast('Sesión cerrada correctamente');
}
function mostrarUsuarioLogueado() {
const loginSection = document.getElementById('loginSection');
const userSection = document.getElementById('userSection');
const userName = document.getElementById('userName');
const userAvatar = document.getElementById('userAvatar');
if (loginSection) loginSection.style.display = 'none';
if (userSection) userSection.style.display = 'block';
if (userName) userName.textContent = usuarioLogueado.nombre;
if (userAvatar) userAvatar.textContent = usuarioLogueado.nombre.charAt(0).toUpperCase();
}
function mostrarBotonLogin() {
const loginSection = document.getElementById('loginSection');
const userSection = document.getElementById('userSection');
if (loginSection) loginSection.style.display = 'block';
if (userSection) userSection.style.display = 'none';
}
// ===========================
// Event Listeners
// ===========================
function configurarEventListeners() {
// Menú hamburguesa
const hamburger = document.getElementById('hamburger');
const navUl = document.querySelector('nav ul');
if (hamburger && navUl) {
hamburger.addEventListener('click', () => {
hamburger.classList.toggle('active');
navUl.classList.toggle('active');
});
}
// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
logoutBtn.addEventListener('click', (e) => {
e.preventDefault();
cerrarSesion();
});
}
// Cerrar menú hamburguesa al hacer click en un enlace
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
link.addEventListener('click', () => {
if (hamburger && navUl) {
hamburger.classList.remove('active');
navUl.classList.remove('active');
}
});
});
}
// ===========================
// Formularios de Login
// ===========================
function configurarFormulariosLogin() {
// Toggle entre login y registro
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const loginContainer = document.querySelector('.login-container');
const registerContainer = document.getElementById('registerContainer');
if (showRegister) {
showRegister.addEventListener('click', (e) => {
e.preventDefault();
if (loginContainer) loginContainer.style.display = 'none';
if (registerContainer) registerContainer.style.display = 'block';
});
}
if (showLogin) {
showLogin.addEventListener('click', (e) => {
e.preventDefault();
if (registerContainer) registerContainer.style.display = 'none';
if (loginContainer) loginContainer.style.display = 'block';
});
}
// Manejo del formulario de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
loginForm.addEventListener('submit', (e) => {
e.preventDefault();
manejarLogin();
});
}
// Manejo del formulario de registro
const registerForm = document.getElementById('registerForm');
if (registerForm) {
registerForm.addEventListener('submit', (e) => {
e.preventDefault();
manejarRegistro();
});
}
}
function manejarLogin() {
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
let valido = true;
// Validar email
const emailError = document.getElementById('emailError');
if (!validarEmail(email)) {
if (emailError) {
emailError.textContent = 'Por favor ingresa un email válido';
emailError.classList.add('show');
}
document.getElementById('email').classList.add('error');
valido = false;
} else {
if (emailError) {
emailError.classList.remove('show');
}
document.getElementById('email').classList.remove('error');
}
// Validar contraseña
const passwordError = document.getElementById('passwordError');
if (!validarPassword(password)) {
if (passwordError) {
passwordError.textContent = 'La contraseña debe tener al menos 6 caracteres';
passwordError.classList.add('show');
}
document.getElementById('password').classList.add('error');
valido = false;
} else {
if (passwordError) {
passwordError.classList.remove('show');
}
document.getElementById('password').classList.remove('error');
}
if (valido) {
// Simular login exitoso
const usuario = {
email: email,
nombre: email.split('@')[0],
fechaRegistro: new Date().toISOString()
};
iniciarSesion(usuario);
setTimeout(() => {
window.location.href = 'index.html';
}, 1500);
}
}
function manejarRegistro() {
const nombre = document.getElementById('regName').value;
const email = document.getElementById('regEmail').value;
const password = document.getElementById('regPassword').value;
const confirmPassword = document.getElementById('regConfirmPassword').value;
let valido = true;
// Validar nombre
if (!validarNombre(nombre)) {
document.getElementById('regName').classList.add('error');
document.getElementById('regNameError').textContent = 'El nombre debe tener al menos 2 caracteres';
document.getElementById('regNameError').classList.add('show');
valido = false;
} else {
document.getElementById('regName').classList.remove('error');
document.getElementById('regNameError').classList.remove('show');
}
// Validar email
if (!validarEmail(email)) {
document.getElementById('regEmail').classList.add('error');
document.getElementById('regEmailError').textContent = 'Por favor ingresa un email válido';
document.getElementById('regEmailError').classList.add('show');
valido = false;
} else {
document.getElementById('regEmail').classList.remove('error');
document.getElementById('regEmailError').classList.remove('show');
}
// Validar contraseña
if (!validarPassword(password)) {
document.getElementById('regPassword').classList.add('error');
document.getElementById('regPasswordError').textContent = 'La contraseña debe tener al menos 6 caracteres';
document.getElementById('regPasswordError').classList.add('show');
valido = false;
} else {
document.getElementById('regPassword').classList.remove('error');
document.getElementById('regPasswordError').classList.remove('show');
}
// Validar confirmación
if (password !== confirmPassword) {
document.getElementById('regConfirmPassword').classList.add('error');
document.getElementById('regConfirmPasswordError').textContent = 'Las contraseñas no coinciden';
document.getElementById('regConfirmPasswordError').classList.add('show');
valido = false;
} else {
document.getElementById('regConfirmPassword').classList.remove('error');
document.getElementById('regConfirmPasswordError').classList.remove('show');
}
if (valido) {
const usuario = {
nombre: nombre,
email: email,
fechaRegistro: new Date().toISOString()
};
iniciarSesion(usuario);
mostrarToast('¡Cuenta creada exitosamente!');
setTimeout(() => {
window.location.href = 'index.html';
}, 1500);
}
}
// ===========================
// Validaciones
// ===========================
function validarEmail(email) {
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return regex.test(email);
}
function validarPassword(password) {
return password.length >= 6;
}
function validarNombre(nombre) {
return nombre.trim().length >= 2;
}
// Exportar funciones globales
window.agregarAlCarrito = agregarAlCarrito;
window.filtrarPorCategoria = filtrarPorCategoria;
window.cerrarSesion = cerrarSesion;
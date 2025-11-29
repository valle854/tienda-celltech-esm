 //===========================
// CARTO MEJORADO - VERSIÓN ROBUSTA
// ===========================

// Variables globales
let carrito = [];
let productos = [];

// ===========================
// INICIALIZACIÓN ROBUSTA
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando carrito mejorado...');
    
    // Verificar que todos los elementos existan
    verificarElementosDOM();
    
    // Cargar datos
    cargarProductos();
    cargarCarrito();
    
    // Configurar eventos
    configurarEventos();
    
    // Mostrar carrito
    mostrarCarrito();
});

// ===========================
// VERIFICAR ELEMENTOS DEL DOM
// ===========================
function verificarElementosDOM() {
    const elementos = {
        cartItems: document.getElementById('cartItems'),
        emptyCart: document.getElementById('emptyCart'),
        cartContent: document.querySelector('.cart-content'),
        subtotal: document.getElementById('subtotal'),
        shipping: document.getElementById('shipping'),
        total: document.getElementById('total'),
        checkoutBtn: document.getElementById('checkoutBtn'),
        cartCount: document.getElementById('cartCount')
    };
    
    console.log('🔍 Verificando elementos del DOM:');
    Object.entries(elementos).forEach(([nombre, elemento]) => {
        console.log(`${nombre}: ${elemento ? '✅ Existe' : '❌ No existe'}`);
    });
    
    return elementos;
}

// ===========================
// CARGAR PRODUCTOS
// ===========================
async function cargarProductos() {
    try {
        console.log('📦 Cargando productos...');
        const response = await fetch('productos.json');
        productos = await response.json();
        console.log(`✅ ${productos.length} productos cargados`);
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
        productos = [];
    }
}

// ===========================
// CARGAR CARRITO
// ===========================
function cargarCarrito() {
    console.log('🛒 Cargando carrito desde localStorage...');
    const carritoStr = localStorage.getItem('carrito');
    
    if (carritoStr) {
        try {
            carrito = JSON.parse(carritoStr);
            console.log(`✅ Carrito cargado: ${carrito.length} productos`);
        } catch (error) {
            console.error('❌ Error parseando carrito:', error);
            carrito = [];
        }
    } else {
        console.log('ℹ️ Carrito vacío');
        carrito = [];
    }
}

// ===========================
// GUARDAR CARRITO
// ===========================
function guardarCarrito() {
    console.log('💾 Guardando carrito...');
    try {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        console.log('✅ Carrito guardado correctamente');
    } catch (error) {
        console.error('❌ Error guardando carrito:', error);
    }
}

// ===========================
// CONFIGURAR EVENTOS
// ===========================
function configurarEventos() {
    const elementos = verificarElementosDOM();
    
    // Botón de checkout
    if (elementos.checkoutBtn) {
        elementos.checkoutBtn.addEventListener('click', procesarCompra);
        console.log('✅ Event listener de checkout configurado');
    }
    
    // Configurar funciones globales
    window.cambiarCantidad = cambiarCantidad;
    window.eliminarDelCarrito = eliminarDelCarrito;
    window.limpiarCarrito = limpiarCarrito;
    window.agregarAlCarrito = agregarAlCarrito;
}

// ===========================
// MOSTRAR CARRITO - VERSIÓN ROBUSTA
// ===========================
function mostrarCarrito() {
    console.log('👀 Mostrando carrito...');
    console.log(`📊 Estado actual: ${carrito.length} productos`);
    
    const elementos = verificarElementosDOM();
    
    if (carrito.length === 0) {
        console.log('🗑️ Carrito vacío, mostrando estado vacío');
        mostrarCarritoVacio(elementos);
        calcularTotales(elementos);
        return;
    }
    
    console.log('📱 Mostrando productos...');
    mostrarProductosCarrito(elementos);
    calcularTotales(elementos);
    actualizarContadorCarrito();
}

// ===========================
// MOSTRAR CARRITO VACÍO
// ===========================
function mostrarCarritoVacio(elementos) {
    if (elementos.cartContent) {
        elementos.cartContent.style.display = 'none';
    }
    
    if (elementos.emptyCart) {
        elementos.emptyCart.style.display = 'block';
        elementos.emptyCart.innerHTML = `
            <div class="empty-cart-content">
                <div class="empty-cart-icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>¡Agrega algunos productos para comenzar!</p>
                <a href="index.html" class="btn btn-primary">Ver Productos</a>
            </div>
        `;
    }
}

// ===========================
// MOSTRAR PRODUCTOS DEL CARRITO
// ===========================
function mostrarProductosCarrito(elementos) {
    if (elementos.cartContent) {
        elementos.cartContent.style.display = 'grid';
    }
    
    if (elementos.emptyCart) {
        elementos.emptyCart.style.display = 'none';
    }
    
    if (!elementos.cartItems) {
        console.error('❌ No se encontró el contenedor cartItems');
        return;
    }
    
    // Limpiar contenedor
    elementos.cartItems.innerHTML = '';
    
    // Crear cada producto
    carrito.forEach((producto, index) => {
        console.log(`📦 Creando producto ${index + 1}: ${producto.nombre}`);
        
        const elementoProducto = crearElementoProducto(producto, index);
        elementos.cartItems.appendChild(elementoProducto);
    });
    
    console.log('✅ Todos los productos mostrados');
}

// ===========================
// CREAR ELEMENTO DE PRODUCTO
// ===========================
function crearElementoProducto(producto, index) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <div class="cart-item-header">
            <img src="${producto.imagen}" alt="${producto.nombre}" 
                 class="cart-item-image" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjRGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA0MEw3MCA2NVY3MEg4MEY3MEg3MFY2NUg1MFY3MEg0MFY3MEg1MFY2NUg1MFoiIGZpbGw9IiM5NEEzQUYiLz4KPGNpcmNsZSBjeD0iNTAiIGN5PSI0MCIgcj0iMTIiIGZpbGw9IiM5NEEzQUYiLz4KPC9zdmc+'">
            <div class="cart-item-info">
                <h3 class="cart-item-name">${producto.nombre}</h3>
                <p class="cart-item-price">$${producto.precio.toFixed(2)}</p>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cambiarCantidad(${index}, -1)">−</button>
                        <span class="quantity-value">${producto.cantidad}</span>
                        <button class="quantity-btn" onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="eliminarDelCarrito(${index})">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        </div>
        <div class="cart-item-total">
            <strong>$${(producto.precio * producto.cantidad).toFixed(2)}</strong>
        </div>
    `;
    
    return div;
}

// ===========================
// CAMBIAR CANTIDAD
// ===========================
function cambiarCantidad(index, cambio) {
    console.log(`🔢 Cambiando cantidad: ${index} + ${cambio}`);
    
    if (index < 0 || index >= carrito.length) {
        console.error('❌ Índice inválido:', index);
        return;
    }
    
    carrito[index].cantidad += cambio;
    
    if (carrito[index].cantidad <= 0) {
        eliminarDelCarrito(index);
        return;
    }
    
    guardarCarrito();
    mostrarCarrito();
    console.log('✅ Cantidad actualizada');
}

// ===========================
// ELIMINAR DEL CARRITO
// ===========================
function eliminarDelCarrito(index) {
    console.log(`🗑️ Eliminando producto: ${index}`);
    
    if (index < 0 || index >= carrito.length) {
        console.error('❌ Índice inválido:', index);
        return;
    }
    
    const productoEliminado = carrito[index].nombre;
    carrito.splice(index, 1);
    
    guardarCarrito();
    mostrarCarrito();
    
    console.log(`✅ ${productoEliminado} eliminado del carrito`);
}

// ===========================
// CALCULAR TOTALES
// ===========================
function calcularTotales(elementos) {
    const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const envio = subtotal >= 50 ? 0 : 5.00;
    const total = subtotal + envio;
    
    console.log(`💰 Totales calculados: Subtotal $${subtotal.toFixed(2)}, Envío $${envio.toFixed(2)}, Total $${total.toFixed(2)}`);
    
    if (elementos.subtotal) {
        elementos.subtotal.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    if (elementos.shipping) {
        elementos.shipping.textContent = envio === 0 && subtotal > 0 ? 'Gratis' : `$${envio.toFixed(2)}`;
    }
    
    if (elementos.total) {
        elementos.total.textContent = `$${total.toFixed(2)}`;
    }
}

// ===========================
// ACTUALIZAR CONTADOR
// ===========================
function actualizarContadorCarrito() {
    const elementos = verificarElementosDOM();
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    if (elementos.cartCount) {
        elementos.cartCount.textContent = totalItems;
        console.log(`🔢 Contador actualizado: ${totalItems} items`);
    }
}

// ===========================
// AGREGAR AL CARRITO
// ===========================
function agregarAlCarrito(idProducto) {
    console.log(`➕ Agregando producto ID: ${idProducto}`);
    
    const producto = productos.find(p => p.id === idProducto);
    if (!producto) {
        console.error('❌ Producto no encontrado:', idProducto);
        return;
    }
    
    const productoExistente = carrito.find(item => item.id === idProducto);
    
    if (productoExistente) {
        productoExistente.cantidad++;
        console.log('📦 Producto existente, incrementando cantidad');
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
        console.log('🆕 Nuevo producto agregado');
    }
    
    guardarCarrito();
    actualizarContadorCarrito();
    
    // Mostrar notificación si existe la función
    if (typeof mostrarToast === 'function') {
        mostrarToast(`${producto.nombre} agregado al carrito`, 'success');
    }
}

// ===========================
// PROCESAR COMPRA
// ===========================
function procesarCompra() {
    console.log('💳 Procesando compra...');
    
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    // Verificar usuario logueado
    const usuario = localStorage.getItem('usuarioLogueado');
    if (!usuario) {
        alert('Debes iniciar sesión para proceder con la compra');
        window.location.href = 'login.html';
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    if (confirm(`¿Confirmar compra?\n\nTotal: $${total.toFixed(2)}`)) {
        alert('¡Compra realizada con éxito!');
        limpiarCarrito();
    }
}

// ===========================
// LIMPIAR CARRITO
// ===========================
function limpiarCarrito() {
    console.log('🧹 Limpiando carrito...');
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
    console.log('✅ Carrito limpiado');
}

// ===========================
// FUNCIONES DE UTILIDAD
// ===========================
function obtenerTotalCarrito() {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

function obtenerCantidadItems() {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
}

// ===========================
// EXPORTAR FUNCIONES GLOBALES
// ===========================
window.cambiarCantidad = cambiarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.procesarCompra = procesarCompra;
window.limpiarCarrito = limpiarCarrito;
window.agregarAlCarrito = agregarAlCarrito;

console.log('🚀 Carrito mejorado cargado correctamente');
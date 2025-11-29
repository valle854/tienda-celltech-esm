const express = require('express');
const { pool } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();
// Obtener carrito del usuario
router.get('/', authenticateToken, async (req, res) => {
try {
const userId = req.user.userId;
const [items] = await pool.execute(`
SELECT 
c.id as carrito_id,
c.cantidad,
p.id as producto_id,
p.nombre as producto_nombre,
p.descripcion as producto_descripcion,
p.precio as producto_precio,
p.imagen as producto_imagen,
p.stock as producto_stock,
p.marca,
p.modelo,
(p.precio * c.cantidad) as subtotal
FROM carrito c
JOIN productos p ON c.producto_id = p.id
WHERE c.user_id = ? AND p.activo = TRUE
ORDER BY c.fecha_agregado DESC
`, [userId]);
// Calcular total
const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
res.json({
items,
total: total.toFixed(2),
totalItems: items.reduce((sum, item) => sum + item.cantidad, 0)
});
} catch (error) {
console.error('Error al obtener carrito:', error);
res.status(500).json({
error: 'Error interno del servidor'
});
}
});
// Agregar producto al carrito
router.post('/agregar', authenticateToken, async (req, res) => {
try {
const userId = req.user.userId;
const { producto_id, cantidad = 1 } = req.body;
// Validar que el producto existe y está activo
const [productos] = await pool.execute(
'SELECT id, stock, precio FROM productos WHERE id = ? AND activo = TRUE',
[producto_id]
);
if (productos.length === 0) {
return res.status(404).json({
error: 'Producto no encontrado'
});
}
const producto = productos[0];
// Verificar stock disponible
if (cantidad > producto.stock) {
return res.status(400).json({
error: `Stock insuficiente. Disponible: ${producto.stock}`
});
}
// Verificar si el producto ya está en el carrito
const [existingItems] = await pool.execute(
'SELECT id, cantidad FROM carrito WHERE user_id = ? AND producto_id = ?',
[userId, producto_id]
);
if (existingItems.length > 0) {
// Actualizar cantidad existente
const nuevaCantidad = existingItems[0].cantidad + cantidad;
if (nuevaCantidad > producto.stock) {
return res.status(400).json({
error: `Stock insuficiente. Disponible: ${producto.stock}`
});
}
await pool.execute(
'UPDATE carrito SET cantidad = ? WHERE id = ?',
[nuevaCantidad, existingItems[0].id]
);
} else {
// Agregar nuevo producto al carrito
await pool.execute(
'INSERT INTO carrito (user_id, producto_id, cantidad) VALUES (?, ?, ?)',
[userId, producto_id, cantidad]
);
}
res.json({
message: 'Producto agregado al carrito exitosamente'
});
} catch (error) {
console.error('Error al agregar al carrito:', error);
res.status(500).json({
error: 'Error interno del servidor'
});
}
});
// Actualizar cantidad de producto en el carrito
router.put('/actualizar/:carrito_id', authenticateToken, async (req, res) => {
try {
const userId = req.user.userId;
const { carrito_id } = req.params;
const { cantidad } = req.body;
if (cantidad <= 0) {
return res.status(400).json({
error: 'La cantidad debe ser mayor a 0'
});
}
// Verificar que el item pertenece al usuario
const [items] = await pool.execute(`
SELECT c.id, c.producto_id, p.stock
FROM carrito c
JOIN productos p ON c.producto_id = p.id
WHERE c.id = ? AND c.user_id = ? AND p.activo = TRUE
`, [carrito_id, userId]);
if (items.length === 0) {
return res.status(404).json({
error: 'Item del carrito no encontrado'
});
}
const item = items[0];
// Verificar stock
if (cantidad > item.stock) {
return res.status(400).json({
error: `Stock insuficiente. Disponible: ${item.stock}`
});
}
await pool.execute(
'UPDATE carrito SET cantidad = ? WHERE id = ?',
[cantidad, carrito_id]
);
res.json({
message: 'Cantidad actualizada exitosamente'
});
} catch (error) {
console.error('Error al actualizar carrito:', error);
res.status(500).json({
error: 'Error interno del servidor'
});
}
});
// Eliminar producto del carrito
router.delete('/eliminar/:carrito_id', authenticateToken, async (req, res) => {
try {
const userId = req.user.userId;
const { carrito_id } = req.params;
const [result] = await pool.execute(
'DELETE FROM carrito WHERE id = ? AND user_id = ?',
[carrito_id, userId]
);
if (result.affectedRows === 0) {
return res.status(404).json({
error: 'Item del carrito no encontrado'
});
}
res.json({
message: 'Producto eliminado del carrito exitosamente'
});
} catch (error) {
console.error('Error al eliminar del carrito:', error);
res.status(500).json({
error: 'Error interno del servidor'
});
}
});
// Limpiar carrito completo
router.delete('/limpiar', authenticateToken, async (req, res) => {
try {
const userId = req.user.userId;
await pool.execute(
'DELETE FROM carrito WHERE user_id = ?',
[userId]
);
res.json({
message: 'Carrito limpiado exitosamente'
});
} catch (error) {
console.error('Error al limpiar carrito:', error);
res.status(500).json({
error: 'Error interno del servidor'
});
}
});
// Obtener total del carrito (para mostrar en el header)
router.get('/total', authenticateToken, async (req, res) => {
try {
const userId = req.user.userId;
const [result] = await pool.execute(`
SELECT 
COUNT(c.id) as total_items,
SUM(c.cantidad * p.precio) as total_precio
FROM carrito c
JOIN productos p ON c.producto_id = p.id
WHERE c.user_id = ? AND p.activo = TRUE
`, [userId]);
const carritoInfo = result[0] || { total_items: 0, total_precio: 0 };
res.json({
total_items: carritoInfo.total_items || 0,
total_precio: (carritoInfo.total_precio || 0).toFixed(2)
});
} catch (error) {
console.error('Error al obtener total del carrito:', error);
res.status(500).json({
error: 'Error interno del servidor'
});
}
});
module.exports = router;
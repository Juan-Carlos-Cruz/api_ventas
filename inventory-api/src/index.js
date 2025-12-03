const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { products, reservations } = require('./data');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==================== PRODUCTOS ====================

// 1. Búsqueda de productos
app.get('/api/v1/products/search', (req, res) => {
  const { query, limit = 50, offset = 0 } = req.query;

  // Validación
  if (!query || query.length < 2) {
    return res.status(400).json({
      error: 'Query inválido',
      message: 'El término de búsqueda debe tener al menos 2 caracteres'
    });
  }

  // Búsqueda case-insensitive
  const searchTerm = query.toLowerCase();
  const filtered = products.filter(p =>
    p.active && (
      p.name.toLowerCase().includes(searchTerm) ||
      p.sku.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    )
  );

  // Paginación
  const limitNum = Math.min(parseInt(limit), 100);
  const offsetNum = parseInt(offset);
  const paginated = filtered.slice(offsetNum, offsetNum + limitNum);

  res.json({
    data: paginated,
    total: filtered.length,
    limit: limitNum,
    offset: offsetNum
  });
});

// 2. Obtener producto por ID
app.get('/api/v1/products/:productId', (req, res) => {
  const { productId } = req.params;

  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({
      error: 'Producto no encontrado',
      productId
    });
  }

  res.json(product);
});

// 3. Consultar disponibilidad
app.get('/api/v1/products/:productId/availability', (req, res) => {
  const { productId } = req.params;

  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({
      error: 'Producto no encontrado',
      productId
    });
  }

  // Calcular stock disponible considerando reservas activas
  let availableQuantity = product.stockQuantity;

  if (product.availabilityType === 'STOCK') {
    // Restar reservas activas
    const activeReservations = Array.from(reservations.values())
      .filter(r => r.productId === productId && r.status === 'ACTIVE' && new Date(r.expiresAt) > new Date());

    const reservedQuantity = activeReservations.reduce((sum, r) => sum + r.quantity, 0);
    availableQuantity = Math.max(0, product.stockQuantity - reservedQuantity);
  }

  res.json({
    productId: product.id,
    availabilityType: product.availabilityType,
    quantity: availableQuantity,
    estimatedDays: product.estimatedDays,
    available: product.availabilityType === 'STOCK' ? availableQuantity > 0 : true,
    lastUpdated: new Date().toISOString()
  });
});

// ==================== RESERVAS ====================

// Limpiar reservas expiradas cada minuto
setInterval(() => {
  const now = new Date();
  let cleaned = 0;

  reservations.forEach((reservation, id) => {
    if (reservation.status === 'ACTIVE' && new Date(reservation.expiresAt) <= now) {
      reservation.status = 'EXPIRED';
      cleaned++;
    }
  });

  if (cleaned > 0) {
    console.log(`[${now.toISOString()}] Limpiadas ${cleaned} reservas expiradas`);
  }
}, 60000); // Cada 1 minuto

// 4. Crear reserva
app.post('/api/v1/reservations', (req, res) => {
  const { productId, quantity, salesChannel, metadata } = req.body;

  // Validación
  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({
      error: 'Datos inválidos',
      message: 'productId y quantity son requeridos, quantity debe ser > 0'
    });
  }

  if (!salesChannel || !['IN_STORE', 'ONLINE', 'PHONE'].includes(salesChannel)) {
    return res.status(400).json({
      error: 'Datos inválidos',
      message: 'salesChannel debe ser: IN_STORE, ONLINE o PHONE'
    });
  }

  // Buscar producto
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({
      error: 'Producto no encontrado',
      productId
    });
  }

  // Solo se pueden reservar productos tipo STOCK
  if (product.availabilityType !== 'STOCK') {
    return res.status(422).json({
      error: 'Producto no reservable',
      message: 'Solo se pueden reservar productos con availabilityType = STOCK',
      availabilityType: product.availabilityType
    });
  }

  // Calcular stock disponible
  const activeReservations = Array.from(reservations.values())
    .filter(r => r.productId === productId && r.status === 'ACTIVE' && new Date(r.expiresAt) > new Date());

  const reservedQuantity = activeReservations.reduce((sum, r) => sum + r.quantity, 0);
  const availableQuantity = product.stockQuantity - reservedQuantity;

  // Verificar stock suficiente
  if (availableQuantity < quantity) {
    return res.status(409).json({
      error: 'Stock insuficiente',
      message: `Solo hay ${availableQuantity} unidades disponibles`,
      requested: quantity,
      available: availableQuantity
    });
  }

  // Crear reserva (15 minutos)
  const reservationId = uuidv4();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // +15 minutos

  const reservation = {
    id: reservationId,
    productId,
    quantity,
    status: 'ACTIVE',
    salesChannel,
    metadata: metadata || {},
    expiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString()
  };

  reservations.set(reservationId, reservation);

  console.log(`[RESERVATION CREATED] ${reservationId} - Product: ${productId}, Qty: ${quantity}, Expires: ${expiresAt.toISOString()}`);

  res.status(201).json({
    id: reservation.id,
    productId: reservation.productId,
    quantity: reservation.quantity,
    status: reservation.status,
    expiresAt: reservation.expiresAt,
    createdAt: reservation.createdAt
  });
});

// 5. Confirmar reserva
app.post('/api/v1/reservations/:reservationId/confirm', (req, res) => {
  const { reservationId } = req.params;
  const { saleId, confirmedBy } = req.body;

  const reservation = reservations.get(reservationId);

  if (!reservation) {
    return res.status(404).json({
      error: 'Reserva no encontrada',
      reservationId
    });
  }

  // Verificar que esté activa
  if (reservation.status !== 'ACTIVE') {
    return res.status(409).json({
      error: 'Reserva no disponible',
      message: 'Solo se pueden confirmar reservas activas',
      status: reservation.status
    });
  }

  // Verificar que no haya expirado
  if (new Date(reservation.expiresAt) <= new Date()) {
    reservation.status = 'EXPIRED';
    return res.status(409).json({
      error: 'Reserva expirada',
      message: 'La reserva ha expirado y no puede ser confirmada',
      expiresAt: reservation.expiresAt
    });
  }

  // Confirmar reserva
  reservation.status = 'CONFIRMED';
  reservation.saleId = saleId;
  reservation.confirmedBy = confirmedBy;
  reservation.confirmedAt = new Date().toISOString();

  // Descontar stock del producto
  const product = products.find(p => p.id === reservation.productId);
  if (product) {
    product.stockQuantity = Math.max(0, product.stockQuantity - reservation.quantity);
    product.updatedAt = new Date();
    console.log(`[STOCK UPDATED] Product: ${product.id}, New Stock: ${product.stockQuantity}`);
  }

  console.log(`[RESERVATION CONFIRMED] ${reservationId} - Sale: ${saleId}, Stock reduced by ${reservation.quantity}`);

  res.json({
    id: reservation.id,
    productId: reservation.productId,
    quantity: reservation.quantity,
    status: reservation.status,
    saleId: reservation.saleId,
    confirmedAt: reservation.confirmedAt,
    confirmedBy: reservation.confirmedBy
  });
});

// 6. Liberar reserva
app.delete('/api/v1/reservations/:reservationId', (req, res) => {
  const { reservationId } = req.params;

  const reservation = reservations.get(reservationId);

  if (!reservation) {
    return res.status(404).json({
      error: 'Reserva no encontrada',
      reservationId
    });
  }

  // No se pueden liberar reservas confirmadas
  if (reservation.status === 'CONFIRMED') {
    return res.status(409).json({
      error: 'Reserva ya confirmada',
      message: 'No se pueden liberar reservas confirmadas'
    });
  }

  // Liberar reserva (operación idempotente)
  const wasActive = reservation.status === 'ACTIVE' && new Date(reservation.expiresAt) > new Date();
  reservation.status = 'RELEASED';
  reservation.releasedAt = new Date().toISOString();

  console.log(`[RESERVATION RELEASED] ${reservationId} - Was active: ${wasActive}`);

  res.json({
    id: reservation.id,
    status: reservation.status,
    releasedAt: reservation.releasedAt,
    message: 'Reservation released successfully, stock returned'
  });
});

// ==================== UTILIDADES ====================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'inventory-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    stats: {
      products: products.length,
      reservations: {
        total: reservations.size,
        active: Array.from(reservations.values()).filter(r => r.status === 'ACTIVE').length,
        confirmed: Array.from(reservations.values()).filter(r => r.status === 'CONFIRMED').length,
        expired: Array.from(reservations.values()).filter(r => r.status === 'EXPIRED').length,
        released: Array.from(reservations.values()).filter(r => r.status === 'RELEASED').length
      }
    }
  });
});

// Lista de productos (sin filtros - para debug)
app.get('/api/v1/products', (req, res) => {
  res.json({
    data: products,
    total: products.length
  });
});

// Lista de reservas (para debug)
app.get('/api/v1/reservations', (req, res) => {
  const allReservations = Array.from(reservations.values());
  res.json({
    data: allReservations,
    total: allReservations.length
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 INVENTORY API MOCK - RUNNING');
  console.log('='.repeat(60));
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`📦 Products: ${products.length} loaded`);
  console.log('='.repeat(60));
  console.log('\n📋 Available Endpoints:');
  console.log('  GET  /api/v1/products/search?query={term}');
  console.log('  GET  /api/v1/products/:id');
  console.log('  GET  /api/v1/products/:id/availability');
  console.log('  POST /api/v1/reservations');
  console.log('  POST /api/v1/reservations/:id/confirm');
  console.log('  DEL  /api/v1/reservations/:id');
  console.log('\n🔧 Debug Endpoints:');
  console.log('  GET  /api/v1/products (all products)');
  console.log('  GET  /api/v1/reservations (all reservations)');
  console.log('  GET  /health (health check)');
  console.log('='.repeat(60));
  console.log('');
});

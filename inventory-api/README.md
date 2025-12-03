# 📦 Inventory API Mock

API mock simple para simular el módulo de Inventarios durante el desarrollo y testing del Portal de Ventas.

## 🚀 Inicio Rápido

### Instalación

```bash
cd inventory-api
npm install
```

### Ejecutar

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

La API estará disponible en: **http://localhost:3001**

## 📋 Endpoints Disponibles

### 1. Búsqueda de Productos
```http
GET /api/v1/products/search?query={term}&limit={n}&offset={n}
```

**Query Parameters:**
- `query` (requerido): Término de búsqueda (min 2 caracteres)
- `limit` (opcional): Límite de resultados (default: 50, max: 100)
- `offset` (opcional): Paginación (default: 0)

**Ejemplo:**
```bash
curl "http://localhost:3001/api/v1/products/search?query=laptop&limit=5"
```

**Response:**
```json
{
  "data": [
    {
      "id": "prod-001",
      "sku": "HP-PB450-001",
      "name": "Laptop HP ProBook 450",
      "price": 899990,
      "availabilityType": "STOCK",
      "stockQuantity": 15
    }
  ],
  "total": 1,
  "limit": 5,
  "offset": 0
}
```

---

### 2. Obtener Producto por ID
```http
GET /api/v1/products/:productId
```

**Ejemplo:**
```bash
curl http://localhost:3001/api/v1/products/prod-001
```

**Response:**
```json
{
  "id": "prod-001",
  "sku": "HP-PB450-001",
  "name": "Laptop HP ProBook 450",
  "description": "Laptop corporativa 15.6\" Intel i5...",
  "price": 899990,
  "availabilityType": "STOCK",
  "stockQuantity": 15,
  "specifications": {...},
  "weight": 1.8,
  "dimensions": {...}
}
```

---

### 3. Consultar Disponibilidad
```http
GET /api/v1/products/:productId/availability
```

**Ejemplo:**
```bash
curl http://localhost:3001/api/v1/products/prod-001/availability
```

**Response:**
```json
{
  "productId": "prod-001",
  "availabilityType": "STOCK",
  "quantity": 15,
  "estimatedDays": null,
  "available": true,
  "lastUpdated": "2024-11-24T10:30:00.000Z"
}
```

---

### 4. Crear Reserva
```http
POST /api/v1/reservations
Content-Type: application/json

{
  "productId": "prod-001",
  "quantity": 2,
  "salesChannel": "IN_STORE",
  "metadata": {
    "sellerId": "user-123",
    "sessionId": "sess-abc"
  }
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3001/api/v1/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod-001",
    "quantity": 2,
    "salesChannel": "IN_STORE"
  }'
```

**Response 201:**
```json
{
  "id": "res-uuid-123",
  "productId": "prod-001",
  "quantity": 2,
  "status": "ACTIVE",
  "expiresAt": "2024-11-24T10:45:00.000Z",
  "createdAt": "2024-11-24T10:30:00.000Z"
}
```

**⏰ Importante:** La reserva expira en **15 minutos** automáticamente.

---

### 5. Confirmar Reserva
```http
POST /api/v1/reservations/:reservationId/confirm
Content-Type: application/json

{
  "saleId": "sale-uuid-999",
  "confirmedBy": "user-uuid-789"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3001/api/v1/reservations/res-uuid-123/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "saleId": "sale-999",
    "confirmedBy": "user-789"
  }'
```

**Response 200:**
```json
{
  "id": "res-uuid-123",
  "productId": "prod-001",
  "quantity": 2,
  "status": "CONFIRMED",
  "saleId": "sale-999",
  "confirmedAt": "2024-11-24T10:35:00.000Z",
  "confirmedBy": "user-789"
}
```

**📉 Efecto:** El stock del producto se descuenta permanentemente.

---

### 6. Liberar Reserva
```http
DELETE /api/v1/reservations/:reservationId
```

**Ejemplo:**
```bash
curl -X DELETE http://localhost:3001/api/v1/reservations/res-uuid-123
```

**Response 200:**
```json
{
  "id": "res-uuid-123",
  "status": "RELEASED",
  "releasedAt": "2024-11-24T10:40:00.000Z",
  "message": "Reservation released successfully, stock returned"
}
```

---

## 🔧 Endpoints de Debug

### Listar Todos los Productos
```bash
curl http://localhost:3001/api/v1/products
```

### Listar Todas las Reservas
```bash
curl http://localhost:3001/api/v1/reservations
```

### Health Check
```bash
curl http://localhost:3001/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "inventory-api",
  "timestamp": "2024-11-24T10:30:00.000Z",
  "uptime": 123.456,
  "stats": {
    "products": 8,
    "reservations": {
      "total": 5,
      "active": 2,
      "confirmed": 2,
      "expired": 1,
      "released": 0
    }
  }
}
```

---

## 📦 Productos Disponibles

La API incluye **8 productos mock**:

| ID | SKU | Nombre | Tipo | Stock | Precio |
|----|-----|--------|------|-------|--------|
| prod-001 | HP-PB450-001 | Laptop HP ProBook 450 | STOCK | 15 | $899.990 |
| prod-002 | DELL-XPS13-002 | Dell XPS 13 | MANUFACTURING | 0 (7 días) | $1.299.990 |
| prod-003 | LG-MX3-001 | Mouse Logitech MX Master 3 | STOCK | 45 | $89.990 |
| prod-004 | APPLE-MBA-M2 | MacBook Air M2 | MADE_TO_ORDER | 0 (14 días) | $1.499.990 |
| prod-005 | KB-MX-KEYS | Teclado Logitech MX Keys | STOCK | 28 | $129.990 |
| prod-006 | MON-DELL-27 | Monitor Dell 27" 4K | STOCK | 8 | $449.990 |
| prod-007 | HP-LASER-PRO | Impresora HP LaserJet Pro | MANUFACTURING | 0 (5 días) | $249.990 |
| prod-008 | WEB-LOGI-C920 | Webcam Logitech C920 | STOCK | 32 | $79.990 |

---

## 🧪 Ejemplos de Prueba

### Flujo Completo de Venta

```bash
# 1. Buscar productos
curl "http://localhost:3001/api/v1/products/search?query=laptop"

# 2. Consultar disponibilidad
curl http://localhost:3001/api/v1/products/prod-001/availability

# 3. Crear reserva
RESERVATION_ID=$(curl -X POST http://localhost:3001/api/v1/reservations \
  -H "Content-Type: application/json" \
  -d '{"productId":"prod-001","quantity":2,"salesChannel":"IN_STORE"}' \
  | jq -r '.id')

echo "Reservation ID: $RESERVATION_ID"

# 4. Confirmar reserva
curl -X POST http://localhost:3001/api/v1/reservations/$RESERVATION_ID/confirm \
  -H "Content-Type: application/json" \
  -d '{"saleId":"sale-999","confirmedBy":"user-789"}'

# 5. Verificar que el stock se descontó
curl http://localhost:3001/api/v1/products/prod-001/availability
```

### Probar Expiración de Reserva

```bash
# 1. Crear reserva
RESERVATION_ID=$(curl -X POST http://localhost:3001/api/v1/reservations \
  -H "Content-Type: application/json" \
  -d '{"productId":"prod-001","quantity":1,"salesChannel":"IN_STORE"}' \
  | jq -r '.id')

# 2. Esperar 15 minutos (o modificar el código para reducir el tiempo)

# 3. Intentar confirmar (debería fallar)
curl -X POST http://localhost:3001/api/v1/reservations/$RESERVATION_ID/confirm \
  -H "Content-Type: application/json" \
  -d '{"saleId":"sale-999"}'
```

### Probar Cancelación

```bash
# 1. Crear reserva
RESERVATION_ID=$(curl -X POST http://localhost:3001/api/v1/reservations \
  -H "Content-Type: application/json" \
  -d '{"productId":"prod-003","quantity":5,"salesChannel":"ONLINE"}' \
  | jq -r '.id')

# 2. Liberar reserva
curl -X DELETE http://localhost:3001/api/v1/reservations/$RESERVATION_ID

# 3. Verificar estado
curl http://localhost:3001/api/v1/reservations
```

---

## ⚙️ Características

✅ **Sistema de Reservas:** Reservas temporales de 15 minutos
✅ **Auto-expiración:** Limpieza automática cada 1 minuto
✅ **Gestión de Stock:** Descuento automático al confirmar
✅ **3 Tipos de Disponibilidad:** STOCK, MANUFACTURING, MADE_TO_ORDER
✅ **Validaciones:** Stock insuficiente, productos no encontrados, reservas expiradas
✅ **CORS Habilitado:** Listo para llamadas desde frontend
✅ **Logs Detallados:** Trazabilidad de todas las operaciones
✅ **Health Check:** Monitoreo del estado del servicio

---

## 📊 Estados de Reserva

| Estado | Descripción |
|--------|-------------|
| `ACTIVE` | Reserva activa, aún no expirada |
| `CONFIRMED` | Reserva confirmada, stock descontado |
| `EXPIRED` | Reserva expirada automáticamente |
| `RELEASED` | Reserva liberada manualmente |

---

## 🔄 Integración con Frontend

En tu servicio de inventario del frontend (`frontend/src/services/inventoryApi.ts`), actualiza la URL base:

```typescript
const INVENTORY_API_URL = 'http://localhost:3001/api/v1';
```

Ahora todas las llamadas funcionarán con datos reales en lugar de mocks.

---

## 🐛 Troubleshooting

### Puerto 3001 ya en uso
```bash
# Cambiar puerto
PORT=3005 npm start
```

### Ver logs en tiempo real
Los logs se muestran automáticamente en consola:
```
[2024-11-24T10:30:00.000Z] GET /api/v1/products/search
[RESERVATION CREATED] res-abc123 - Product: prod-001, Qty: 2
[STOCK UPDATED] Product: prod-001, New Stock: 13
```

### Reiniciar datos
Simplemente reinicia el servidor (Ctrl+C y `npm start`). Los datos en memoria se resetean.

---

## 📝 Notas Importantes

1. **Datos en Memoria:** Todos los datos se pierden al reiniciar el servidor
2. **Sin Autenticación:** No requiere tokens (solo para testing)
3. **CORS Abierto:** Acepta requests desde cualquier origen
4. **Auto-limpieza:** Las reservas expiradas se marcan cada 60 segundos
5. **Stock Real:** El stock se descuenta permanentemente al confirmar reservas

---

## 🚢 Usar con Docker (Opcional)

```bash
# Construir imagen
docker build -t inventory-api-mock .

# Ejecutar
docker run -p 3001:3001 inventory-api-mock
```

---

## 📚 Ver También

- [API_REQUIREMENTS.md](../API_REQUIREMENTS.md) - Especificación completa de la API
- [Frontend README](../frontend/README.md) - Integración con el frontend

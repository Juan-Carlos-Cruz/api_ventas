# Integración con API de Despachos - Formato del Equipo de Despachos

## URL del Endpoint

Para configurar la URL de la API de despachos real, edita el archivo `.env` en el directorio `backend`:

```env
DISPATCH_API_URL="https://api-despachos.tudominio.com"  # URL real del equipo de despachos
```

## Endpoint de Creación de Despacho

**Endpoint:** `POST /api/despachos`

### Request Body (Formato del Equipo de Despachos)

```json
{
  "id_venta": "V-2024-001567",
  "cliente_nombre": "Constructora Norte SAC",
  "cliente_telefono": "987654321",
  "direccion_entrega": "Av. Los Constructores 123, Lima, San Isidro",
  "productos": [
    {
      "id_producto": "RIPIT-5000",
      "nombre": "Cadena Ripit 5000",
      "cantidad": 50
    },
    {
      "id_producto": "KIT-MANT-01",
      "nombre": "Kit de Mantenimiento",
      "cantidad": 10
    }
  ],
  "fecha_estimada_envio": "2024-01-18"
}
```

### Campos del Request

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_venta` | string | ID de la venta en nuestro sistema |
| `cliente_nombre` | string | Nombre completo del cliente |
| `cliente_telefono` | string | Teléfono del cliente |
| `direccion_entrega` | string | Dirección completa de entrega |
| `productos` | array | Lista de productos a despachar |
| `productos[].id_producto` | string | ID del producto |
| `productos[].nombre` | string | Nombre del producto |
| `productos[].cantidad` | number | Cantidad a despachar |
| `fecha_estimada_envio` | string | Fecha estimada (formato: YYYY-MM-DD) |

### Response Esperado

```json
{
  "id_despacho": "DESP-2024-001567",
  "estado": "listo para despacho",
  "numero_seguimiento": "TRK-123456789",
  "fecha_estimada_entrega": "2024-01-20"
}
```

### Campos del Response

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_despacho` | string | ID del despacho generado |
| `estado` | string | Estado del despacho |
| `numero_seguimiento` | string (opcional) | Número de tracking |
| `fecha_estimada_entrega` | string | Fecha estimada de entrega |

---

## Envío por Lotes (Batch)

Para enviar múltiples órdenes de una vez:

**Endpoint:** `POST /api/despachos/batch`

### Request Body

```json
{
  "ordenes": [
    {
      "id_venta": "V-2024-001567",
      "cliente_nombre": "Constructora Norte SAC",
      "cliente_telefono": "987654321",
      "direccion_entrega": "Av. Los Constructores 123, Lima",
      "productos": [
        {
          "id_producto": "RIPIT-5000",
          "nombre": "Cadena Ripit 5000",
          "cantidad": 50
        }
      ],
      "fecha_estimada_envio": "2024-01-18",
      "estado": "listo para despacho"
    },
    {
      "id_venta": "V-2024-001568", 
      "cliente_nombre": "Maderera Sur EIRL",
      "cliente_telefono": "987654322",
      "direccion_entrega": "Calle Los Madereros 456, Arequipa",
      "productos": [
        {
          "id_producto": "RIPIT-5000",
          "nombre": "Cadena Ripit 5000",
          "cantidad": 25
        }
      ],
      "fecha_estimada_envio": "2024-01-19",
      "estado": "pendiente"
    }
  ]
}
```

---

## Mapeo de Datos

Nuestro sistema transforma automáticamente los datos al formato esperado:

| Campo Interno | Campo API Despachos | Transformación |
|---------------|---------------------|----------------|
| `sale.id` | `id_venta` | Directo |
| `person.name` | `cliente_nombre` | Directo |
| `person.phone` | `cliente_telefono` | Si no hay teléfono, usa email |
| `person.address` | `direccion_entrega` | Directo |
| `item.productId` | `productos[].id_producto` | Directo |
| `item.description` | `productos[].nombre` | Si no hay descripción, usa productId |
| `item.quantity` | `productos[].cantidad` | Directo |
| `deliveryDate` | `fecha_estimada_envio` | Formato YYYY-MM-DD |

---

## Flujo de Integración

### 1. Usuario Finaliza Venta con Envío a Domicilio

```
Frontend → Backend → Dispatch API
```

**Datos enviados:**
- ID de venta
- Información del cliente (nombre, teléfono, dirección)
- Lista de productos con cantidades
- Fecha estimada de envío

### 2. Backend Transforma y Envía

El backend automáticamente:
1. Obtiene los datos de la venta y el cliente
2. Transforma al formato del equipo de despachos
3. Envía POST a `/api/despachos`
4. Guarda el `id_despacho` en la venta

### 3. Response del Equipo de Despachos

El equipo de despachos retorna:
- ID del despacho creado
- Estado inicial
- Número de seguimiento (opcional)
- Fecha estimada de entrega

---

## Configuración

### Variables de Entorno

```env
# Backend .env
DISPATCH_API_URL="https://api-despachos.tudominio.com"
```

### Código de Integración

El código de integración está en:
- `/backend/src/services/dispatchService.ts` - Servicio de despachos
- `/backend/src/controllers/salesController.ts` - Lógica de creación de ventas

### Transformación de Datos

```typescript
const dispatchPayload = {
    id_venta: saleId,
    cliente_nombre: customerName,
    cliente_telefono: customerPhone || customerEmail,
    direccion_entrega: customerAddress,
    productos: items.map(item => ({
        id_producto: item.productId,
        nombre: item.description || item.productId,
        cantidad: item.quantity
    })),
    fecha_estimada_envio: deliveryDate.split('T')[0] // YYYY-MM-DD
};
```

---

## Campo de Teléfono

### Actualización del Modelo Person

Se agregó el campo `phone` al modelo de personas:

```prisma
model Person {
  id             String   @id @default(uuid())
  name           String
  email          String   @unique
  phone          String?  // ← NUEVO CAMPO
  documentNumber String   @unique
  address        String
  sales          Sale[]
  createdAt      DateTime @default(now())
}
```

### Frontend

El campo de teléfono debe agregarse al formulario de personas en:
- `/frontend/src/pages/Persons.tsx`

---

## Manejo de Errores

### Si la API de Despachos Falla

El sistema tiene un fallback automático:

```typescript
// Fallback si la API no responde
return {
    dispatchId: `DISPATCH-${Date.now()}`,
    status: 'PENDING',
    trackingNumber: `TRK-${Date.now()}`,
    estimatedDeliveryDate: deliveryDate
};
```

La venta se crea normalmente pero sin ID de despacho real.

### Logs

Todos los errores se registran en la consola:
```
Error creating dispatch: [error details]
```

---

## Testing

### Probar con API Mock

La dispatch-api mock ya está configurada para aceptar el formato correcto:

```bash
curl -X POST http://localhost:3002/api/despachos \
  -H "Content-Type: application/json" \
  -d '{
    "id_venta": "test-123",
    "cliente_nombre": "Test Cliente",
    "cliente_telefono": "987654321",
    "direccion_entrega": "Calle Test 123",
    "productos": [
      {
        "id_producto": "prod-001",
        "nombre": "Producto Test",
        "cantidad": 5
      }
    ],
    "fecha_estimada_envio": "2024-12-10"
  }'
```

### Probar con API Real

1. Actualizar `DISPATCH_API_URL` en `.env`
2. Reiniciar backend: `docker compose restart backend`
3. Crear una venta con envío a domicilio
4. Verificar logs del backend
5. Confirmar que se guardó el `dispatchId`

---

## Checklist de Implementación

- [x] Servicio de despachos actualizado con formato correcto
- [x] Endpoint cambiado a `/api/despachos`
- [x] Transformación de datos implementada
- [x] Campo `phone` agregado al modelo Person
- [x] Mapeo de teléfono (phone o email como fallback)
- [x] Formato de fecha corregido (YYYY-MM-DD)
- [x] Productos mapeados correctamente
- [x] Fallback implementado para errores
- [ ] Campo phone agregado al frontend
- [ ] Pruebas con API real del equipo de despachos

---

## Próximos Pasos

1. **Agregar campo de teléfono al frontend:**
   - Actualizar formulario en `Persons.tsx`
   - Agregar validación de teléfono

2. **Coordinar con equipo de despachos:**
   - Obtener URL de producción
   - Verificar formato de response
   - Confirmar códigos de estado HTTP

3. **Implementar batch dispatch:**
   - Si se necesita enviar múltiples órdenes
   - Endpoint `/api/despachos/batch`

---

## Soporte

Para más información sobre la API mock de despachos:
- `dispatch-api/README.md` - Documentación de la API mock
- `DISPATCH_API_CONFIG.md` - Configuración general

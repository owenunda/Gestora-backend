# 📘 Guía de Implementación Frontend - Sistema de Inventario

Esta guía detalla cómo integrar el sistema de inventario de productos terminados en el frontend.

## 🔗 Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/inventory-finished-products` | Obtener inventario actual |
| `GET` | `/api/inventory-finished-product-movements` | Obtener historial de movimientos |
| `POST` | `/api/inventory-finished-product-movements` | Registrar nuevo movimiento (Producción, Venta, Ajuste) |

---

## 🛠️ Interfaces TypeScript

Copia estas interfaces en tu proyecto frontend para tener tipado estricto.

```typescript
// Tipos de movimiento permitidos
export type MovementType = 'production_output' | 'sale' | 'adjustment' | 'initial_load';

// Interfaz para el Inventario Actual
export interface InventoryItem {
  id: string;
  client_id: string;
  product_id: string;
  quantity: string; // Viene como string del backend (Decimal)
  unit: string;
  updated_at: string;
  products: {
    id: string;
    name: string;
    status: string;
  };
}

// Interfaz para el Historial de Movimientos
export interface InventoryMovement {
  id: string;
  client_id: string;
  product_id: string;
  type: MovementType;
  quantity: string;
  unit: string;
  notes?: string;
  created_at: string;
  products?: {
    id: string;
    name: string;
  };
}

// DTO para crear un movimiento
export interface CreateMovementDto {
  product_id: number; // ID del producto
  type: MovementType;
  quantity: number;
  unit: string;
  notes?: string;
}
```

---

## 📡 Servicios (Ejemplo con Axios)

```typescript
import axios from 'axios';

const API_URL = 'https://gestora-backend-production.up.railway.app/api'; // O tu URL local

// Configuración de Axios con Token
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // O donde guardes tu JWT
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const InventoryService = {
  // Obtener inventario actual
  getInventory: async (productId?: number) => {
    const params = productId ? { product_id: productId } : {};
    const response = await api.get<InventoryItem[]>('/inventory-finished-products', { params });
    return response.data;
  },

  // Obtener historial de movimientos
  getMovements: async (filters?: { product_id?: number; type?: MovementType }) => {
    const response = await api.get<InventoryMovement[]>('/inventory-finished-product-movements', { params: filters });
    return response.data;
  },

  // Registrar un movimiento (Producción, Venta, Ajuste)
  createMovement: async (data: CreateMovementDto) => {
    const response = await api.post<InventoryMovement>('/inventory-finished-product-movements', data);
    return response.data;
  },
};
```

---

## 🚨 Manejo de Errores

El backend retorna errores con códigos de estado HTTP estándar. Es importante manejarlos en el frontend para dar feedback al usuario.

### **Error: Inventario Insuficiente (400 Bad Request)**

Cuando intentas registrar una salida (ej. Venta) mayor al stock disponible.

**Respuesta del Backend:**
```json
{
  "statusCode": 400,
  "message": "Insufficient inventory. Current: 5 kg, Requested: 10 kg",
  "error": "Bad Request"
}
```

**Ejemplo de manejo en React:**

```typescript
try {
  await InventoryService.createMovement({
    product_id: 1,
    type: 'sale',
    quantity: 100, // Cantidad excesiva
    unit: 'kg'
  });
} catch (error) {
  if (axios.isAxiosError(error) && error.response) {
    const { message } = error.response.data;
    if (message.includes('Insufficient inventory')) {
      alert(`⚠️ No hay suficiente stock. ${message}`);
    } else {
      alert('Error al registrar el movimiento');
    }
  }
}
```

---

## 💡 Ejemplos de Uso

### 1. Registrar una Producción (Entrada)

```typescript
await InventoryService.createMovement({
  product_id: 1,
  type: 'production_output',
  quantity: 50,
  unit: 'kg',
  notes: 'Lote de producción #2025-01'
});
// Esto aumentará el inventario en 50kg
```

### 2. Registrar una Venta (Salida)

```typescript
await InventoryService.createMovement({
  product_id: 1,
  type: 'sale',
  quantity: 10,
  unit: 'kg',
  notes: 'Venta a Cliente X'
});
// Esto reducirá el inventario en 10kg
```

### 3. Registrar una Merma/Pérdida (Ajuste Negativo)

```typescript
await InventoryService.createMovement({
  product_id: 1,
  type: 'adjustment',
  quantity: -2.5, // Cantidad negativa para restar
  unit: 'kg',
  notes: 'Producto dañado en almacén'
});
```

---

## 📊 Visualización de Datos

Para mostrar el inventario en una tabla, puedes combinar los datos de productos con el inventario actual.

1. Carga la lista de productos.
2. Carga el inventario actual.
3. Mapea los datos:

```typescript
// El endpoint /inventory-finished-products ya incluye el objeto 'products'
// por lo que puedes mostrar directamente el nombre del producto.

inventoryItems.map(item => (
  <tr key={item.id}>
    <td>{item.products.name}</td>
    <td>{item.quantity} {item.unit}</td>
    <td>{new Date(item.updated_at).toLocaleDateString()}</td>
  </tr>
));
```

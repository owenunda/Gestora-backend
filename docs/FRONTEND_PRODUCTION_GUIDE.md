# 🏭 Guía de Implementación Frontend - Módulo de Producciones

Esta guía detalla cómo integrar el módulo de producciones, que permite registrar la fabricación de productos terminados, opcionalmente consumiendo materias primas.

## 🔗 Endpoints Principales

| Método | Endpoint            | Descripción                                      |
| ------ | ------------------- | ------------------------------------------------ |
| `POST` | `/api/productions`  | Registrar una nueva producción                   |
| `GET`  | `/api/productions`  | Listar historial de producciones                 |
| `GET`  | `/api/productions/:id` | Ver detalles de una producción (materiales y productos) |

---

## 🛠️ Interfaces TypeScript

Copia estas interfaces para facilitar el desarrollo en el frontend.

```typescript
// DTO para items de Materia Prima (Opcional)
export interface ProductionMaterialPayload {
  raw_material_id: number;
  quantity: number;
  unit: string;
}

// DTO para items de Producto Terminado (Requerido)
export interface ProductionProductPayload {
  product_id: number;
  quantity: number;
  unit: string;
}

// Payload principal para crear producción
export interface CreateProductionPayload {
  production_date: string; // ISO 8601 (ej. "2023-12-12T10:00:00Z")
  batch_code?: string;     // Opcional
  notes?: string;          // Opcional
  materials?: ProductionMaterialPayload[]; // Array opcional
  products: ProductionProductPayload[];    // Array requerido
}

// Respuesta de Producción
export interface ProductionResponse {
  id: string; // BigInt serializado como string
  client_id: string;
  production_date: string;
  batch_code?: string;
  notes?: string;
  status: string;
  created_at: string;
  // En listados simples pueden no venir los detalles anidados
  production_materials?: any[]; 
  production_products?: any[];
}
```

---

## 💡 Casos de Uso

### 1. Producción Completa (Con Materias Primas)
Uso típico: Una panadería fabrica pan usando harina y agua.

```typescript
const payload: CreateProductionPayload = {
  production_date: new Date().toISOString(),
  batch_code: "PAN-2023-001",
  notes: "Producción turno mañana",
  // Materias Primas QUE SE DESCONTARÁN del inventario
  materials: [
    { raw_material_id: 10, quantity: 50, unit: "kg" }, // Harina
    { raw_material_id: 15, quantity: 20, unit: "litros" } // Agua
  ],
  // Productos QUE SE SUMARÁN al inventario
  products: [
    { product_id: 5, quantity: 200, unit: "unidades" } // Pan Baguette
  ]
};

await api.post('/productions', payload);
```

### 2. Producción Simple (Solo Productos)
Uso típico: Registrar stock que "aparece" por producción sin traquear los insumos exactos, o carga masiva inicial.

```typescript
const payload: CreateProductionPayload = {
  production_date: new Date().toISOString(),
  batch_code: "CARGA-INICIAL",
  // OMITIMOS la propiedad 'materials' o la enviamos vacía []
  products: [
    { product_id: 8, quantity: 100, unit: "cajas" }
  ]
};

await api.post('/productions', payload);
```

---

## 🚨 Manejo de Errores Comunes

### **400 Bad Request - Inventario Insuficiente**
Si envías `materials`, el backend validará que exista suficiente stock en `inventory_raw_materials`.

```json
{
  "statusCode": 400,
  "message": "Insufficient raw material inventory for ID 10",
  "error": "Bad Request"
}
```

**Recomendación Frontend:**
- Capturar el error 400.
- Si el mensaje contiene "Insufficient raw material inventory", mostrar alerta indicando qué materia prima falta.

---

## 📊 Visualización (Listado)

El endpoint `GET /api/productions` retorna las producciones ordenadas por fecha descendente.

```typescript
// Ejemplo de consumo
const loadProductions = async () => {
  const { data } = await api.get<ProductionResponse[]>('/productions');
  return data;
};
```

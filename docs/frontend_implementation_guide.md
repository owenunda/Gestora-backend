# Guía de Implementación Frontend: Productos y Categorías

Esta guía resume los nuevos endpoints disponibles para la gestión de Productos y Categorías de Productos.

## 🔐 Autenticación y Multi-tenancy
*   Todos los endpoints requieren el header `Authorization: Bearer <token>`.
*   El `client_id` se extrae automáticamente del token. **No enviarlo** en el cuerpo de las peticiones.

---

## 📦 Módulo: Categorías de Productos
**Endpoint Base:** `/api/products-categories`

### 1. Listar Categorías
*   **GET** `/api/products-categories`
*   Retorna todas las categorías activas e inactivas del cliente.

### 2. Crear Categoría
*   **POST** `/api/products-categories`
*   **Body:**
    ```json
    {
      "name": "Lácteos",           // Requerido, max 100 chars
      "description": "...",        // Opcional
      "status": "active"           // Requerido: "active" | "inactive"
    }
    ```

### 3. Actualizar Categoría
*   **PATCH** `/api/products-categories/:id`
*   **Body:** Enviar solo los campos a modificar.

### 4. Eliminar Categoría
*   **DELETE** `/api/products-categories/:id`
*   ⚠️ No se puede eliminar si tiene productos asociados (retorna 409 Conflict).

---

## 🧀 Módulo: Productos
**Endpoint Base:** `/api/products`

### 1. Listar Productos
*   **GET** `/api/products`
*   Incluye automáticamente la relación con `products_categories`.

### 2. Crear Producto
*   **POST** `/api/products`
*   **Body:**
    ```json
    {
      "name": "Queso Fresco",      // Requerido, max 150 chars
      "unit": "kg",                // Requerido, max 20 chars
      "default_yield": 1.00,       // Opcional, number
      "description": "...",        // Opcional
      "status": "active",          // Requerido: "active" | "inactive"
      "image_url": "https://...",  // Opcional, debe ser URL válida
      "category_id": "1"           // Opcional, string (ID de la categoría)
    }
    ```

### 3. Actualizar Producto
*   **PATCH** `/api/products/:id`
*   **Manejo de Categoría:**
    *   Para **asignar** una categoría: Enviar `"category_id": "5"`
    *   Para **desvincular** una categoría: Enviar `"category_id": null`

### 4. Eliminar Producto
*   **DELETE** `/api/products/:id`

---

## 📝 Nota Importante: Materias Primas
Se aplicó una corrección en el endpoint de Materias Primas (`/api/raw-materials`).

*   **PATCH** `/api/raw-materials/:id`
*   Ahora permite desvincular un proveedor enviando explícitamente `null`:
    ```json
    {
      "supplier_id": null
    }
    ```

# 📚 Documentación de la API - Gestora Backend

## 🎯 Acceso a la Documentación

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva de la API en:

**🔗 URL:** http://localhost:3000/api/reference

## ✨ Características de Scalar

### **Interfaz Moderna**
- 🎨 Tema morado (purple) con modo oscuro activado
- 📱 Layout moderno y responsive
- 🔍 Búsqueda rápida de endpoints
- 📋 Sidebar navegable

### **Funcionalidades**
- ✅ Prueba de endpoints en vivo (Try it out)
- 📝 Ejemplos de request/response
- 🔐 Autenticación (cuando se configure)
- 📊 Esquemas de datos automáticos
- 🌐 Exportar a diferentes formatos

## 🚀 Endpoints Disponibles

### **Clientes** (`/clients`)

#### **GET /clients**
Obtener todos los clientes
- **Response:** Array de clientes
- **Status:** 200 OK

#### **GET /clients/:id**
Obtener un cliente por ID
- **Parámetros:** `id` (string) - ID del cliente
- **Response:** Objeto cliente
- **Status:** 200 OK | 404 Not Found

#### **POST /clients**
Crear un nuevo cliente
- **Body:** Datos del cliente
- **Response:** Cliente creado
- **Status:** 201 Created | 400 Bad Request

**Ejemplo de body:**
```json
{
  "name": "Empresa ABC",
  "document_id": "123456789",
  "email": "contacto@empresa.com",
  "phone": "+57 300 1234567",
  "address": "Calle 123 #45-67",
  "country": "Colombia",
  "plan": "premium",
  "status": "active",
  "password_hash": "hashed_password_here"
}
```

#### **PATCH /clients/:id**
Actualizar un cliente
- **Parámetros:** `id` (string) - ID del cliente
- **Body:** Datos a actualizar (parciales)
- **Response:** Cliente actualizado
- **Status:** 200 OK | 404 Not Found

**Ejemplo de body:**
```json
{
  "name": "Empresa ABC Actualizada",
  "status": "inactive"
}
```

#### **DELETE /clients/:id**
Eliminar un cliente
- **Parámetros:** `id` (string) - ID del cliente
- **Response:** Cliente eliminado
- **Status:** 200 OK | 404 Not Found

## 🎨 Personalización de Scalar

La configuración actual en `src/main.ts`:

```typescript
apiReference({
  spec: {
    content: document,
  },
  theme: 'purple',        // Tema de color
  layout: 'modern',       // Layout moderno
  darkMode: true,         // Modo oscuro activado
  showSidebar: true,      // Mostrar sidebar
})
```

### **Temas Disponibles**
- `purple` (actual)
- `blue`
- `green`
- `orange`
- `default`

### **Layouts Disponibles**
- `modern` (actual)
- `classic`

## 📝 Agregar Documentación a Nuevos Endpoints

Para documentar nuevos endpoints, usa los decoradores de Swagger:

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('nombre-recurso')
@Controller('nombre-recurso')
export class MiController {
  
  @Get()
  @ApiOperation({ summary: 'Descripción del endpoint' })
  @ApiResponse({ status: 200, description: 'Respuesta exitosa' })
  miMetodo() {
    // ...
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID del recurso', example: '1' })
  @ApiResponse({ status: 200, description: 'Recurso encontrado' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado' })
  obtenerPorId(@Param('id') id: string) {
    // ...
  }

  @Post()
  @ApiBody({
    description: 'Datos del recurso',
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Ejemplo' },
      },
    },
  })
  crear(@Body() dto: any) {
    // ...
  }
}
```

## 🔧 Configuración Avanzada

### **Agregar Autenticación**

```typescript
const config = new DocumentBuilder()
  .setTitle('Gestora API')
  .setDescription('API para el sistema de gestión de producción')
  .setVersion('1.0')
  .addBearerAuth() // JWT
  // o
  .addApiKey() // API Key
  .build();
```

### **Agregar Servidor Base**

```typescript
const config = new DocumentBuilder()
  // ...
  .addServer('http://localhost:3000', 'Desarrollo')
  .addServer('https://api.gestora.com', 'Producción')
  .build();
```

### **Agregar Contacto y Licencia**

```typescript
const config = new DocumentBuilder()
  // ...
  .setContact('Soporte', 'https://gestora.com', 'soporte@gestora.com')
  .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  .build();
```

## 🌐 Exportar Documentación

Desde la interfaz de Scalar puedes exportar la documentación a:
- OpenAPI JSON
- OpenAPI YAML
- Postman Collection
- Insomnia Collection

## 💡 Tips

1. **Usa ejemplos realistas** en los decoradores `@ApiBody` y `@ApiParam`
2. **Documenta todos los códigos de respuesta** posibles (200, 400, 404, 500, etc.)
3. **Agrupa endpoints relacionados** con `@ApiTags`
4. **Mantén las descripciones concisas** pero informativas
5. **Actualiza la documentación** cuando cambies la API

## 🚀 Próximos Pasos

1. ✅ Documentar endpoints de productos
2. ✅ Documentar endpoints de proveedores
3. ✅ Documentar endpoints de producción
4. ⬜ Agregar autenticación JWT
5. ⬜ Agregar ejemplos de errores
6. ⬜ Configurar CORS si es necesario

---

**Documentación generada con Scalar API Reference** 🎨

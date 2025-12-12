# 📘 Guía de Prisma ORM - Gestora Backend

Esta guía te ayudará a trabajar con Prisma ORM en el proyecto Gestora Backend.

## 📋 Tabla de Contenidos

- [Comandos Principales](#-comandos-principales)
- [Flujo de Trabajo](#-flujo-de-trabajo)
- [Ejemplos de Uso en NestJS](#-ejemplos-de-uso-en-nestjs)
- [Queries Comunes](#-queries-comunes)
- [Relaciones](#-relaciones)
- [Tips y Mejores Prácticas](#-tips-y-mejores-prácticas)

---

## 🔧 Comandos Principales

### Comandos Básicos

```bash
# Generar el cliente de Prisma (después de cambios en schema.prisma)
npx prisma generate

# Introspección: Leer la base de datos y actualizar schema.prisma
npx prisma db pull

# Aplicar cambios del schema a la base de datos
npx prisma db push

# Abrir Prisma Studio (UI visual para ver/editar datos)
npx prisma studio

# Ver el estado de las migraciones
npx prisma migrate status

# Formatear el archivo schema.prisma
npx prisma format

# Validar el schema.prisma
npx prisma validate
```

### Comandos de Migraciones

```bash
# Crear una nueva migración (desarrollo)
npx prisma migrate dev --name nombre_de_la_migracion

# Aplicar migraciones pendientes (producción)
npx prisma migrate deploy

# Resetear la base de datos (¡CUIDADO! Borra todos los datos)
npx prisma migrate reset
```

---

## 🔄 Flujo de Trabajo

### Opción 1: Cambios desde Supabase (Recomendado para este proyecto)

Si haces cambios en la base de datos desde Supabase UI:

```bash
# 1. Hacer cambios en Supabase (agregar tabla, columna, etc.)

# 2. Actualizar el schema local
npx prisma db pull

# 3. Regenerar el cliente
npx prisma generate

# 4. Reiniciar el servidor de desarrollo (se hace automáticamente)
```

### Opción 2: Cambios desde Prisma Schema

Si prefieres gestionar cambios desde `schema.prisma`:

```bash
# 1. Editar prisma/schema.prisma

# 2. Aplicar cambios a la base de datos
npx prisma db push

# 3. Generar el cliente
npx prisma generate
```

---

## 💻 Ejemplos de Uso en NestJS

### 1. Integrar PrismaModule en tu aplicación

**`src/app.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule, // Agregar aquí
    UsersModule,
  ],
})
export class AppModule {}
```

### 2. Usar PrismaService en un módulo

**`src/clients/clients.service.ts`**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  // Crear un cliente
  async create(createClientDto: CreateClientDto) {
    return this.prisma.clients.create({
      data: createClientDto,
    });
  }

  // Obtener todos los clientes
  async findAll() {
    return this.prisma.clients.findMany({
      where: { status: 'active' },
      orderBy: { created_at: 'desc' },
    });
  }

  // Obtener un cliente por ID
  async findOne(id: number) {
    return this.prisma.clients.findUnique({
      where: { id },
      include: {
        products: true,
        suppliers: true,
      },
    });
  }

  // Actualizar un cliente
  async update(id: number, updateClientDto: UpdateClientDto) {
    return this.prisma.clients.update({
      where: { id },
      data: updateClientDto,
    });
  }

  // Eliminar un cliente (soft delete)
  async remove(id: number) {
    return this.prisma.clients.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  // Eliminar permanentemente
  async hardDelete(id: number) {
    return this.prisma.clients.delete({
      where: { id },
    });
  }
}
```

---

## 🔍 Queries Comunes

### Operaciones CRUD Básicas

```typescript
// CREATE - Crear un registro
const newProduct = await prisma.products.create({
  data: {
    client_id: 1,
    name: 'Producto Ejemplo',
    category: 'Categoría A',
    unit: 'kg',
    status: 'active',
    description: 'Descripción del producto',
  },
});

// READ - Leer registros
// Obtener todos
const allProducts = await prisma.products.findMany();

// Obtener uno por ID
const product = await prisma.products.findUnique({
  where: { id: 1 },
});

// Obtener el primero que coincida
const firstActive = await prisma.products.findFirst({
  where: { status: 'active' },
});

// UPDATE - Actualizar
const updated = await prisma.products.update({
  where: { id: 1 },
  data: { name: 'Nuevo Nombre' },
});

// DELETE - Eliminar
const deleted = await prisma.products.delete({
  where: { id: 1 },
});
```

### Filtros y Búsquedas

```typescript
// Búsqueda con múltiples condiciones
const products = await prisma.products.findMany({
  where: {
    status: 'active',
    category: 'Categoría A',
    client_id: 1,
  },
});

// Búsqueda con OR
const products = await prisma.products.findMany({
  where: {
    OR: [
      { category: 'Categoría A' },
      { category: 'Categoría B' },
    ],
  },
});

// Búsqueda con texto (LIKE)
const products = await prisma.products.findMany({
  where: {
    name: {
      contains: 'ejemplo', // Case sensitive
    },
  },
});

// Búsqueda insensible a mayúsculas
const products = await prisma.products.findMany({
  where: {
    name: {
      contains: 'ejemplo',
      mode: 'insensitive',
    },
  },
});

// Búsqueda por rango de fechas
const productions = await prisma.productions.findMany({
  where: {
    production_date: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31'),
    },
  },
});

// Búsqueda con NOT
const products = await prisma.products.findMany({
  where: {
    NOT: {
      status: 'inactive',
    },
  },
});
```

### Ordenamiento y Paginación

```typescript
// Ordenar
const products = await prisma.products.findMany({
  orderBy: {
    created_at: 'desc', // 'asc' o 'desc'
  },
});

// Ordenar por múltiples campos
const products = await prisma.products.findMany({
  orderBy: [
    { category: 'asc' },
    { name: 'asc' },
  ],
});

// Paginación
const page = 1;
const pageSize = 10;

const products = await prisma.products.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { created_at: 'desc' },
});

// Contar total de registros
const total = await prisma.products.count({
  where: { status: 'active' },
});
```

### Selección de Campos

```typescript
// Seleccionar solo ciertos campos
const products = await prisma.products.findMany({
  select: {
    id: true,
    name: true,
    category: true,
    // No incluye otros campos
  },
});

// Excluir campos sensibles
const clients = await prisma.clients.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // password_hash NO se incluye
  },
});
```

---

## 🔗 Relaciones

### Incluir Relaciones

```typescript
// Incluir productos de un cliente
const client = await prisma.clients.findUnique({
  where: { id: 1 },
  include: {
    products: true,
    suppliers: true,
    raw_materials: true,
  },
});

// Incluir relaciones anidadas
const production = await prisma.productions.findUnique({
  where: { id: 1 },
  include: {
    clients: true,
    production_materials: {
      include: {
        raw_materials: true, // Incluir datos de la materia prima
      },
    },
    production_products: {
      include: {
        products: true, // Incluir datos del producto
      },
    },
  },
});
```

### Crear con Relaciones

```typescript
// Crear producción con materiales y productos
const production = await prisma.productions.create({
  data: {
    client_id: 1,
    production_date: new Date(),
    batch_code: 'BATCH-001',
    status: 'in_progress',
    production_materials: {
      create: [
        {
          raw_material_id: 1,
          quantity: 100,
          unit: 'kg',
        },
        {
          raw_material_id: 2,
          quantity: 50,
          unit: 'kg',
        },
      ],
    },
    production_products: {
      create: [
        {
          product_id: 1,
          quantity: 80,
          unit: 'kg',
        },
      ],
    },
  },
  include: {
    production_materials: true,
    production_products: true,
  },
});
```

### Actualizar Relaciones

```typescript
// Conectar relaciones existentes
await prisma.raw_materials.update({
  where: { id: 1 },
  data: {
    suppliers: {
      connect: { id: 5 }, // Conectar con proveedor existente
    },
  },
});

// Desconectar relaciones
await prisma.raw_materials.update({
  where: { id: 1 },
  data: {
    suppliers: {
      disconnect: true,
    },
  },
});
```

---

## 🎯 Queries Específicas del Proyecto

### Gestión de Inventario

```typescript
// Obtener inventario de productos terminados
async getInventory(clientId: number) {
  return this.prisma.inventory_finished_products.findMany({
    where: { client_id: clientId },
    include: {
      products: {
        select: {
          id: true,
          name: true,
          category: true,
          unit: true,
        },
      },
    },
    orderBy: { updated_at: 'desc' },
  });
}

// Actualizar cantidad en inventario
async updateInventory(productId: number, quantity: number) {
  return this.prisma.inventory_finished_products.update({
    where: { id: productId },
    data: {
      quantity,
      updated_at: new Date(),
    },
  });
}
```

### Reportes de Producción

```typescript
// Obtener producciones con detalles completos
async getProductionReport(clientId: number, startDate: Date, endDate: Date) {
  return this.prisma.productions.findMany({
    where: {
      client_id: clientId,
      production_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      production_materials: {
        include: {
          raw_materials: {
            select: {
              name: true,
              unit: true,
              cost_per_unit: true,
            },
          },
        },
      },
      production_products: {
        include: {
          products: {
            select: {
              name: true,
              category: true,
            },
          },
        },
      },
    },
    orderBy: { production_date: 'desc' },
  });
}
```

### Gestión de Proveedores

```typescript
// Obtener proveedores con sus materias primas
async getSuppliersWithMaterials(clientId: number) {
  return this.prisma.suppliers.findMany({
    where: {
      client_id: clientId,
      status: 'active',
    },
    include: {
      raw_materials: {
        where: { status: 'active' },
        select: {
          id: true,
          name: true,
          unit: true,
          cost_per_unit: true,
        },
      },
    },
  });
}
```

---

## 💡 Tips y Mejores Prácticas

### 1. Manejo de Errores

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    try {
      const product = await this.prisma.products.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      return product;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Manejar errores específicos de Prisma
        if (error.code === 'P2025') {
          throw new NotFoundException('Registro no encontrado');
        }
      }
      throw error;
    }
  }
}
```

### 2. Transacciones

```typescript
// Usar transacciones para operaciones múltiples
async createProductionWithInventoryUpdate(data: CreateProductionDto) {
  return this.prisma.$transaction(async (tx) => {
    // Crear la producción
    const production = await tx.productions.create({
      data: {
        client_id: data.client_id,
        production_date: data.production_date,
        status: 'completed',
      },
    });

    // Actualizar inventario
    await tx.inventory_finished_products.update({
      where: { product_id: data.product_id },
      data: {
        quantity: {
          increment: data.quantity,
        },
      },
    });

    return production;
  });
}
```

### 3. Tipos TypeScript

```typescript
import { Prisma } from '@prisma/client';

// Usar tipos generados por Prisma
type ProductWithRelations = Prisma.productsGetPayload<{
  include: {
    clients: true;
    inventory_finished_products: true;
  };
}>;

// Tipo para crear producto
type CreateProductInput = Prisma.productsCreateInput;

// Tipo para actualizar producto
type UpdateProductInput = Prisma.productsUpdateInput;
```

### 4. Queries Reutilizables

```typescript
// Crear funciones helper para queries comunes
private getActiveProductsQuery(clientId: number) {
  return {
    where: {
      client_id: clientId,
      status: 'active',
    },
    orderBy: {
      created_at: 'desc' as const,
    },
  };
}

async findActiveProducts(clientId: number) {
  return this.prisma.products.findMany(
    this.getActiveProductsQuery(clientId)
  );
}
```

### 5. Prisma Studio

```bash
# Abrir Prisma Studio para visualizar y editar datos
npx prisma studio
```

Prisma Studio se abrirá en `http://localhost:5555` y te permitirá:
- Ver todos los datos de tus tablas
- Editar registros visualmente
- Crear nuevos registros
- Ver relaciones entre tablas

---

## 🚀 Comandos Rápidos de Referencia

```bash
# Desarrollo diario
npx prisma studio              # Abrir UI visual
npx prisma generate            # Regenerar cliente después de cambios
npx prisma db pull             # Sincronizar schema desde Supabase

# Validación
npx prisma validate            # Validar schema.prisma
npx prisma format              # Formatear schema.prisma

# Migraciones (si decides usarlas)
npx prisma migrate dev         # Crear y aplicar migración
npx prisma migrate deploy      # Aplicar migraciones en producción
```

---

## 📚 Recursos Adicionales

- [Documentación Oficial de Prisma](https://www.prisma.io/docs)
- [Prisma con NestJS](https://docs.nestjs.com/recipes/prisma)
- [Prisma Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

---

## ❓ Preguntas Frecuentes

**¿Cuándo debo ejecutar `prisma generate`?**
- Después de cualquier cambio en `schema.prisma`
- Después de `prisma db pull`
- Si ves errores de tipos en tu IDE

**¿Debo usar migraciones o `db push`?**
- Para desarrollo: `db push` es más rápido
- Para producción: usa migraciones (`migrate deploy`)
- En este proyecto con Supabase: usa `db pull` para sincronizar cambios

**¿Cómo actualizo mi schema si cambio algo en Supabase?**
```bash
npx prisma db pull
npx prisma generate
```

**¿Prisma Studio modifica mi base de datos?**
- Sí, los cambios que hagas en Prisma Studio se guardan directamente en la base de datos
- Úsalo con cuidado en producción

---

¡Listo! Ahora tienes todo lo necesario para trabajar con Prisma en tu proyecto Gestora Backend. 🎉

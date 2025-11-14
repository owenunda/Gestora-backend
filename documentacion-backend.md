# 📘 Documentación Backend – Proyecto Amara

## 📌 Información del Proyecto

| Campo | Descripción |
|-------|-------------|
| **Nombre** | Gestora Backend - Proyecto Amara |
| **Versión** | 1.0.0 |
| **Framework** | NestJS |
| **Base de Datos** | PostgreSQL |
| **ORM** | Prisma |
| **Autor** | owenunda |
| **Última Actualización** | Noviembre 2025 |

## 🧩 Visión General

Este documento describe la arquitectura y estructura completa del backend del proyecto **Amara**, un sistema integral diseñado para gestionar la producción de quesos y otros productos agroindustriales.

### Objetivos del Sistema

- Automatizar el control de inventario de materias primas
- Gestionar relaciones con proveedores
- Registrar y rastrear lotes de producción
- Calcular costos de producción
- Generar reportes y métricas de producción

### Stack Tecnológico

El backend está construido con tecnologías modernas y escalables:

- **NestJS**: Framework progresivo de Node.js para aplicaciones del lado del servidor
- **PostgreSQL**: Base de datos relacional robusta y confiable
- **Prisma ORM**: Toolkit de base de datos de última generación con type-safety
- **TypeScript**: Superset tipado de JavaScript para mayor seguridad en el código

### Módulos de la Fase 1

1. **Gestión de Proveedores**: Control de proveedores y sus contactos
2. **Gestión de Materias Primas**: Control de inventario y movimientos
3. **Gestión de Producción**: Registro de lotes y consumo de materias
4. **Gestión de Quesos**: Catálogo de productos terminados

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
/src
├── app.module.ts              # Módulo raíz de la aplicación
├── main.ts                    # Punto de entrada de la aplicación
│
├── config/                    # Configuración global
│   ├── env.config.ts         # Variables de entorno
│   └── configuration.ts      # Configuración general
│
├── common/                    # Recursos compartidos
│   ├── decorators/           # Decoradores personalizados
│   ├── filters/              # Filtros de excepciones
│   ├── guards/               # Guards de autorización
│   ├── interceptors/         # Interceptores HTTP
│   ├── pipes/                # Pipes de validación
│   └── utils/                # Utilidades generales
│
├── database/                  # Capa de base de datos
│   ├── prisma.service.ts     # Servicio de Prisma
│   └── prisma.module.ts      # Módulo de Prisma
│
├── modules/                   # Módulos funcionales
│   ├── proveedores/          # Gestión de proveedores
│   │   ├── proveedores.module.ts
│   │   ├── proveedores.service.ts
│   │   ├── proveedores.controller.ts
│   │   ├── dto/              # Data Transfer Objects
│   │   └── entities/         # Entidades del dominio
│   │
│   ├── materias-primas/      # Gestión de materias primas
│   │   ├── materias-primas.module.ts
│   │   ├── materias-primas.service.ts
│   │   ├── materias-primas.controller.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── produccion/           # Gestión de producción
│   │   ├── produccion.module.ts
│   │   ├── produccion.service.ts
│   │   ├── produccion.controller.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   └── quesos/               # Gestión de quesos
│       ├── quesos.module.ts
│       ├── quesos.service.ts
│       ├── quesos.controller.ts
│       ├── dto/
│       └── entities/
│
└── shared/                    # Recursos compartidos entre módulos
    ├── responses/            # Respuestas estandarizadas
    ├── interfaces/           # Interfaces TypeScript
    └── constants/            # Constantes de la aplicación

/prisma
├── schema.prisma             # Esquema de base de datos
├── migrations/               # Migraciones de BD
└── seed.ts                   # Datos iniciales (opcional)

/.env                         # Variables de entorno
/nest-cli.json               # Configuración de NestJS CLI
/tsconfig.json               # Configuración de TypeScript
/package.json                # Dependencias del proyecto
```

### Principios de Arquitectura

- **Modularidad**: Cada funcionalidad está encapsulada en su propio módulo
- **Separation of Concerns**: Controladores, servicios y repositorios separados
- **Dependency Injection**: Uso extensivo del sistema DI de NestJS
- **Type Safety**: TypeScript para prevenir errores en tiempo de compilación
- **RESTful API**: Endpoints siguiendo convenciones REST


---

# 📦 Módulos del Sistema

A continuación se describen los módulos que conforman la Fase 1 del sistema.

---

## 1️⃣ Módulo: Gestión de Proveedores

### Descripción
Módulo encargado de administrar la información de los proveedores y sus relaciones con las entregas de materias primas.

### Funcionalidades

| Operación | Descripción |
|-----------|-------------|
| **Crear** | Registrar nuevos proveedores en el sistema |
| **Listar** | Obtener listado de proveedores (con paginación y filtros) |
| **Obtener** | Consultar información detallada de un proveedor |
| **Actualizar** | Modificar datos de proveedores existentes |
| **Eliminar** | Dar de baja proveedores (soft delete recomendado) |
| **Historial** | Ver historial de entregas por proveedor |

### Endpoints API

```http
GET    /api/proveedores          # Listar todos los proveedores
GET    /api/proveedores/:id      # Obtener un proveedor específico
POST   /api/proveedores          # Crear nuevo proveedor
PUT    /api/proveedores/:id      # Actualizar proveedor
DELETE /api/proveedores/:id      # Eliminar proveedor
GET    /api/proveedores/:id/entregas  # Historial de entregas
```

### Modelo de Datos

```prisma
model Proveedor {
  id           Int         @id @default(autoincrement())
  nombre       String      @db.VarChar(255)
  contacto     String?     @db.VarChar(255)
  telefono     String?     @db.VarChar(20)
  email        String?     @db.VarChar(255)
  direccion    String?     @db.Text
  tipoMateria  String      @db.VarChar(100)
  activo       Boolean     @default(true)
  entregas     Entrega[]
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  
  @@index([nombre])
  @@index([activo])
}
```
## 2️⃣ Módulo: Gestión de Materias Primas

### Descripción
Control integral del inventario de materias primas utilizadas en la producción de quesos.

### Funcionalidades

| Operación | Descripción |
|-----------|-------------|
| **Gestión de Materias** | CRUD completo de materias primas (leche, sal, cuajo, etc.) |
| **Entradas** | Registrar ingresos de materias primas al inventario |
| **Salidas** | Registrar consumos de materias primas en producción |
| **Control de Stock** | Actualización automática de stock en cada movimiento |
| **Alertas** | Notificar cuando el stock esté por debajo del mínimo |
| **Trazabilidad** | Historial completo de movimientos por materia prima |

### Endpoints API

```http
# Materias Primas
GET    /api/materias-primas              # Listar todas las materias primas
GET    /api/materias-primas/:id          # Obtener una materia prima específica
POST   /api/materias-primas              # Crear nueva materia prima
PUT    /api/materias-primas/:id          # Actualizar materia prima
DELETE /api/materias-primas/:id          # Eliminar materia prima

# Movimientos de Inventario
GET    /api/materias-primas/:id/movimientos  # Historial de movimientos
POST   /api/materias-primas/entradas         # Registrar entrada
POST   /api/materias-primas/salidas          # Registrar salida
GET    /api/materias-primas/stock-bajo       # Materias con stock bajo
```

### Modelos de Datos

```prisma
model MateriaPrima {
  id              Int           @id @default(autoincrement())
  nombre          String        @db.VarChar(255)
  descripcion     String?       @db.Text
  unidad          String        @db.VarChar(50)  // kg, litros, unidades
  stock           Float         @default(0)
  stockMinimo     Float         @default(0)
  precioPromedio  Float?
  activo          Boolean       @default(true)
  entradas        EntradaMP[]
  salidas         SalidaMP[]
  materiasUsadas  MateriaUsada[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([nombre])
  @@index([activo])
}

model EntradaMP {
  id             Int           @id @default(autoincrement())
  cantidad       Float
  precioUnitario Float?
  precioTotal    Float?
  fecha          DateTime      @default(now())
  numeroLote     String?       @db.VarChar(100)
  observaciones  String?       @db.Text
  proveedorId    Int?
  proveedor      Proveedor?    @relation(fields: [proveedorId], references: [id])
  materiaPrimaId Int
  materiaPrima   MateriaPrima  @relation(fields: [materiaPrimaId], references: [id], onDelete: Cascade)
  createdAt      DateTime      @default(now())
  
  @@index([fecha])
  @@index([materiaPrimaId])
  @@index([proveedorId])
}

model SalidaMP {
  id             Int           @id @default(autoincrement())
  cantidad       Float
  fecha          DateTime      @default(now())
  motivo         String        @db.VarChar(255)  // Producción, Merma, Otro
  observaciones  String?       @db.Text
  materiaPrimaId Int
  materiaPrima   MateriaPrima  @relation(fields: [materiaPrimaId], references: [id], onDelete: Cascade)
  createdAt      DateTime      @default(now())
  
  @@index([fecha])
  @@index([materiaPrimaId])
  @@index([motivo])
}
```

## 3️⃣ Módulo: Gestión de Producción

### Descripción
Registra y gestiona los lotes de producción de queso, incluyendo materias primas consumidas y costos asociados.

### Funcionalidades

| Operación | Descripción |
|-----------|-------------|
| **Registro de Lotes** | Crear nuevos lotes de producción con número de lote único |
| **Control de Materias** | Registrar materias primas consumidas en cada lote |
| **Cálculo de Costos** | Calcular costo de producción basado en materias consumidas |
| **Trazabilidad** | Seguimiento completo desde materias hasta producto final |
| **Reportes** | Generar reportes de producción por fecha, tipo, costos |
| **Estados** | Gestionar estados del lote (En proceso, Terminado, En maduración) |

### Endpoints API

```http
# Producción
GET    /api/produccion                    # Listar lotes de producción
GET    /api/produccion/:id                # Obtener un lote específico
POST   /api/produccion                    # Crear nuevo lote de producción
PUT    /api/produccion/:id                # Actualizar lote
DELETE /api/produccion/:id                # Eliminar lote
PATCH  /api/produccion/:id/estado         # Cambiar estado del lote

# Reportes
GET    /api/produccion/reportes/mensual   # Reporte mensual de producción
GET    /api/produccion/reportes/costos    # Análisis de costos
GET    /api/produccion/estadisticas       # Estadísticas generales
```

### Modelos de Datos

```prisma
model Produccion {
  id              Int              @id @default(autoincrement())
  numeroLote      String           @unique @db.VarChar(50)
  fecha           DateTime         @default(now())
  fechaInicio     DateTime?
  fechaFin        DateTime?
  cantidad        Float            // Cantidad producida en kg o unidades
  estado          String           @default("EN_PROCESO") @db.VarChar(50)
  // Estados: EN_PROCESO, TERMINADO, EN_MADURACION, FINALIZADO
  tipoQuesoId     Int
  tipoQueso       Queso            @relation(fields: [tipoQuesoId], references: [id])
  materiasUsadas  MateriaUsada[]
  costoMateriales Float?
  costoManoObra   Float?
  costoTotal      Float?
  rendimiento     Float?           // Porcentaje de rendimiento
  observaciones   String?          @db.Text
  responsable     String?          @db.VarChar(255)
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  
  @@index([numeroLote])
  @@index([fecha])
  @@index([tipoQuesoId])
  @@index([estado])
}

model MateriaUsada {
  id             Int           @id @default(autoincrement())
  cantidad       Float
  costoUnitario  Float?
  costoTotal     Float?
  materiaPrimaId Int
  produccionId   Int
  materiaPrima   MateriaPrima  @relation(fields: [materiaPrimaId], references: [id])
  produccion     Produccion    @relation(fields: [produccionId], references: [id], onDelete: Cascade)
  createdAt      DateTime      @default(now())
  
  @@index([produccionId])
  @@index([materiaPrimaId])
}
```

## 4️⃣ Módulo: Gestión de Quesos (Productos Terminados)

### Descripción
Catálogo y gestión de los diferentes tipos de quesos que produce la empresa, incluyendo sus características técnicas y recetas.

### Funcionalidades

| Operación | Descripción |
|-----------|-------------|
| **Catálogo** | Gestionar tipos de quesos producidos |
| **Recetas** | Definir recetas estándar con materias primas requeridas |
| **Características** | Registrar propiedades del queso (maduración, peso, etc.) |
| **Análisis** | Ver estadísticas de producción por tipo de queso |
| **Costos** | Calcular costo estándar basado en receta |

### Endpoints API

```http
GET    /api/quesos                    # Listar tipos de quesos
GET    /api/quesos/:id                # Obtener un tipo de queso específico
POST   /api/quesos                    # Crear nuevo tipo de queso
PUT    /api/quesos/:id                # Actualizar tipo de queso
DELETE /api/quesos/:id                # Eliminar tipo de queso
GET    /api/quesos/:id/producciones   # Historial de producción por tipo
GET    /api/quesos/:id/receta         # Obtener receta estándar
```

### Modelo de Datos

```prisma
model Queso {
  id              Int            @id @default(autoincrement())
  nombre          String         @unique @db.VarChar(255)
  descripcion     String?        @db.Text
  categoria       String?        @db.VarChar(100)  // Fresco, Semi-madurado, Madurado
  maduracionDias  Int?           // Días de maduración requeridos
  pesoPromedio    Float?         // Peso promedio en kg
  precioVenta     Float?
  activo          Boolean        @default(true)
  imagenUrl       String?        @db.VarChar(500)
  
  // Características técnicas
  humedadPorcent  Float?
  grasaPorcent    Float?
  
  // Relaciones
  producciones    Produccion[]
  receta          RecetaQueso[]
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  @@index([nombre])
  @@index([categoria])
  @@index([activo])
}

model RecetaQueso {
  id             Int           @id @default(autoincrement())
  quesoId        Int
  queso          Queso         @relation(fields: [quesoId], references: [id], onDelete: Cascade)
  materiaPrimaId Int
  materiaPrima   MateriaPrima  @relation(fields: [materiaPrimaId], references: [id])
  cantidadBase   Float         // Cantidad necesaria para 1kg o 1 unidad
  
  @@unique([quesoId, materiaPrimaId])
  @@index([quesoId])
}

```
---

## 🚀 Guía de Inicio Rápido

### Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/owenunda/Gestora-backend.git
cd Gestora-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos
```

### Configuración de Base de Datos

```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Poblar con datos de prueba
npx prisma db seed
```

### Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod

# Tests
npm run test
```

La aplicación estará disponible en: `http://localhost:3000`

---

## 📌 Comandos NestJS CLI

### Generar Módulos

```bash
# Proveedores
nest g module modules/proveedores
nest g controller modules/proveedores
nest g service modules/proveedores

# Materias Primas
nest g module modules/materias-primas
nest g controller modules/materias-primas
nest g service modules/materias-primas

# Producción
nest g module modules/produccion
nest g controller modules/produccion
nest g service modules/produccion

# Quesos
nest g module modules/quesos
nest g controller modules/quesos
nest g service modules/quesos
```

### Otros Comandos Útiles

```bash
# Generar un nuevo recurso completo (CRUD)
nest g resource modules/nombre-recurso

# Generar un DTO
nest g class modules/nombre-modulo/dto/create-nombre.dto --no-spec

# Generar un Guard
nest g guard common/guards/nombre-guard

# Generar un Interceptor
nest g interceptor common/interceptors/nombre-interceptor

# Generar un Pipe
nest g pipe common/pipes/nombre-pipe
```

---

## 🛠️ Dependencias Principales

### Core Dependencies

```json
{
  "@nestjs/common": "^10.x",
  "@nestjs/core": "^10.x",
  "@nestjs/platform-express": "^10.x",
  "@prisma/client": "^5.x",
  "reflect-metadata": "^0.1.x",
  "rxjs": "^7.x"
}
```

### Validation & Transformation

```json
{
  "class-validator": "^0.14.x",
  "class-transformer": "^0.5.x"
}
```

### Database

```json
{
  "prisma": "^5.x",
  "@nestjs/config": "^3.x",
  "pg": "^8.x"
}
```

### Development Dependencies

```json
{
  "@nestjs/cli": "^10.x",
  "@nestjs/schematics": "^10.x",
  "@nestjs/testing": "^10.x",
  "@types/node": "^20.x",
  "typescript": "^5.x",
  "ts-node": "^10.x"
}
```

---

## 🔧 Configuración de Variables de Entorno

### Archivo `.env`

```env
# Aplicación
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Base de Datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/gestora_db?schema=public"

# JWT (si se implementa autenticación)
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=7d

# Logs
LOG_LEVEL=debug

# CORS
CORS_ORIGIN=http://localhost:4200
```

---

## 📊 Modelo de Base de Datos Completo

### Diagrama de Relaciones

```
Proveedor (1) -----> (N) EntradaMP
                      ↓
MateriaPrima (1) ←---- (N) EntradaMP
      ↓
      |---> (N) SalidaMP
      |---> (N) MateriaUsada
      |---> (N) RecetaQueso
      
Queso (1) -----> (N) Produccion
      |
      └----> (N) RecetaQueso

Produccion (1) -----> (N) MateriaUsada
```

---

## 🔐 Seguridad y Buenas Prácticas

### Validación de DTOs

Todos los DTOs deben usar decoradores de `class-validator`:

```typescript
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  contacto?: string;

  @IsNumber()
  @IsOptional()
  telefono?: string;
}
```

### Manejo de Errores

Usar filtros de excepciones globales:

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Manejo centralizado de errores
  }
}
```

### Logging

Implementar logging estructurado:

```typescript
this.logger.log('Operación exitosa', context);
this.logger.error('Error en operación', trace, context);
```

---

## 📝 Convenciones de Código

### Nomenclatura

- **Archivos**: kebab-case (`materias-primas.service.ts`)
- **Clases**: PascalCase (`MateriasPrimasService`)
- **Variables/Funciones**: camelCase (`getMateriasPrimas()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_STOCK_LIMIT`)

### Estructura de Controladores

```typescript
@Controller('materias-primas')
export class MateriasPrimasController {
  constructor(private readonly service: MateriasPrimasService) {}

  @Get()
  findAll() { }

  @Get(':id')
  findOne(@Param('id') id: string) { }

  @Post()
  create(@Body() dto: CreateMateriaPrimaDto) { }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMateriaPrimaDto) { }

  @Delete(':id')
  remove(@Param('id') id: string) { }
}
```

---

## 🧪 Testing

### Estructura de Tests

```bash
src/
└── modules/
    └── proveedores/
        ├── proveedores.service.ts
        ├── proveedores.service.spec.ts
        ├── proveedores.controller.ts
        └── proveedores.controller.spec.ts
```

### Ejemplo de Test Unitario

```typescript
describe('ProveedoresService', () => {
  let service: ProveedoresService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProveedoresService, PrismaService],
    }).compile();

    service = module.get<ProveedoresService>(ProveedoresService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });
});
```

### Comandos de Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests con cobertura
npm run test:cov

# Tests en modo watch
npm run test:watch

# Tests e2e
npm run test:e2e
```


---

## 🤝 Contribución

### Proceso de Contribución

1. Fork del repositorio
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código

- Seguir las convenciones de nomenclatura establecidas
- Escribir tests para nuevas funcionalidades
- Documentar funciones y clases complejas
- Mantener cobertura de tests por encima del 80%

---

## 📞 Soporte y Contacto

- **Repositorio**: [github.com/owenunda/Gestora-backend](https://github.com/owenunda/Gestora-backend)
- **Issues**: [github.com/owenunda/Gestora-backend/issues](https://github.com/owenunda/Gestora-backend/issues)
- **Documentación API**: `http://localhost:3000/api/docs` (cuando esté implementado)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 📚 Referencias y Recursos

### Documentación Oficial

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Guías Útiles

- [NestJS Best Practices](https://github.com/nestjs/nest/tree/master/sample)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [REST API Design Guide](https://restfulapi.net/)

---

**Última actualización**: Noviembre 2025  
**Versión del documento**: 2.0.0
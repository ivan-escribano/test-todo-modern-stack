# tasks.md

Hoja de ruta estructurada por fases, alineada con `plan.md`.

Cada tarea está pensada para ser pequeña, accionable y orientada al aprendizaje.  
El objetivo es entender qué se hace y por qué, no solo ejecutar.

---

## Fase 1 — Configuración inicial del proyecto

### 1.1 — Inicializar el repositorio

- [x] Crear el repositorio con `git init`
- [x] Configurar el `.gitignore` adecuado para el stack (Node, Next.js, Turborepo)
- [x] Crear el primer commit con la estructura base

### 1.2 — Configurar el monorepo con pnpm workspaces

- [x] Inicializar `pnpm` en el proyecto
- [x] Definir el `pnpm-workspace.yaml` con los workspaces (`apps/`, `packages/`)
- [x] Investigar cómo funcionan los workspaces de pnpm y qué resuelven

### 1.3 — Configurar Turborepo

- [x] Instalar Turborepo como dependencia de desarrollo
- [x] Crear el `turbo.json` con las tareas base (`dev`, `build`, `lint`)
- [x] Entender la relación entre Turborepo y pnpm workspaces

### 1.4 — Configurar Biome (linting y formateo)

- [x] Instalar Biome
- [x] Crear el archivo de configuración `biome.json`
- [x] Definir las reglas base de linting y formateo
- [x] Verificar que funciona correctamente en un archivo de prueba

### 1.5 — Configurar TypeScript base

- [x] Crear un `tsconfig.json` base en la raíz del proyecto
- [x] Configurar modo estricto (`strict: true`)
- [x] Entender cómo los workspaces heredarán esta configuración

---

## Fase 2 — Estructura del proyecto y arquitectura

### 2.1 — Definir la estructura de carpetas

- [x] Crear la estructura base de `apps/` y `packages/`
- [x] Crear el workspace del backend (`apps/api`)
- [x] Crear el workspace del frontend (`apps/web`)
- [x] Documentar brevemente la decisión de estructura elegida

### 2.2 — Preparar el workspace del backend

- [x] Inicializar `apps/api` con su `package.json`
- [x] Configurar el `tsconfig.json` del backend extendiendo el base
- [x] Crear la estructura de carpetas interna del backend (rutas, servicios, etc.)

### 2.3 — Preparar el workspace del frontend

- [x] Inicializar `apps/web` con Next.js
- [x] Configurar el `tsconfig.json` del frontend
- [x] Verificar que el proyecto arranca correctamente con `pnpm dev`

  TypeScript: yes
  ESLint: no
  Tailwind CSS: yes
  src/ directory: yes
  App Router: yes
  Turbopack: yes
  Import alias: yes
  Alias: @/\*

### 2.4 — Verificar el monorepo completo

- [x] Ejecutar `pnpm dev` desde la raíz y confirmar que ambos workspaces arrancan
- [x] Ejecutar `pnpm lint` desde la raíz y confirmar que Biome se aplica a ambos
- [x] Resolver cualquier conflicto de configuración entre workspaces

---

## Fase 3 — Base conceptual del backend

### 3.1 — Comprender Fastify

- [x] Investigar qué es Fastify y en qué se diferencia de Express
- [x] Entender el sistema de plugins de Fastify
- [x] Entender cómo Fastify maneja rutas, hooks y validación
- [x] Crear un servidor mínimo con una ruta de prueba

### 3.2 — Comprender Drizzle ORM

- [x] Investigar qué es Drizzle y cómo se diferencia de Prisma
- [x] Entender el concepto de schema-first en Drizzle
- [x] Entender cómo funcionan las migraciones en Drizzle
- [x] Entender cómo se conecta Drizzle con PostgreSQL

### 3.3 — Comprender la conexión con PostgreSQL

- [x] Verificar que PostgreSQL está corriendo localmente
- [x] Familiarizarse con pgAdmin para inspeccionar la base de datos
- [x] Crear una base de datos de prueba para el proyecto
- [x] Probar una conexión básica desde Node.js a PostgreSQL

---

## Fase 4 — Desarrollo del backend

### 4.1 — Configurar Fastify en el proyecto

- [x] Instalar Fastify y sus dependencias en `apps/api`
- [x] Crear el archivo principal del servidor
- [x] Configurar el arranque del servidor con variables de entorno (puerto, host)
- [x] Verificar que el servidor arranca correctamente

### 4.2 — Configurar Drizzle y la base de datos

- [x] Instalar Drizzle ORM y el driver de PostgreSQL
- [x] Crear el archivo de configuración de Drizzle (`drizzle.config.ts`)
- [x] Configurar la conexión a la base de datos
- [x] Verificar que la conexión funciona correctamente

### 4.3 — Definir el esquema de datos (ToDo)

- [x] Definir la tabla `todos` con Drizzle (campos: id, título, descripción, completado, fechas)
- [x] Investigar los tipos de datos adecuados en Drizzle para cada campo
- [x] Generar la primera migración
- [x] Aplicar la migración y verificar la tabla en pgAdmin

### 4.4 — Implementar la capa de rutas (routes)

- [x] Crear la estructura de rutas para todos (`/api/todos`)
- [x] Registrar las rutas como plugin de Fastify
- [x] Definir los endpoints: `GET`, `POST`, `PUT`, `DELETE`
- [x] Verificar que las rutas responden (aunque sin lógica aún)

### 4.5 — Implementar la capa de servicios (services)

- [x] Crear el servicio de todos con las operaciones CRUD
- [x] Conectar el servicio con Drizzle para las consultas a la base de datos
- [x] Entender la separación entre rutas y servicios (y por qué importa)

### 4.6 — Conectar rutas con servicios

- [x] Integrar los servicios dentro de los handlers de las rutas
- [x] Probar cada endpoint manualmente (con herramienta tipo Thunder Client, Postman o curl)
- [x] Verificar que el CRUD completo funciona contra la base de datos real

### 4.7 — Validación de datos

- [x] Investigar cómo Fastify maneja la validación de schemas (JSON Schema)
- [x] Definir los schemas de validación para crear y actualizar tareas
- [x] Aplicar la validación en las rutas correspondientes
- [x] Verificar que los errores de validación se devuelven correctamente

### 4.8 — Manejo de errores

- [x] Definir una estrategia básica de manejo de errores
- [x] Implementar respuestas consistentes para errores comunes (404, 400, 500)
- [x] Investigar el error handler de Fastify y cómo personalizarlo

---

## Fase 5 — Desarrollo del frontend

### 5.1 — Configurar Next.js y dependencias

- [x] Verificar la configuración de Next.js en `apps/web`
- [x] Instalar Tailwind CSS v4 y configurarlo
- [x] Instalar y configurar shadcn/ui
- [x] Crear una página de prueba para verificar que todo funciona

### 5.2 — Definir la estructura del frontend

- [x] Definir la organización de carpetas (componentes, servicios, tipos, etc.)
- [x] Crear los tipos compartidos para el modelo de ToDo
- [x] Establecer la estructura base de páginas/rutas

### 5.3 — Implementar la interfaz de lista de tareas

- [ ] Crear el componente de lista de tareas
- [ ] Crear el componente de item de tarea individual
- [ ] Aplicar estilos con Tailwind y componentes de shadcn/ui
- [ ] Renderizar datos de prueba (mock) para verificar la UI

### 5.4 — Implementar la creación de tareas

- [ ] Crear el formulario de nueva tarea
- [ ] Implementar la validación del formulario en el cliente
- [ ] Conectar el formulario con el estado local (datos mock por ahora)

### 5.5 — Implementar la edición y eliminación de tareas

- [ ] Crear el mecanismo de edición de tareas (inline o modal)
- [ ] Implementar la acción de marcar tarea como completada
- [ ] Implementar la eliminación de tareas con confirmación
- [ ] Verificar que todas las acciones CRUD funcionan con datos mock

### 5.6 — Implementar la capa de servicios del frontend

- [ ] Crear los servicios/funciones para llamadas HTTP a la API
- [ ] Definir la URL base de la API como variable de entorno
- [ ] Preparar las funciones para cada operación: listar, crear, actualizar, eliminar

---

## Fase 6 — Integración frontend-backend

### 6.1 — Conectar el frontend con la API real

- [ ] Reemplazar los datos mock por llamadas reales a la API
- [ ] Configurar CORS en el backend para permitir las peticiones del frontend
- [ ] Verificar que el listado de tareas carga desde la base de datos

### 6.2 — Verificar el flujo CRUD completo

- [ ] Probar la creación de tareas desde el frontend hasta la base de datos
- [ ] Probar la edición de tareas
- [ ] Probar el cambio de estado (completada/pendiente)
- [ ] Probar la eliminación de tareas
- [ ] Verificar que los errores de la API se manejan correctamente en la UI

### 6.3 — Ajustes de integración

- [ ] Revisar y ajustar el manejo de estados de carga (loading)
- [ ] Revisar y ajustar el manejo de estados de error
- [ ] Verificar que la experiencia de usuario es fluida y coherente

---

## Fase 7 — Testing

### 7.1 — Configurar Vitest

- [ ] Instalar Vitest en los workspaces necesarios
- [ ] Configurar Vitest para el backend y el frontend
- [ ] Crear un test mínimo de prueba para verificar la configuración

### 7.2 — Tests del backend

- [ ] Escribir tests unitarios para los servicios (operaciones CRUD)
- [ ] Escribir tests de integración para los endpoints de la API
- [ ] Investigar cómo testear rutas de Fastify con `inject`
- [ ] Verificar que los tests se ejecutan correctamente desde la raíz del monorepo

### 7.3 — Tests del frontend

- [ ] Escribir tests unitarios para componentes clave
- [ ] Escribir tests para los servicios HTTP (con mocks de las respuestas)
- [ ] Verificar que los tests del frontend funcionan correctamente

### 7.4 — Tests end-to-end con Playwright

- [ ] Instalar y configurar Playwright
- [ ] Escribir un test e2e que cubra el flujo principal (crear, listar, completar, eliminar tarea)
- [ ] Investigar cómo se ejecutan los tests e2e en el contexto del monorepo
- [ ] Verificar que el test e2e pasa contra la aplicación completa

---

## Fase 8 — Despliegue

### 8.1 — Definir la estrategia de despliegue

- [ ] Investigar las opciones de despliegue para cada parte del stack
- [ ] Elegir plataformas para frontend, backend y base de datos
- [ ] Documentar las decisiones tomadas

### 8.2 — Preparar el proyecto para producción

- [ ] Revisar las variables de entorno necesarias para producción
- [ ] Configurar los builds de producción para frontend y backend
- [ ] Verificar que los builds funcionan correctamente en local

### 8.3 — Desplegar la aplicación

- [ ] Desplegar la base de datos
- [ ] Desplegar el backend
- [ ] Desplegar el frontend
- [ ] Verificar que la aplicación funciona correctamente en el entorno desplegado

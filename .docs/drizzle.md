# Drizzle ORM — Guia de aprendizaje

Guia practica para aprender Drizzle ORM desde la perspectiva de un desarrollador
con experiencia en Prisma y Mongoose. Enfocada en PostgreSQL.

---

## Que es un ORM y por que usarlo

```
Sin ORM:                                Con ORM:

const result = await pool.query(        const todos = await db.select()
  'SELECT * FROM todos WHERE ' +          .from(todos)
  'completed = $1 ORDER BY ' +            .where(eq(todos.completed, true))
  'created_at DESC',                      .orderBy(desc(todos.createdAt))
  [true]
)
    │                                       │
    ▼                                       ▼
  Strings sueltos                       TypeScript con autocompletado
  Sin tipos                             Errores en tiempo de compilacion
  Errores en runtime                    El IDE te ayuda
  SQL injection si te descuidas         Seguro por defecto
```

ORM significa **Object-Relational Mapping** — una capa entre tu codigo y la base de datos
que te permite trabajar con tablas y filas como si fueran objetos de TypeScript.

- **Sin ORM**: escribes SQL como strings, sin tipos, sin autocompletado, con riesgo de errores que solo ves al ejecutar
- **Con ORM**: escribes TypeScript con tipos, el IDE te autocompleta columnas y el compilador te avisa si algo esta mal
- **La utilidad real**: no es solo comodidad — es seguridad (evita SQL injection), productividad (autocompletado) y mantenibilidad (si renombras una columna, el compilador te dice donde falla)

```
RECUERDA:
-> ORM = traductor entre tu codigo TypeScript y la base de datos SQL
-> Sin ORM escribes strings sin tipos — con ORM escribes codigo con autocompletado
-> La ventaja principal: errores en compilacion en vez de en produccion
```

---

## 0. Conceptos clave en simple

### Que es Drizzle

```
┌────────────────────────────────────────────────────────┐
│                  Tu codigo TypeScript                   │
│                                                        │
│   ┌──────────┐    ┌──────────┐    ┌──────────────┐     │
│   │ SQL puro │    │  Prisma  │    │   Drizzle    │     │
│   │          │    │          │    │              │     │
│   │ Escribes │    │ Genera   │    │ Escribes     │     │
│   │ strings  │    │ un client│    │ TypeScript   │     │
│   │ a mano   │    │ desde un │    │ que PARECE   │     │
│   │          │    │ .prisma  │    │ SQL          │     │
│   └──────────┘    └──────────┘    └──────────────┘     │
│                                                        │
│   Sin tipos        Su propio        SQL + tipos        │
│   Propenso a       lenguaje         Lo mejor de        │
│   errores          (PSL)            ambos mundos       │
└────────────────────────────────────────────────────────┘
```

- **ORM ligero para TypeScript** que se parece mucho a escribir SQL
- Su lema: "Si sabes SQL, sabes Drizzle"
- Los schemas se definen en TypeScript (no en un archivo separado como Prisma)

### Filosofia: SQL-first

```
Prisma:    Aprende el lenguaje de Prisma ──> Prisma genera SQL por ti
           (abstraccion alta, no ves el SQL)

Mongoose:  Define schemas JS ──> Mongoose habla con MongoDB
           (no es SQL, es otro mundo)

Drizzle:   Escribe TypeScript que se parece a SQL ──> Drizzle lo ejecuta
           (abstraccion minima, siempre sabes que SQL se genera)
```

```
RECUERDA:
-> Drizzle = escribir SQL pero con tipos de TypeScript y autocompletado
-> No tiene su propio lenguaje — es TypeScript puro
-> Si sabes SQL, ya sabes el 80% de Drizzle
```

---

## 1. Comparacion con lo que ya conoces

### Drizzle vs Prisma

```
┌─────────────────────┬──────────────────────────┬──────────────────────────┐
│     Concepto        │       Prisma             │        Drizzle           │
├─────────────────────┼──────────────────────────┼──────────────────────────┤
│ Schema              │ Archivo .prisma (PSL)    │ TypeScript puro          │
│ Lenguaje de queries │ Propio (findMany, etc.)  │ Parece SQL (select, eq)  │
│ Paso extra          │ prisma generate          │ No necesita              │
│ Migraciones         │ prisma migrate           │ drizzle-kit generate     │
│ Rendimiento         │ Mas overhead             │ Mas ligero               │
│ Curva aprendizaje   │ Facil si no sabes SQL    │ Facil si sabes SQL       │
│ Relaciones          │ include / select         │ with (relational queries)│
│ SQL crudo           │ prisma.$queryRaw         │ sql`` (template literal) │
│ Studio visual       │ prisma studio            │ drizzle studio           │
└─────────────────────┴──────────────────────────┴──────────────────────────┘
```

### Ejemplo lado a lado: buscar todos completados

```
-- SQL puro
SELECT * FROM todos WHERE completed = true ORDER BY created_at DESC;

// Prisma
await prisma.todo.findMany({
  where: { completed: true },
  orderBy: { createdAt: 'desc' }
})

// Drizzle
await db.select().from(todos).where(eq(todos.completed, true)).orderBy(desc(todos.createdAt))

// Mongoose (MongoDB, distinto modelo)
await Todo.find({ completed: true }).sort({ createdAt: -1 })
```

```
RECUERDA:
-> Prisma tiene su propio lenguaje (findMany, where: {})
-> Drizzle se parece al SQL real (select, from, where, orderBy)
-> Mongoose es otro paradigma (MongoDB, no SQL)
```

---

## 2. Definir schemas (tablas)

```
SQL puro:                              Drizzle:

CREATE TABLE todos (                   export const todos = pgTable('todos', {
  id UUID PRIMARY KEY DEFAULT           id: uuid('id').primaryKey().defaultRandom(),
    gen_random_uuid(),                   title: text('title').notNull(),
  title TEXT NOT NULL,                   description: text('description'),
  description TEXT,                      completed: boolean('completed').default(false).notNull(),
  completed BOOLEAN NOT NULL             createdAt: timestamp('created_at').defaultNow().notNull(),
    DEFAULT false,                       updatedAt: timestamp('updated_at').defaultNow().notNull(),
  created_at TIMESTAMP NOT NULL        })
    DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL
    DEFAULT NOW()
);
```

### Schema completo para el proyecto ToDo

```typescript
// src/db/schema.ts
import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core'

export const todos = pgTable('todos', {
  id:          uuid('id').primaryKey().defaultRandom(),
  title:       text('title').notNull(),
  description: text('description'),
  completed:   boolean('completed').default(false).notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
})
```

### Comparacion con Prisma schema

```
// Prisma (archivo schema.prisma, lenguaje propio)
model Todo {
  id          String   @id @default(uuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Drizzle (archivo .ts, TypeScript puro)
export const todos = pgTable('todos', {
  id:          uuid('id').primaryKey().defaultRandom(),
  title:       text('title').notNull(),
  description: text('description'),
  completed:   boolean('completed').default(false).notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
})
```

### Tipos de columna mas comunes en PostgreSQL

```
┌───────────────────┬───────────────────────────────┐
│  Tipo             │  Drizzle                      │
├───────────────────┼───────────────────────────────┤
│ UUID              │ uuid('nombre')                │
│ Texto             │ text('nombre')                │
│ Texto limitado    │ varchar('nombre', { length }) │
│ Entero            │ integer('nombre')             │
│ Booleano          │ boolean('nombre')             │
│ Fecha/hora        │ timestamp('nombre')           │
│ Serial (auto-inc) │ serial('nombre')              │
│ JSON              │ json('nombre')                │
│ Enum              │ pgEnum('nombre', [...])       │
└───────────────────┴───────────────────────────────┘
```

### Modificadores de columna

```typescript
.primaryKey()       // Clave primaria
.notNull()          // No puede ser null
.default(valor)     // Valor por defecto
.defaultRandom()    // UUID aleatorio (solo para uuid)
.defaultNow()       // Fecha actual (solo para timestamp)
.unique()           // Valor unico
.references(() => otraTabla.id)  // Foreign key
```

```
RECUERDA:
-> El schema se define en TypeScript, no en un archivo aparte
-> pgTable('nombre_tabla', { columnas }) es todo lo que necesitas
-> Los nombres de columna en el string ('created_at') son los de la BD,
   los nombres JS (createdAt) son los que usas en tu codigo
```

---

## 3. Conexion a la base de datos

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Tu codigo   │─────▶│   Drizzle    │─────▶│  PostgreSQL  │
│  (queries)   │      │   (traduce)  │      │  (ejecuta)   │
└──────────────┘      └──────────────┘      └──────────────┘
                            │
                      Necesita un DRIVER
                      (node-postgres)
```

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

const db = drizzle({
  connection: process.env.DATABASE_URL!,
  schema,
})

export default db
```

```
// .env
DATABASE_URL=postgresql://usuario:password@localhost:5432/todo_app
```

```
RECUERDA:
-> Drizzle necesita un driver para hablar con PostgreSQL (node-postgres)
-> La conexion se configura una vez y exportas db para usarlo en todo el proyecto
-> El schema se pasa a drizzle() para que conozca tus tablas
```

---

## 4. Queries — CRUD completo

### SELECT (leer)

```
SQL:      SELECT * FROM todos
Prisma:   prisma.todo.findMany()
Drizzle:  db.select().from(todos)
```

```typescript
import { eq, and, or, desc, asc, like } from 'drizzle-orm'
import { todos } from './schema'

// Todos los registros
const all = await db.select().from(todos)

// Con condicion (WHERE)
const completed = await db.select()
  .from(todos)
  .where(eq(todos.completed, true))

// Multiples condiciones (AND)
const filtered = await db.select()
  .from(todos)
  .where(
    and(
      eq(todos.completed, false),
      like(todos.title, '%comprar%')
    )
  )

// OR
const either = await db.select()
  .from(todos)
  .where(
    or(
      eq(todos.completed, true),
      like(todos.title, '%urgente%')
    )
  )

// Solo algunas columnas
const titles = await db.select({
  id: todos.id,
  title: todos.title,
}).from(todos)

// Ordenar
const sorted = await db.select().from(todos).orderBy(desc(todos.createdAt))

// Limitar resultados
const first10 = await db.select().from(todos).limit(10)

// Un solo registro por ID
const one = await db.select().from(todos).where(eq(todos.id, someId))
// one es un array — usas one[0] para obtener el elemento
```

### INSERT (crear)

```
SQL:      INSERT INTO todos (title) VALUES ('Comprar pan') RETURNING *
Prisma:   prisma.todo.create({ data: { title: 'Comprar pan' } })
Drizzle:  db.insert(todos).values({ title: 'Comprar pan' }).returning()
```

```typescript
// Insertar uno
const [newTodo] = await db.insert(todos)
  .values({ title: 'Comprar pan' })
  .returning()

// Insertar varios
const newTodos = await db.insert(todos)
  .values([
    { title: 'Comprar pan' },
    { title: 'Limpiar casa' },
  ])
  .returning()
```

### UPDATE (actualizar)

```
SQL:      UPDATE todos SET completed = true WHERE id = '...' RETURNING *
Prisma:   prisma.todo.update({ where: { id }, data: { completed: true } })
Drizzle:  db.update(todos).set({ completed: true }).where(eq(todos.id, id)).returning()
```

```typescript
// Actualizar por ID
const [updated] = await db.update(todos)
  .set({
    completed: true,
    updatedAt: new Date(),
  })
  .where(eq(todos.id, someId))
  .returning()

// Actualizar varios (todos los completados)
await db.update(todos)
  .set({ completed: false })
  .where(eq(todos.completed, true))
```

### DELETE (eliminar)

```
SQL:      DELETE FROM todos WHERE id = '...' RETURNING *
Prisma:   prisma.todo.delete({ where: { id } })
Drizzle:  db.delete(todos).where(eq(todos.id, id)).returning()
```

```typescript
// Eliminar por ID
const [deleted] = await db.delete(todos)
  .where(eq(todos.id, someId))
  .returning()

// Eliminar todos los completados
await db.delete(todos)
  .where(eq(todos.completed, true))
```

```
RECUERDA:
-> select().from(tabla) — leer
-> insert(tabla).values({}) — crear
-> update(tabla).set({}).where() — actualizar
-> delete(tabla).where() — eliminar
-> .returning() devuelve el registro afectado (como RETURNING en SQL)
```

---

## 5. Operadores de filtrado

```
┌──────────────────┬──────────────────────────┬─────────────────────────┐
│  SQL             │  Drizzle                 │  Prisma                 │
├──────────────────┼──────────────────────────┼─────────────────────────┤
│  = valor         │  eq(col, valor)          │  { col: valor }         │
│  != valor        │  ne(col, valor)          │  { col: { not: valor }} │
│  > valor         │  gt(col, valor)          │  { col: { gt: valor }}  │
│  >= valor        │  gte(col, valor)         │  { col: { gte: valor }} │
│  < valor         │  lt(col, valor)          │  { col: { lt: valor }}  │
│  <= valor        │  lte(col, valor)         │  { col: { lte: valor }} │
│  LIKE '%x%'      │  like(col, '%x%')        │  { col: { contains }}   │
│  IN (a, b)       │  inArray(col, [a, b])    │  { col: { in: [a,b] }} │
│  IS NULL         │  isNull(col)             │  { col: null }          │
│  IS NOT NULL     │  isNotNull(col)          │  { col: { not: null }}  │
│  AND             │  and(cond1, cond2)       │  { AND: [{}, {}] }      │
│  OR              │  or(cond1, cond2)        │  { OR: [{}, {}] }       │
│  NOT             │  not(cond)               │  { NOT: {} }            │
│  BETWEEN         │  between(col, min, max)  │  { col: {gte, lte} }   │
└──────────────────┴──────────────────────────┴─────────────────────────┘
```

Todos se importan de `drizzle-orm`:

```typescript
import { eq, ne, gt, gte, lt, lte, like, and, or, not, inArray, isNull, isNotNull, between } from 'drizzle-orm'
```

```
RECUERDA:
-> Los operadores de Drizzle son funciones con nombre de SQL: eq, gt, like, and, or
-> Siempre reciben (columna, valor) — nunca al reves
-> Se importan todos de 'drizzle-orm'
```

---

## 6. Relaciones

Para el proyecto ToDo no necesitas relaciones aun, pero es importante
entender como funcionan para cuando el proyecto crezca.

```
┌──────────────┐         ┌──────────────┐
│    users     │ 1 ── N  │    todos     │
│              │────────▶│              │
│ id           │         │ id           │
│ name         │         │ title        │
│ email        │         │ userId (FK)  │
└──────────────┘         └──────────────┘
```

### Definir las tablas con foreign key

```typescript
import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id:    uuid('id').primaryKey().defaultRandom(),
  name:  text('name').notNull(),
  email: text('email').notNull().unique(),
})

export const todos = pgTable('todos', {
  id:          uuid('id').primaryKey().defaultRandom(),
  title:       text('title').notNull(),
  completed:   boolean('completed').default(false).notNull(),
  userId:      uuid('user_id').notNull().references(() => users.id),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
})
```

### Definir relaciones (para queries relacionales)

```typescript
import { relations } from 'drizzle-orm'

export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
}))

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
}))
```

### Consultar con relaciones

```typescript
// Prisma:
// prisma.user.findMany({ include: { todos: true } })

// Drizzle (relational query):
const usersWithTodos = await db.query.users.findMany({
  with: {
    todos: true,
  },
})
// Resultado: [{ id, name, email, todos: [{ id, title, ... }] }]
```

### Comparacion con Prisma y Mongoose

```
// Prisma
model User {
  id    String @id @default(uuid())
  todos Todo[]
}
model Todo {
  id     String @id @default(uuid())
  user   User   @relation(fields: [userId], references: [id])
  userId String
}

// Mongoose
const todoSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})
await Todo.find().populate('user')

// Drizzle
export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, { fields: [todos.userId], references: [users.id] }),
}))
await db.query.todos.findMany({ with: { user: true } })
```

```
RECUERDA:
-> Foreign key se define en la tabla con .references(() => otraTabla.id)
-> Las relaciones se definen aparte con relations() para queries relacionales
-> with: { relacion: true } es el equivalente a include de Prisma o populate de Mongoose
```

---

## 7. Migraciones

```
Tu cambias el schema.ts
        │
        ▼
drizzle-kit generate    ──> Genera archivo SQL de migracion
        │
        ▼
drizzle-kit migrate     ──> Aplica la migracion a la BD
        │
        ▼
La BD tiene la nueva estructura
```

### Configuracion

```typescript
// drizzle.config.ts (raiz de apps/api)
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### Comandos de Drizzle Kit

```bash
# Generar migracion (crea archivo SQL en /drizzle)
npx drizzle-kit generate

# Aplicar migraciones pendientes
npx drizzle-kit migrate

# Push directo (aplica cambios sin crear archivo de migracion)
# Util en desarrollo, NO en produccion
npx drizzle-kit push

# Abrir Drizzle Studio (interfaz visual para ver/editar datos)
npx drizzle-kit studio
```

### Comparacion con Prisma

```
Prisma:                              Drizzle:

prisma migrate dev                   drizzle-kit generate + drizzle-kit migrate
  (genera + aplica)                    (dos pasos separados)

prisma db push                       drizzle-kit push
  (push sin migracion)                 (mismo concepto)

prisma studio                        drizzle-kit studio
  (interfaz visual)                    (interfaz visual)

prisma generate                      (no necesita — es TypeScript directo)
  (genera el client)
```

```
RECUERDA:
-> generate crea el archivo SQL de migracion
-> migrate aplica las migraciones a la BD
-> push aplica directo sin migracion (solo desarrollo)
-> Drizzle NO necesita un paso de "generate client" como Prisma
```

---

## 8. Tipos inferidos

Una ventaja grande de Drizzle: puedes extraer tipos TypeScript directamente del schema.

```typescript
import { todos } from './schema'
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'

// Tipo de un todo cuando lo LEES de la BD (todos los campos)
type Todo = InferSelectModel<typeof todos>
// { id: string, title: string, description: string | null, completed: boolean, ... }

// Tipo de un todo cuando lo CREAS (sin id, sin defaults)
type NewTodo = InferInsertModel<typeof todos>
// { title: string, description?: string | null, completed?: boolean, ... }
```

### Comparacion

```
Prisma:    import { Todo } from '@prisma/client'    ← Generado por prisma generate
Mongoose:  Defines la interfaz manualmente           ← O usas InferSchemaType
Drizzle:   InferSelectModel<typeof todos>            ← Directo del schema, sin generar nada
```

```
RECUERDA:
-> InferSelectModel = tipo para leer (SELECT)
-> InferInsertModel = tipo para crear (INSERT)
-> No necesitas definir interfaces a mano ni generar nada
```

---

## 9. Cheatsheet

### Setup

```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'
const db = drizzle({ connection: process.env.DATABASE_URL!, schema })
```

### Schema

```typescript
import { pgTable, uuid, text, boolean, timestamp, integer, varchar } from 'drizzle-orm/pg-core'

export const miTabla = pgTable('mi_tabla', {
  id:        uuid('id').primaryKey().defaultRandom(),
  nombre:    text('nombre').notNull(),
  activo:    boolean('activo').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

### CRUD

```typescript
import { eq, and, or, desc, like } from 'drizzle-orm'

// SELECT
db.select().from(tabla)
db.select().from(tabla).where(eq(tabla.col, valor))
db.select({ id: tabla.id }).from(tabla).orderBy(desc(tabla.createdAt)).limit(10)

// INSERT
db.insert(tabla).values({ ... }).returning()
db.insert(tabla).values([{ ... }, { ... }]).returning()

// UPDATE
db.update(tabla).set({ ... }).where(eq(tabla.id, id)).returning()

// DELETE
db.delete(tabla).where(eq(tabla.id, id)).returning()
```

### Operadores

```typescript
eq(col, val)          // =
ne(col, val)          // !=
gt(col, val)          // >
gte(col, val)         // >=
lt(col, val)          // <
lte(col, val)         // <=
like(col, '%val%')    // LIKE
inArray(col, [a, b])  // IN
isNull(col)           // IS NULL
isNotNull(col)        // IS NOT NULL
and(c1, c2)           // AND
or(c1, c2)            // OR
between(col, a, b)    // BETWEEN
```

### Relaciones

```typescript
import { relations } from 'drizzle-orm'

export const padreRelations = relations(padre, ({ many }) => ({
  hijos: many(hijo),
}))

export const hijoRelations = relations(hijo, ({ one }) => ({
  padre: one(padre, { fields: [hijo.padreId], references: [padre.id] }),
}))

// Query
db.query.padre.findMany({ with: { hijos: true } })
```

### Tipos

```typescript
type Select = InferSelectModel<typeof tabla>  // Tipo para leer
type Insert = InferInsertModel<typeof tabla>   // Tipo para crear
```

### Drizzle Kit (CLI)

```bash
npx drizzle-kit generate   # Generar migracion
npx drizzle-kit migrate    # Aplicar migraciones
npx drizzle-kit push       # Push directo (solo dev)
npx drizzle-kit studio     # Interfaz visual
```

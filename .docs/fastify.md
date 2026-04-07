# Fastify — Guia de aprendizaje

Guia practica para aprender Fastify desde la perspectiva de un desarrollador con experiencia en Express.
El objetivo es entender lo esencial para implementar un backend real, no memorizar documentacion.

---

## 0. Conceptos clave en simple

Antes de entrar en detalle, esto es lo que necesitas entender de cada concepto:

### Plugins — Que son realmente

Un plugin es simplemente una **funcion que agrupa codigo relacionado**. Nada mas.

```
Imagina un restaurante:

  ┌─────────────────────────────────────┐
  │           Restaurante (Fastify)      │
  │                                      │
  │   ┌──────────┐    ┌──────────┐      │
  │   │  Cocina   │    │   Bar    │      │
  │   │          │    │          │      │
  │   │ Su chef  │    │ Su barman│      │
  │   │ Sus platos│    │ Sus copas│      │
  │   │ Sus reglas│    │ Sus reglas│      │
  │   └──────────┘    └──────────┘      │
  │                                      │
  │   La cocina no toca las copas del bar│
  │   El bar no toca los platos          │
  └─────────────────────────────────────┘
```

En Express harias esto:

```javascript
// Todo junto, todo global
app.use(express.json())
app.use(cors())
app.get('/todos', getTodos)
app.get('/users', getUsers)
// Todo ve todo, todo comparte todo
```

En Fastify agrupas por "departamentos":

```typescript
// Plugin = agrupar rutas y logica relacionada
async function todoPlugin(fastify) {
  fastify.get('/', getTodos)       // GET /api/todos
  fastify.post('/', createTodo)    // POST /api/todos
}

async function userPlugin(fastify) {
  fastify.get('/', getUsers)       // GET /api/users
}

// Registras cada "departamento"
fastify.register(todoPlugin, { prefix: '/api/todos' })
fastify.register(userPlugin, { prefix: '/api/users' })
```

**Un plugin = una funcion que mete rutas/logica dentro de Fastify.** El equivalente en Express seria un `Router()`, pero con aislamiento.

### Decorators — Que son realmente

Un decorator es **ponerle un nombre a algo para que este disponible despues**.

```
Sin decorator:                    Con decorator:

const db = connectDB()            fastify.decorate('db', connectDB())

// Tienes que importar db         // En cualquier parte:
// en cada archivo que             // fastify.db
// lo necesite                     // Ya esta ahi, sin importar nada
```

Es como colgar las llaves en un gancho de la entrada en vez de dejarlas sueltas por la casa.

```
┌──────────────────────────────┐
│   fastify (la instancia)     │
│                              │
│   .db        = conexion BD   │  ← decorate('db', ...)
│   .config    = { port: 3000 }│  ← decorate('config', ...)
│                              │
│   request.user = null        │  ← decorateRequest('user', ...)
│   (se llena en cada request) │
└──────────────────────────────┘
```

En Express haces lo mismo pero de forma informal:

```javascript
// Express: lo pegas en req sin que nadie lo sepa
req.user = getUser()  // Funciona, pero no hay registro de que existe

// Fastify: lo declaras oficialmente
fastify.decorateRequest('user', null)  // Ahora Fastify SABE que request.user existe
```

**Un decorator = registrar oficialmente una propiedad nueva en Fastify, request o reply.**

### Hooks — Que son realmente

Un hook es **codigo que se ejecuta en un momento concreto de cada peticion**. Exactamente como un middleware de Express, pero con nombre.

```
En Express un middleware es generico:

  Request ──> middleware1 ──> middleware2 ──> middleware3 ──> handler
              (no sabes cuando se ejecuta cada uno, es una cola)


En Fastify cada hook tiene un MOMENTO definido:

  Request ──> onRequest ──> preHandler ──> Handler ──> onResponse
                 │               │                        │
            "acaba de          "ya se               "ya se
             llegar"          valido todo,           respondio,
                              ahora auth"           haz cleanup"
```

Ejemplo real comparado:

```javascript
// EXPRESS: middleware de auth
app.use((req, res, next) => {
  req.user = getUser(req.headers.authorization)
  next()
})

// FASTIFY: hook de auth (mismo resultado, pero sabes CUANDO corre)
fastify.addHook('preHandler', async (request) => {
  request.user = getUser(request.headers.authorization)
})
```

**Un hook = un middleware con nombre que indica en que momento exacto se ejecuta.**

### Por que es mas rapido — Explicado simple

Piensa en dos restaurantes que sirven hamburguesas:

```
Restaurante Express:

  Cliente pide ──> Camarero busca mesa por mesa si hay sitio ──> Cocina lee el pedido
                         (busca ruta una por una)                      │
                                                              Lee cada ingrediente
                                                              y decide como cocinarlo
                                                              en el momento
                                                                       │
                                                                       ▼
                                                                  Sirve plato


Restaurante Fastify:

  Cliente pide ──> Mapa de mesas (sabe al instante donde ir) ──> Cocina YA SABE
                       (Radix Tree)                               como hacer esta
                                                                  hamburguesa porque
                                                                  tiene la receta
                                                                  PRE-COMPILADA
                                                                       │
                                                                       ▼
                                                                  Sirve plato
```

Son solo **dos optimizaciones**:

**1. Encontrar la ruta mas rapido**

```
Express: "Tengo 50 rutas, voy a probar una por una hasta encontrar la correcta"
         /users? no... /todos? no... /auth? no... /api/todos? SI!

Fastify: "Tengo un arbol, bajo directamente al nodo correcto"
         /api -> /todos -> ENCONTRADO (2-3 pasos siempre)
```

**2. Convertir objetos a JSON mas rapido**

Cuando devuelves `{ id: 1, title: "Comprar pan" }`, hay que convertirlo a texto JSON.

```
Express (JSON.stringify):
  Recibe el objeto ──> "Que tipo es id? number. Que tipo es title? string..."
  Lo analiza CADA VEZ, campo por campo

Fastify (fast-json-stringify):
  Tu le dices de antemano: "id siempre es number, title siempre es string"
  Compila una funcion especifica ──> Ya no necesita analizar nada, solo escribe
```

Es como la diferencia entre:
- Leer una receta paso a paso cada vez que cocinas (Express)
- Saberte la receta de memoria porque la has practicado mil veces (Fastify)

```
RECUERDA:
-> Plugin = funcion que agrupa rutas y logica (como un Router de Express pero aislado)
-> Decorator = registrar algo en fastify/request/reply para usarlo despues
-> Hook = middleware con nombre que indica CUANDO se ejecuta
-> Rapido = busca rutas en arbol (no en lista) + serializa JSON pre-compilado
```

---

## 1. Que es Fastify

```
┌──────────────────────────────────────────────────┐
│                    Node.js                       │
│                                                  │
│   ┌──────────┐         ┌──────────────┐          │
│   │ Express  │         │   Fastify    │          │
│   │          │         │              │          │
│   │ Flexible │         │ Rapido       │          │
│   │ Minimal  │         │ Estructurado │          │
│   │ Middleware│         │ Plugins      │          │
│   └──────────┘         └──────────────┘          │
│                                                  │
│   Ambos son frameworks HTTP para Node.js         │
│   Fastify nacio para resolver lo que Express     │
│   no optimizo: rendimiento y estructura          │
└──────────────────────────────────────────────────┘
```

- **Framework HTTP para Node.js**, alternativa moderna a Express
- Creado para ser rapido por diseno, no como optimizacion posterior
- Soporta TypeScript de forma nativa y tiene un ecosistema de plugins oficial

```
RECUERDA:
-> Fastify es a Express lo que un coche de carreras es a un coche familiar
-> Ambos te llevan al mismo sitio, pero uno esta disenado para velocidad desde el motor
-> No necesitas desaprender Express, solo entender las diferencias
```

---

## 2. Por que es tan rapido

```
Express (por cada request):

  Request ──> Middleware 1 ──> Middleware 2 ──> ... ──> Handler ──> JSON.stringify() ──> Response
                  │                │                                      │
                  └── Cadena de funciones sin optimizar ──────────────────┘
                  └── Serializa JSON de forma generica (lento) ──────────┘


Fastify (por cada request):

  Request ──> find-my-way ──> Handler ──> fast-json-stringify ──> Response
                  │                              │
                  └── Router basado en Radix Tree (ultra rapido)
                                                 └── Serializa con schema compilado (2-3x mas rapido)
```

Tres razones principales:

### 2.1 Router: find-my-way

Express usa una lista de rutas que recorre una por una (O(n)).
Fastify usa un **Radix Tree** — una estructura en arbol que encuentra la ruta correcta casi al instante.

```
Radix Tree (simplificado):

              /api
             /    \
           /v1     /v2
          /   \      \
      /todos  /users  /todos
```

### 2.2 Serializacion: fast-json-stringify

Express usa `JSON.stringify()` generico — analiza el objeto completo cada vez.
Fastify compila un **serializador especifico** basado en tu JSON Schema. Sabe de antemano que forma tiene tu respuesta.

```
Express:  { hello: "world" }  ──>  JSON.stringify(obj)  ──>  '{"hello":"world"}'
                                        |
                                   Analiza tipos en runtime (lento)

Fastify:  { hello: "world" }  ──>  serializadorCompilado(obj)  ──>  '{"hello":"world"}'
                                        |
                                   Ya sabe que "hello" es string (2-3x mas rapido)
```

### 2.3 Validacion: Ajv compilado

La validacion de datos de entrada tambien se compila. Fastify usa **Ajv v8** y genera funciones de validacion optimizadas a partir de tus JSON Schemas.

```
RECUERDA:
-> Rapido por 3 cosas: router (find-my-way), serializacion (fast-json-stringify), validacion (Ajv)
-> Todo se basa en JSON Schema: defines la forma de los datos UNA vez y Fastify optimiza todo
-> +76,000 requests/segundo en benchmarks sinteticos
```

---

## 3. Diferencias clave con Express

```
┌─────────────────────┬────────────────────────┬──────────────────────────┐
│     Concepto        │       Express          │        Fastify           │
├─────────────────────┼────────────────────────┼──────────────────────────┤
│ Extensibilidad      │ Middlewares             │ Plugins                  │
│ Validacion          │ Manual o con libs       │ JSON Schema integrado    │
│ Serializacion       │ JSON.stringify          │ fast-json-stringify      │
│ Logging             │ Manual (morgan, etc.)   │ Pino integrado           │
│ Async/Await         │ Requiere try/catch      │ Soporte nativo           │
│ Encapsulacion       │ No existe               │ Contextos aislados       │
│ TypeScript          │ Con @types/express      │ Soporte nativo           │
│ Decoradores         │ No tiene                │ decorate / decorateReq   │
│ Ciclo de vida       │ next() manual           │ Hooks automaticos        │
└─────────────────────┴────────────────────────┴──────────────────────────┘
```

La diferencia mas importante: **encapsulacion**. En Express todo es global.
En Fastify cada plugin tiene su propio contexto aislado por defecto.

```
Express:                              Fastify:

  app.use(cors)     <-- global          register(authPlugin)     <-- contexto A
  app.use(auth)     <-- global            ├── Solo rutas auth ven esto
  app.use(logger)   <-- global          register(publicPlugin)   <-- contexto B
                                          ├── No ve nada de auth
  Todo ve todo                          Cada uno en su burbuja
```

```
RECUERDA:
-> No hay app.use() — hay fastify.register()
-> No hay middlewares — hay plugins y hooks
-> No hay next() — hay async/await nativo
```

---

## 4. Sistema de plugins

Este es el concepto mas importante de Fastify.
Un plugin es una funcion que recibe la instancia de Fastify y la extiende.

```
┌─────────────────────────────────────────────────┐
│               Fastify Instance                   │
│                                                  │
│   register(dbPlugin)                             │
│       └── Anade fastify.db                       │
│                                                  │
│   register(authPlugin)                           │
│       └── Anade hook de autenticacion            │
│       └── Solo afecta a sus rutas hijas          │
│                                                  │
│   register(todosRoutes, { prefix: '/api/todos' })│
│       └── GET  /api/todos                        │
│       └── POST /api/todos                        │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Plugin basico

```typescript
// plugins/db.ts
import fp from 'fastify-plugin'

async function dbPlugin(fastify, options) {
  const db = await connectToDatabase(options.connectionString)

  // Decorator: anade .db a la instancia de Fastify
  fastify.decorate('db', db)

  // Cleanup al cerrar el servidor
  fastify.addHook('onClose', async () => {
    await db.close()
  })
}

// fp() rompe la encapsulacion -> hace que .db sea visible para TODOS
export default fp(dbPlugin, { name: 'database' })
```

### Registrar plugins

```typescript
// app.ts
import Fastify from 'fastify'
import dbPlugin from './plugins/db'
import todoRoutes from './routes/todos'

const fastify = Fastify({ logger: true })

// Plugin global (fp -> visible para todos)
fastify.register(dbPlugin, {
  connectionString: 'postgresql://localhost/todos'
})

// Rutas con prefijo (encapsuladas)
fastify.register(todoRoutes, { prefix: '/api/todos' })

fastify.listen({ port: 3000 })
```

### Encapsulacion vs compartir

```
                    ┌── Plugin con fp()  ──> COMPARTE con todos (ej: db, config)
                    │
fastify.register ───┤
                    │
                    └── Plugin sin fp()  ──> ENCAPSULADO, solo visible para hijos
```

La regla es simple:
- **Infraestructura** (db, config, auth): usa `fp()` para compartir
- **Rutas y logica de negocio**: sin `fp()`, encapsulado

```
RECUERDA:
-> Un plugin es una funcion async que recibe (fastify, options)
-> register() crea un contexto hijo aislado por defecto
-> fastify-plugin (fp) rompe esa encapsulacion para compartir cosas globales
```

---

## 5. Hooks (ciclo de vida)

Los hooks son funciones que se ejecutan en momentos especificos del ciclo de vida de cada request.
Son el equivalente a los middlewares de Express, pero con puntos de entrada definidos.

```
Request entrante
    │
    ▼
┌─────────────┐
│  onRequest   │  ← Primer hook (ej: logging, timing)
└──────┬──────┘
       ▼
┌─────────────┐
│  preParsing  │  ← Antes de parsear el body
└──────┬──────┘
       ▼
┌──────────────┐
│ preValidation │  ← Antes de validar con JSON Schema
└──────┬───────┘
       ▼
┌─────────────┐
│  preHandler  │  ← Despues de validar, antes del handler (ej: auth)
└──────┬──────┘
       ▼
┌─────────────┐
│   Handler    │  ← Tu logica de negocio
└──────┬──────┘
       ▼
┌──────────────────┐
│ preSerialization  │  ← Antes de serializar la respuesta
└──────┬───────────┘
       ▼
┌─────────────┐
│   onSend     │  ← Antes de enviar (ej: headers extra)
└──────┬──────┘
       ▼
┌─────────────┐
│  onResponse  │  ← Despues de enviar (ej: metricas, cleanup)
└─────────────┘
```

### Los que mas usaras

```typescript
// Medir tiempo de respuesta
fastify.addHook('onRequest', async (request, reply) => {
  request.startTime = Date.now()
})

// Autenticacion antes del handler
fastify.addHook('preHandler', async (request, reply) => {
  const token = request.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    reply.code(401).send({ error: 'No autorizado' })
    return
  }
  request.user = await validateToken(token)
})

// Logging despues de responder
fastify.addHook('onResponse', async (request, reply) => {
  request.log.info({
    statusCode: reply.statusCode,
    responseTime: Date.now() - request.startTime
  })
})
```

### Hooks de aplicacion (no de request)

```typescript
// Cuando el servidor esta listo
fastify.addHook('onReady', async () => {
  console.log('Servidor listo')
})

// Cuando el servidor se cierra
fastify.addHook('onClose', async (instance) => {
  await instance.db?.close()
})
```

```
RECUERDA:
-> Los hooks reemplazan a los middlewares de Express
-> Los mas comunes: onRequest, preHandler, onResponse
-> Se pueden registrar globalmente o dentro de un plugin (solo afecta a ese contexto)
```

---

## 6. Validacion con JSON Schema

Fastify valida automaticamente los datos de entrada si defines schemas.
No necesitas librerias externas como Joi o Zod para la validacion HTTP.

```
               Sin schema                    Con schema
               
Request ──> Handler ──> Response    Request ──> Validacion automatica ──> Handler ──> Response
                                                      │
                                                 Si falla: 400 automatico
```

### Ejemplo completo

```typescript
const createTodoSchema = {
  body: {
    type: 'object',
    required: ['title'],
    properties: {
      title:       { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', maxLength: 1000 },
      completed:   { type: 'boolean', default: false }
    },
    additionalProperties: false
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id:          { type: 'string', format: 'uuid' },
        title:       { type: 'string' },
        description: { type: 'string' },
        completed:   { type: 'boolean' },
        createdAt:   { type: 'string', format: 'date-time' }
      }
    }
  }
}

fastify.post('/todos', { schema: createTodoSchema }, async (request, reply) => {
  // request.body ya esta validado cuando llegas aqui
  const todo = await createTodo(request.body)
  reply.code(201).send(todo)
})
```

### Que puedes validar

```
schema: {
  body:        ──> El cuerpo de la request (POST, PUT)
  querystring: ──> Los query params (?page=1&limit=10)
  params:      ──> Los parametros de ruta (:id)
  headers:     ──> Headers especificos
  response:    ──> La forma de la respuesta (para serializar rapido)
}
```

### Schemas reutilizables

```typescript
// Registrar schema compartido
fastify.addSchema({
  $id: 'todo',
  type: 'object',
  properties: {
    id:          { type: 'string', format: 'uuid' },
    title:       { type: 'string' },
    description: { type: 'string' },
    completed:   { type: 'boolean' },
    createdAt:   { type: 'string', format: 'date-time' }
  }
})

// Referenciarlo en rutas
const getTodosSchema = {
  response: {
    200: {
      type: 'array',
      items: { $ref: 'todo#' }
    }
  }
}
```

```
RECUERDA:
-> Defines el schema UNA vez, Fastify valida y serializa automaticamente
-> Si la validacion falla, devuelve 400 sin que tu hagas nada
-> El response schema no valida la respuesta — la SERIALIZA rapido
```

---

## 7. Decorators

Los decorators anaden propiedades o metodos a la instancia de Fastify, a request o a reply.
Son la forma oficial de extender Fastify.

```
┌──────────────────────┐
│  fastify.decorate()  │ ──> Anade a la instancia (ej: fastify.db)
├──────────────────────┤
│  decorateRequest()   │ ──> Anade a cada request (ej: request.user)
├──────────────────────┤
│  decorateReply()     │ ──> Anade a cada reply (ej: reply.success())
└──────────────────────┘
```

```typescript
// Decorator en la instancia
fastify.decorate('config', {
  dbUrl: process.env.DATABASE_URL,
  port: process.env.PORT || 3000
})
// Uso: fastify.config.dbUrl

// Decorator en request (debe tener valor inicial)
fastify.decorateRequest('user', null)
// Luego en un hook:
fastify.addHook('preHandler', async (request) => {
  request.user = await getUser(request.headers.authorization)
})
// Uso en handler: request.user

// Decorator en reply
fastify.decorateReply('success', function (data) {
  return this.code(200).send({ success: true, data })
})
// Uso: reply.success({ id: 1, title: 'Mi tarea' })
```

```
RECUERDA:
-> decorate = extender la instancia de Fastify con cosas nuevas
-> decorateRequest = anadir propiedades a cada request
-> El valor inicial es obligatorio (null si se llena despues en un hook)
```

---

## 8. Manejo de errores

```
                              ┌── error.validation existe?
                              │        │
                  Error ──────┤    SI: Error de validacion (400)
                              │    NO: ──> error.statusCode existe?
                              │                  │
                              │             SI: Usa ese codigo
                              │             NO: 500 Internal Server Error
                              │
                              └── setErrorHandler personalizado captura TODO
```

### Error handler global

```typescript
fastify.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error })

  // Error de validacion (JSON Schema)
  if (error.validation) {
    return reply.code(400).send({
      error: 'Error de validacion',
      message: error.message,
      details: error.validation
    })
  }

  // Error con codigo HTTP explicito
  if (error.statusCode) {
    return reply.code(error.statusCode).send({
      error: error.name,
      message: error.message
    })
  }

  // Error inesperado
  reply.code(500).send({
    error: 'Error interno',
    message: 'Ocurrio un error inesperado'
  })
})
```

### 404 personalizado

```typescript
fastify.setNotFoundHandler(async (request, reply) => {
  reply.code(404).send({
    error: 'No encontrado',
    message: `Ruta ${request.method}:${request.url} no existe`
  })
})
```

### Lanzar errores en handlers

```typescript
fastify.get('/todos/:id', async (request, reply) => {
  const todo = await findTodo(request.params.id)

  if (!todo) {
    // Opcion 1: reply directo
    return reply.code(404).send({ error: 'Tarea no encontrada' })
  }

  // Opcion 2: throw (lo captura setErrorHandler)
  // const err = new Error('Tarea no encontrada')
  // err.statusCode = 404
  // throw err

  return todo
})
```

```
RECUERDA:
-> setErrorHandler captura TODOS los errores (validacion, throw, etc.)
-> setNotFoundHandler para rutas que no existen
-> En async handlers, puedes hacer throw directamente sin try/catch
```

---

## 9. Logging con Pino

Fastify incluye **Pino** como logger integrado. No necesitas instalar morgan ni winston.

```typescript
// Activar logger al crear la instancia
const fastify = Fastify({
  logger: true  // Logs en formato JSON
})

// Niveles de log
fastify.log.info('Servidor arrancado')
fastify.log.warn('Algo no va bien')
fastify.log.error('Error critico')

// Dentro de un handler, usa request.log (incluye requestId automatico)
fastify.get('/todos', async (request, reply) => {
  request.log.info('Listando todos los todos')
  // Output: {"reqId":"abc-123","msg":"Listando todos los todos",...}
})
```

```typescript
// Desarrollo: formato legible
const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty'  // npm install -D pino-pretty
    }
  }
})
```

```
RECUERDA:
-> logger: true activa Pino automaticamente
-> Cada request tiene un requestId unico
-> En desarrollo usa pino-pretty para logs legibles
```

---

## 10. Estructura real de un proyecto Fastify

```
apps/api/
  ├── src/
  │   ├── app.ts              ── Crea y configura la instancia Fastify
  │   ├── server.ts           ── Arranca el servidor (listen)
  │   ├── plugins/
  │   │   ├── db.ts           ── Plugin de base de datos (con fp)
  │   │   └── cors.ts         ── Plugin de CORS (con fp)
  │   ├── routes/
  │   │   └── todos/
  │   │       ├── index.ts    ── Registra las rutas como plugin
  │   │       ├── schema.ts   ── JSON Schemas de validacion
  │   │       └── handler.ts  ── Handlers (logica de cada endpoint)
  │   └── services/
  │       └── todo.service.ts ── Logica de negocio y acceso a DB
  └── drizzle.config.ts
```

### app.ts — Configurar la instancia

```typescript
import Fastify from 'fastify'
import dbPlugin from './plugins/db'
import todoRoutes from './routes/todos'

export function buildApp() {
  const fastify = Fastify({ logger: true })

  // Plugins globales
  fastify.register(dbPlugin)

  // Rutas
  fastify.register(todoRoutes, { prefix: '/api/todos' })

  return fastify
}
```

### server.ts — Arrancar

```typescript
import { buildApp } from './app'

const app = buildApp()

app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`Servidor escuchando en ${address}`)
})
```

### routes/todos/index.ts — Rutas como plugin

```typescript
import { FastifyInstance } from 'fastify'
import { createTodoSchema, getTodosSchema, updateTodoSchema, deleteTodoSchema } from './schema'
import * as handlers from './handler'

export default async function todoRoutes(fastify: FastifyInstance) {
  fastify.get('/', { schema: getTodosSchema }, handlers.getTodos)
  fastify.post('/', { schema: createTodoSchema }, handlers.createTodo)
  fastify.put('/:id', { schema: updateTodoSchema }, handlers.updateTodo)
  fastify.delete('/:id', { schema: deleteTodoSchema }, handlers.deleteTodo)
}
```

---

## 11. Cheatsheet

### Crear servidor

```typescript
import Fastify from 'fastify'
const fastify = Fastify({ logger: true })
fastify.listen({ port: 3000 })
```

### Rutas

```typescript
fastify.get('/path', handler)
fastify.post('/path', { schema }, handler)
fastify.put('/path/:id', { schema }, handler)
fastify.delete('/path/:id', handler)
```

### Plugins

```typescript
// Encapsulado (por defecto)
fastify.register(async (fastify, opts) => { ... })

// Compartido (con fp)
import fp from 'fastify-plugin'
export default fp(async (fastify, opts) => { ... })
```

### Hooks

```typescript
fastify.addHook('onRequest', async (req, reply) => { })
fastify.addHook('preHandler', async (req, reply) => { })
fastify.addHook('onResponse', async (req, reply) => { })
fastify.addHook('onClose', async (instance) => { })
```

### Decorators

```typescript
fastify.decorate('nombre', valor)
fastify.decorateRequest('nombre', valorInicial)
fastify.decorateReply('nombre', valorInicial)
```

### Validacion

```typescript
{
  schema: {
    body: { type: 'object', properties: { ... } },
    params: { type: 'object', properties: { id: { type: 'string' } } },
    querystring: { type: 'object', properties: { page: { type: 'integer' } } },
    response: { 200: { type: 'object', properties: { ... } } }
  }
}
```

### Errores

```typescript
fastify.setErrorHandler((error, request, reply) => { ... })
fastify.setNotFoundHandler(async (request, reply) => { ... })
```

### Logging

```typescript
fastify.log.info('mensaje')
request.log.info('con requestId automatico')
```

---

## 12. Express vs Fastify — Traduccion rapida

```
// EXPRESS                              // FASTIFY
const app = express()                   const fastify = Fastify()
app.use(cors())                         fastify.register(cors)
app.use(express.json())                 // No necesario, parsea JSON automaticamente
app.use(authMiddleware)                 fastify.addHook('preHandler', authHook)
app.get('/path', handler)              fastify.get('/path', handler)
app.listen(3000)                        fastify.listen({ port: 3000 })

// Middleware Express                   // Plugin Fastify
module.exports = (req, res, next) => {  export default fp(async (fastify) => {
  req.user = getUser()                    fastify.decorateRequest('user', null)
  next()                                  fastify.addHook('preHandler', async (req) => {
}                                           req.user = getUser()
                                          })
                                        })
```

```
RECUERDA:
-> express()           = Fastify()
-> app.use()           = fastify.register()
-> middleware           = plugin + hook
-> express.json()      = incluido por defecto
-> next()              = async/await (no hay next)
-> req.algo = valor    = decorateRequest + hook
```

# Herramientas del proyecto — Por que estas y no las clasicas

Guia para entender pnpm, Turborepo y Biome: que hacen, por que sustituyen
a npm, monorepos manuales y ESLint+Prettier, y como encajan en el proyecto.

---

## 1. pnpm — El gestor de paquetes

```
┌──────────────────────────────────────────────────────────┐
│                  Instalar dependencias                    │
│                                                          │
│   npm                              pnpm                  │
│   ┌──────────┐                     ┌──────────┐          │
│   │proyecto-A│ ── node_modules/    │proyecto-A│ ── link  │
│   │  react   │    (copia completa) │  react   │    ──┐   │
│   └──────────┘                     └──────────┘      │   │
│   ┌──────────┐                     ┌──────────┐      │   │
│   │proyecto-B│ ── node_modules/    │proyecto-B│ ── link  │
│   │  react   │    (OTRA copia)     │  react   │    ──┤   │
│   └──────────┘                     └──────────┘      │   │
│                                                      ▼   │
│   2 copias de react                  ┌────────────┐      │
│   en disco                           │ Store global│     │
│                                      │ (1 sola     │     │
│                                      │  copia)     │     │
│                                      └────────────┘      │
└──────────────────────────────────────────────────────────┘
```

### Que es

Un gestor de paquetes como npm o yarn, pero mas eficiente.

### Por que sustituye a npm

- **Disco**: npm copia cada paquete en cada proyecto. pnpm guarda UNA copia global y crea enlaces. Si 5 proyectos usan React, npm tiene 5 copias, pnpm tiene 1.
- **Velocidad**: al no copiar archivos, instalar es mas rapido.
- **Monorepos**: pnpm tiene soporte nativo para workspaces (multiples proyectos en un solo repo).

### Workspaces — Lo que importa para este proyecto

```
test-todo-modern-stack/          ← Raiz del monorepo
├── package.json                 ← Dependencias compartidas
├── pnpm-workspace.yaml          ← "Aqui estan mis workspaces"
├── apps/
│   ├── api/                     ← Workspace: backend
│   │   └── package.json
│   └── web/                     ← Workspace: frontend
│       └── package.json
└── node_modules/                ← UNO solo, en la raiz
```

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
```

Con esto pnpm sabe que `apps/api` y `apps/web` son proyectos independientes
pero que comparten el mismo repositorio.

### Referencia rapida de comandos

pnpm init # crea el package.json
pnpm install # instala dependencias del workspace

pnpm add <paquete> # instala una dependencia normal
pnpm add -D <paquete> # instala una dependencia de desarrollo

pnpm add -w <paquete> # instala una dependencia en la raíz
pnpm add -w -D <paquete> # instala una devDependency en la raíz

pnpm --filter api add <paquete> # instala una dependencia solo en apps/api
pnpm --filter api add -D <paquete> # instala una devDependency solo en apps/api

pnpm --filter web add <paquete> # instala una dependencia solo en apps/web
pnpm --filter web add -D <paquete> # instala una devDependency solo en apps/web

pnpm remove <paquete> # elimina una dependencia del paquete actual
pnpm --filter api remove <paquete> # elimina una dependencia de apps/api
pnpm --filter web remove <paquete> # elimina una dependencia de apps/web

pnpm dev # ejecuta el script dev del package actual o raíz
pnpm build # ejecuta el script build del package actual o raíz
pnpm lint # ejecuta el script lint del package actual o raíz

pnpm --filter api dev # ejecuta el script dev de apps/api
pnpm --filter web dev # ejecuta el script dev de apps/web

pnpm -r run build # ejecuta build en todos los workspaces
pnpm -r run lint # ejecuta lint en todos los workspaces

pnpm list # muestra dependencias instaladas
pnpm why <paquete> # muestra por qué un paquete está instalado
pnpm outdated # muestra dependencias desactualizadas
pnpm update # actualiza dependencias
pnpm --version # muestra la versión de pnpm

```
RECUERDA:
-> pnpm = npm pero sin copias duplicadas (usa un store global con enlaces)
-> Mas rapido, menos disco, soporte nativo para monorepos
-> pnpm-workspace.yaml define donde estan los proyectos del monorepo
```

---

## 2. Turborepo — El orquestador del monorepo

```
Sin Turborepo:                       Con Turborepo:

  pnpm run build --filter api        turbo build
  (esperar...)                           │
  pnpm run build --filter web            ├── build api ──┐
  (esperar...)                           │               ├── En paralelo
  pnpm run lint --filter api             ├── build web ──┘
  (esperar...)                           │
  pnpm run lint --filter web             └── Si nada cambio: usa CACHE
  (esperar...)                               (0 segundos)

  Todo secuencial                    Paralelo + cache
  4 tareas = 4 esperas              4 tareas = 1 espera (o 0 con cache)
```

### Que es

Una herramienta que **ejecuta tareas** (build, lint, test, dev) en todos los
proyectos de un monorepo de forma inteligente.

### Por que lo necesitas

Sin Turborepo, en un monorepo con 2 proyectos tendrias que ejecutar cada
comando manualmente en cada workspace. Con 5 workspaces seria un desastre.

Turborepo resuelve 3 problemas:

- **Ejecucion en paralelo**: ejecuta tareas que no dependen entre si al mismo tiempo
- **Cache**: si no cambiaste nada en un workspace, no vuelve a ejecutar la tarea
- **Dependencias entre tareas**: sabe que para hacer build de web, primero necesita build de api (si hay dependencia)

### Como funciona

```
turbo build
    │
    ▼
┌────────────────────────┐
│  Lee turbo.json        │ ← "que tareas existen y como se relacionan"
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  Revisa que cambio     │ ← "api cambio, web no"
└───────────┬────────────┘
            │
    ┌───────┴────────┐
    ▼                ▼
 api: build       web: build
 (ejecuta)        (CACHE, nada cambio, 0s)
```

### turbo.json — La configuracion

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

- `"dependsOn": ["^build"]` — antes de build, haz build de las dependencias
- `"outputs"` — que carpetas guardar en cache
- `"cache": false` — dev no se cachea (es un servidor vivo)
- `"persistent": true` — el comando no termina (se queda corriendo)

### Comandos

```bash
turbo build                # Build en todos los workspaces (paralelo + cache)
turbo lint                 # Lint en todos
turbo dev                  # Dev en todos (sin cache)
turbo build --filter=api   # Solo en api
```

```
RECUERDA:
-> Turborepo no instala paquetes ni ejecuta codigo — ORQUESTA tareas
-> Ejecuta en paralelo lo que puede y cachea lo que no cambio
-> turbo.json define que tareas existen y como dependen entre si
```

---

## 3. Biome — Linting y formateo en uno

```
Antes (2 herramientas):              Ahora (1 herramienta):

┌──────────┐   ┌───────────┐        ┌──────────────────┐
│  ESLint  │ + │ Prettier  │        │      Biome       │
│          │   │           │        │                  │
│ Analiza  │   │ Formatea  │        │ Analiza          │
│ errores  │   │ codigo    │        │ Y formatea       │
│          │   │           │        │                  │
│ .eslintrc│   │.prettierrc│        │ biome.json       │
│ plugins  │   │           │        │ (un solo archivo)│
│ configs  │   │           │        │                  │
└──────────┘   └───────────┘        └──────────────────┘
     │               │                      │
  Lento          A veces              100x mas rapido
  (JS)           conflictos           (escrito en Rust)
                 con ESLint           Sin conflictos
```

### Que es

Una herramienta que hace **linting** (detectar errores y malas practicas) y
**formateo** (ordenar el codigo bonito) al mismo tiempo.

### Por que sustituye a ESLint + Prettier

- **Una sola herramienta**: en vez de configurar ESLint Y Prettier por separado
  (y que a veces se peleen entre ellos), Biome hace las dos cosas
- **Velocidad**: Biome esta escrito en Rust, ESLint en JavaScript. La diferencia
  es brutal — Biome es ~100x mas rapido en proyectos grandes
- **Configuracion minima**: un solo `biome.json` frente a `.eslintrc` + `.prettierrc`
  + plugins + configs de compatibilidad

### El problema clasico de ESLint + Prettier

```
ESLint dice:  "Usa comillas simples"
Prettier dice: "Usa comillas dobles"
    │
    ▼
Conflicto ──> Necesitas eslint-config-prettier para que no se peleen
              + eslint-plugin-prettier para que se integren
              + 3 archivos de config
              + 15 minutos de dolor

Biome: "Yo hago las dos cosas, no hay conflicto. biome.json y listo."
```

### biome.json — La configuracion

```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  }
}
```

### Comandos

```bash
biome check .              # Lint + format check (no modifica archivos)
biome check --write .      # Lint + format (corrige automaticamente)
biome lint .               # Solo lint
biome format .             # Solo format
```

### Que detecta Biome (ejemplos)

```typescript
// Biome te avisa de:

let x = 5             // "Usa const, no reasignas x"
x == '5'              // "Usa === en vez de =="
if (true) {}          // "Bloque vacio"
import { useState } from 'react'
// (si no usas useState) // "Importacion sin usar"
```

```
RECUERDA:
-> Biome = ESLint + Prettier en una sola herramienta
-> Un solo archivo de config (biome.json), sin conflictos, sin plugins
-> 100x mas rapido que ESLint porque esta escrito en Rust
```

---

## 4. Como encajan las 3 herramientas juntas

```
┌──────────────────────────────────────────────────┐
│              Monorepo (tu proyecto)               │
│                                                  │
│   pnpm                                           │
│   └── Gestiona paquetes y workspaces             │
│       "Instala dependencias, sabe donde esta     │
│        cada proyecto"                            │
│                                                  │
│   Turborepo                                      │
│   └── Orquesta tareas entre workspaces           │
│       "Ejecuta build/lint/dev en paralelo        │
│        y cachea resultados"                      │
│                                                  │
│   Biome                                          │
│   └── Analiza y formatea el codigo               │
│       "Revisa que el codigo este limpio           │
│        y bien formateado"                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Flujo real en el proyecto

```
Tu escribes codigo
    │
    ▼
turbo lint              ← Turborepo dice: "hay que hacer lint en api y web"
    │
    ├── apps/api ──> biome check .    ← Biome revisa el backend
    │                                    (en paralelo)
    └── apps/web ──> biome check .    ← Biome revisa el frontend
    │
    ▼
turbo build             ← Turborepo dice: "hay que hacer build"
    │
    ├── apps/api ──> tsc + build      ← Build del backend
    │                (CACHE si no cambio nada)
    └── apps/web ──> next build       ← Build del frontend
```

### Resumen de reemplazos

```
┌─────────────────────┬───────────────────┬────────────────────────┐
│     Herramienta     │   Reemplaza a     │     Por que            │
├─────────────────────┼───────────────────┼────────────────────────┤
│ pnpm                │ npm / yarn        │ Mas rapido, menos disco│
│                     │                   │ Workspaces nativos     │
├─────────────────────┼───────────────────┼────────────────────────┤
│ Turborepo           │ Scripts manuales  │ Paralelo + cache       │
│                     │ Lerna / Nx        │ Config minima          │
├─────────────────────┼───────────────────┼────────────────────────┤
│ Biome               │ ESLint + Prettier │ 1 herramienta, 100x   │
│                     │                   │ mas rapido, sin        │
│                     │                   │ conflictos             │
└─────────────────────┴───────────────────┴────────────────────────┘
```

```
RECUERDA:
-> pnpm gestiona paquetes (instalar, workspaces)
-> Turborepo gestiona tareas (ejecutar, paralelizar, cachear)
-> Biome gestiona calidad de codigo (lint + format)
-> Cada una tiene un rol claro, no se solapan
```

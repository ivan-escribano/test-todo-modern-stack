# plan.md

# Enfoque general

El proyecto se desarrollará de forma progresiva, priorizando el aprendizaje y la comprensión de cada decisión antes de avanzar a la siguiente fase.

La idea no es construir la aplicación de la forma más rápida posible, sino utilizar este proyecto como base práctica para aprender un stack moderno fullstack con una estructura ordenada y reutilizable.

---

# Plan de trabajo

## Fase 1 — Configuración inicial del proyecto

Primero se realizará la configuración base necesaria para todo el proyecto.

Esta fase incluirá la preparación del entorno y de las herramientas principales que servirán como base del desarrollo, como la gestión del monorepo, el formateo, el linting y la organización general del workspace.

El objetivo aquí es dejar una base limpia, consistente y lista para trabajar correctamente desde el inicio.

---

## Fase 2 — Estructura del proyecto y arquitectura

Una vez preparada la base del proyecto, se definirá la estructura general de carpetas y la organización del código.

La prioridad será mantener una arquitectura sencilla, clara y bien ordenada. Se buscará una estructura que permita crecer sin introducir complejidad innecesaria desde el principio.

La intención es encontrar un equilibrio entre simplicidad y escalabilidad, apostando por una organización modular que siga siendo fácil de entender y mantener.

---

## Fase 3 — Base conceptual del backend

Antes de comenzar con la implementación del backend, habrá una fase previa centrada en comprender los conceptos esenciales de las tecnologías principales de esta parte del proyecto.

Dado que la experiencia previa está más orientada a Express y Prisma, esta fase servirá para construir una base sólida sobre Fastify y Drizzle, entendiendo sus conceptos, filosofía y diferencias principales respecto a herramientas ya conocidas.

El objetivo no será profundizar en todos los detalles posibles, sino dominar lo esencial para poder implementar con criterio y no simplemente replicar ejemplos.

Esta fase se apoyará en documentación guiada y explicaciones orientadas al aprendizaje.

---

## Fase 4 — Desarrollo del backend

Una vez entendida la base conceptual, se pasará a la construcción del backend.

Esta etapa estará enfocada en implementar la API de forma progresiva, manteniendo el proyecto como un entorno de aprendizaje práctico.

Aquí el acompañamiento no estará orientado a recibir directamente las soluciones completas, sino a trabajar mediante guía, contexto y apoyo en la toma de decisiones. La idea es avanzar resolviendo cada parte de forma activa, entendiendo el porqué de cada paso y pudiendo profundizar cuando sea necesario.

Además, el backend se apoyará en un `tasks.md` con tareas claras y ordenadas, pensado como hoja de ruta educativa para avanzar paso a paso.

---

## Fase 5 — Desarrollo del frontend

Después del backend, se abordará la parte del frontend.

En esta fase no será necesaria una base educativa tan marcada como en el backend, ya que existe más experiencia previa con React, Next.js, Tailwind y shadcn/ui.

Por tanto, el enfoque aquí será más práctico y orientado a implementación, manteniendo igualmente una estructura ordenada y buenas decisiones de organización.

El frontend se desarrollará como la capa encargada de consumir la API y ofrecer una experiencia clara para gestionar las tareas del sistema.

---

## Fase 6 — Integración frontend-backend

Una vez finalizados el backend y el frontend de forma independiente, se abordará la integración completa entre ambas partes.

Esta fase se centrará en conectar el frontend con la API real, verificar que la comunicación funcione correctamente y resolver cualquier ajuste necesario para que el sistema funcione como un todo coherente.

---

## Fase 7 — Testing

El testing se aplicará tanto al backend como al frontend.

Se utilizarán las herramientas definidas en el stack (Vitest para tests unitarios y de integración, Playwright para tests end-to-end) para validar el comportamiento del sistema de forma progresiva.

El objetivo no será alcanzar una cobertura exhaustiva, sino aprender a escribir tests útiles que aporten confianza sobre el funcionamiento del proyecto.

---

## Fase 8 — Despliegue

Como fase final, se abordará el despliegue de la aplicación.

Las tecnologías y plataformas concretas se definirán en ese momento, adaptándose a las necesidades del proyecto y al estado del ecosistema disponible.

El objetivo será cerrar el ciclo completo del proyecto, llevando la aplicación desde el entorno local hasta un entorno accesible.

---

# Forma de trabajo durante el proyecto

El proyecto seguirá una dinámica guiada y práctica:

- avanzar por fases
- entender antes de implementar
- mantener una base ordenada desde el inicio
- evitar complejidad innecesaria
- apoyarse en tareas concretas para ejecutar cada bloque de trabajo
- usar el proyecto como herramienta real de aprendizaje

No se busca delegar toda la construcción, sino utilizar la guía como apoyo para aprender mejor, resolver dudas y reforzar criterio técnico durante el proceso.

---

# Estructura recomendada del proyecto

Para este proyecto se recomienda una estructura de monorepo simple, clara y escalable, manteniendo la separación entre aplicaciones ejecutables y código compartido.

```text
/
|-- apps/
|   |-- api/
|   `-- web/
|-- packages/
|   `-- contracts/
|-- .docs/
|-- package.json
|-- pnpm-workspace.yaml
|-- turbo.json
|-- tsconfig.json
`-- biome.json
```

## Criterio de organización

- `apps/` contendrá las aplicaciones ejecutables del sistema.
- `apps/api` será el backend con Fastify.
- `apps/web` será el frontend con Next.js.
- `packages/` contendrá código o configuración compartida entre workspaces.
- `packages/contracts` se usará para DTOs, tipos compartidos y contratos entre frontend y backend.

La idea es mantener desde el principio una separación clara entre lo que se ejecuta y lo que se comparte. Esto permite crecer sin mezclar responsabilidades y facilita el uso del workspace de `pnpm` y la orquestación con Turborepo.

## Punto de partida recomendado

Aunque el monorepo puede crecer en el futuro con más packages compartidos, para esta fase inicial se recomienda empezar solo con:

- `apps/api`
- `apps/web`
- `packages/contracts`

Con esto se cubre la necesidad real del proyecto sin introducir estructura vacía demasiado pronto.

## Criterio para el backend

En el backend se recomienda una organización por módulos o features, en lugar de separar todo únicamente por capas técnicas globales.

Ejemplo recomendado:

```text
apps/api/src/modules/todos/
  todos.routes.ts
  todos.schemas.ts
  todos.service.ts
  todos.repository.ts
```

Este enfoque facilita:

- entender cada funcionalidad como una unidad
- mantener juntas sus rutas, validación y lógica
- escalar mejor si en el futuro aparecen nuevos módulos

## Criterio para el frontend

En el frontend se recomienda una estructura ligera y pragmática, sin sobrearquitectura inicial.

Ejemplo orientativo:

```text
apps/web/src/
  app/
  components/
  services/
  lib/
  hooks/
```

La prioridad es mantener claridad, separación básica de responsabilidades y facilidad de evolución a medida que el proyecto crezca.

---

# Resultado esperado

Al finalizar este proyecto, el objetivo no será únicamente tener una ToDo App funcional, sino haber construido una base clara sobre:

- cómo organizar un proyecto fullstack moderno
- cómo estructurar un backend con tecnologías nuevas
- cómo trabajar con una arquitectura limpia y sencilla
- cómo convertir un proyecto pequeño en una base válida para proyectos mayores

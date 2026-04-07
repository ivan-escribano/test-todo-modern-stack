# Overview

El objetivo es desarrollar una aplicación tipo **ToDo App** como proyecto base de aprendizaje, enfocada en el uso de tecnologías modernas (2026).

Esta aplicación servirá como entorno práctico para entender, implementar y consolidar conceptos clave que posteriormente podrán escalarse a proyectos más complejos.

---

# Objetivo del proyecto

- Aprender y aplicar un stack moderno
- Construir una base sólida para futuros proyectos más avanzados
- Entender cómo estructurar una aplicación fullstack desde cero
- Priorizar el aprendizaje práctico sobre la automatización

---

# Alcance funcional (MVP)

La aplicación consistirá en un **CRUD básico de tareas (ToDo)**:

- Crear tareas
- Leer tareas
- Actualizar tareas
- Eliminar tareas

---

# Enfoque de desarrollo

El desarrollo estará orientado al aprendizaje progresivo:

- Implementación paso a paso
- Comprensión de conceptos antes que velocidad
- Apoyo en documentación oficial
- Uso del proyecto como entorno de práctica y experimentación

No se busca automatizar el desarrollo, sino entender cada parte del proceso.

---

# Arquitectura

La aplicación será **fullstack**, separada en dos partes principales:

## Frontend

- Interfaz de usuario para gestionar tareas
- Comunicación con el backend mediante API

## Backend

- Exposición de una API para la gestión de tareas
- Manejo de la lógica de negocio
- Persistencia de datos

---

# Principios clave

- Simplicidad sobre complejidad innecesaria
- Base sólida antes de añadir nuevas funcionalidades
- Aprender haciendo en lugar de replicar soluciones completas
- Modularidad desde el inicio

---

# Evolución futura (fuera del MVP)

- Ampliación de funcionalidades
- Mejora de la arquitectura
- Integración de nuevas tecnologías del stack
- Aplicación de buenas prácticas de producción

---

# Tech Stack (2026)

## Frontend

- **React**  
  Librería para la construcción de interfaces de usuario.

- **Next.js**  
  Framework sobre React que aporta routing, renderizado en servidor y una mejor organización del proyecto.

- **TypeScript**  
  Superset de JavaScript con tipado estático. Uso en modo estricto.

- **Tailwind CSS v4**  
  Framework de estilos basado en utilidades para construir interfaces de forma rápida y consistente.

- **shadcn/ui**  
  Sistema de componentes reutilizables con control total sobre el código.

---

## Backend

- **Node.js**  
  Entorno de ejecución de JavaScript en el servidor.

- **Fastify**  
  Framework backend centrado en rendimiento y simplicidad, con soporte para validación y estructura modular.

---

## Base de datos

- **PostgreSQL (local)**  
  Base de datos relacional gestionada en entorno local mediante **pgAdmin**.

- **Drizzle ORM**  
  ORM ligero orientado a SQL, con buena integración en TypeScript.

> En esta fase inicial no se utilizará Supabase, con el objetivo de comprender mejor el funcionamiento de la base de datos en local.

---

## Herramientas

- **pnpm**  
  Gestor de paquetes eficiente y preparado para monorepos.

- **Biome**  
  Herramienta unificada para linting y formateo.

- **Turborepo**  
  Orquestador de monorepos para la gestión de tareas y builds.

---

## Testing

- **Vitest**  
  Testing de unidades e integración.

- **Playwright**  
  Testing end-to-end en múltiples navegadores.

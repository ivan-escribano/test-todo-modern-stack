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

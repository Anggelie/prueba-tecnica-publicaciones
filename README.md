# Prueba tecnica - Gestion de publicaciones

Aplicacion web CRUD para administrar publicaciones. Incluye una API REST con NestJS, persistencia en MongoDB y una interfaz React responsive para crear, listar, ver detalle, editar y eliminar publicaciones de forma logica.

## Tecnologias usadas

- Frontend: React, TypeScript, Vite
- Backend: NestJS, TypeScript
- Base de datos: MongoDB con Mongoose
- Validaciones: class-validator y ValidationPipe
- Control de versiones: Git

## Requisitos previos

- Node.js 22 o superior
- npm
- MongoDB local o una base de datos MongoDB Atlas
- Git

## Estructura del proyecto

```txt
backend/
  src/
    publicaciones/
      dto/
      schemas/
      publicaciones.controller.ts
      publicaciones.service.ts
      publicaciones.module.ts
  .env.example

frontend/
  src/
    api/
    App.tsx
    types.ts
  .env.example
```

## Configuracion de variables de entorno

No se incluyen archivos `.env` reales en el repositorio.

Backend:

```bash
cd backend
cp .env.example .env
```

Contenido esperado:

```env
MONGODB_URI=mongodb://localhost:27017/prueba_publicaciones
PORT=3000
```

Si se usa MongoDB Atlas, reemplazar `MONGODB_URI` en el archivo `.env` local con la cadena privada correspondiente. No subir ese archivo a GitHub.

Frontend:

```bash
cd frontend
cp .env.example .env
```

Contenido esperado:

```env
VITE_API_URL=http://localhost:3000
```

## Instalacion

Instalar dependencias del backend:

```bash
cd backend
npm install
```

Instalar dependencias del frontend:

```bash
cd frontend
npm install
```

## Ejecucion local

Iniciar el backend:

```bash
cd backend
npm run start:dev
```

La API queda disponible en:

```txt
http://localhost:3000
```

Iniciar el frontend en otra terminal:

```bash
cd frontend
npm run dev
```

La aplicacion queda disponible normalmente en:

```txt
http://localhost:5173
```

## Endpoints principales

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| GET | `/publicaciones` | Lista publicaciones no eliminadas |
| GET | `/publicaciones/:id` | Obtiene el detalle de una publicacion |
| POST | `/publicaciones` | Crea una publicacion |
| PATCH | `/publicaciones/:id` | Actualiza una publicacion |
| DELETE | `/publicaciones/:id` | Elimina logicamente una publicacion |

Ejemplo de body para crear o actualizar:

```json
{
  "titulo": "Primera publicacion",
  "descripcion": "Descripcion de prueba para la publicacion.",
  "autor": "Juan Perez",
  "fechaCreacion": "2026-05-18T00:00:00.000Z",
  "estado": "Activo"
}
```

## Notas de implementacion

- La eliminacion es logica: el backend asigna `deletedAt` y cambia el estado a `Inactivo`.
- El listado excluye publicaciones con `deletedAt`.
- El backend valida DTOs con `class-validator`.
- Los IDs de MongoDB se validan antes de consultar la base de datos.
- El frontend muestra estados de carga, mensajes de error y confirmacion de operaciones.
- Los formularios tienen validaciones basicas en frontend y backend.

## Verificacion antes de entregar

Ejecutar:

```bash
cd backend
npm run build
```

```bash
cd frontend
npm run build
```

Tambien se recomienda probar el flujo completo desde la interfaz:

- Crear una publicacion.
- Verla en el listado.
- Abrir el detalle.
- Editarla.
- Eliminarla logicamente.
- Confirmar que ya no aparece en el listado.

## Archivos para entrega .zip

Incluir todo el proyecto excepto carpetas generadas o dependencias:

- `backend/`
- `frontend/`
- `.gitignore`
- `README.md`

No incluir:

- `node_modules/`
- `backend/.env`
- `frontend/.env`
- `backend/dist/`
- `frontend/dist/`

## Notas para el evaluador

El proyecto esta pensado para correr localmente con MongoDB local o MongoDB Atlas configurado desde `.env`. Las credenciales reales no forman parte del repositorio por seguridad.

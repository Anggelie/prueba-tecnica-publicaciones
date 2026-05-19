# Prueba técnica - Gestión de publicaciones

Aplicación web CRUD para administrar publicaciones. Incluye una API REST con NestJS, persistencia en MongoDB y una interfaz React responsive para crear, listar, ver detalle, editar y eliminar publicaciones de forma lógica.

## Tecnologias usadas

- Frontend: React, TypeScript, Vite
- Backend: NestJS, TypeScript
- Base de datos: MongoDB con Mongoose
- Validaciones: class-validator y ValidationPipe
- Control de versiones: Git

## Requisitos previos

- Node.js 
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

Frontend:

```bash
cd frontend
cp .env.example .env
```

Contenido esperado:

```env
VITE_API_URL=http://localhost:3000
```

## Instalación

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

## Ejecución local

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

La aplicación queda disponible normalmente en:

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
  "titulo": "Primera publicación",
  "descripcion": "Descripcion de prueba para la publicación.",
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

Ejecutar:

```bash
cd backend
npm run build
```

```bash
cd frontend
npm run build
```


## Notas para el evaluador

El proyecto esta pensado para correr localmente con MongoDB local o MongoDB Atlas configurado desde `.env`. Las credenciales reales no forman parte del repositorio por seguridad.

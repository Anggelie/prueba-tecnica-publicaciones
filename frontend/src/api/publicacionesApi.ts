import type { Publicacion, PublicacionForm } from '../types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type PublicacionPayload = PublicacionForm & {
  fechaCreacion: string
}

async function consultarApi<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    headers: {
      'Content-Type': 'application/json',
      ...opciones?.headers,
    },
    ...opciones,
  })

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => null)
    const detalle = Array.isArray(cuerpo?.message)
      ? cuerpo.message.join(', ')
      : cuerpo?.message
    throw new Error(detalle ?? 'Ocurrio un error al procesar la solicitud')
  }

  if (respuesta.status === 204) {
    return null as T
  }

  return respuesta.json()
}

export function listarPublicaciones() {
  return consultarApi<Publicacion[]>('/publicaciones')
}

export function obtenerPublicacion(id: string) {
  return consultarApi<Publicacion>(`/publicaciones/${id}`)
}

export function crearPublicacion(payload: PublicacionPayload) {
  return consultarApi<Publicacion>('/publicaciones', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function actualizarPublicacion(id: string, payload: PublicacionPayload) {
  return consultarApi<Publicacion>(`/publicaciones/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function eliminarPublicacionApi(id: string) {
  return consultarApi(`/publicaciones/${id}`, {
    method: 'DELETE',
  })
}

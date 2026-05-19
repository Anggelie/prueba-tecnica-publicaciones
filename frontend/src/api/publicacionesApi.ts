import type { Publicacion, PublicacionForm } from '../types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const REQUEST_TIMEOUT_MS = 10000

type PublicacionPayload = PublicacionForm & {
  fechaCreacion: string
}

async function consultarApi<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let respuesta: Response

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      headers: {
        'Content-Type': 'application/json',
        ...opciones?.headers,
      },
      ...opciones,
      signal: controller.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(
        'La API no respondio a tiempo. Revisa que el backend este conectado a MongoDB.',
        { cause: error },
      )
    }

    throw new Error('No se pudo conectar con la API. Revisa que el backend este activo.', {
      cause: error,
    })
  } finally {
    window.clearTimeout(timeoutId)
  }

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

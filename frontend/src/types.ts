export type EstadoPublicacion = 'Activo' | 'Inactivo'

export type Publicacion = {
  _id: string
  titulo: string
  descripcion: string
  autor: string
  fechaCreacion: string
  estado: EstadoPublicacion
  deletedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export type PublicacionForm = {
  titulo: string
  descripcion: string
  autor: string
  fechaCreacion: string
  estado: EstadoPublicacion
}

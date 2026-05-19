import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  actualizarPublicacion,
  crearPublicacion,
  eliminarPublicacionApi,
  listarPublicaciones,
  obtenerPublicacion,
} from './api/publicacionesApi'
import type { EstadoPublicacion, Publicacion, PublicacionForm } from './types'
import './App.css'

type Vista = 'lista' | 'detalle' | 'crear' | 'editar'

const formularioInicial: PublicacionForm = {
  titulo: '',
  descripcion: '',
  autor: '',
  fechaCreacion: new Date().toISOString().slice(0, 10),
  estado: 'Activo',
}

function App() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [publicacionSeleccionada, setPublicacionSeleccionada] =
    useState<Publicacion | null>(null)
  const [formulario, setFormulario] = useState<PublicacionForm>(formularioInicial)
  const [vista, setVista] = useState<Vista>('lista')
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const esEdicion = vista === 'editar'

  const publicacionesActivas = useMemo(
    () => publicaciones.filter((publicacion) => publicacion.estado === 'Activo'),
    [publicaciones],
  )

  useEffect(() => {
    cargarPublicaciones()
  }, [])

  async function cargarPublicaciones() {
    setCargando(true)
    setError('')
    try {
      const datos = await listarPublicaciones()
      setPublicaciones(datos)
    } catch (err) {
      setError(obtenerMensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  async function verDetalle(id: string) {
    setCargando(true)
    setError('')
    setMensaje('')
    try {
      const datos = await obtenerPublicacion(id)
      setPublicacionSeleccionada(datos)
      setVista('detalle')
    } catch (err) {
      setError(obtenerMensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  function abrirCrear() {
    setFormulario(formularioInicial)
    setPublicacionSeleccionada(null)
    setError('')
    setMensaje('')
    setVista('crear')
  }

  function abrirEditar(publicacion: Publicacion) {
    setFormulario({
      titulo: publicacion.titulo,
      descripcion: publicacion.descripcion,
      autor: publicacion.autor,
      fechaCreacion: publicacion.fechaCreacion.slice(0, 10),
      estado: publicacion.estado,
    })
    setPublicacionSeleccionada(publicacion)
    setError('')
    setMensaje('')
    setVista('editar')
  }

  async function guardarPublicacion(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const validacion = validarFormulario(formulario)

    if (validacion) {
      setError(validacion)
      return
    }

    setGuardando(true)
    setError('')
    setMensaje('')

    const cuerpo = {
      ...formulario,
      fechaCreacion: new Date(`${formulario.fechaCreacion}T00:00:00`).toISOString(),
    }

    try {
      if (esEdicion && publicacionSeleccionada) {
        await actualizarPublicacion(publicacionSeleccionada._id, cuerpo)
        setMensaje('Publicacion actualizada correctamente.')
      } else {
        await crearPublicacion(cuerpo)
        setMensaje('Publicacion creada correctamente.')
      }

      setVista('lista')
      setFormulario(formularioInicial)
      setPublicacionSeleccionada(null)
      await cargarPublicaciones()
    } catch (err) {
      setError(obtenerMensajeError(err))
    } finally {
      setGuardando(false)
    }
  }

  async function eliminarPublicacion(publicacion: Publicacion) {
    const confirmar = window.confirm(
      `Se eliminara logicamente la publicacion "${publicacion.titulo}".`,
    )

    if (!confirmar) {
      return
    }

    setCargando(true)
    setError('')
    setMensaje('')
    try {
      await eliminarPublicacionApi(publicacion._id)
      setMensaje('Publicacion eliminada correctamente.')
      if (publicacionSeleccionada?._id === publicacion._id) {
        setPublicacionSeleccionada(null)
        setVista('lista')
      }
      await cargarPublicaciones()
    } catch (err) {
      setError(obtenerMensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Gestion de publicaciones</p>
          <h1>Publicaciones</h1>
        </div>
        <button className="primary-button" type="button" onClick={abrirCrear}>
          Nueva publicacion
        </button>
      </header>

      <section className="summary-grid" aria-label="Resumen de publicaciones">
        <div>
          <span>Total</span>
          <strong>{publicaciones.length}</strong>
        </div>
        <div>
          <span>Activas</span>
          <strong>{publicacionesActivas.length}</strong>
        </div>
        <div>
          <span>Inactivas</span>
          <strong>{publicaciones.length - publicacionesActivas.length}</strong>
        </div>
      </section>

      {error && <div className="alert alert-error">{error}</div>}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      {(vista === 'crear' || vista === 'editar') && (
        <section className="panel">
          <div className="panel-heading">
            <h2>{esEdicion ? 'Editar publicacion' : 'Crear publicacion'}</h2>
            <button className="ghost-button" type="button" onClick={() => setVista('lista')}>
              Cancelar
            </button>
          </div>

          <form className="publication-form" onSubmit={guardarPublicacion}>
            <label>
              Titulo
              <input
                type="text"
                value={formulario.titulo}
                maxLength={120}
                onChange={(evento) =>
                  setFormulario({ ...formulario, titulo: evento.target.value })
                }
                required
              />
            </label>

            <label>
              Autor
              <input
                type="text"
                value={formulario.autor}
                maxLength={80}
                onChange={(evento) =>
                  setFormulario({ ...formulario, autor: evento.target.value })
                }
                required
              />
            </label>

            <label>
              Fecha de creacion
              <input
                type="date"
                value={formulario.fechaCreacion}
                onChange={(evento) =>
                  setFormulario({ ...formulario, fechaCreacion: evento.target.value })
                }
                required
              />
            </label>

            <label>
              Estado
              <select
                value={formulario.estado}
                onChange={(evento) =>
                  setFormulario({
                    ...formulario,
                    estado: evento.target.value as EstadoPublicacion,
                  })
                }
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </label>

            <label className="full-width">
              Descripcion
              <textarea
                value={formulario.descripcion}
                rows={5}
                maxLength={1000}
                onChange={(evento) =>
                  setFormulario({ ...formulario, descripcion: evento.target.value })
                }
                required
              />
            </label>

            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </section>
      )}

      {vista === 'detalle' && publicacionSeleccionada && (
        <section className="panel">
          <div className="panel-heading">
            <h2>Detalle de publicacion</h2>
            <button className="ghost-button" type="button" onClick={() => setVista('lista')}>
              Volver
            </button>
          </div>

          <div className="detail-grid">
            <div>
              <span>Titulo</span>
              <strong>{publicacionSeleccionada.titulo}</strong>
            </div>
            <div>
              <span>Autor</span>
              <strong>{publicacionSeleccionada.autor}</strong>
            </div>
            <div>
              <span>Fecha de creacion</span>
              <strong>{formatearFecha(publicacionSeleccionada.fechaCreacion)}</strong>
            </div>
            <div>
              <span>Estado</span>
              <strong>{publicacionSeleccionada.estado}</strong>
            </div>
            <div className="full-width">
              <span>Descripcion</span>
              <p>{publicacionSeleccionada.descripcion}</p>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => abrirEditar(publicacionSeleccionada)}
            >
              Editar
            </button>
            <button
              className="danger-button"
              type="button"
              onClick={() => eliminarPublicacion(publicacionSeleccionada)}
            >
              Eliminar
            </button>
          </div>
        </section>
      )}

      {vista === 'lista' && (
        <section className="panel">
          <div className="panel-heading">
            <h2>Listado</h2>
            <button className="ghost-button" type="button" onClick={cargarPublicaciones}>
              Actualizar
            </button>
          </div>

          {cargando ? (
            <div className="empty-state">Cargando publicaciones...</div>
          ) : publicaciones.length === 0 ? (
            <div className="empty-state">No hay publicaciones registradas.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Titulo</th>
                    <th>Autor</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {publicaciones.map((publicacion) => (
                    <tr key={publicacion._id}>
                      <td>{publicacion.titulo}</td>
                      <td>{publicacion.autor}</td>
                      <td>{formatearFecha(publicacion.fechaCreacion)}</td>
                      <td>
                        <span className={`status ${publicacion.estado.toLowerCase()}`}>
                          {publicacion.estado}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button type="button" onClick={() => verDetalle(publicacion._id)}>
                            Ver
                          </button>
                          <button type="button" onClick={() => abrirEditar(publicacion)}>
                            Editar
                          </button>
                          <button
                            className="danger-link"
                            type="button"
                            onClick={() => eliminarPublicacion(publicacion)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  )
}

function validarFormulario(formulario: PublicacionForm) {
  if (formulario.titulo.trim().length < 3) {
    return 'El titulo debe tener al menos 3 caracteres.'
  }

  if (formulario.autor.trim().length < 3) {
    return 'El autor debe tener al menos 3 caracteres.'
  }

  if (formulario.descripcion.trim().length < 10) {
    return 'La descripcion debe tener al menos 10 caracteres.'
  }

  if (!formulario.fechaCreacion) {
    return 'La fecha de creacion es obligatoria.'
  }

  return ''
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat('es-GT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(fecha))
}

function obtenerMensajeError(error: unknown) {
  return error instanceof Error ? error.message : 'Ocurrio un error inesperado'
}

export default App

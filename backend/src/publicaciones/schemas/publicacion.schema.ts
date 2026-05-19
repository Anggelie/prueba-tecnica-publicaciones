import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EstadoPublicacion } from '../dto/create-publicacion.dto';

export type PublicacionDocument = HydratedDocument<Publicacion>;

@Schema({
  collection: 'publicaciones',
  timestamps: true,
  versionKey: false,
})
export class Publicacion {
  @Prop({ required: true, trim: true })
  titulo: string;

  @Prop({ required: true, trim: true })
  descripcion: string;

  @Prop({ required: true, trim: true })
  autor: string;

  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @Prop({
    enum: EstadoPublicacion,
    default: EstadoPublicacion.Activo,
  })
  estado: EstadoPublicacion;

  // Se usa para eliminación lógica sin perder el historial del registro.
  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);

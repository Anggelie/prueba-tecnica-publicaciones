import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreatePublicacionDto,
  EstadoPublicacion,
} from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import {
  Publicacion,
  PublicacionDocument,
} from './schemas/publicacion.schema';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name)
    private readonly publicacionModel: Model<PublicacionDocument>,
  ) {}

  async crear(createPublicacionDto: CreatePublicacionDto) {
    const publicacion = new this.publicacionModel(createPublicacionDto);
    return publicacion.save();
  }

  async listar() {
    return this.publicacionModel
      .find({ deletedAt: null })
      .sort({ fechaCreacion: -1 })
      .exec();
  }

  async obtenerPorId(id: string) {
    const publicacion = await this.publicacionModel
      .findOne({ _id: id, deletedAt: null })
      .exec();

    if (!publicacion) {
      throw new NotFoundException('Publicacion no encontrada');
    }

    return publicacion;
  }

  async actualizar(id: string, updatePublicacionDto: UpdatePublicacionDto) {
    const publicacion = await this.publicacionModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        updatePublicacionDto,
        { new: true, runValidators: true },
      )
      .exec();

    if (!publicacion) {
      throw new NotFoundException('Publicacion no encontrada');
    }

    return publicacion;
  }

  async eliminar(id: string) {
    const publicacion = await this.publicacionModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
          estado: EstadoPublicacion.Inactivo,
          deletedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!publicacion) {
      throw new NotFoundException('Publicacion no encontrada');
    }

    return {
      mensaje: 'Publicacion eliminada correctamente',
      publicacion,
    };
  }
}

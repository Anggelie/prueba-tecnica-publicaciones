import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { PublicacionesService } from './publicaciones.service';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  crear(@Body() createPublicacionDto: CreatePublicacionDto) {
    return this.publicacionesService.crear(createPublicacionDto);
  }

  @Get()
  listar() {
    return this.publicacionesService.listar();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.publicacionesService.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(
    @Param('id') id: string,
    @Body() updatePublicacionDto: UpdatePublicacionDto,
  ) {
    return this.publicacionesService.actualizar(id, updatePublicacionDto);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.publicacionesService.eliminar(id);
  }
}

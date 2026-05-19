import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum EstadoPublicacion {
  Activo = 'Activo',
  Inactivo = 'Inactivo',
}

export class CreatePublicacionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(120)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  autor: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaCreacion?: Date;

  @IsOptional()
  @IsEnum(EstadoPublicacion)
  estado?: EstadoPublicacion;
}

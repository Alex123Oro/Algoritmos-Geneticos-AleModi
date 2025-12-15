import { IsDateString, IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

// Coinciden con los enums de Prisma: TipoAyuda, Urgencia, EstadoSolicitud
export const TipoAyudaValores = [
  'SIEMBRA',
  'COSECHA',
  'RIEGO',
  'LIMPIEZA_CANAL',
  'CONSTRUCCION',
  'PRESTAMO_HERRAMIENTA',
  'PRESTAMO_ANIMAL',
  'OTRA',
] as const;
export type TipoAyuda = (typeof TipoAyudaValores)[number];

export const UrgenciaValores = ['BAJA', 'MEDIA', 'ALTA'] as const;
export type Urgencia = (typeof UrgenciaValores)[number];

export class CreateSolicitudDto {
  @IsInt()
  @Min(1)
  familiaId: number; // quien pide la ayuda

  @IsIn(TipoAyudaValores)
  tipo: TipoAyuda; // tipo de tarea

  @IsString()
  @IsNotEmpty()
  descripcion: string; // breve descripción

  @IsDateString()
  fechaInicio: Date; // desde cuándo se necesita ayuda

  @IsDateString()
  fechaFin: Date; // hasta cuándo sigue siendo útil

  @IsInt()
  @Min(1)
  horasEstimadas: number;

  @IsIn(UrgenciaValores)
  urgencia: Urgencia; // BAJA, MEDIA, ALTA
}

// Coinciden con los enums de Prisma: TipoAyuda, Urgencia, EstadoSolicitud
export type TipoAyuda =
  | 'SIEMBRA'
  | 'COSECHA'
  | 'RIEGO'
  | 'LIMPIEZA_CANAL'
  | 'CONSTRUCCION'
  | 'PRESTAMO_HERRAMIENTA'
  | 'PRESTAMO_ANIMAL'
  | 'OTRA';

export type Urgencia = 'BAJA' | 'MEDIA' | 'ALTA';

export class CreateSolicitudDto {
  familiaId: number;     // quién pide la ayuda
  tipo: TipoAyuda;       // tipo de tarea
  descripcion: string;   // breve descripción
  fechaInicio: Date;     // desde cuándo se necesita ayuda
  fechaFin: Date;        // hasta cuándo sigue siendo útil
  horasEstimadas: number;
  urgencia: Urgencia;    // BAJA, MEDIA, ALTA
}

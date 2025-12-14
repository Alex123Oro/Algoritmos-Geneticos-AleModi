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
export type EstadoSolicitud = 'PENDIENTE' | 'PLANIFICADA' | 'COMPLETADA' | 'CANCELADA';
export type EstadoAyuda = 'PROGRAMADO' | 'REALIZADO' | 'CANCELADO';

export interface Comunidad {
  id: number;
  nombre: string;
  region: string;
}

export interface Familia {
  id: number;
  nombre: string;
  comunidadId: number;
  miembros: number;
  comunidad?: Comunidad;
  horasDadas?: number;
  horasRecibidas?: number;
}

export interface SolicitudAyuda {
  id: number;
  familiaId: number;
  tipo: TipoAyuda;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  horasEstimadas: number;
  urgencia: Urgencia;
  estado: EstadoSolicitud;
  familia?: Familia & { comunidad?: Comunidad };
}

export interface AyudaAsignada {
  id: number;
  origenId: number;
  destinoId: number;
  solicitudId?: number | null;
  tipo: TipoAyuda;
  fecha: string;
  horas: number;
  estado: EstadoAyuda;
  origen?: Familia;
  destino?: Familia;
  solicitud?: SolicitudAyuda;
}

export interface PlanResponse {
  mensaje: string;
  totalAyudas: number;
  fitness: number;
  detalleFitness: {
    equilibrioAyni: number;
    coberturaSolicitudes: number;
    cargaMaximaPorFamilia: number;
  };
}

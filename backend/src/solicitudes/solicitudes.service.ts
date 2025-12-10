import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateEstadoSolicitudDto } from './dto/update-estado-solicitud.dto';

@Injectable()
export class SolicitudesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateSolicitudDto) {
    return this.prisma.solicitudAyuda.create({
      data,
    });
  }

  // Lista todas, con filtros opcionales
  findAll(params?: {
    familiaId?: number;
    estado?: string;
    urgencia?: string;
  }) {
    const { familiaId, estado, urgencia } = params || {};

    return this.prisma.solicitudAyuda.findMany({
      where: {
        familiaId,
        estado: estado as any,
        urgencia: urgencia as any,
      },
      include: {
        familia: {
          include: {
            comunidad: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.solicitudAyuda.findUnique({
      where: { id },
      include: {
        familia: {
          include: { comunidad: true },
        },
      },
    });
  }

  // Listar solicitudes por comunidad (a través de la familia)
  findByComunidad(comunidadId: number) {
    return this.prisma.solicitudAyuda.findMany({
      where: {
        familia: {
          comunidadId,
        },
      },
      include: {
        familia: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  updateEstado(id: number, data: UpdateEstadoSolicitudDto) {
    return this.prisma.solicitudAyuda.update({
      where: { id },
      data: {
        estado: data.estado as any,
      },
    });
  }
}

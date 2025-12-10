import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAyudaDto } from './dto/create-ayuda.dto';
import { CreateAyudaBatchDto } from './dto/create-ayuda-batch.dto';
import { UpdateEstadoAyudaDto } from './dto/update-estado-ayuda.dto';

@Injectable()
export class AyudasService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAyudaDto) {
    return this.prisma.ayudaAsignada.create({
      data: {
        ...data,
        // si no viene estado, usamos PROGRAMADO
        estado: (data.estado as any) ?? 'PROGRAMADO',
      },
      include: {
        origen: true,
        destino: true,
        solicitud: true,
      },
    });
  }

  // crear muchas ayudas de una sola vez (desde el AG)
  createBatch(batch: CreateAyudaBatchDto) {
    return this.prisma.$transaction(
      batch.ayudas.map((a) =>
        this.prisma.ayudaAsignada.create({
          data: {
            ...a,
            estado: (a.estado as any) ?? 'PROGRAMADO',
          },
        }),
      ),
    );
  }

  // Lista ayudas, con filtros opcionales:
  // familiaId, rol (origen/destino), estado
  findAll(params?: {
    familiaId?: number;
    rol?: 'origen' | 'destino' | 'ambos';
    estado?: string;
  }) {
    const { familiaId, rol = 'ambos', estado } = params || {};

    const where: any = {};

    if (estado) {
      where.estado = estado;
    }

    if (familiaId) {
      if (rol === 'origen') {
        where.origenId = familiaId;
      } else if (rol === 'destino') {
        where.destinoId = familiaId;
      } else {
        where.OR = [{ origenId: familiaId }, { destinoId: familiaId }];
      }
    }

    return this.prisma.ayudaAsignada.findMany({
      where,
      include: {
        origen: true,
        destino: true,
        solicitud: true,
      },
      orderBy: {
        fecha: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.ayudaAsignada.findUnique({
      where: { id },
      include: {
        origen: true,
        destino: true,
        solicitud: true,
      },
    });
  }

  updateEstado(id: number, data: UpdateEstadoAyudaDto) {
    return this.prisma.ayudaAsignada.update({
      where: { id },
      data: {
        estado: data.estado as any,
      },
    });
  }
}

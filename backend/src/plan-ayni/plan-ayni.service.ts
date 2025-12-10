import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { AyudasService } from '../ayudas/ayudas.service';

@Injectable()
export class PlanAyniService {
  private readonly agServiceUrl = 'http://127.0.0.1:8000/optimizar-ayni';

  constructor(
    private readonly http: HttpService,
    private readonly prisma: PrismaService,
    private readonly ayudasService: AyudasService,
  ) {}

  async generarPlan() {
    // 1) Obtener familias
    const familias = await this.prisma.familia.findMany();

    // 2) Obtener solicitudes pendientes
    const solicitudes = await this.prisma.solicitudAyuda.findMany({
      where: {
        estado: 'PENDIENTE',
      },
    });

    if (!familias.length) {
      throw new BadRequestException('No hay familias registradas para generar el plan de ayni.');
    }

    if (!solicitudes.length) {
      throw new BadRequestException('No hay solicitudes PENDIENTE para generar el plan de ayni.');
    }

    // 3) Armar el payload que espera el microservicio Python
    const payload = {
      familias: familias.map((f) => ({
        id: f.id,
        nombre: f.nombre,
        comunidadId: f.comunidadId,
        miembros: f.miembros,
        horasDadas: f.horasDadas,
        horasRecibidas: f.horasRecibidas,
      })),
      solicitudes: solicitudes.map((s) => ({
        id: s.id,
        familiaId: s.familiaId,
        tipo: s.tipo,
        horasEstimadas: s.horasEstimadas,
        urgencia: s.urgencia,
        fechaInicio: s.fechaInicio.toISOString(),
        fechaFin: s.fechaFin.toISOString(),
      })),
      parametros: {
        tamanoPoblacion: 30,
        maxGeneraciones: 50,
      },
    };

    // 4) Llamar al microservicio Python
    const response = await lastValueFrom(
      this.http.post(this.agServiceUrl, payload),
    );

    const { ayudas, fitness, detalleFitness } = response.data;

    if (!ayudas || !Array.isArray(ayudas) || !ayudas.length) {
      throw new BadRequestException(
        'El servicio de optimización no devolvió ayudas válidas.',
      );
    }

    // 5) Guardar las ayudas en la BD usando AyudasService (batch)
    await this.ayudasService.createBatch({
      ayudas: ayudas.map((a: any) => ({
        origenId: a.origenId,
        destinoId: a.destinoId,
        solicitudId: a.solicitudId,
        tipo: a.tipo,
        fecha: a.fecha, // string ISO -> Prisma lo acepta como Date
        horas: a.horas,
      })),
    });

    // 6) (Opcional) Marcar las solicitudes como PLANIFICADA
    const solicitudesIds = Array.from(
      new Set(ayudas.map((a: any) => a.solicitudId)),
    );

    if (solicitudesIds.length) {
      await this.prisma.solicitudAyuda.updateMany({
        where: { id: { in: solicitudesIds } },
        data: { estado: 'PLANIFICADA' },
      });
    }

    // 7) Devolver al frontend un resumen
    return {
      mensaje: 'Plan de ayni generado y ayudas registradas correctamente.',
      totalAyudas: ayudas.length,
      fitness,
      detalleFitness,
    };
  }
}

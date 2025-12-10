import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AyudasService } from './ayudas.service';
import { CreateAyudaDto } from './dto/create-ayuda.dto';
import { CreateAyudaBatchDto } from './dto/create-ayuda-batch.dto';
import { UpdateEstadoAyudaDto } from './dto/update-estado-ayuda.dto';

@Controller('ayudas')
export class AyudasController {
  constructor(private readonly ayudasService: AyudasService) {}

  // Crear una sola ayuda (puede usarse en pruebas o casos manuales)
  @Post()
  create(@Body() dto: CreateAyudaDto) {
    return this.ayudasService.create(dto);
  }

  // Crear un lote de ayudas (desde el Algoritmo Genético)
  @Post('batch')
  createBatch(@Body() dto: CreateAyudaBatchDto) {
    return this.ayudasService.createBatch(dto);
  }

  // GET /ayudas
  // GET /ayudas?familiaId=1
  // GET /ayudas?familiaId=1&rol=origen
  // GET /ayudas?familiaId=1&rol=destino
  // GET /ayudas?estado=PROGRAMADO
  @Get()
  findAll(
    @Query('familiaId') familiaId?: string,
    @Query('rol') rol?: 'origen' | 'destino' | 'ambos',
    @Query('estado') estado?: string,
  ) {
    return this.ayudasService.findAll({
      familiaId: familiaId ? Number(familiaId) : undefined,
      rol,
      estado,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ayudasService.findOne(id);
  }

  // PATCH /ayudas/5/estado
  @Patch(':id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoAyudaDto,
  ) {
    return this.ayudasService.updateEstado(id, dto);
  }
}

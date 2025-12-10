import { Body, Controller, Get, Post } from '@nestjs/common';
import { ComunidadesService } from './comunidades.service';
import { CreateComunidadDto } from './dto/create-comunidad.dto';

@Controller('comunidades')
export class ComunidadesController {
  constructor(private readonly comunidadesService: ComunidadesService) {}

  @Post()
  create(@Body() dto: CreateComunidadDto) {
    return this.comunidadesService.create(dto);
  }

  @Get()
  findAll() {
    return this.comunidadesService.findAll();
  }
}

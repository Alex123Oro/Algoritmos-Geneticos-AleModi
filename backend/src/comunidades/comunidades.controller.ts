import { Body, Controller, Get, Post } from '@nestjs/common';
import { ComunidadesService } from './comunidades.service';
import { CreateComunidadDto } from './dto/create-comunidad.dto';
import { Public } from '../auth/public.decorator';

@Controller('comunidades')
export class ComunidadesController {
  constructor(private readonly comunidadesService: ComunidadesService) {}

  @Post()
  create(@Body() dto: CreateComunidadDto) {
    return this.comunidadesService.create(dto);
  }

  @Public()
  @Get()
  findAll() {
    return this.comunidadesService.findAll();
  }
}

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FamiliasService } from './familias.service';
import { CreateFamiliaDto } from './dto/create-familia.dto';

@Controller('familias')
export class FamiliasController {
  constructor(private readonly familiasService: FamiliasService) {}

  @Post()
  create(@Body() dto: CreateFamiliaDto) {
    return this.familiasService.create(dto);
  }

  // GET /familias  o  GET /familias?comunidadId=1
  @Get()
  findAll(@Query('comunidadId') comunidadId?: string) {
    if (comunidadId) {
      return this.familiasService.findByComunidad(Number(comunidadId));
    }
    return this.familiasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.familiasService.findOne(id);
  }
}

import { Controller, Post } from '@nestjs/common';
import { PlanAyniService } from './plan-ayni.service';

@Controller('plan-ayni')
export class PlanAyniController {
  constructor(private readonly planAyniService: PlanAyniService) {}

  @Post('generar')
  async generar() {
    return this.planAyniService.generarPlan();
  }
}

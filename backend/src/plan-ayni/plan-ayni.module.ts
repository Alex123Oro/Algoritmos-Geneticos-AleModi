import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PlanAyniService } from './plan-ayni.service';
import { PlanAyniController } from './plan-ayni.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AyudasModule } from '../ayudas/ayudas.module';
import { AyudasService } from '../ayudas/ayudas.service';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    AyudasModule,
  ],
  controllers: [PlanAyniController],
  providers: [PlanAyniService, AyudasService],
})
export class PlanAyniModule {}

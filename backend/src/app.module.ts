import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ComunidadesModule } from './comunidades/comunidades.module';
import { FamiliasModule } from './familias/familias.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { AyudasModule } from './ayudas/ayudas.module';
import { PlanAyniModule } from './plan-ayni/plan-ayni.module';

@Module({
  imports: [
    PrismaModule,
    ComunidadesModule,
    FamiliasModule,
    SolicitudesModule,
    AyudasModule,
    PlanAyniModule,
    // aquí luego irán ComunidadesModule, FamiliasModule, etc.
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

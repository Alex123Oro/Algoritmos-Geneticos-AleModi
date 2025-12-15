import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

// Limita acceso a la propia familia salvo que el rol sea ADMIN
@Injectable()
export class FamiliaGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (user?.role === 'ADMIN') return true;
    const paramId = req.params?.id
      ? Number(req.params.id)
      : req.query?.familiaId
        ? Number(req.query.familiaId)
        : undefined;
    if (!user?.familiaId) {
      throw new ForbiddenException('Solo tu familia');
    }
    if (paramId && user.familiaId !== paramId) {
      throw new ForbiddenException('Solo tu familia');
    }
    return true;
  }
}

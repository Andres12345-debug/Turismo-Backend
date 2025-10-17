import { Module } from '@nestjs/common';
import { PublicacionsPublicasService } from './publicacions-publicas.service';
import { PublicacionsPublicasController } from './publicacions-publicas.controller';

@Module({
  providers: [PublicacionsPublicasService],
  controllers: [PublicacionsPublicasController]
})
export class PublicacionsPublicasModule {}

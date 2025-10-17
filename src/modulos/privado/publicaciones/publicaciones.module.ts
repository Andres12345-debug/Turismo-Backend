import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';

@Module({
  providers: [PublicacionesService],
  controllers: [PublicacionesController]
})
export class PublicacionesModule {}

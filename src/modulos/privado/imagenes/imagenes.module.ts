import { Module } from '@nestjs/common';
import { ImagenesService } from './imagenes.service';
import { ImagenesController } from './imagenes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagenesPublicaciones } from 'src/modelos/imagenes_publicacion/imagenes_publicacion';
import { Publicacion } from 'src/modelos/publicacion/publicacion';

@Module({
  imports: [TypeOrmModule.forFeature([ImagenesPublicaciones, Publicacion])], // Asegúrate de incluir las entidades
  providers: [ImagenesService],
  controllers: [ImagenesController],
  exports: [ImagenesService], // Exporta si otro módulo necesita usarlo


})
export class ImagenesModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagenesPublicaciones } from 'src/modelos/imagenes_publicacion/imagenes_publicacion';
import { Publicacion } from 'src/modelos/publicacion/publicacion';
import { Repository } from 'typeorm';

@Injectable()
export class ImagenesService {
    constructor(
            @InjectRepository(ImagenesPublicaciones)
            private readonly imagenesRepo: Repository<ImagenesPublicaciones>,
        
            @InjectRepository(Publicacion)
            private readonly publicacionesRepo: Repository<Publicacion>,
          ) {}
        
          async findAll(): Promise<ImagenesPublicaciones[]> {
            return this.imagenesRepo.find({ relations: ['publicacion'] });
          }
        
          async findOne(id: number): Promise<ImagenesPublicaciones> {
            const imagen = await this.imagenesRepo.findOne({
              where: { codImagen: id },
              relations: ['publicacion'],
            });
        
            if (!imagen) {
              throw new NotFoundException(`Imagen con ID ${id} no encontrada`);
            }
        
            return imagen;
          }
        
          async create(urlImagen: string, codPublicacion: number): Promise<ImagenesPublicaciones> {
            const publicacion = await this.publicacionesRepo.findOne({ where: { codPublicacion } });
        
            if (!publicacion) {
              throw new NotFoundException(`Publicación con ID ${codPublicacion} no encontrada`);
            }
        
            const nuevaImagen = this.imagenesRepo.create({ urlImagen, publicacion });
            return this.imagenesRepo.save(nuevaImagen);
          }
        
          async delete(id: number): Promise<void> {
            const imagen = await this.findOne(id);
            await this.imagenesRepo.remove(imagen);
          }
}

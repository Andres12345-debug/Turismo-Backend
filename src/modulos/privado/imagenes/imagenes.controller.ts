import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Publicacion } from 'src/modelos/publicacion/publicacion';
import { Repository } from 'typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImagenesPublicaciones } from 'src/modelos/imagenes_publicacion/imagenes_publicacion';

@Controller('imagenes')
export class ImagenesController {
  constructor(
    @InjectRepository(ImagenesPublicaciones)
    private readonly imagenesRepo: Repository<ImagenesPublicaciones>,

    @InjectRepository(Publicacion)
    private readonly publicacionesRepo: Repository<Publicacion>,
  ) {}

  @Get()
  async findAll(): Promise<ImagenesPublicaciones[]> {
    return this.imagenesRepo.find({ relations: ['publicacion'] });
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ImagenesPublicaciones> {
    const imagen = await this.imagenesRepo.findOne({
      where: { codImagen: id },
      relations: ['publicacion'],
    });

    if (!imagen) {
      throw new NotFoundException(`Imagen con ID ${id} no encontrada`);
    }

    return imagen;
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads/imagenes',
        filename: (req, file, cb) => {
          // Generar un nombre de archivo único
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() body: { urlImagen?: string; codPublicacion: string | number },
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ImagenesPublicaciones> {
    // Check if codPublicacion exists and handle different input types
    if (!body.codPublicacion) {
      throw new NotFoundException('codPublicacion es requerido');
    }
    
    // Safely convert to number
    const publicacionId = typeof body.codPublicacion === 'string' 
      ? parseInt(body.codPublicacion) 
      : body.codPublicacion;
    
    // Handle NaN case
    if (isNaN(publicacionId)) {
      throw new NotFoundException('codPublicacion debe ser un número válido');
    }

    const publicacion = await this.publicacionesRepo.findOne({
      where: { codPublicacion: publicacionId },
    });

    if (!publicacion) {
      throw new NotFoundException(
        `Publicación con ID ${publicacionId} no encontrada`,
      );
    }

    let urlImagen = body.urlImagen;
    
    // Si se cargó un archivo, usamos su ruta
    if (file) {
      // Ajuste esta URL según su configuración
      urlImagen = `${process.env.APP_URL || 'http://localhost:3550'}/uploads/imagenes/${file.filename}`;
    }

    if (!urlImagen) {
      throw new NotFoundException(
        'Debe proporcionar una URL de imagen o cargar un archivo',
      );
    }

    const nuevaImagen = this.imagenesRepo.create({
      urlImagen,
      publicacion,
    });

    return this.imagenesRepo.save(nuevaImagen);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ affected: number }> {
    const imagen = await this.findOne(id);
    const result = await this.imagenesRepo.remove(imagen);
    return { affected: result ? 1 : 0 };
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads/imagenes',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() body: { urlImagen?: string; codPublicacion?: string | number },
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ImagenesPublicaciones> {
    const imagen = await this.findOne(id);

    if (body.urlImagen) {
      imagen.urlImagen = body.urlImagen;
    }

    // Si se cargó un archivo, usamos su ruta
    if (file) {
      imagen.urlImagen = `${process.env.APP_URL || 'http://localhost:3550'}/uploads/imagenes/${file.filename}`;
    }

    if (body.codPublicacion) {
      // Safely convert to number
      const publicacionId = typeof body.codPublicacion === 'string' 
        ? parseInt(body.codPublicacion) 
        : body.codPublicacion;
      
      // Handle NaN case
      if (isNaN(publicacionId)) {
        throw new NotFoundException('codPublicacion debe ser un número válido');
      }

      const publicacion = await this.publicacionesRepo.findOne({
        where: { codPublicacion: publicacionId },
      });

      if (!publicacion) {
        throw new NotFoundException(
          `Publicación con ID ${publicacionId} no encontrada`,
        );
      }

      imagen.publicacion = publicacion;
    }

    return this.imagenesRepo.save(imagen);
  }
}
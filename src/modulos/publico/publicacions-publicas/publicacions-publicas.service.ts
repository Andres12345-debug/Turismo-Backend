import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Publicacion } from 'src/modelos/publicacion/publicacion';
import { PublicacionesService } from 'src/modulos/privado/publicaciones/publicaciones.service';
import { DataSource, Like, Repository } from 'typeorm';

@Injectable()
export class PublicacionsPublicasService {
private publicacionesRepository: Repository<Publicacion>;

    constructor(private poolConexion: DataSource) {
        this.publicacionesRepository = poolConexion.getRepository(Publicacion);
    }

  public async consultar(): Promise<any> {
        try {
            const publicaciones = await this.publicacionesRepository.find({
                relations: ['imagenes'], // Asegúrate de usar el nombre real de la relación
            });

            return publicaciones.map(publi => ({
                ...publi,
                imagenesUrls: publi.imagenes?.map(img => img.urlImagen) || [],
                imagenUrl: publi.imagenes?.[0]?.urlImagen || null,
            }));
        } catch (error) {
            throw new HttpException(
                'Fallo al consultar las publicaciones',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

  
  
  public async consultarUno(codigo: number): Promise<any> {
  try {
    const publi = await this.publicacionesRepository.findOne({
      where: { codPublicacion: codigo },
      relations: ['imagenes'],
    });

    if (!publi) {
      throw new HttpException('Publicación no encontrada', HttpStatus.NOT_FOUND);
    }

    return {
      ...publi,
      imagenesUrls: publi.imagenes?.map(img => img.urlImagen) || [],
      imagenUrl: publi.imagenes?.[0]?.urlImagen || null
    };
  } catch (error) {
    throw new HttpException('Fallo al consultar la publicación', HttpStatus.BAD_REQUEST);
  }
}

async buscarPorTitulo(titulo: string): Promise<any[]> {
  try {
    const publicaciones = await this.publicacionesRepository.find({
      where: {
        tituloPublicacion: Like(`%${titulo}%`), // <-- LIKE en SQL
      },
      relations: ['imagenes'],
    });

    return publicaciones.map(publi => ({
      ...publi,
      imagenesUrls: publi.imagenes?.map(img => img.urlImagen) || [],
      imagenUrl: publi.imagenes?.[0]?.urlImagen || null,
    }));
  } catch (error) {
    throw new HttpException(
      'Fallo al buscar publicaciones por título',
      HttpStatus.BAD_REQUEST
    );
  }
}

}

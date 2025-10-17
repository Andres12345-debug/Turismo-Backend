import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Publicacion } from '../publicacion/publicacion';

@Entity('imagenes_publicaciones', { schema: 'public' })
export class ImagenesPublicaciones {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'cod_imagen' })
  public codImagen: number;
  
  @Column({ type: 'varchar', length: 500, nullable: false, name: 'url_imagen' })
  public urlImagen: string;

  // Relación con Publicacion  
  @ManyToOne(() => Publicacion, (publicacion) => publicacion.imagenes, {
    onUpdate: 'RESTRICT',
    onDelete: 'CASCADE',
  })  
  @JoinColumn({ name: 'cod_publicacion', referencedColumnName: 'codPublicacion' })
  public publicacion: Publicacion;
}

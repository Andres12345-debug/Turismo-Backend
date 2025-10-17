import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Acceso } from '../acceso/acceso';
import { Usuario } from '../usuario/usuario';
import { ImagenesPublicaciones } from '../imagenes_publicacion/imagenes_publicacion';



@Entity('publicaciones', { schema: 'public' })
export class Publicacion {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'cod_publicacion' })
  public codPublicacion: number;

  @Column({ type: 'integer', nullable: false, name: 'cod_usuario' })
  public codUsuario: number;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
    name: 'titulo_publicacion',
  })
  public tituloPublicacion: string;


  @Column({ type: 'varchar', name: 'descripcion_publicacion', nullable: true, length: 500, })
  public descripcionPublicacion: string;

  @Column({ type: 'varchar', length: 250, name: 'ubicacion_publicacion', nullable: true })
  public ubicacionPublicacion: string;

  @Column({ type: 'varchar', length: 250, name: 'link_video', nullable: true })
  public linkVideo: string;
n

  @Column({ type: 'date', nullable: false, name: 'fecha_creacion_publicacion' })
  public fechaCreacionPublicacion: Date;

  //Relacion con usuarios
  @ManyToOne(() => Usuario, (objUsuario: Usuario) => objUsuario.Publicaciones, {
    onUpdate: 'RESTRICT',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cod_usuario', referencedColumnName: 'codUsuario' })
  public codUsu?: Usuario;


  //Recibo de imagen
  // Relación con imágenes de publicaciones
  @OneToMany(() => ImagenesPublicaciones, (imagen) => imagen.publicacion)
  public imagenes?: ImagenesPublicaciones[];

}

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Acceso } from "../acceso/acceso";
import { Rol } from "../rol/rol";
import { Publicacion } from "../publicacion/publicacion";

@Entity("usuarios", { schema: "public" })

export class Usuario {
@PrimaryGeneratedColumn({ type: "integer", name: "cod_usuario" })
  public codUsuario: number;

  @Column({ type: "integer", nullable: false, name: "cod_rol" })
  public codRol: number;

  @Column({ type: "varchar", length: 250, nullable: false, name: "nombre_usuario" })
  public nombreUsuario: string;

  @Column({ type: "date", nullable: false, name: "fecha_nacimiento_usuario" })
  public fechaNacimientoUsuario: Date;

  @Column({ type: "varchar", length: 250, nullable: false, name: "telefono_usuario" })
  public telefonoUsuario: string;

  @Column({ type: "integer", nullable: false, name: "genero_usuario" })
  public generoUsuario: number;

    // Relación con Acceso
  @OneToOne(() => Acceso, (objAcceso) => objAcceso.usuario)
  public acceso?: Acceso;


     //Relacion con Roles mando
     @ManyToOne(() => Rol, (objRol: Rol) => objRol.usuarios, {
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: "cod_rol", referencedColumnName: "codRol" })
    public codRolU?: Rol;

    //recibo
    @OneToMany(()=> Publicacion, (objPublicacion)=>objPublicacion.codUsu)
    public Publicaciones?: Publicacion[];





}

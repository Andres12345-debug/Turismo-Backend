import { Column, Entity, OneToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { Usuario } from "../usuario/usuario";

@Entity("accesos", { schema: "public" })
export class Acceso {
  @PrimaryColumn({ type: "integer", nullable: false, name: "cod_usuario" })
  public codUsuario: number;

  @Column({ type: "varchar", length: 250, nullable: false, name: "nombre_acceso" })
  public nombreAcceso: string;

  @Column({ type: "varchar", length: 500, nullable: false, name: "clave_acceso" })
  public claveAcceso: string;

  // Relación con Usuario
  @OneToOne(() => Usuario, (objUsuario) => objUsuario.acceso, {
    onDelete: 'RESTRICT', // Elimina automáticamente el acceso al borrar el usuario
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: "cod_usuario" })
  public usuario: Usuario;
  
}

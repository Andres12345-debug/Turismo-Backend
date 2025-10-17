import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Usuario } from 'src/modelos/usuario/usuario';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsuariosService {
    private usuarioRepository: Repository<Usuario>

    constructor(private poolConexion: DataSource) {
        this.usuarioRepository = poolConexion.getRepository(Usuario);
    }

    public async consultar(): Promise<any> {
        try {
            return this.usuarioRepository.find();
        } catch (error) {
            throw new HttpException(
                'fallo al consultar el usuario',
                HttpStatus.BAD_REQUEST,
            )
        }
    }
    public async verficar(nombre: string): Promise<boolean> {
        const existe = await this.usuarioRepository.findBy({ nombreUsuario: nombre });
        return existe.length > 0;
    }
    public async registrar(objUsuario: Usuario): Promise<any> {
        try {
            // Verificar si el usuario ya existe
            if (await this.verificarUsuario(objUsuario.nombreUsuario)) {
                throw new HttpException('El usuario ya existe', HttpStatus.CONFLICT);
            }
            // Registrar el usuario
            const usuarioGuardado = await this.usuarioRepository.save(objUsuario);
            return {
                success: true,
                message: 'Usuario registrado correctamente',
                data: usuarioGuardado,
            };
        } catch (miError) {
            // Manejar errores
            throw new HttpException(
                {
                    success: false,
                    message: miError.message || 'Error interno al registrar el usuario',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async consultarUno(codigo: number): Promise<Usuario> {
        try {
            const usuario = await this.usuarioRepository.findOneBy({ codUsuario: codigo });

            if (!usuario) {
                throw new HttpException(
                    `Usuario con código ${codigo} no encontrado`,
                    HttpStatus.NOT_FOUND,
                );
            }

            return usuario;
        } catch (error) {
            // Si ya es HttpException, lo relanzamos
            if (error instanceof HttpException) throw error;

            // Si es otro error, lanzamos uno genérico
            throw new HttpException(
                'Error al consultar el usuario',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }


    public async verificarUsuario(nombre: string): Promise<boolean> {
        try {
            const existe = await this.usuarioRepository.findBy({ nombreUsuario: nombre });
            return existe.length > 0;
        } catch (miError) {
            throw new HttpException(
                'Error al verificar si el usuario existe',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async actualizar(objUsu: Usuario, codigo: number): Promise<any> {
        try {
            const usuExistente = await this.usuarioRepository.findOneBy({ codUsuario: codigo });

            if (!usuExistente) {
                throw new HttpException("El usuario no existe", HttpStatus.NOT_FOUND);
            }

            if (
                objUsu.nombreUsuario &&
                objUsu.nombreUsuario !== usuExistente.nombreUsuario &&
                (await this.verificarUsuario(objUsu.nombreUsuario))
            ) {
                throw new HttpException("El nombre de usuario ya existe", HttpStatus.BAD_REQUEST);
            }

            await this.usuarioRepository.update({ codUsuario: codigo }, objUsu);

            const usuarioActualizado = await this.usuarioRepository.findOneBy({ codUsuario: codigo });

            return { mensaje: "Perfil actualizado correctamente", usuario: usuarioActualizado };
        } catch (miError) {
            throw new HttpException(
                miError.message || "Fallo al actualizar perfil",
                miError.status || HttpStatus.BAD_REQUEST,
            );
        }
    }



    public async eliminar(objUsu: Usuario, codigo: number): Promise<any> {
        try {
            return this.usuarioRepository.delete({ codUsuario: codigo })

        } catch (error) {
            throw new HttpException("fallo al eliminar el usuario", HttpStatus.BAD_REQUEST)
        }
    }


}

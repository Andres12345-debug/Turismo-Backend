import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { Acceso } from 'src/modelos/acceso/acceso';
import GenerarToken from 'src/Utilities/shared/generarToken';
import { DataSource, Repository } from 'typeorm';
import { ACCESO_SQL } from '../registros/registro_sql';


@Injectable()
export class AccesosService {
    private accesoRepository: Repository<Acceso>;
    constructor(private poolConexion: DataSource) {
        this.accesoRepository = poolConexion.getRepository(Acceso);
    }
    public async sesion(objAcceso: Acceso): Promise<any> {
        const usuarioExiste = await this.accesoRepository.findBy({ nombreAcceso: objAcceso.nombreAcceso });
       
        if (usuarioExiste.length != 0) {
            const claveAcceso = usuarioExiste[0].claveAcceso;

            // Agregar log para verificar los valores ingresados y de la base de datos
            console.log("Usuario encontrado:", usuarioExiste[0]);
            console.log("Clave ingresada:", objAcceso.claveAcceso);
            console.log("Clave de la base de datos:", claveAcceso);

            if (compareSync(objAcceso.claveAcceso, claveAcceso)) {
                try {
                    const datosSesion = await this.accesoRepository.query(ACCESO_SQL.DATOS_SESION, [usuarioExiste[0].codUsuario]);
                    const tokenSistema = GenerarToken.procesarRespuesta(datosSesion[0]);
                    if (tokenSistema) {
                        return { tokenApp: tokenSistema }; // Cambiado para devolver el token directamente
                    } else {
                        throw new HttpException("Fallo al generar la autenticación", HttpStatus.CONFLICT);
                    }
                } catch (miError) {
                    throw new HttpException("Fallo al consultar la información", HttpStatus.CONFLICT);
                }
            } else {
                // Retornar un error más claro
                throw new HttpException("Las claves no coinciden", HttpStatus.UNAUTHORIZED);
            }
        } else {
            throw new HttpException("Usuario no registrado", HttpStatus.BAD_REQUEST);
        }
    }
}

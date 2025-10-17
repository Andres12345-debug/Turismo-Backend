import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { Acceso } from 'src/modelos/acceso/acceso';
import { Usuario } from 'src/modelos/usuario/usuario';
import GenerarToken from 'src/Utilities/shared/generarToken';
import { DataSource, Repository } from 'typeorm';
import { ACCESO_SQL } from './registro_sql';

@Injectable()
export class RegistrosService {
    private usuarioRepositorio: Repository<Usuario>;
  private AccesoRepositorio: Repository<Acceso>;

  constructor(private poolConexion: DataSource) {
    this.usuarioRepositorio = poolConexion.getRepository(Usuario);
    this.AccesoRepositorio = poolConexion.getRepository(Acceso);
  }

  public async nuevoUsuario(
    objAcceso: Acceso,
    objUsuario: Usuario,
  ): Promise<any> {
    try {
      const usuarioExiste = await this.AccesoRepositorio.findBy({
        nombreAcceso: objAcceso.nombreAcceso,
      });
      if (usuarioExiste.length == 0) {
        let codigoUsuario = (await this.usuarioRepositorio.save(objUsuario))
          .codUsuario;

        const claveCifrada = hashSync(objAcceso.claveAcceso);
        objAcceso.codUsuario = codigoUsuario;
        objAcceso.claveAcceso = claveCifrada;
        await this.AccesoRepositorio.save(objAcceso);

        let datosSesion = await this.AccesoRepositorio.query(
          ACCESO_SQL.DATOS_SESION,
          [codigoUsuario],
        );
        const token = GenerarToken.procesarRespuesta(datosSesion[0]);
        if (token !== '') {
          return new HttpException({ "tokenApp": token }, HttpStatus.OK);
        } else {
          return new HttpException(
            'Fallo al realizar ',
            HttpStatus.METHOD_NOT_ALLOWED,
          );
        }
      } else {
        return new HttpException(
          'El usuario existe',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    } catch (miError) {
      throw new HttpException(
        'Fallo al registrar el usuario',
        HttpStatus.CONFLICT,
      );
    }
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Rol } from 'src/modelos/rol/rol';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RolesService {
    private rolesRepository: Repository<Rol>;
    constructor(private poolConexion: DataSource){
        this.rolesRepository = poolConexion.getRepository(Rol);
    }
    public async consultar(): Promise<any>{
        try {
                return this.rolesRepository.find();
        } catch (error) {
            throw new HttpException(
                'fallo al consultar el rol',
                HttpStatus.BAD_REQUEST,
            )            
        }
    }
    public async verficar(nombre: string): Promise<boolean>{
        const existe = await this.rolesRepository.findBy({ nombreRol: nombre});
        return existe.length > 0;
    }
    public async registrar(objRol: Rol): Promise<any> {
      try {
        // Normalizar el nombre del rol
        objRol.nombreRol = objRol.nombreRol.trim().toLowerCase();
    
        // Verificar si el rol ya existe
        if (await this.verificarRol(objRol.nombreRol)) {
          throw new HttpException('El rol ya existe', HttpStatus.BAD_REQUEST);
        }
    
        // Guardar el rol
        const rolGuardado = await this.rolesRepository.save(objRol);
    
        // Devolver éxito
        return {
          success: true,
          message: 'El rol fue registrado correctamente.',
          data: rolGuardado,
        };
      } catch (miError) {
        // Manejar errores de manera consistente
        throw new HttpException(
          {
            success: false,
            message: miError.message || 'Fallo al hacer el registro.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    public async consultarUno(codigo: number): Promise<any>{
        try{
            return this.rolesRepository.findBy({ codRol  : codigo});

        }catch(error){
            throw new HttpException('Fallo al consultar el rol', HttpStatus.BAD_REQUEST);
        }
    }

    public async verificarRol(nombre: string): Promise<boolean> {
        const nombreNormalizado = nombre.trim().toLowerCase(); // Normaliza el nombre
        const existe = await this.rolesRepository.findBy({ nombreRol: nombreNormalizado });
        return existe.length > 0;
      }
      
    public async actualizar(objRol: Rol, codigo: number): Promise<any> {
        try {
          // Obtener el rol existente
          const rolExistente = await this.rolesRepository.findOneBy({ codRol: codigo });
      
          if (!rolExistente) {
            throw new HttpException("El rol no existe", HttpStatus.NOT_FOUND);
          }
      
          // Verificar si el nombre de rol ha cambiado y si ya existe otro con ese nombre
          if (
            objRol.nombreRol &&
            objRol.nombreRol !== rolExistente.nombreRol &&
            (await this.verificarRol(objRol.nombreRol))
          ) {
            throw new HttpException("El nombre del rol ya existe", HttpStatus.BAD_REQUEST);
          }
      
          // Actualizar el rol
          const resultado = await this.rolesRepository.update({ codRol: codigo }, objRol);
      
          // Verificar si la actualización fue exitosa
          if (resultado.affected && resultado.affected > 0) {
            // Retornar éxito con el objeto actualizado
            const rolActualizado = await this.rolesRepository.findOneBy({ codRol: codigo });
            return { mensaje: "Rol actualizado", objeto: rolActualizado };
          } else {
            // Si no se afectó ningún registro
            throw new HttpException("No se pudo actualizar el rol", HttpStatus.BAD_REQUEST);
          }
        } catch (miError) {
          throw new HttpException(
            miError.message || "Fallo al actualizar rol",
            miError.status || HttpStatus.BAD_REQUEST,
          );
        }
      }
    
    public async eliminar(objRol : Rol, codigo : number): Promise<any>{
        try {
            return this.rolesRepository.delete({codRol : codigo})
            
        } catch (error) {
            throw new HttpException("fallo al eliminar el rol", HttpStatus.BAD_REQUEST)
        }
    }
}

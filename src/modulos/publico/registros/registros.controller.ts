import { RegistrosService } from './registros.service';
import { Body, Controller, Post } from '@nestjs/common';
import { Acceso } from 'src/modelos/acceso/acceso';
import { Usuario } from 'src/modelos/usuario/usuario';

@Controller('registros')
export class RegistrosController {
    constructor(private readonly registroService:RegistrosService){   
    }
    @Post('/user')
    public registrarUsuario(@Body() datosRegistro: any):any {
        const objAcceso: Acceso = datosRegistro;
        const objUsuario: Usuario = datosRegistro;

        return this.registroService.nuevoUsuario(objAcceso, objUsuario);
    }

}

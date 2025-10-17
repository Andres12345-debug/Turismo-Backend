import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, Req } from '@nestjs/common';
import { Usuario } from 'src/modelos/usuario/usuario';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuarioService: UsuariosService) { }


    @Get('/todos')
    public obtenerProductos(): any {
        return this.usuarioService.consultar();
    }

    @Get('/perfil')
    public async obtenerMiPerfil(@Req() req: Request): Promise<any> {
        const datosUsuario = (req as any).datosUsuario;

        // Log para ver exactamente qué está llegando
        console.log("👉 Datos que llegan al controlador /perfil:", datosUsuario);

        return {
            mensaje: 'Perfil obtenido correctamente',
            usuario: datosUsuario, // Aquí sale la info del usuario
        };
    }

    @Post("/agregar")
    public registrarProducto(@Body() objUsu: Usuario): any {
        return this.usuarioService.registrar(objUsu);
    }
    @Put("/actualizar")
    public async actualizarPerfil(
        @Req() req: Request,
        @Body() objActualizar: Usuario
    ): Promise<any> {
        const datosUsuario = (req as any).datosUsuario;
        const codigo = datosUsuario.codUsuario || datosUsuario.id || datosUsuario.userId;

        if (!codigo) {
            throw new HttpException("Usuario no válido en el token", HttpStatus.UNAUTHORIZED);
        }

        return this.usuarioService.actualizar(objActualizar, codigo);
    }
}

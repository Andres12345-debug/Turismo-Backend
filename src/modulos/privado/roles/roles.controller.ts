import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Rol } from 'src/modelos/rol/rol';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService : RolesService){}
    @Get('/todos')
    public obtenerProductos(): any{
        return this.rolesService.consultar();
    }
     @Post("/agregar")
    public registrarProducto(@Body() objCate: Rol): any{
        return this.rolesService.registrar(objCate);
    }


}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { Acceso } from 'src/modelos/acceso/acceso';
import { AccesosService } from './accesos.service';

@Controller('accesos')
export class AccesosController {
    constructor(private readonly accesoService:AccesosService){
    }
    @Post("/signin")
    public inicioSesion(@Body() objAcceso:Acceso):any{
        return this.accesoService.sesion(objAcceso);
    }
      
}

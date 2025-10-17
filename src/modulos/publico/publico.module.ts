import { Module } from '@nestjs/common';
import { AccesosModule } from './accesos/accesos.module';
import { RegistrosModule } from './registros/registros.module';
import { RouterModule, Routes } from '@nestjs/core';
import { UsuariosModule } from '../privado/usuarios/usuarios.module';
import { PublicacionesModule } from '../privado/publicaciones/publicaciones.module';
import { AccesosService } from './accesos/accesos.service';
import { RegistrosService } from './registros/registros.service';
import { AccesosController } from './accesos/accesos.controller';
import { RegistrosController } from './registros/registros.controller';
import { PublicacionsPublicasModule } from './publicacions-publicas/publicacions-publicas.module';

const routes:Routes=[
    {
        path:"publico",
        children:[
            AccesosModule,
            RegistrosModule,
            PublicacionsPublicasModule
            
        ]
    }
]

@Module({
    imports:[
        PublicacionsPublicasModule,
        RouterModule.register(routes), AccesosModule, RegistrosModule],
        exports: [RouterModule],
        providers: [AccesosService, RegistrosService],
        controllers: [AccesosController, RegistrosController]


})
export class PublicoModule {}

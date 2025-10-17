import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { ImagenesModule } from './imagenes/imagenes.module';
import { RouterModule, Routes } from '@nestjs/core';
import { PublicoModule } from '../publico/publico.module';


const routes: Routes = [
    {
      path: 'privado',
      children: [UsuariosModule, PublicoModule, RolesModule, PublicacionesModule, ImagenesModule],
    },
  ];

@Module({
    imports: [
        UsuariosModule,
        PublicoModule,
        RolesModule,
        RouterModule.register(routes),
        PublicacionesModule,
        ImagenesModule       
        ],
      exports: [RouterModule],
})
export class PrivadoModule {}

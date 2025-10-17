import { Global, Module } from "@nestjs/common";
import { Acceso } from "src/modelos/acceso/acceso";
import { ImagenesPublicaciones } from "src/modelos/imagenes_publicacion/imagenes_publicacion";
import { Publicacion } from "src/modelos/publicacion/publicacion";
import { Rol } from "src/modelos/rol/rol";
import { Usuario } from "src/modelos/usuario/usuario";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      inject: [],
      useFactory: async () => {
        try {
          const poolConexion = new DataSource({
            type: 'postgres',
            host: String(process.env.DB_HOST),
            port: Number(process.env.PORT),
            username: String(process.env.DB_USER),
            password: String(process.env.DB_PASSWORD),
            database: String(process.env.DB_NAME),
            synchronize: true,
            logging: true,
            namingStrategy: new SnakeNamingStrategy(),
            entities: [Usuario, Rol, Publicacion, Acceso, ImagenesPublicaciones], // Aquí debes agregar tus entidades
          });

          await poolConexion.initialize();
          console.log("Conexión a la base de datos exitosa."+String(process.env.DATA_BASE));

          return poolConexion;
        } catch (miError) {
          console.log("Falló al realizar la conexión");
          throw miError;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class 
ConexionModule {}

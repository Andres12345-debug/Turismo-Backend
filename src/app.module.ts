import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrivadoModule } from './modulos/privado/privado.module';
import { PublicoModule } from './modulos/publico/publico.module';
import { ConfigModule } from '@nestjs/config';
import { ConexionModule } from './config/conexion.module';
import { Seguridad } from './middleware/seguridad/seguridad/seguridad';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true,envFilePath:".env"}), ConexionModule, PublicoModule, PrivadoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
    public configure(consumer: MiddlewareConsumer) {
         consumer.apply(Seguridad).forRoutes({path: '/privado/*', method: RequestMethod.ALL});
    }

}

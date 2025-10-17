import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const puerto = Number(process.env.PUERTO_SERVIDOR);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    // Configurar servir archivos estáticos desde la carpeta uploads, MAQUINA LOCAL
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/'
    });
    await app.listen(puerto, () => {
        console.log(`Servidor funcionando puerto: ` + puerto);
    });
}
bootstrap();


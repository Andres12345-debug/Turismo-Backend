import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const puerto = Number(process.env.PORT) || 3000; // 👈 fallback seguro

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  // Servir archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(puerto);
  console.log(`Servidor funcionando en puerto: ${puerto}`);
}
bootstrap();

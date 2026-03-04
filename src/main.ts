import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import * as mime from 'mime';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve uploads folder with correct Content-Type
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'uploads'), {
      setHeaders: (res, path) => {
        const type = mime.getType(path);
        if (type) {
          res.setHeader('Content-Type', type);
        }
      },
    }),
  );

  app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
}

bootstrap();

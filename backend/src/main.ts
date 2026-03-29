import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { seedPredefinedCategories } from './seed/predefined-categories';
import { DataSource } from 'typeorm';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true
    }));

    app.enableCors({
      origin: 'http://localhost:3000', 
      credentials: true,              
    });

    const dataSource = app.get(DataSource);
    await seedPredefinedCategories(dataSource);
  
    await app.listen(4000);
}
bootstrap();
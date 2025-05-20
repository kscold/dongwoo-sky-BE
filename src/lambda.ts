import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

let cachedServer: Server;

async function bootstrap() {
  const expressApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  
  nestApp.enableCors();
  await nestApp.init();
  
  return createServer({
    app: expressApp,
  });
}

export const handler: Handler = async (event: any, context: Context) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  
  return proxy(cachedServer, event, context);
};

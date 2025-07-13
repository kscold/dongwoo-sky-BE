import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Handler, Context } from 'aws-lambda';
import * as express from 'express';

import { AppModule } from './app.module';

const { configure } = require('@vendia/serverless-express');

let cachedServer: any;

async function bootstrap() {
  const expressApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  nestApp.enableCors();
  nestApp.setGlobalPrefix('api');
  await nestApp.init();

  return configure({
    app: expressApp,
  });
}

export const handler: Handler = async (event: any, context: Context) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }

  return cachedServer(event, context);
};

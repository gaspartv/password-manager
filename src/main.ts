import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { env } from "./env.config";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      transform: true,
      transformOptions: { groups: ["transform"] },
    }),
  );

  await app.listen(env.PORT, () => {
    if (env.NODE_ENV === "development") {
      Logger.log(`Server running on port ${env.PORT}`, "Bootstrap");
    }
  });
}
bootstrap();

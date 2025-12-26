import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { join } from "path";
import { AppModule } from "./app.module";
import { env } from "./env.config";
import { LoggingInterceptor } from "./interceptors/logs.interceptor";
import { PrismaService } from "./services/prisma/service";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Configurar arquivos estáticos
  app.useStaticAssets({
    root: join(__dirname, "..", "public"),
    prefix: "/public/",
  });

  // Configurar view engine
  app.setViewEngine({
    engine: {
      handlebars: require("handlebars"),
    },
    templates: join(__dirname, "..", "views"),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      transform: true,
      transformOptions: { groups: ["transform"] },
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor(app.get(PrismaService)));

  await app.listen(env.PORT, () => {
    if (env.NODE_ENV === "development") {
      Logger.log(`Server running on port ${env.PORT}`, "Bootstrap");
    }
  });
}
bootstrap();

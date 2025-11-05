import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthGuard } from "./modules/auth/guard";
import { AuthModule } from "./modules/auth/module";
import { ServicesModule } from "./services/modules";

@Module({
  imports: [AuthModule, ServicesModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}

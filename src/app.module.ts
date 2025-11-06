import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AuthGuard } from "./app.guard";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/module";
import { ManagerModule } from "./modules/manager/module";
import { ServicesModule } from "./services/modules";

@Module({
  imports: [AuthModule, ManagerModule, ServicesModule],
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

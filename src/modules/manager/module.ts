import { Module } from "@nestjs/common";
import { ManagerController } from "./controller";

@Module({
  controllers: [ManagerController],
})
export class ManagerModule {}

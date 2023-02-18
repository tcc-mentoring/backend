import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileController } from "./profile.controller";
import { Profile } from "./profile.entity";
import { ProfileService } from "./profile.service";

@Module({
    imports: [TypeOrmModule.forFeature([Profile])],
    providers: [ProfileService],
    controllers: [ProfileController],
    exports: [ProfileService]
})
export class ProfileModule {}
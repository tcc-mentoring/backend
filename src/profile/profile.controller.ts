import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ProfileDTO } from "./profile.entity";
import { ProfileService } from "./profile.service";

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/user/')
    async userProfile(@Param() params, @Request() req): Promise<ProfileDTO> {
        const userProfile = await this.profileService.getUserInformations(req.user);
        return userProfile;
    }
}
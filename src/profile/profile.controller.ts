import { Body, Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AcademyEntryDTO, CreateOcupationDTO, ProfileDTO } from "./profile.entity";
import { ProfileService } from "./profile.service";

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/user/')
    async userProfile(@Request() req): Promise<ProfileDTO> {
        const userProfile = await this.profileService.getUserInformations(req.user);
        return userProfile;
    }

    @UseGuards(JwtAuthGuard)
    @Post('/ocupation/')
    async addOcupation(@Body() ocupationDTO: CreateOcupationDTO, @Request() req): Promise<void> {
        await this.profileService.createOcupationToUser(ocupationDTO, req.user)
    }   

    @UseGuards(JwtAuthGuard)
    @Post('/academy-entry/')
    async addAcademyEntry(@Body() academyEntryDTO: AcademyEntryDTO, @Request() req): Promise<void> {
        await this.profileService.createAcademyEntryToUser(academyEntryDTO, req.user)
    }   
}
import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateMentorProfileDTO, MentorProfileDTO } from './mentor-profile.entity';
import { MentorProfileService } from './mentor-profile.service';

@Controller('mentor-profile')
export class MentorProfileController {
    constructor(private mentorProfileService: MentorProfileService){}

    @UseGuards(JwtAuthGuard)
    @Get("/user")
    async getUserMentorProfile(@Req() req): Promise<MentorProfileDTO> {
        const userMentorProfile = await this.mentorProfileService.getUserMentorProfileFromEmail(req.user);

        if (!userMentorProfile) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'Profile not found'
              }, HttpStatus.NOT_FOUND);
        }

        return userMentorProfile;
    }

    @UseGuards(JwtAuthGuard)
    @Post("/user")
    async createUserMentorProfile(@Req() req, @Body() mentorProfile: CreateMentorProfileDTO): Promise<void> {
        await this.mentorProfileService.createMentorProfileToUser(req.user, mentorProfile);
    }


    @Get()
    async getMentorProfiles(): Promise<MentorProfileDTO[]> {
       return await this.mentorProfileService.getMentorProfiles();
    }
}

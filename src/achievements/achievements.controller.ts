import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AllAchievementsDTO, CompleteAchievementDTO, CreateAchievementDTO } from './achievements.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("/new")
  async createAchievement(@Request() req, @Body() newAchievement: CreateAchievementDTO) {
    console.log(req.user)
    await this.achievementsService.createAchievement(newAchievement, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAchievements(@Request() req): Promise<AllAchievementsDTO> {
    return await this.achievementsService.getAllAchievements(req.user);
  }

  @Get("/:id")
  async getAchievement(@Param() param): Promise<CompleteAchievementDTO> {
    return await this.achievementsService.getAchievement(param.id);
  }
}


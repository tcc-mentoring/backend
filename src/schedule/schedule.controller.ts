import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateScheduleDTO, CreateSessionReviewDTO, PastSessionsDTO, SessionDTO } from './schedule.entity';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() createScheduleDto: CreateScheduleDTO) {
    await this.scheduleService.schedule(createScheduleDto, req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get("mentee-sessions")
  async menteeSessions(@Req() req): Promise<SessionDTO[]> {
    return await this.scheduleService.getAllMenteeSessions(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("mentee-past-sessions")
  async menteePastSessions(@Req() req): Promise<PastSessionsDTO> {
    return await this.scheduleService.getAllMenteePastSessions(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("review/:id")
  async reviewSession(@Param() params, @Body() sessionReview: CreateSessionReviewDTO): Promise<void> {
    return await this.scheduleService.reviewSession(params.id, sessionReview);
  }
}

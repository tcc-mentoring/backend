import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CompleteSessionDTO, CreateScheduleDTO, CreateSessionReviewDTO, SessionsDTO, SessionDTO, UpdateMentorNotesDTO, UserSessions } from './schedule.entity';
import { ScheduleService } from './schedule.service';
import { completeSessionDTOFromEntity } from 'src/facade/ScheduleFacade';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() createScheduleDto: CreateScheduleDTO) {
    await this.scheduleService.schedule(createScheduleDto, req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get("user-sessions")
  async userSessions(@Req() req): Promise<UserSessions> {
    return await this.scheduleService.getAllSessions(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("mentee-sessions")
  async menteeSessions(@Req() req): Promise<SessionDTO[]> {
    return await this.scheduleService.getAllMenteeSessions(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("sessions")
  async menteePastSessions(@Req() req): Promise<SessionsDTO> {
    return await this.scheduleService.getSessions(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("review/:id")
  async reviewSession(@Param() params, @Body() sessionReview: CreateSessionReviewDTO): Promise<void> {
    return await this.scheduleService.reviewSession(params.id, sessionReview);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async session(@Param() params): Promise<CompleteSessionDTO> {
    const schedule = await this.scheduleService.getScheduleById(params.id);

    return completeSessionDTOFromEntity(schedule);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/update-mentor-notes/:id")
  async updateMentorNotes(@Param() params, @Body() updateMentorNotes: UpdateMentorNotesDTO): Promise<void> {
    console.log("got here")
    await this.scheduleService.updateMentorNotes(params.id, updateMentorNotes);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { menteeSessionsDTOFromEntity, scheduleSessionEntityFromDTO } from 'src/facade/ScheduleFacade';
import { UsersService } from 'src/users/users.service';
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { CreateScheduleDTO, CreateSessionReviewDTO, PastSessionsDTO, Schedule, SessionDTO } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private userService: UsersService
  ) { }


  async schedule(createScheduleDto: CreateScheduleDTO, menteeEmail: string): Promise<void> {

    const mentee = await this.userService.findCompleteUserByEmail(menteeEmail);

    const menthor = await this.userService.findCompleteUserByEmail(createScheduleDto.menthorEmail);

    const schedule = scheduleSessionEntityFromDTO(createScheduleDto, mentee, menthor);

    await this.scheduleRepository.save(schedule);
  }

  async getAllMenteePastSessions(menteeEmail: string): Promise<PastSessionsDTO> {
    const sessionsToReview = await this.scheduleRepository.find({ where: 
      {
        mentee: { 
          email: menteeEmail 
        },
        score: IsNull(), 
        endDateTime: LessThanOrEqual(moment().format("YYYY-MM-DD  HH:mm")),
      }, relations: ["menthor"] });

    const finishedSessions = await this.scheduleRepository.find({ where: 
      {
        mentee: { 
          email: menteeEmail 
        }, 
        score: MoreThanOrEqual(0),
        endDateTime: LessThanOrEqual(moment().format("YYYY-MM-DD  HH:mm")),
      }, relations: ["menthor"] });

    return {
      sessionsToReview: sessionsToReview.map(menteeSessionsDTOFromEntity),
      finishedSessions: finishedSessions.map(menteeSessionsDTOFromEntity)
    }; 
  }

  async reviewSession(scheduleId: number, review: CreateSessionReviewDTO): Promise<void> {
    let schedule = await this.getScheduleById(scheduleId);

    await this.scheduleRepository.update({id: schedule.id}, {...review});
  }

  async getAllMenteeSessions(menteeEmail: string): Promise<SessionDTO[]> {
    const sessions = await this.scheduleRepository.find({ where: { mentee: { email: menteeEmail } }, relations: ["menthor"] });

    return sessions.map(menteeSessionsDTOFromEntity);
  }

  async getScheduleById(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({where: {id}});

    return schedule;
  }
}

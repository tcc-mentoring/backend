import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { menteeSessionsDTOFromEntity, mentorSessionsDTOFromEntity, scheduleSessionEntityFromDTO } from 'src/facade/ScheduleFacade';
import { UsersService } from 'src/users/users.service';
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { CreateScheduleDTO, CreateSessionReviewDTO, SessionsDTO, Schedule, SessionDTO, UpdateMentorNotesDTO, UserSessions } from './schedule.entity';

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

  async getSessions(userEmail: string): Promise<SessionsDTO> {

    const currentTime = moment.utc().format("YYYY-MM-DD  HH:mm");

    const sessionsToReview = await this.scheduleRepository.find({
      where:
      {
        mentee: {
          email: userEmail
        },
        score: IsNull(),
        endDateTime: LessThanOrEqual(currentTime),
      }, relations: ["menthor"]
    });

    const finishedSessions = await this.scheduleRepository.find({
      where: [{
        mentee: {
          email: userEmail
        },
        score: MoreThanOrEqual(0),
        endDateTime: LessThanOrEqual(currentTime),
      },
      {
        menthor: {
          email: userEmail
        },
        score: MoreThanOrEqual(0),
        endDateTime: LessThanOrEqual(currentTime),
      }]
      , relations: ["menthor", "mentee"]
    });

    const upcomingSessions = await this.scheduleRepository.find({
      where: [{
        mentee: {
          email: userEmail
        },
        endDateTime: MoreThanOrEqual(currentTime),
      },
      {
        menthor: {
          email: userEmail
        },
        endDateTime: MoreThanOrEqual(currentTime),
      }]
      , relations: ["menthor", "mentee"]
    });

    return {
      sessionsToReview: sessionsToReview.map(menteeSessionsDTOFromEntity),
      finishedSessions: finishedSessions.map((session) =>
        session.mentee.email === userEmail 
          ? menteeSessionsDTOFromEntity(session) 
          : mentorSessionsDTOFromEntity(session)
      ),
      upcomingSessions: upcomingSessions.map((session) =>
        session.mentee.email === userEmail 
          ? menteeSessionsDTOFromEntity(session) 
          : mentorSessionsDTOFromEntity(session)
      ),
    };
  }

  async reviewSession(scheduleId: number, review: CreateSessionReviewDTO): Promise<void> {
    let schedule = await this.getScheduleById(scheduleId);

    await this.scheduleRepository.update({ id: schedule.id }, { ...review });
  }

  async getAllMenteeSessions(menteeEmail: string): Promise<SessionDTO[]> {
    const sessions = await this.scheduleRepository.find({ where: { mentee: { email: menteeEmail } }, relations: ["menthor"] });

    return sessions.map(menteeSessionsDTOFromEntity);
  }

  async getAllSessions(userEmail: string): Promise<UserSessions> {
    const menteeSessions = await this.scheduleRepository.find({ where: { mentee: { email: userEmail } }, relations: ["menthor"] });
    const mentorSessions = await this.scheduleRepository.find({ where: { menthor: { email: userEmail } }, relations: ["mentee"] });

    return {
      asMentee: menteeSessions.map(menteeSessionsDTOFromEntity),
      asMentor: mentorSessions.map(mentorSessionsDTOFromEntity)
    };
  }

  async getScheduleById(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({ where: { id }, relations: ["menthor", "mentee"] });
    return schedule;
  }

  async updateMentorNotes(id: number, { updatedMentorNotes }: UpdateMentorNotesDTO) {
    try {
      await this.scheduleRepository.update({ id }, { mentorNotes: updatedMentorNotes });
    } catch (err) {
      console.log({ err })
    }
  }
}

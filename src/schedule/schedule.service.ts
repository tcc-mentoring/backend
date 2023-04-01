import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { menteeSessionsDTOFromEntity, scheduleSessionEntityFromDTO } from 'src/facade/ScheduleFacade';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateScheduleDTO, Schedule, SessionDTO } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private userService: UsersService
  ){}


  async schedule(createScheduleDto: CreateScheduleDTO, menteeEmail: string): Promise<void> {
    
    const mentee = await this.userService.findCompleteUserByEmail(menteeEmail);

    const menthor = await this.userService.findCompleteUserByEmail(createScheduleDto.menthorEmail);
  
    const schedule = scheduleSessionEntityFromDTO(createScheduleDto, mentee, menthor);

    await this.scheduleRepository.save(schedule);
  }

  async getAllMenteeSessions(menteeEmail: string): Promise<SessionDTO[]> {
    const sessions = await this.scheduleRepository.find({where: {mentee: {email: menteeEmail}}, relations: ["menthor"]});

    return sessions.map(menteeSessionsDTOFromEntity);
  }
}

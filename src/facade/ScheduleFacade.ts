import * as moment from "moment";
import { CreateScheduleDTO, Schedule, SessionDTO } from "src/schedule/schedule.entity";
import { User } from "src/users/user.entity";
import { userDTOfromEntity } from "./UserFacade";

export function scheduleSessionEntityFromDTO(createScheduleSessionDTO: CreateScheduleDTO, mentee: User, menthor: User): Schedule {
    const schedule = new Schedule();

    const startDateTime = moment(createScheduleSessionDTO.startDateTime);

    schedule.mentee = mentee;
    schedule.menthor = menthor;
    schedule.startDateTime = startDateTime.toISOString();
    schedule.endDateTime = startDateTime.add(1, "hour").toISOString();
    
    return schedule;
}

export function menteeSessionsDTOFromEntity(scheduleEntity: Schedule): SessionDTO {
    const sessionDTO = new SessionDTO();
    sessionDTO.startDateTime = scheduleEntity.startDateTime;
    sessionDTO.endDateTime = scheduleEntity.endDateTime;
    sessionDTO.with = userDTOfromEntity(scheduleEntity.menthor);
    
    sessionDTO.details = scheduleEntity.details;
    sessionDTO.score = scheduleEntity.score;
    
    sessionDTO.id = scheduleEntity.id;

    sessionDTO.as = "mentee"; 

    return sessionDTO;
}


export function menthorSessionsDTOFromEntity(scheduleEntity: Schedule): SessionDTO {
    const sessionDTO = new SessionDTO();
    sessionDTO.startDateTime = scheduleEntity.startDateTime;
    sessionDTO.endDateTime = scheduleEntity.endDateTime;
    sessionDTO.with = userDTOfromEntity(scheduleEntity.mentee);
    sessionDTO.as = "menthor"; 

    return sessionDTO;
}
import { User, UserDTO } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startDateTime: string;

    @Column()
    endDateTime: string;

    @Column({nullable: true})
    score: number;

    @Column({nullable: true})
    details: string;

    @ManyToOne(() => User, (user) => user.mentorProfile)
    @JoinColumn()
    menthor: User;
    
    @ManyToOne(() => User, (user) => user.mentorProfile)
    @JoinColumn()
    mentee: User;
}

export class CreateScheduleDTO {
    startDateTime: string;
    menthorEmail: string;
}

export class SessionDTO {
    id?: number;

    startDateTime: string;

    endDateTime: string;

    with: UserDTO;

    as: string;

    score: number;
    
    details: string;
}

export class UserSessions {
    asMentee: SessionDTO[];
    asMentor: SessionDTO[]
}

export class CreateSessionReviewDTO {
    score: number;
    details: string;
}

export class PastSessionsDTO {
    sessionsToReview: SessionDTO[];
    finishedSessions: SessionDTO[]
}
import { User, UserDTO } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startDateTime: string;

    @Column()
    endDateTime: string;
    
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
    startDateTime: string;

    endDateTime: string;

    with: UserDTO;

    as: string
}
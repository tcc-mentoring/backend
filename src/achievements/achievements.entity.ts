import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Achievement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    achievedDate: string;

    @ManyToMany(() => User, (user) => user.achievementsParticipated)
    @JoinTable()
    menthors: User[];
    
    @ManyToOne(() => User, (user) => user.achievements)
    @JoinColumn()
    mentee: User;
}

export class CreateAchievementDTO {
    description: string;
    mentorsParticipated: string;
    achievedDate: string;
}

class AchievementDTO {
    description: string;
    achievedDate: string;
}

class AchievedDTO extends AchievementDTO {
    mentorsParticipated: string[];
}

export class CompleteAchievementDTO extends AchievementDTO {
    mentorsParticipated: string[];
    mentee: string;
}

class ParticipatedAchievementsDTO extends AchievementDTO {
    mentee: string;
};

export class AllAchievementsDTO {
    participated: ParticipatedAchievementsDTO[];
    achieved: AchievedDTO[];
}
import { User, UserDTO } from "src/users/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MentorProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    selfDescription: string;

    @Column()
    knowledgeArea: KnowledgeAreas;

    @Column("simple-array")
    specialties: string[];

    @OneToOne(() => User, (user) => user.mentorProfile)
    @JoinColumn()
    user: User;
    mentorProfileEntity: MentorProfile;
}

export class MentorProfileDTO {
    user: UserDTO;
    selfDescription: string;
    specialties: string[];
    knowledgeArea: KnowledgeAreas
}

export class CreateMentorProfileDTO {
    selfDescription: string;
    specialties: string;
    knowledgeArea: KnowledgeAreas
}

enum KnowledgeAreas {
    BIO = "BIO",
    ENG = "ENG",
    SAU = "SAU",
    AGR = "AGR",
    LIT = "LIT",
    SOC = "SOC",
    HUM = "HUM",
    EXA = "EXA"
}
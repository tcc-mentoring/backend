import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Ocupation, (ocupation) => ocupation.profile)
    ocupations: Ocupation[];
    
    @OneToMany(() => AcademyEntry, (academy) => academy.profile)
    academyEntries: AcademyEntry[];

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user: User;
}

@Entity()
export class Ocupation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    startDate: string;

    @Column({nullable: true})
    endDate: string;

    @ManyToOne(() => Profile, (profile) => profile.ocupations)
    profile: Profile;
}

@Entity()
export class AcademyEntry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startDate: string;

    @Column({nullable: true})
    endDate: string;

    @Column()
    institution: string;

    @Column()
    course: string;

    @ManyToOne(() => Profile, (profile) => profile.academyEntries)
    profile: Profile;
}

export class OcupationDTO {
    description: string;
    startDate: string;
    endDate?: string;
}

export class AcademyEntryDTO {
    course: string;
    institution: string;
    startDate: string;
    endDate?: string;
}

export class ProfileDTO {
    ocupations: OcupationDTO[];
    academyEntries: AcademyEntryDTO[];
}
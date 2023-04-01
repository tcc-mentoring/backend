import { IsEmail, IsString, MinLength } from 'class-validator';
import { MentorProfile } from 'src/mentor-profile/mentor-profile.entity';
import { Profile } from 'src/profile/profile.entity';
import { Schedule } from 'src/schedule/schedule.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({unique: true})
  @IsEmail({}, { message: 'mailFormat'})
  email: string;
  
  @Column({select: false})
  @MinLength(8, {message: 'passwordRequirements'})
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;
  
  @OneToOne(() => MentorProfile, (mentorProfile) => mentorProfile.user)
  @JoinColumn()
  mentorProfile: MentorProfile;

  @OneToMany(() => Schedule, (schedule) => schedule.mentee)
  menteeSessions: Schedule;
  
  @OneToMany(() => Schedule, (schedule) => schedule.menthor)
  mentorSessions: Schedule;
}

export class CreateUserDTO {
  firstName: string;

  lastName: string;

  @IsEmail({}, { message: 'mailFormat'})
  email: string;

  @MinLength(8, {message: 'passwordRequirements'})
  password: string
}

export class LoginDTO {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class AuthDetails {
  access_token: string;
}

export class UserDTO {
  firstName: string;
  lastName: string;
  email: string;
}
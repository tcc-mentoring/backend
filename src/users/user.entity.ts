import { IsEmail, IsString, MinLength } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ unique: true, nullable: false })
  userAuthUUID: string;
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
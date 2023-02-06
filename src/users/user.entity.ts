import { IsEmail, MinLength } from 'class-validator';
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
}

export class CreateUserDTO {
  firstName: string;

  lastName: string;

  @IsEmail({}, { message: 'mailFormat'})
  email: string;

  @MinLength(8, {message: 'passwordRequirements'})
  password: string
}
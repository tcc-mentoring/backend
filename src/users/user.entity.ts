import { IsEmail, Length, MinLength } from 'class-validator';
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
  @IsEmail()
  email: string;

  @Column({select: false})
  @MinLength(8)
  password: string;
}

export class CreateUserDTO {
  firstName: string;

  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string
}
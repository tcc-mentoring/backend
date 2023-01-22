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
  email: string;

  @Column({select: false})
  password: string;
}

export class CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string
}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademyEntry, Ocupation, Profile } from './profile/profile.entity';
import { ProfileModule } from './profile/profile.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module'; 
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { MentorProfileModule } from './mentor-profile/mentor-profile.module';
import { MentorProfile } from './mentor-profile/mentor-profile.entity';
import { ScheduleModule } from './schedule/schedule.module';
import { Schedule } from './schedule/schedule.entity';

const envFilePath: string = resolve(`../.env`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'mentoring',
      synchronize: true,
      entities: [
        User,
        Profile,
        Ocupation,
        AcademyEntry,
        MentorProfile,
        Schedule
      ]
    }),
    UsersModule,
    ProfileModule,
    AuthModule,
    MentorProfileModule,
    ScheduleModule
  ],
})
export class AppModule {}

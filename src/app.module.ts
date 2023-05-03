import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
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
import { AchievementsModule } from './achievements/achievements.module';
import { Achievement } from './achievements/achievements.entity';
const envFilePath: string = resolve(`../.env`);

let localDatabase: Partial<TypeOrmModuleOptions> = {
  type: 'sqlite',
  database: 'mentoring',
}

if (process.env.ENVIRONMENT === 'prod'){
  localDatabase = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DATABASE_NAME,
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      ...localDatabase,
      synchronize: true,
      entities: [
        User,
        Profile,
        Ocupation,
        AcademyEntry,
        MentorProfile,
        Schedule,
        Achievement
      ]
    }),
    UsersModule,
    ProfileModule,
    AuthModule,
    MentorProfileModule,
    ScheduleModule,
    AchievementsModule,
  ],
})
export class AppModule {}
 
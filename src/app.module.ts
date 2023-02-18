import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademyEntry, Ocupation, Profile } from './profile/profile.entity';
import { ProfileModule } from './profile/profile.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module'; 
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';

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
        AcademyEntry
      ]
    }),
    UsersModule,
    ProfileModule,
    AuthModule
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'mentoring',
      synchronize: true,
      entities: [
        User
      ]
    }),
    UsersModule,
    AuthModule
  ],
})
export class AppModule {}

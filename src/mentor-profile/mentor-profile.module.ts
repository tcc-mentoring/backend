import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { MentorProfileController } from './mentor-profile.controller';
import { MentorProfile } from './mentor-profile.entity';
import { MentorProfileService } from './mentor-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([MentorProfile]), UsersModule],
  providers: [MentorProfileService],
  controllers: [MentorProfileController],
  exports: [MentorProfileService]
})
export class MentorProfileModule {
}

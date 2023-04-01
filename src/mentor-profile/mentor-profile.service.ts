import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mentorProfileDTOFromEntity, mentorProfileEntityFromDTO } from 'src/facade/MentorProfileFacade';
import { UsersService } from 'src/users/users.service';
import { Not, Repository } from 'typeorm';
import { CreateMentorProfileDTO, MentorProfile, MentorProfileDTO } from './mentor-profile.entity';

@Injectable()
export class MentorProfileService {
    constructor(
        @InjectRepository(MentorProfile)
        private mentorProfileRepository: Repository<MentorProfile>,
        private userService: UsersService
    ){}

    async getUserMentorProfileFromEmail(email: string): Promise<MentorProfileDTO> {
        const userMentorProfile = await this.mentorProfileRepository.findOne({
            where: {
                user: {
                    email
                }
            }
        });

        return userMentorProfile;
    }

    
    async createMentorProfileToUser(email: string, mentorProfile: CreateMentorProfileDTO): Promise<void> {
        const user = await this.userService.findUserCredentialsByEmail(email);

        const mentorProfileEntity = mentorProfileEntityFromDTO(mentorProfile);

        mentorProfileEntity.user = user;

        await this.mentorProfileRepository.save(mentorProfileEntity);
    }

        
    async getUserMentorProfileByEmail(email: string): Promise<MentorProfile> {
        const mentorProfile = await this.mentorProfileRepository.findOne({
            where: {
                user: {
                    email
                }
            }
        });

        return mentorProfile;
    }

    async getMentorProfiles(userEmail: string): Promise<MentorProfileDTO[]> {
        const mentorProfiles = await this.mentorProfileRepository.find({
            relations: ['user'],
            where: {
                user: {
                    email: Not(userEmail)
                }
            }
        });

        const mentorProfileDTOs = mentorProfiles.map(mentorProfileDTOFromEntity);

        return mentorProfileDTOs;
    }
}

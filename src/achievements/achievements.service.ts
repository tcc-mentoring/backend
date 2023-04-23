import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement, AllAchievementsDTO, CompleteAchievementDTO, CreateAchievementDTO } from './achievements.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AchievementsService {

    constructor(
        @InjectRepository(Achievement)
        private achievementRepository: Repository<Achievement>,
        private userService: UsersService
    ){}


    async createAchievement(achievement: CreateAchievementDTO, menteeEmail: string): Promise<void> {
        const mentee = await this.userService.findCompleteUserByEmail(menteeEmail);

        const mentors = await Promise.all(achievement.mentorsParticipated.split(",").map(
            async (mentor) => await this.userService.findCompleteUserByEmail(mentor)));

        

        const newAchievement = new Achievement();
        newAchievement.achievedDate = achievement.achievedDate;
        newAchievement.description = achievement.description;
        newAchievement.mentee = mentee;
        newAchievement.menthors = mentors;
            console.log(newAchievement);
        await this.achievementRepository.save(newAchievement);
        
    }

    async getAchievement(id: number): Promise<CompleteAchievementDTO> {
       const completeAchievement = await this.achievementRepository.findOne({where: { id}, relations: ["menthors", "mentee"]});
       return {
            achievedDate: completeAchievement.achievedDate,
            description: completeAchievement.description,
            mentorsParticipated: completeAchievement.menthors.map((menthor) => menthor.email),
            mentee: completeAchievement.mentee.email
       };
    }

    async getAllAchievements(userEmail: string): Promise<AllAchievementsDTO> {

        const achievements = await this.achievementRepository.find({where: { mentee: { email: userEmail }}, relations: ["menthors"]})

        const participatedAchievements = await this.achievementRepository.find({where: { menthors: { email: userEmail }}, relations: ["mentee"]});

        return {
            achieved: achievements.map((achievement) => (
                {
                    description: achievement.description,
                    achievedDate: achievement.achievedDate, 
                    mentorsParticipated: achievement.menthors.map((menthor) => menthor.email)
                })),
            participated: participatedAchievements.map((achievement) => (
                {   
                    description: achievement.description,
                    achievedDate: achievement.achievedDate, 
                    mentee: achievement.mentee.email 
                }))
        }
    }

}

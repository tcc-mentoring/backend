import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createProfileDTOFromEntity } from "src/facade/ProfileFacade";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { AcademyEntry, Ocupation, Profile, ProfileDTO } from "./profile.entity";

@Injectable()
export class ProfileService {

    constructor(
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
    ){}

    async getUserInformations(email: string): Promise<ProfileDTO> {
        const userProfile = await this.profileRepository.findOne({
            relations: {
                academyEntries: true,
                ocupations: true
            },
            where: {
                user: {
                    email
                }
            }
        });

        if (userProfile) {
            return createProfileDTOFromEntity(userProfile);
        }

    }

    async linkProfileToNewUser(user: User): Promise<void> {
        const profile = new Profile();
        
        const academyEntries = [] as AcademyEntry[];
        const ocupations = [] as Ocupation[];

        profile.academyEntries = academyEntries;
        profile.ocupations = ocupations;

        profile.user = user;

        await this.profileRepository.save(profile);
    }
}
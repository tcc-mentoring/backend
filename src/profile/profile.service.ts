import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createOcupationEntityFromDTO, createProfileDTOFromEntity } from "src/facade/ProfileFacade";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { AcademyEntry, CreateOcupationDTO, Ocupation, OcupationDTO, Profile, ProfileDTO } from "./profile.entity";

@Injectable()
export class ProfileService {

    constructor(
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        @InjectRepository(Ocupation)
        private ocupationRepository: Repository<Ocupation>,
    ){}

    async getUserInformations(email: string): Promise<ProfileDTO> {
        const userProfile = await this.getUserProfileByEmail(email);

        if (userProfile) {
            return createProfileDTOFromEntity(userProfile);
        }
    }

    async createOcupationToUser(ocupationDTO: CreateOcupationDTO, email: string): Promise<void> {
        const userProfile = await this.getUserProfileByEmail(email);

        if (userProfile) {
            const ocupation = createOcupationEntityFromDTO(ocupationDTO);

            await this.ocupationRepository.save(ocupation)

            userProfile.ocupations.push(ocupation);

            this.profileRepository.save(userProfile);
        }
    }

    async getUserProfileByEmail(email: string): Promise<Profile> {
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

        return userProfile;
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
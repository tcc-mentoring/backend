import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createAcademyEntryFromDTO, createOcupationEntityFromDTO, createProfileDTOFromEntity } from "src/facade/ProfileFacade";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { AcademyEntry, AcademyEntryDTO, CreateOcupationDTO, Ocupation, OcupationDTO, Profile, ProfileDTO } from "./profile.entity";

@Injectable()
export class ProfileService {

    constructor(
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        @InjectRepository(Ocupation)
        private ocupationRepository: Repository<Ocupation>,
        @InjectRepository(AcademyEntry)
        private academyEntryRepository: Repository<AcademyEntry>
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

    async createAcademyEntryToUser(academyEntryDTO: AcademyEntryDTO, email: string): Promise<void> {
        const userProfile = await this.getUserProfileByEmail(email);

        if (userProfile) {
            const academyEntry = createAcademyEntryFromDTO(academyEntryDTO);

            await this.academyEntryRepository.save(academyEntry)

            userProfile.academyEntries.push(academyEntry);

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
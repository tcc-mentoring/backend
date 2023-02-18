import { AcademyEntryDTO, OcupationDTO, Profile, ProfileDTO } from "src/profile/profile.entity";

export function createProfileDTOFromEntity(profileEntity: Profile): ProfileDTO {
    const academyEntries = 
        profileEntity.academyEntries.map((academyEntry): AcademyEntryDTO => {
            return {
                    course: academyEntry.course,
                    startDate: academyEntry.startDate,
                    endDate: academyEntry.endDate,
                    institution: academyEntry.institution
            }
     });

    const ocupations = 
        profileEntity.ocupations.map((ocupation): OcupationDTO => {
            return {
                description: ocupation.description,
                    startDate: ocupation.startDate,
                    endDate: ocupation.endDate,
            }
    });

    return {
        academyEntries,
        ocupations
    }
}
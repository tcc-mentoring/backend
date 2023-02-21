import { AcademyEntry, AcademyEntryDTO, CreateOcupationDTO, Ocupation, OcupationDTO, Profile, ProfileDTO } from "src/profile/profile.entity";

export function createProfileDTOFromEntity(profileEntity: Profile): ProfileDTO {
    const academyEntries = 
        profileEntity.academyEntries.map((academyEntry): AcademyEntryDTO => {
            return {
                    id: academyEntry.id,
                    course: academyEntry.course,
                    startDate: academyEntry.startDate,
                    endDate: academyEntry.endDate,
                    institution: academyEntry.institution
            }
     });

    const ocupations = 
        profileEntity.ocupations.map((ocupation): OcupationDTO => {
            return {
                    id: ocupation.id,
                    company: ocupation.company,
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

export function createOcupationEntityFromDTO(ocupationDTO: CreateOcupationDTO): Ocupation {
    const ocupationEntity = new Ocupation();

    ocupationEntity.description = ocupationDTO.description;
    ocupationEntity.company = ocupationDTO.company;
    ocupationEntity.startDate = ocupationDTO.startDate;
    ocupationEntity.endDate = ocupationDTO.endDate; 

    return ocupationEntity;
}

export function createAcademyEntryFromDTO(academyEntryDTO: AcademyEntryDTO): AcademyEntry {
    const academyEntry = new AcademyEntry();

    academyEntry.course = academyEntryDTO.course;
    academyEntry.institution = academyEntryDTO.institution;
    academyEntry.startDate = academyEntryDTO.startDate;
    academyEntry.endDate = academyEntryDTO.endDate; 

    return academyEntry;
}

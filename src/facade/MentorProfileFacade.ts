import { CreateMentorProfileDTO, MentorProfile, MentorProfileDTO } from "src/mentor-profile/mentor-profile.entity";
import { userDTOfromEntity } from "./UserFacade";


export function mentorProfileEntityFromDTO(mentorProfileDTO: CreateMentorProfileDTO): MentorProfile {    
    const {selfDescription, knowledgeArea, specialties} = mentorProfileDTO;
    const mentorProfile = new MentorProfile();

    mentorProfile.knowledgeArea = knowledgeArea;
    mentorProfile.specialties = specialties.split(",");
    mentorProfile.selfDescription = selfDescription;
    
    return mentorProfile;
}

export function mentorProfileDTOFromEntity(mentorProfileEntity: MentorProfile): MentorProfileDTO {
    const {selfDescription, knowledgeArea, specialties} = mentorProfileEntity;
    const mentorProfile = new MentorProfileDTO();

    mentorProfile.knowledgeArea = knowledgeArea;
    mentorProfile.specialties = specialties;
    mentorProfile.selfDescription = selfDescription;
    mentorProfile.user = userDTOfromEntity(mentorProfileEntity.user);

    return mentorProfile;
}

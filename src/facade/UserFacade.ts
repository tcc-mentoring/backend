import { CreateUserDTO, User } from "src/users/user.entity";
import { v4 as uuidv4 } from 'uuid';

export function createUserEntityFromDTO(userDTO: CreateUserDTO, encryptedPassword: string): User {
    let newUser = new User();
    newUser.firstName = userDTO.firstName;
    newUser.lastName = userDTO.lastName;
    newUser.email = userDTO.email;
    newUser.password = encryptedPassword;
    newUser.userAuthUUID = uuidv4();

    return newUser;
}

export function userDTOfromEntity(userEntity: User) {
    let userDTO = new CreateUserDTO();
    userDTO.firstName = userEntity.firstName;
    userDTO.lastName = userEntity.lastName;
    userDTO.email = userEntity.email;
    return userDTO;
}
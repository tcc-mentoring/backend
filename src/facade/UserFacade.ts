import { CreateUserDTO, User } from "src/users/user.entity";

export function createUserEntityFromDTO(userDTO: CreateUserDTO, encryptedPassword: string): User {
    let newUser = new User();
    newUser.firstName = userDTO.firstName;
    newUser.lastName = userDTO.lastName;
    newUser.email = userDTO.email;
    newUser.password = encryptedPassword;
    newUser.userAuthUUID = crypto.randomUUID();

    return newUser;
}
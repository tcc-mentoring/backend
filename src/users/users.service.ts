import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validateOrReject } from "class-validator";
import { createUserEntityFromDTO, userDTOfromEntity } from "src/facade/UserFacade";
import { encryptPassword, passwordsMatch } from "src/utils/password";
import { Repository } from "typeorm";
import { AuthDetails, CreateUserDTO, LoginDTO, User, UserDTO } from "./user.entity";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(user: CreateUserDTO): Promise<AuthDetails>{
        await validateOrReject(user)
            .catch ((errors) => {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Validation error',
                    validationErrors: errors.map(error => error.property)
                  }, HttpStatus.BAD_REQUEST, {
                    cause: errors
                  });
            });

        const userExists = await this.userExistsByEmail(user.email);

        if (userExists) {
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                error: 'Validation error',
                message: [ 'uniqueMail']
              }, HttpStatus.BAD_REQUEST);
        }

        const encryptedPassword = await encryptPassword(user.password);
        const newUser = createUserEntityFromDTO(user, encryptedPassword);
        
        const {userAuthUUID} = await this.usersRepository.save(newUser);

        return {access_token: userAuthUUID};
    }


    findUserCredentialsByEmail(email: string): Promise<User> {
        return this.usersRepository.findOne({
            where: {
                email
            },
            select: ['email', 'password']
        });
    }

    async userExistsByEmail(email: string): Promise<boolean> {
        const existingUser = await this.findUserCredentialsByEmail(email);
        return !!existingUser;
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findCompleteUserByEmail(email: string): Promise<UserDTO> {
        const user = await this.usersRepository.findOne({
            where: {
                email
            }
        });
        
        if (user) {
            return userDTOfromEntity(user);
        }

        throw new HttpException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Invalid user error',
            message: ['invalidCredentials']
            }, HttpStatus.BAD_REQUEST);
    }
 

    async logout(userAuthUUID: string): Promise<void> {
        const user = await this.usersRepository.findOne({
            where: {
                userAuthUUID
            }
        });

        if (user) {
            const newAuthUUID = uuidv4();

            await this.usersRepository.update(user.id, { userAuthUUID:  newAuthUUID});
        }
        
        throw new HttpException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Not found',
            message: ['resourceNotFound']
            }, HttpStatus.BAD_REQUEST);
    }
}
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validateOrReject } from "class-validator";
import { createUserEntityFromDTO, userDTOfromEntity } from "src/facade/UserFacade";
import { ProfileService } from "src/profile/profile.service";
import { encryptPassword } from "src/utils/password";
import { Repository } from "typeorm";
import { CreateUserDTO, User, UserDTO } from "./user.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private profileService: ProfileService
    ) {}

    async create(user: CreateUserDTO): Promise<void>{
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
        
        try {
            await this.usersRepository.save(newUser);
            await this.profileService.linkProfileToNewUser(newUser);
        } catch (err) {
            throw new HttpException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Invalid user error',
                message: ['serverError']
                }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    findUserCredentialsByEmail(email: string): Promise<User> {
        return this.usersRepository.findOne({
            where: {
                email
            },
            select: ['email', 'password', 'id']
        });
    }

    async userExistsByEmail(email: string): Promise<boolean> {
        const existingUser = await this.findUserCredentialsByEmail(email);
        return !!existingUser;
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findCompleteUserByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: {
                email
            }
        });
        
        if (user) {
            return user;
        }

        throw new HttpException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Invalid user error',
            message: ['invalidCredentials']
            }, HttpStatus.BAD_REQUEST);
    }
}
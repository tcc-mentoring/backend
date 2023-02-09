import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validateOrReject } from "class-validator";
import { createUserEntityFromDTO } from "src/facade/UserFacade";
import { encryptPassword, passwordsMatch } from "src/utils/password";
import { Repository } from "typeorm";
import { AuthDetails, CreateUserDTO, LoginDTO, User } from "./user.entity";
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

        return {userAuthUUID};
    }
    }

    findUserByEmail(email: string): Promise<User> {
        return this.usersRepository.findOne({
            where: {
                email
            },
            select: ['email', 'password', 'id']
        });
    }

    async userExistsByEmail(email: string): Promise<boolean> {
        const existingUser = await this.findUserByEmail(email);
        return !!existingUser;
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

}
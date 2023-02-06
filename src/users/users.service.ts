import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validateOrReject } from "class-validator";
import { createUserEntityFromDTO } from "src/facade/UserFacade";
import { encryptPassword } from "src/utils/password";
import { Repository } from "typeorm";
import { CreateUserDTO, User } from "./user.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
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
        
        await this.usersRepository.save(newUser);
    }

    findUserByEmail(email: string): Promise<User[]> {
        return this.usersRepository.find({
            where: {
                email
            }
        });
    }

    async userExistsByEmail(email: string): Promise<boolean> {
        const existingUser = await this.findUserByEmail(email);
        return existingUser.length > 0;
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

}
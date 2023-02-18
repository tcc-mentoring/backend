import { Body, Controller, Get, Param, Post, } from "@nestjs/common";
import { AuthDetails, CreateUserDTO, User } from "./user.entity";
import { UsersService } from "./users.service";

@Controller('user')
export class UsersController {
    constructor(
        private usersService: UsersService,
    ) {}

    @Post()
    async create(@Body() createUserDTO: CreateUserDTO): Promise<AuthDetails> {
        return await this.usersService.create(createUserDTO);
    }

    @Get('/logout/:userAuthUUID')
    async logout(@Param() params): Promise<void> {
        await this.usersService.logout(params.userAuthUUID);
    }
 
    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
}
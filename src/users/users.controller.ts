import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common";
import { AuthDetails, CreateUserDTO, LoginDTO, User } from "./user.entity";
import { UsersService } from "./users.service";

@Controller('user')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDTO: CreateUserDTO): Promise<AuthDetails> {
        return await this.usersService.create(createUserDTO);
    }

    @Post('/login')
    async login(@Body() loginDTO: LoginDTO): Promise<AuthDetails> {
        const auth = await this.usersService.login(loginDTO);
        return auth;
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
}
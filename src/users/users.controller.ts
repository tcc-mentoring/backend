import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { AuthDetails, CreateUserDTO, LoginDTO, User, UserDTO } from "./user.entity";
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

    @Get('/auth/:userAuthUUID')
    async auth(@Param() params): Promise<UserDTO> {
        const user = await this.usersService.findUserByUUID(params.userAuthUUID);
        return user;
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
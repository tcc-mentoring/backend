import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthDetails, CreateUserDTO, LoginDTO, User, UserDTO } from "./user.entity";
import { UsersService } from "./users.service";

@Controller('user')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDTO: CreateUserDTO): Promise<AuthDetails> {
        return await this.usersService.create(createUserDTO);
    }

    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Request() req): Promise<AuthDetails> {
        return req.user;
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
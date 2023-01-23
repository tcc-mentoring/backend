import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common";
import { CreateUserDTO, User } from "./user.entity";
import { UsersService } from "./users.service";

@Controller('user')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDTO: CreateUserDTO): Promise<void> {
        await this.usersService.create(createUserDTO);
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
}
import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateUserDTO, User } from "./user.entity";
import { UsersService } from "./users.service";

@Controller('user')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    create(@Body() createUserDTO: CreateUserDTO): void {
        this.usersService.create(createUserDTO);
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
}
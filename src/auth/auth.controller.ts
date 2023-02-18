import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthDetails, UserDTO } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService,
        private userService: UsersService) { }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req): Promise<AuthDetails> {
        return await this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async auth(@Request() req): Promise<UserDTO> {
        const user = await this.userService.findCompleteUserByEmail(req.user)

        return user;
    }
}
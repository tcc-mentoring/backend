import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthDetails, UserDTO } from "src/users/user.entity";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req): Promise<AuthDetails> {
        return await this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async auth(@Request() req): Promise<UserDTO> {
        console.log('guard?')
        return req.user;
    }
}
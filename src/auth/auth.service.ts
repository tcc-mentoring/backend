import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userDTOfromEntity } from 'src/facade/UserFacade';
import { UserDTO } from 'src/users/user.entity';
import { passwordsMatch } from 'src/utils/password';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService
    ) {}

  async validateUser(email: string, password: string): Promise<UserDTO> {
    const user = await this.usersService.findUserCredentialsByEmail(email);

    const doesPasswordsMatch = await passwordsMatch(password, user?.password);
    
    if (user && doesPasswordsMatch) {
        return userDTOfromEntity(user);
    }

    return null;
  }

  async login(user: UserDTO) {
    const payload = { username: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

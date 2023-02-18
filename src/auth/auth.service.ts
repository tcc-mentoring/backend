import { Injectable } from '@nestjs/common';
import { userDTOfromEntity } from 'src/facade/UserFacade';
import { UserDTO } from 'src/users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<UserDTO> {
    const user = await this.usersService.findUserByEmail(email);

    if (user && user.password === password) {
        return userDTOfromEntity(user);
    }

    return null;
  }
}
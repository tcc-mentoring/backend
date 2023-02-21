import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserDTO } from 'src/users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<UserDTO> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
       throw new HttpException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: 'Validation error',
            message: ['invalidCredentials']
            }, HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
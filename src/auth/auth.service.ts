import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/use-cases/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isMatch = await this.usersService.checkPassword(
      password,
      user.password,
    );
    return isMatch ? user : null;
  }

  async signIn(user: any) {
    const db_user = await this.validateUser(user.email, user.password);
    if (!db_user) throw new Error('Invalid credentials');
    try {
      const payload = { email: db_user.email, sub: db_user._id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new Error('Error generating token');
    }
  }

  async signUp(user: any) {
    try {
      return await this.usersService.create(user);
    } catch (error) {
      throw new Error('Error creating user');
    }
  }
}

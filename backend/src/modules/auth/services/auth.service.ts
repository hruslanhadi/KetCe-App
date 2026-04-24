import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/modules/users/services/user.service';
import { LoginDto, RegisterDto } from '@/modules/auth/dtos/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.getUserByEmail(registerDto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await this.userService.createUser(registerDto);
    return this.generateToken(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await this.userService.validatePassword(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

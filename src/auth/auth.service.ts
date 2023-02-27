import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "../users/users.model";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService, // Inject the UsersService to interact with the user data
    private jwtService: JwtService // Inject the JwtService to generate JSON Web Tokens
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto); // Validate the user credentials
    return this.generateToken(user); // Generate a JWT token for the authenticated user
  }

  async registration(userDto: CreateUserDto) {
    // Check if the user role includes "USER" or "ADMIN" or "BOSS"
    if (
      !(
        userDto.role.includes("USER") ||
        userDto.role.includes("ADMIN") ||
        userDto.role.includes("BOSS")
      )
    ) {
      throw new HttpException(
        "You role must be a USER or a ADMIN or a BOSS",
        HttpStatus.BAD_REQUEST
      );
    }
    // Check if the user role includes "USER" and the boss with the given ID exists
    if (userDto.role.includes("USER")) {
      const boss = await this.userService.getBossById(userDto.bossId);
      if (!boss) {
        throw new HttpException(
          "Boss not found. You need add bossId or set correct bossId.",
          HttpStatus.BAD_REQUEST
        );
      }
    }

    // Check if the user role is "BOSS" or "ADMIN" and bossId is null
    if (userDto.role.includes("BOSS") || userDto.role.includes("ADMIN")) {
      if (userDto.bossId !== null) {
        throw new HttpException(
          "bossId must be null if you want be Boss or Admin",
          HttpStatus.BAD_REQUEST
        );
      }
    }

    // Check if the user with the given email already exists
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        "User registered with such email",
        HttpStatus.BAD_REQUEST
      );
    }

    // Hash the user password and create a new user
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    // Generate a JWT token for the newly registered user
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    // Create a payload object that contains user data to be stored in the token
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
      bossId: user.bossId,
    };
    // Sign the payload and return the JWT token
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    // Get the user with the given email from the database
    const user = await this.userService.getUserByEmail(userDto.email);
    // If the user does not exist, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException({
        message: "Not correct password or email",
      });
    }
    // Compare the user password with the given password
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password
    );
    // If the passwords match, return the user object
    if (user && passwordEquals) {
      return user;
    }
    // Otherwise, throw an UnauthorizedException
    throw new UnauthorizedException({
      message: "Not correct password or email",
    });
  }
}

import { Roles } from "./../auth/roles-auth.decorator";
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { Op } from "sequelize";

// Marking the class as injectable so that NestJS can inject its dependencies
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private jwtService: JwtService
  ) {}
  // Method for creating a new user
  async createUser(dto: CreateUserDto) {
    // If the user's role includes "USER"
    if (dto.role.includes("USER")) {
      // If the bossId is not provided in the request, throw a ForbiddenException
      if (!dto.bossId) {
        throw new ForbiddenException({
          message: "The bossId require",
        });
      }
      // Otherwise, create the user and return it
      const user = await this.userRepository.create(dto);
      return user;
    }
    // If the user's role does not include "USER", simply create the user and return it
    const user = await this.userRepository.create(dto);
    return user;
  }
  // Method for getting all users
  async getAllUsers(authHeader: string) {
    // Extract the JWT token from the Authorization header
    const token = authHeader.split(" ")[1];
    // Verify the token and extract the user information from it
    const user = this.jwtService.verify(token);
    // If the user's role includes "ADMIN", return all users
    if (user.role.includes("ADMIN")) {
      const users = await this.userRepository.findAll({
        include: { all: true },
      });
      return users;
    }
    // If the user's role includes "BOSS", return all users belonging to the boss and their subordinates
    if (user.role.includes("BOSS")) {
      // Find the boss's information
      const boss = await this.userRepository.findByPk(user.id);
      // If not find a boss
      if (!boss) {
        throw new UnauthorizedException({
          message: "Boss no found",
        });
      }
      // Find all the users that belong to the boss or to the boss's subordinates
      const users = await this.userRepository.findAll({
        where: {
          bossId: user.id,
        },
      });
      // Convert the list of users into a tree structure where each boss has their subordinates as children
      const usersBosArr = [boss].map((boss) => {
        const children = users;
        return {
          ...boss.toJSON(),
          children,
        };
      });
      // Stringify and then parse the tree structure to remove any circular references
      const stringify = JSON.stringify(usersBosArr);
      const result = JSON.parse(stringify);
      return result;
    }
    // If the user's role includes "USER", return the user's information
    if (user.role.includes("USER")) {
      // If the user does not have a boss, throw an UnauthorizedException
      if (!user.bossId) {
        throw new UnauthorizedException({
          message: "You must to have a boss",
        });
      }
      // Otherwise, find the user's information and return it
      const users = await this.userRepository.findByPk(user.id);
      return users;
    }
  }
  // Method for update a user by ids
  async updateUser(ids: {
    idBoss: string;
    authToken: string;
    idUser: number;
    newIdBoss: number;
  }) {
    // Extract the JWT token from the Authorization header
    const token = ids.authToken.split(" ")[1];
    // Verify the token and extract the user information from it
    const userTokenData = this.jwtService.verify(token);
    // Check if current bossId matches ids.idBoss
    if (!userTokenData.role.includes("BOSS")) {
      // Throw error if they don't match
      throw new ForbiddenException({
        success: false,
        message: "You must be to have a role BOSS if you want to change a boss",
      });
    }
    //find user
    const userData = await this.userRepository.findByPk(ids.idUser);
    if (!userData) {
      // Throw error if they don't match
      throw new ForbiddenException({
        success: false,
        message: "User not found",
      });
    }
    // Check if current bossId matches ids.idBoss
    if (+ids.idBoss !== userData.bossId) {
      // Throw error if they don't match
      throw new ForbiddenException({
        success: false,
        message: "You are not Boss for this user",
      });
    }

    // find boss
    const isUserBoss = await this.userRepository.findByPk(ids.newIdBoss);
    // Check if user is boss
    if (!isUserBoss) {
      // Throw error if they don't match
      throw new ForbiddenException({
        success: false,
        message: "Boss not found",
      });
    }

    // Update user data in repository
    await this.userRepository.update(
      { bossId: ids.newIdBoss },
      { where: { id: ids.idUser } }
    );
    // Return the resp
    return { success: true };
  }

  // Method for check is email in DB
  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }
  // Method for check is boss by id
  async getBossById(id: number) {
    const boss = await this.userRepository.findByPk(id);
    return boss;
  }
}

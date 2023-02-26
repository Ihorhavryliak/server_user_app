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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private jwtService: JwtService
  ) {}

  async createUser(dto: CreateUserDto) {
    //User
    if (dto.role.includes("USER")) {
      if (!dto.bossId) {
        throw new ForbiddenException({
          message: "The bossId require",
        });
      }
      const user = await this.userRepository.create(dto);
      return user;
    }
    //Admin / boss
    const user = await this.userRepository.create(dto);
    return user;
  }

  async getAllUsers(authHeader: string) {
    const token = authHeader.split(" ")[1];
    const user = this.jwtService.verify(token);

    if (user.role.includes("ADMIN")) {
      const users = await this.userRepository.findAll({
        include: { all: true },
      });
      return users;
    }

    if (user.role.includes("BOSS")) {
      const boss = await this.userRepository.findByPk(user.id);
      const users = await this.userRepository.findAll({
        where: {
          [Op.or]: [{ bossId: user.id }, { id: user.id }],
        },
      });

      const usersBosArr = [boss].map((boss) => {
        const children = users;
        return {
          ...boss.toJSON(),
          children,
        };
      });
      const stringify = JSON.stringify(usersBosArr);
      const result = JSON.parse(stringify);
      return result;
    }

    if (user.role.includes("USER")) {
      if (!user.bossId) {
        throw new UnauthorizedException({
          message: "Некорректный name или id Boss",
        });
      }
      const users = await this.userRepository.findByPk(user.id);
      return users;
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async updateUser(ids: { idBoss: string; idUser: number; newIdBoss: number }) {
    // find user
    console.log(ids);
    const userData = await this.userRepository.findByPk(ids.idUser);
    //check
    if (+ids.idBoss !== userData.bossId) {
      throw new ForbiddenException({
        success: false,
        message: "You are not Boss for this user",
      });
    }
    //update
    const user = await this.userRepository.update(
      { bossId: ids.newIdBoss },
      { where: { id: ids.idUser } }
    );
    return user;
  }
}

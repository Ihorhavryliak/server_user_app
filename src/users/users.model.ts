import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

interface UserCreationAttrs {
  email: string;
  password: string;
  role: string[];
  bossId: number;
  users: any;
}

@Table({ tableName: "users" })
export class User extends Model<User, UserCreationAttrs> {
  // This decorator adds an integer
  @ApiProperty({ example: "1", description: "Unique indemnificator" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  // This decorator adds a user's email
  @ApiProperty({ example: "user@gmail.com", description: "Email" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;
  // This decorator adds a user's password
  @ApiProperty({ example: "12345678", description: "Password" })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  // This decorator adds a number foreign key for a boss, if present
  @ApiProperty({
    example: "null",
    description: "Boss id",
  })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  bossId: number;
  //This decorator adds an array of strings which specifies each user's individual roles
  @ApiProperty({ example: "12345678", description: "User role" })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  role: string[];
}

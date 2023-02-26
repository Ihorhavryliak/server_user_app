import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
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
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "user@gmail.com", description: "Почтовый адрес" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: "12345678", description: "Пароль" })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({
    example: "null",
    description: "childId  - force on main post id",
  })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  bossId: number;

  @ApiProperty({ example: "12345678", description: "Пароль" })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  role: string[];
}

import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/users.model";
import { AuthModule } from "./auth/auth.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";

// Configuring App Module
@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, "static"),
    }),
    SequelizeModule.forRoot({
      dialect: "postgres", // For PostgreSQL
      host: process.env.POSTGRES_HOST, // Host URL
      port: Number(process.env.POSTGRES_PORT), // Port number
      username: process.env.POSTGRES_USER, // Username
      password: process.env.POSTGRES_PASSWORD, // Password
      database: process.env.POSTGRES_DB, // Database name
      models: [User], // Models from ./users/users.model
      autoLoadModels: true, // Auto load models
    }),
    UsersModule, // UsersModule
    AuthModule, // Authentication Module
  ],
})
export class AppModule {}

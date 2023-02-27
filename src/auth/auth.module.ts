import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";

// Import necessary dependencies and modules
@Module({
  // Import the AuthController to handle authentication-related requests
  controllers: [AuthController],
  // Import the AuthService to handle authentication-related business logic
  providers: [AuthService],
  // Import the UsersModule using forwardRef to avoid circular dependencies
  imports: [
    forwardRef(() => UsersModule),
    // Import the JwtModule and register it with a configuration object
    JwtModule.register({
      // Use the secret key defined in the environment variable PRIVATE_KEY or a default string "SECRET"
      secret: process.env.PRIVATE_KEY || "SECRET",
      // Set the token expiration time to 7 days
      signOptions: {
        expiresIn: "7d",
      },
    }),
  ],
  // Export the AuthService and JwtModule to make them available to other modules
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

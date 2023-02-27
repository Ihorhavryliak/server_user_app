import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService, // Injecting the JwtService to verify JWT tokens
    private reflector: Reflector // Injecting the Reflector service to retrieve metadata
  ) {}

  canActivate(
    context: ExecutionContext // Context object containing request and response
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()] // Retrieve the required roles from metadata
      );
      if (!requiredRoles) {
        return true; // No roles required, so return true
      }
      const req = context.switchToHttp().getRequest(); // Retrieve the request object from context
      const authHeader = req.headers.authorization; // Retrieve the authorization header
      const bearer = authHeader.split(" ")[0]; // Split the authorization header to get the bearer token
      const token = authHeader.split(" ")[1]; // Extract the token from the authorization header

      if (bearer !== "Bearer" || !token) {
        // Check if the token exists and is of the right type
        throw new UnauthorizedException({
          message: "User not authorized", // Throw an unauthorized exception if token is not valid
        });
      }

      const user = this.jwtService.verify(token); // Verify the token using JwtService
      req.user = user; // Attach the user object to the request object
      return user.roles.some((role) => requiredRoles.includes(role)); // Check if user has required roles
    } catch (e) {
      console.log(e); // Log any errors
      throw new HttpException("Not access", HttpStatus.FORBIDDEN); // Throw a forbidden exception if an error occurred
    }
  }
}

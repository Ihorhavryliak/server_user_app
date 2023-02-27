import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Extract the request object from the ExecutionContext
    const req = context.switchToHttp().getRequest();

    try {
      // Extract the authorization header and JWT token from the request header
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(" ")[0];
      const token = authHeader.split(" ")[1];

      // Ensure the authorization header is in the expected format
      if (bearer !== "Bearer" || !token) {
        throw new UnauthorizedException({
          message: "User not authorized",
        });
      }

      // Verify the JWT token and set the user object on the request
      const user = this.jwtService.verify(token);
      req.user = user;

      // Allow the request to proceed
      return true;
    } catch (e) {
      // If there was an error, reject the request with an UnauthorizedException
      throw new UnauthorizedException({
        message: "User not authorized",
      });
    }
  }
}

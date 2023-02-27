import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";

@ApiTags("Authorization")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  //log in
  @ApiOperation({
    summary: "Sign in",
    description: `For sign in you need:</br>1. Email. </br>2. Password</br></br>
    Example: { "email": "user@gmail.com", "password": "12345" }`,
  })
  @ApiResponse({
    status: 200,
    description: `Response <strong> {token: 'fds32gg334g43g43g}</strong>`,
  })
  @Post("/login")
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }
  //registration
  @ApiOperation({
    summary: "Sign up",
    description: `For sign in you need:</br></br>
    If you role ADMIN.</br>
    1. Set role ADMIN, example: role: [ADMIN],</br>
    2. Set bossId null, example: bossId: null.</br></br>
    If you role BOSS.</br>
    1. Set role BOSS, example: role: [BOSS],</br>
    2. Set bossId null, example: bossId: null.</br>
    If you role USER.</br></br>
    1. Set role USER, example: role: [USER],</br>
    2. Set bossId 4 - it is boss, example: bossId: 4.</br></br>
    Require bossId - number.</br>
    Example: {"email": "user@gmail.com", "password": "12345",  "role": ["USER"], "bossId": 4}</br>`,
  })
  @ApiResponse({
    status: 200,
    description: `Response <strong> {token: 'fds32gg334g43g43g}</strong>`,
  })
  @Post("/registration")
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }
}

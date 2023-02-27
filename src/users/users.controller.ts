import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}
// Get all users
  @ApiOperation({
    summary: "Get users",
    description: `You can get users depend or role: [ADMIN, USER, BOSS].</br> 
  If you role <strong>ADMIN</strong>, you get all data. </br> 
  If you role <strong>BOSS</strong>, you get data yourself and all subordinates.</br> 
  If you role <strong>USER</strong>, you get data yourself.</br> 
  For get data you need have a <strong> 'Bearer token' </strong> (you can get token after Sign in or Sign up)`,
  })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Headers("authorization") authHeader: string) {
    return this.usersService.getAllUsers(authHeader);
  }
// Update user
  @ApiOperation({
    summary: "Update user",
    description: `You can update user. For it you need:</br>
  0.You need be authorized</br>
  1.Your id (add in request query, example: http://localhost:5000/users/yourId:<strong> http://localhost:5000/users/6 </strong>)</br>
  In body request set (example: {idUser: 6, newIdBoss: 5}):</br>
  2.<strong>idUser</strong>, who you want to update <strong>(you can update only for your subordinates)</strong></br>
  3.<strong>newIdBoss</strong> id </br></br>
  <strong> All ids must be a number.</strong></br></br>
  For update user you need have a 'Bearer token' (you can get token after Sign in or Sign up)`,
  })
  @ApiResponse({ status: 200, type: User , description: '<strong>Response: { "success": true }</strong>'})
  @UseGuards(JwtAuthGuard)
  @Put("/:idBoss")
  change(
    @Param("idBoss") idBoss: string,
    @Body() userData: { idUser: number; newIdBoss: number },
    @Headers("authorization") authToken: string
  ) {
    return this.usersService.updateUser({ idBoss,authToken, ...userData });
  }
}

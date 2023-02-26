import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles-auth.decorator";
import { RolesGuard } from "../auth/roles.guard";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}
  //swagger start
  @ApiOperation({description: "This is the main Description of an Endpoint."})
  /// Request Documentation
  @ApiParam({
      name: "name",
      description: "This Decorator specifies the documentation for a specific Parameter, in this case the <b>name</b> Param.",
      allowEmptyValue: false,
      examples: {
          a: {
              summary: "Name is Pete",
              description: "Pete can be provided as a name. See how it becomes a selectable option in the dropdown",
              value: "Pete"
          },
          b: {
              summary: "Name is Joe",
              value: "Joe"
          }
      }
  })
  @ApiQuery({
      name: "useExclamation",
      description: "This is the description of a query argument. In this instance, we have a boolean value.",
      type: Boolean,
      required: false // This value is optional
  })
  @ApiBody({
      type: `PostHelloBodyDTO`,
      description: "The Description for the Post Body. Please look into the DTO. You will see the @ApiOptionalProperty used to define the Schema.",
      examples: {
          a: {
              summary: "Empty Body",
              description: "Description for when an empty body is used",
              value: `{} as PostHelloBodyDTO`
          },
          b: {
              summary: "Hello Body",
              description: "Hello is used as the greeting",
              value: `{greeting: "Hello"} as PostHelloBodyDTO`
          }
      }
  
  })
  /// Response Documentation
  @ApiOkResponse({
      description: "This description defines when a 200 (OK) is returned. For @Get-Annotated Endpoints this is always present. When, for example, using a @Post-Endpoint, a 201 Created is always present",
      schema: {
          type: "string",
          example: "Hello, Pete!"
          // For instructions on how to set a Schema, please refer to https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schema-object-examples
      }
  })
  @ApiBadRequestResponse({
      description: "This description is for a 400 response. It is returned when additional query params are passed, or when the <b>useExclamation</b>-Argument could not be parsed as a boolean."
  })
  @ApiResponse({ status: 200, type: User })

  @ApiBearerAuth()

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Headers("authorization") authHeader: string) {
    return this.usersService.getAllUsers(authHeader);
  }

  @ApiOperation({ summary: "Создание пользователя" })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @Put("/:idBoss")
  change(
    @Param("idBoss") idBoss: string,
    @Body() userData: { idUser: number; newIdBoss: number }
  ) {
    return this.usersService.updateUser({ idBoss, ...userData });
  }
}

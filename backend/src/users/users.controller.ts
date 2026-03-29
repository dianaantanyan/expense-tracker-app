import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dtos/register-user.dto';


/**
 * Controller to manage all User-related operations.
 */
@ApiTags('User Module')
@Controller('user')
export class UserController {
    public constructor(private readonly userService: UserService) {}

    /**
     * Registers a new user.
     *
     * @param {RegisterUserDto} createUserDto - The user registration data.
     * @returns {Promise<User>} The newly created user entity.
     */
    @ApiOperation({ summary: 'Register a new user' })
    @ApiOkResponse({ type: () => User, description: 'User registered successfully' })
    @ApiBody({ type: () => RegisterUserDto, description: 'User registration data' })
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('/register')
    public async register(
        @Body() createUserDto: RegisterUserDto,
    ): Promise<User> {
        return this.userService.register(createUserDto);
    }
}
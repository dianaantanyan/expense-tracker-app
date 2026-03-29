import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
    UnauthorizedException,
    UseInterceptors,
    ClassSerializerInterceptor
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
  } from '@nestjs/swagger';
  import express from 'express';

  import { AuthService } from './auth.service';
  import { TokenPairDto } from './dtos/token-pair.dto';
  import { LoginDto } from './dtos/login.dto';
  import { JwtGuard } from './guards/jwt.guard';
import { UserService } from '../users/users.service';
  
  @ApiTags('Authentication')
  @Controller('auth')
  export class AuthController {
      public constructor(
          private readonly authService: AuthService,
          private readonly userService: UserService
      ) {}
  
      /**
       * Logs in a user with the provided credentials.
       *
       * @param loginDto - The login credentials.
       * @returns Access and refresh tokens.
       * @throws UnauthorizedException - If the email or password is incorrect.
       */
      @ApiOperation({ summary: 'Log in as a user' })
      @ApiOkResponse({ type: () => TokenPairDto, description: 'Successfully authenticated' })
      @ApiBody({ type: () => LoginDto, description: 'Login credentials' })
      @UseInterceptors(ClassSerializerInterceptor)
      @Post('/login')
      public async login(@Body() loginDto: LoginDto): Promise<TokenPairDto> {
          const user = await this.userService.findByEmail(loginDto.email);
          if (!user) throw new UnauthorizedException('Email or password is incorrect');
          return await this.authService.login(loginDto.email, loginDto.password);
      }
  
      /**
       * Logs out the current user.
       *
       * @param req - The request containing the authenticated user.
       * @returns A confirmation message.
       * @throws UnauthorizedException - If session is invalid.
       */
      @ApiOperation({ summary: 'Logout user' })
      @ApiOkResponse({ description: 'Logged out successfully' })
      @ApiBearerAuth()
      @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
      @UseGuards(JwtGuard)
      @UseInterceptors(ClassSerializerInterceptor)
      @Post('/logout')
      public async logout(@Req() req: express.Request): Promise<{ message: string }> {
        const user = req.user as { userId: number };
        if (!user?.userId) throw new UnauthorizedException('Invalid session');
        return await this.authService.logout(user.userId);
    }
  
      /**
       * Refreshes the access token using a valid refresh token.
       *
       * @param tokenPair - The current token pair.
       * @returns A new access token and refresh token.
       */
      @ApiOperation({ summary: 'Refresh user access token' })
      @ApiOkResponse({ type: () => TokenPairDto, description: 'Access token refreshed successfully' })
      @ApiBody({ type: TokenPairDto })
      @UseInterceptors(ClassSerializerInterceptor)
      @Post('/refresh')
      public async refresh(@Body() tokenPair: TokenPairDto): Promise<TokenPairDto> {
          return await this.authService.refreshAccessToken(tokenPair.refresh_token);
      }
  }
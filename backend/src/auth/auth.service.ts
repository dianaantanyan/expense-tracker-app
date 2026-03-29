import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtUserPayload } from "./dtos/user-payload.dto";
import * as bcrypt from 'bcrypt';
import { TokenPairDto } from "./dtos/token-pair.dto";

const ACCESS_TOKEN_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = '7d';
const SALT_ROUNDS = 10;

@Injectable() 
export class AuthService {
    public constructor( 
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    /**
     * Authenticates a user.
     *
     * @param {string} email - The user's email address.
     * @param {string} password - The user 's plain password.
     * @throws {UnauthorizedException} - Throws an exception if credentials are invalid.
     * @returns {Promise<TokenPairDto>} The access and refresh tokens.
     */
    public async login(email: string, password: string): Promise<TokenPairDto> {
        const normalizedEmail = email.trim().toLowerCase();

        const user = await this.userRepository.findOne({
            where: { email: normalizedEmail },
            select: ['id', 'email', 'password'],
        });

    if (!user) throw new UnauthorizedException('Invalid credentials.');

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) throw new UnauthorizedException('Invalid credentials.');

    const payload: JwtUserPayload = { userId: user.id, email: user.email };

    const access_token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_USER_SECRET'),
        expiresIn: ACCESS_TOKEN_EXPIRATION,
    });

    const refresh_token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_USER_REFRESH_SECRET'),
        expiresIn: REFRESH_TOKEN_EXPIRATION,
    });

    const refreshTokenHash = await bcrypt.hash(refresh_token, SALT_ROUNDS);

    await this.userRepository.update(user.id, { refreshTokenHash });

    return { access_token, refresh_token };
    }

    /**
     * Logs out a user by invalidating their refresh token.
     *
     * @param {number} userId - The ID of the user to log out.
     * @returns {Promise<void>} - A promise that resolves when the logout is successful.
     */
    public async logout(userId: number): Promise<{ message: string }> {
        await this.userRepository.update(userId, { refreshTokenHash: null });

        return { message: 'Logout successful.' };
    }

    /**
     * Refreshes the access and refresh tokens.
     * 
     * @param {string} refreshToken - The refresh token provided by the user.
     * @throws {UnauthorizedException} - Throws and exception if the refresh token is invalid or not found.
     * @returns {Promise<TokenPairDto>} - The new access and refresh tokens.
     */
    public async refreshAccessToken(refreshToken: string): Promise<TokenPairDto> {
        let payload: JwtUserPayload;

        try {
            payload = this.jwtService.verify<JwtUserPayload>(refreshToken, {
                secret: this.configService.get<string>('JWT_USER_REFRESH_SECRET'),
            });
        } catch {
             throw new UnauthorizedException('Invalid or expired refresh token.');
        }

        const user = await this.userRepository.findOne({
            where: { id: payload.userId },
            select: ['id', 'refreshTokenHash', 'email'],
        });

        if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Refresh token not found.');

        const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);

        if (!isValid) throw new UnauthorizedException('Invalid refresh token.');

        const newPayload: JwtUserPayload = { userId: user.id, email: user.email };

        const access_token = this.jwtService.sign(newPayload, {
           secret: this.configService.get<string>('JWT_USER_SECRET'),
           expiresIn: ACCESS_TOKEN_EXPIRATION,
        });

        const new_refresh_token = this.jwtService.sign(newPayload, {
           secret: this.configService.get<string>('JWT_USER_REFRESH_SECRET'),
           expiresIn: REFRESH_TOKEN_EXPIRATION,
        });

        const newRefreshTokenHash = await bcrypt.hash(new_refresh_token, SALT_ROUNDS);

        await this.userRepository.update(user.id, { refreshTokenHash: newRefreshTokenHash });

        return { access_token, refresh_token: new_refresh_token };
    }

    /**
     * Decodes a given access token and returns its payload.
     * 
     * @param {string} accessToken - The JWT access token to decode.
     * @returns {JwtUserPayload | null} The decoded payload or null if invalid.
     */
    public decodeAccessToken(accessToken: string): JwtUserPayload | null {
        return this.jwtService.decode(accessToken) as JwtUserPayload | null;
    }


}
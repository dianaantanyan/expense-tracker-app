import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
    /**
     * Represents the email address of the user.
     * 
     * @type {string}
     */
    @ApiProperty({ description: 'User email', example: 'user@example.com' })
    @IsString()
    public readonly email: string;

    /**
     * Represents the password of the user.
     *
     * @type {string}
     */
    @ApiProperty({ description: 'User password', example: 'StrongPassword123!' })
    @IsString()
    public readonly password: string;
}
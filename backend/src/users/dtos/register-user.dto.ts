import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for registering a new user.
 */
export class RegisterUserDto {
    /**
     * Full name of the user.
     */
    @ApiProperty({ description: 'Full name of the user', example: 'Jack Johnson' })
    @IsString()
    @IsNotEmpty()
    public fullName: string;

    /**
     * Plain text password.
     */
    @ApiProperty({ description: 'User password', example: 'secret123' })
    @IsString()
    @IsNotEmpty()
    public password: string;

    /**
     * Email address of the user.
     */
    @ApiProperty({ description: 'Email address', example: 'jack.johnson@example.com' })
    @IsString()
    @IsNotEmpty()
    public email: string;

    /**
     * Phone number of the user.
     */
    @ApiPropertyOptional({ description: 'Phone number', example: '+37477777777' })
    @IsString()
    @IsOptional()
    public phone?: string;
}
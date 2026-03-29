import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TokenPairDto {
    /**
     * Represents the access token for authentication.
     * 
     * @type {string}
     */
    @ApiProperty({ description: 'Access token', example: 'eyX12GciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    @IsString()
    public readonly access_token: string;

    /**
     * Represents the refresh token for authentication.
     * 
     * @type {string}
     */
    @ApiProperty({ description: 'Refresh token', example: 'eyX12GciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    @IsString()
    public readonly refresh_token: string;
}
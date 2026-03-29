import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailDto {
    /**
     * Represents the email address of the user.
     * 
     * @type {string}
     */
    @ApiProperty({ description: 'Email of the user' })
    @IsString()
    @IsNotEmpty()
    public readonly email: string;
}
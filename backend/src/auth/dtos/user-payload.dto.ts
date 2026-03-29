import { ApiProperty } from '@nestjs/swagger';

export class JwtUserPayload {
    /**
     * Represents the ID of the user.
     * 
     * @type {number}
     * 
     */
    @ApiProperty({ description: 'The ID of the user', example: 1 })
    public userId: number;

    /**
     * Represents the email of the user.
     * 
     * @type {string}
     */
    @ApiProperty({ description: 'The email of the user', example: 'user@email.com' })
    public email: string;
}
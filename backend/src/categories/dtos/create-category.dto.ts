import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for creating a category.
 */
export class CreateCategoryDto {
    /**
     * Name of the category.
     */
    @ApiProperty({ type: String, description: 'Category name', example: 'Food' })
    @IsString()
    @IsNotEmpty()
    public name: string;
}
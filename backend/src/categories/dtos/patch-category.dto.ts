import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * DTO for updating a category.
 */
export class UpdateCategoryDto {
    /**
     * Name of the category.
     */
    @ApiPropertyOptional({ type: String, description: 'Category name' })
    @IsOptional()
    @IsString()
    public name?: string;
}
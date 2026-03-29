import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString, IsOptional, IsInt, IsDateString } from 'class-validator';

/**
 * DTO for creating an expense.
 */
export class CreateExpenseDto {
    /**
     * Expense amount.
     */
    @ApiProperty({ type: Number, description: 'Expense amount', example: 50.25 })
    @IsNumber()
    @IsNotEmpty()
    public amount: number;

    /**
     * Expense date (YYYY-MM-DD).
     */
    @ApiProperty({ type: String, description: 'Expense date', example: '2026-03-28' })
    @IsDateString()
    @IsNotEmpty()
    public date: string;

    /**
     * Optional note for the expense.
     */
    @ApiPropertyOptional({ type: String, description: 'Optional note', example: 'Dinner' })
    @IsOptional()
    @IsString()
    public note?: string;

    /**
     * User ID (owner of the expense).
     */
    @ApiProperty({ type: Number, description: 'User ID', example: 1 })
    @IsInt()
    @IsNotEmpty()
    public user_id: number;

    /**
     * Category ID.
     */
    @ApiProperty({ type: Number, description: 'Category ID', example: 1 })
    @IsInt()
    @IsNotEmpty()
    public category_id: number;
}
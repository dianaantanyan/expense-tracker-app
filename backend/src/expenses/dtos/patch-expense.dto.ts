import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsDateString, IsInt } from 'class-validator';

/**
 * DTO for updating an expense.
 */
export class UpdateExpenseDto {
    /**
     * Expense amount.
     */
    @ApiPropertyOptional({ type: Number, description: 'Expense amount' })
    @IsOptional()
    @IsNumber()
    public amount?: number;

    /**
     * Expense date (YYYY-MM-DD).
     */
    @ApiPropertyOptional({ type: String, description: 'Expense date' })
    @IsOptional()
    @IsDateString()
    public date?: string;

    /**
     * Optional note.
     */
    @ApiPropertyOptional({ type: String, description: 'Optional note' })
    @IsOptional()
    @IsString()
    public note?: string;

    /**
     * User ID (owner of the expense).
     */
    @ApiPropertyOptional({ type: Number, description: 'User ID' })
    @IsOptional()
    @IsInt()
    public user_id?: number;

    /**
     * Category ID.
     */
    @ApiPropertyOptional({ type: Number, description: 'Category ID' })
    @IsOptional()
    @IsInt()
    public category_id?: number;
}
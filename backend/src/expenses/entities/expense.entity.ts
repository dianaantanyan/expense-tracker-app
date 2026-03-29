import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

/**
 * Expense entity representing user expenses.
 */
@Entity('expenses')
export class Expense extends CommonEntity {
  /**
   * Expense amount.
   */
  @ApiProperty({ example: 50.25 })
  @IsNumber()
  @IsNotEmpty()
  @Column('decimal', { precision: 10, scale: 2 })
  public amount: number;

  /**
   * Expense date.
   */
  @ApiProperty({ example: '2026-03-28T12:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  @Column({ type: 'timestamp' })
  public date: Date;

  /**
   * Optional note.
   */
  @ApiPropertyOptional({ example: 'Dinner' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  public note?: string;

  /**
   * Owner of expense.
   */
  @ManyToOne(() => User, (user) => user.expenses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: User;

  /**
   * Category of expense.
   */
  @ManyToOne(() => Category, (category) => category.expenses, { eager: true })
  @JoinColumn({ name: 'category_id' })
  public category: Category;
}
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Expense } from '../../expenses/entities/expense.entity';

/**
 * Category entity supporting both global and user-defined categories.
 */
@Entity('categories')
export class Category extends CommonEntity {
  /**
   * Category name.
   */
  @ApiProperty({ example: 'Food' })
  @IsString()
  @IsNotEmpty()
  @Column()
  public name: string;

  /**
   * Indicates if category is global (predefined).
   */
  @ApiProperty({ example: true })
  @Column({ default: false })
  public isGlobal: boolean;

  /**
   * Relation to user (only for custom categories).
   */
  @ManyToOne(() => User, (user) => user.categories, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) 
  public user?: User;

  @Column({ name: 'user_id', nullable: true })
  public userId?: number;
  /**
   * Expenses under this category.
   */
  @OneToMany(() => Expense, (expense) => expense.category)
  public expenses: Expense[];
}
import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Expense } from '../../expenses/entities/expense.entity';
import { Category } from '../../categories/entities/category.entity';

/**
 * User class representing a user entity in the database.
 */
@Entity('users')
export class User extends CommonEntity {
    /**
     * The full name of the user.
     *
     * @type {string}
     */
    @ApiProperty({ description: 'Full name of the user', example: 'Name Surname' })
    @IsString()
    @IsNotEmpty()
    @Column({ nullable: false })
    public fullName: string;

    /**
     * The hashed password of the user.
     *
     * @type {string}
     */
    @Exclude({ toPlainOnly: true })
    @ApiProperty({ description: 'User password (hashed)', example: '$2b$10$abcDEF...', writeOnly: true })
    @IsString()
    @IsNotEmpty()
    @Column({ nullable: false })
    public password: string;

    /**
     * The email address of the user.
     *
     * @type {string}
     */
    @ApiProperty({ description: 'Email address of the user', example: 'user@example.com' })
    @IsEmail()
    @Column({ unique: true })
    public email: string;

    /**
     * The phone number of the user.
     *
     * @type {string | undefined}
     */
    @ApiPropertyOptional({ description: 'Phone number', example: '+374 10 100 100' })
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    public phone?: string;

    /**
     * The hashed refresh token of the user.
     *
     * @type {string | null}
     */
    @Exclude({ toPlainOnly: true })
    @ApiPropertyOptional({
        description: 'Hashed refresh token (read-only)',
        example: '$2b$10$abcDEF...',
    })
    @IsString()
    @IsOptional()
    @Column({type: 'text', nullable: true })
    public refreshTokenHash: string | null;

    /**
     * The list of expenses owned by the user.
     *
     * @type {Expense[]}
     */
    @ApiPropertyOptional({
        type: () => [Expense],
        description: 'An array of user expenses',
        isArray: true,
    })
    @OneToMany(() => Expense, (expense) => expense.user)
    public expenses: Expense[];

    /**
     * Custom categories created by the user.
     */
    @OneToMany(() => Category, (category) => category.user)
    public categories: Category[];
}
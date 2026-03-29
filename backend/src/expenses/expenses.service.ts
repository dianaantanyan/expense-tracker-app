import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { UpdateExpenseDto } from './dtos/patch-expense.dto';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  /**
   * Retrieve a single expense by ID.
   *
   * @param id - Expense ID
   * @returns The expense entity
   * @throws NotFoundException if not found
   */
  public async findOne(id: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['category', 'user'],
    });

    if (!expense) throw new NotFoundException(`Expense with ID #${id} not found.`);
    return expense;
  }

  /**
   * Retrieve all expenses for a user with optional filters.
   *
   * @param userId - User ID
   * @param startDate - Optional start date filter
   * @param endDate - Optional end date filter
   * @param categoryId - Optional category filter
   * @returns Array of filtered expenses
   */
  public async findAll(
    userId: number,
    startDate?: string,
    endDate?: string,
    categoryId?: number,
  ): Promise<Expense[]> {
    const where: any = { user: { id: userId } };

    if (startDate && endDate) {
      where.date = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      where.date = Between(new Date(startDate), new Date());
    }

    if (categoryId) where.category = { id: categoryId };

    return await this.expenseRepository.find({
      where,
      relations: ['category'],
      order: { date: 'DESC' },
    });
  }

  /**
   * Create a new expense for a user.
   *
   * @param createExpenseDto - DTO containing expense data
   * @returns The created expense
   * @throws NotFoundException if user or category does not exist
   */
  public async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const user = await this.userRepository.findOne({ where: { id: createExpenseDto.user_id } });
    if (!user) throw new NotFoundException(`User with ID #${createExpenseDto.user_id} not found.`);

    const category = await this.categoryRepository.findOne({ where: { id: createExpenseDto.category_id } });
    if (!category) throw new NotFoundException(`Category with ID #${createExpenseDto.category_id} not found.`);

    const expense = this.expenseRepository.create({
      amount: createExpenseDto.amount,
      date: new Date(createExpenseDto.date),
      note: createExpenseDto.note,
      user,
      category,
    });

    return await this.expenseRepository.save(expense);
  }

  /**
   * Update an existing expense by ID.
   *
   * @param id - Expense ID
   * @param updateExpenseDto - DTO containing fields to update
   * @returns The updated expense
   * @throws NotFoundException if expense, user, or category not found
   */
  public async update(id: number, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
    const expense = await this.findOne(id);

    if (updateExpenseDto.user_id) {
      const user = await this.userRepository.findOne({ where: { id: updateExpenseDto.user_id } });
      if (!user) throw new NotFoundException(`User with ID #${updateExpenseDto.user_id} not found.`);
      expense.user = user;
    }

    if (updateExpenseDto.category_id) {
      const category = await this.categoryRepository.findOne({ where: { id: updateExpenseDto.category_id } });
      if (!category) throw new NotFoundException(`Category with ID #${updateExpenseDto.category_id} not found.`);
      expense.category = category;
    }

    if (updateExpenseDto.amount !== undefined) expense.amount = updateExpenseDto.amount;
    if (updateExpenseDto.date) expense.date = new Date(updateExpenseDto.date);
    if (updateExpenseDto.note !== undefined) expense.note = updateExpenseDto.note;

    return await this.expenseRepository.save(expense);
  }

  /**
   * Soft-delete an expense by ID.
   *
   * @param id - Expense ID
   */
  public async delete(id: number): Promise<void> {
    await this.expenseRepository.softDelete(id);
  }

  /**
   * Calculate the total sum of expenses for a user with optional filters.
   *
   * @param userId - User ID
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   * @param categoryId - Optional category filter
   * @returns Total sum of expenses
   */
  public async getTotal(
    userId: number,
    startDate?: string,
    endDate?: string,
    categoryId?: number,
  ): Promise<number> {
    const where: any = { user: { id: userId } };

    if (startDate && endDate) where.date = Between(new Date(startDate), new Date(endDate));
    if (categoryId) where.category = { id: categoryId };

    const total = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'sum')
      .where(where)
      .getRawOne();

    return Number(total.sum) || 0;
  }
}
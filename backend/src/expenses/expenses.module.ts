import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpenseService } from './expenses.service';
import { ExpenseController } from './expenses.controller';import { Expense } from './entities/expense.entity';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';


@Module({
  controllers: [ExpenseController],
  providers: [ExpenseService],
  imports: [TypeOrmModule.forFeature([Expense, Category, User])],
  exports: [TypeOrmModule],
})
export class ExpenseModule {}
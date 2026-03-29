import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryController } from './categories.controller';
import { CategoryService } from './categories.service';
import { Category } from './entities/category.entity';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [TypeOrmModule.forFeature([Category])],
  exports: [TypeOrmModule],
})
export class CategoryModule {}
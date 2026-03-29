import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/patch-category.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CategoryService {
  public constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Retrieves a category by ID, including user and expenses relations.
   *
   * @param id - Category ID.
   * @returns The category if found.
   * @throws {NotFoundException} if category is not found.
   */
  public async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['user', 'expenses'],
    });

    if (!category) throw new NotFoundException(`Category with ID #${id} not found.`);
    return category;
  }

  /**
   * Finds all categories, either global or user-specific.
   *
   * @param userId - Optional user ID to filter user-specific categories.
   * @returns Array of categories.
   */
  public async findAll(userId?: number): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: userId
        ? [{ userId }, { isGlobal: true }] // user-specific + global
        : { isGlobal: true },
      relations: ['user', 'expenses'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Creates a new category.
   *
   * @param createCategoryDto - DTO containing category details.
   * @param userId - Optional user ID for user-specific categories.
   * @returns The created category.
   * @throws {ConflictException} if a category with the same name exists for the user.
   */
  public async create(createCategoryDto: CreateCategoryDto, userId: number): Promise<Category> {
    const existing = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name,
        userId,
      },
    });

    if (existing) throw new ConflictException(`Category '${createCategoryDto.name}' already exists.`);

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      userId,
    });

    return await this.categoryRepository.save(category);
  }
  /**
   * Updates a category by ID.
   *
   * @param id - Category ID.
   * @param updateCategoryDto - DTO containing fields to update.
   * @returns The updated category.
   * @throws {NotFoundException} if category is not found.
   * @throws {ConflictException} if updating name conflicts with another category.
   */
  public async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException(`Category with ID #${id} not found.`);

    if (updateCategoryDto?.name !== category.name) {
      const existing = await this.categoryRepository.findOne({
        where: {
          name: updateCategoryDto.name,
          userId: category.userId ?? undefined, 
        },
      });

      if (existing) throw new ConflictException(`Category '${updateCategoryDto.name}' already exists.`);
    }

    const updatedCategory = { ...category, ...updateCategoryDto };
    return await this.categoryRepository.save(updatedCategory);
  }

  /**
   * Soft deletes a category by ID.
   *
   * @param id - Category ID.
   */
  public async delete(id: number): Promise<void> {
    await this.categoryRepository.softDelete(id);
  }
}
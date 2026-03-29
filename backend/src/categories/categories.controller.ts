import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    ParseIntPipe,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiBody,
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiBearerAuth,
    ApiQuery,
  } from '@nestjs/swagger';
  import { JwtGuard } from '../auth/guards/jwt.guard';
  import { Category } from './entities/category.entity';
  import { CreateCategoryDto } from './dtos/create-category.dto';
  import { UpdateCategoryDto } from './dtos/patch-category.dto';
import { CategoryService } from './categories.service';
  
  /**
   * Controller to manage all Category-related operations.
   */
  @ApiTags('Category Module')
  @Controller('category')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  export class CategoryController {
    public constructor(private readonly categoryService: CategoryService) {}
  
    /**
     * Retrieves a single category by its ID.
     *
     * @param id - The ID of the category.
     * @returns The category entity with its details.
     */
    @ApiOperation({ summary: 'Get Category by ID' })
    @ApiParam({ name: 'id', description: 'ID of the category' })
    @ApiOkResponse({ type: Category, description: 'Category retrieved successfully' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get('/:id')
    public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
      return await this.categoryService.findOne(id);
    }
  
    /**
     * Retrieves all categories.
     * Optionally filters by user ID to include user-specific categories and global categories.
     *
     * @param userId - Optional user ID to filter categories.
     * @returns Array of categories.
     */
    @ApiOperation({ summary: 'Get all categories (global + user-specific)' })
    @ApiQuery({ name: 'userId', description: 'Optional user ID to filter categories', required: false })
    @ApiOkResponse({ type: [Category], description: 'Categories retrieved successfully' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get('/')
    public async findAll(@Query('userId') userId?: number): Promise<Category[]> {
      return await this.categoryService.findAll(userId);
    }
  
    /**
     * Creates a new category.
     *
     * @param createCategoryDto - DTO containing category details.
     * @param userId - ID of the user creating the category (for custom categories).
     * @returns The newly created category.
     */
    @ApiOperation({ summary: 'Create a new category' })
    @ApiBody({ type: CreateCategoryDto, description: 'Category data to create' })
    @ApiOkResponse({ type: Category, description: 'Category created successfully' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post('/')
    public async create(
      @Body() createCategoryDto: CreateCategoryDto,
      @Query('userId', ParseIntPipe) userId: number,
    ): Promise<Category> {
      return await this.categoryService.create(createCategoryDto, userId);
    }
  
    /**
     * Updates a category by ID.
     *
     * @param id - The ID of the category to update.
     * @param updateCategoryDto - DTO containing fields to update.
     * @returns The updated category.
     */
    @ApiOperation({ summary: 'Update a category' })
    @ApiParam({ name: 'id', description: 'ID of the category to update' })
    @ApiBody({ type: UpdateCategoryDto, description: 'Fields to update' })
    @ApiOkResponse({ type: Category, description: 'Category updated successfully' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Patch('/:id')
    public async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateCategoryDto: UpdateCategoryDto,
    ): Promise<Category> {
      return await this.categoryService.update(id, updateCategoryDto);
    }
  
    /**
     * Soft deletes a category by ID.
     *
     * @param id - The ID of the category to delete.
     */
    @ApiOperation({ summary: 'Soft delete a category by ID' })
    @ApiParam({ name: 'id', description: 'ID of the category to delete' })
    @ApiOkResponse({ description: 'Category deleted successfully' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Delete('/:id')
    public async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
      return await this.categoryService.delete(id);
    }
  }
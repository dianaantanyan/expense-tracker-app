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
  import { ExpenseService } from './expenses.service';
  import { Expense } from './entities/expense.entity';
  import { CreateExpenseDto } from './dtos/create-expense.dto';
  import { UpdateExpenseDto } from './dtos/patch-expense.dto';
  import { JwtGuard } from '../auth/guards/jwt.guard';
  
  @ApiTags('Expenses')
  @Controller('expenses')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  export class ExpenseController {
    constructor(private readonly expenseService: ExpenseService) {}
  
    /**
     * Retrieve a single expense by its ID.
     *
     * @param id - Expense ID
     * @returns The expense entity
     */
    @ApiOperation({ summary: 'Get Expense by ID' })
    @ApiParam({ name: 'id', description: 'ID of the expense' })
    @ApiOkResponse({ type: Expense, description: 'Expense retrieved successfully' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get('/:id')
    public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Expense> {
      return await this.expenseService.findOne(id);
    }
  
    /**
     * Retrieve all expenses for a user with optional filters.
     *
     * @param userId - User ID (owner)
     * @param startDate - Optional start date filter
     * @param endDate - Optional end date filter
     * @param categoryId - Optional category filter
     * @returns Array of filtered expenses
     */
    @ApiOperation({ summary: 'Get all expenses with optional filters' })
    @ApiQuery({ name: 'userId', required: true, description: 'User ID' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Filter start date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'endDate', required: false, description: 'Filter end date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
    @ApiOkResponse({ type: [Expense], description: 'Filtered expenses retrieved successfully' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get('/')
    public async findAll(
      @Query('userId', ParseIntPipe) userId: number,
      @Query('startDate') startDate?: string,
      @Query('endDate') endDate?: string,
      @Query('categoryId', ParseIntPipe) categoryId?: number,
    ): Promise<Expense[]> {
      return await this.expenseService.findAll(userId, startDate, endDate, categoryId);
    }
  
    /**
     * Create a new expense.
     *
     * @param createExpenseDto - DTO containing expense data
     * @returns The created expense entity
     */
    @ApiOperation({ summary: 'Create a new expense' })
    @ApiBody({ type: CreateExpenseDto })
    @ApiOkResponse({ type: Expense, description: 'Expense created successfully' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post('/')
    public async create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
      return await this.expenseService.create(createExpenseDto);
    }
  
    /**
     * Update an existing expense by ID.
     *
     * @param id - Expense ID
     * @param updateExpenseDto - DTO containing fields to update
     * @returns The updated expense entity
     */
    @ApiOperation({ summary: 'Update an expense' })
    @ApiParam({ name: 'id', description: 'ID of the expense to update' })
    @ApiBody({ type: UpdateExpenseDto })
    @ApiOkResponse({ type: Expense, description: 'Expense updated successfully' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Patch('/:id')
    public async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateExpenseDto: UpdateExpenseDto,
    ): Promise<Expense> {
      return await this.expenseService.update(id, updateExpenseDto);
    }
  
    /**
     * Soft delete an expense by ID.
     *
     * @param id - Expense ID
     */
    @ApiOperation({ summary: 'Delete an expense (soft delete)' })
    @ApiParam({ name: 'id', description: 'ID of the expense to delete' })
    @ApiOkResponse({ description: 'Expense deleted successfully' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Delete('/:id')
    public async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
      return await this.expenseService.delete(id);
    }
  
    /**
     * Retrieve the total sum of expenses for a user with optional filters.
     *
     * @param userId - User ID
     * @param startDate - Optional start date
     * @param endDate - Optional end date
     * @param categoryId - Optional category filter
     * @returns Total sum of expenses
     */
    @ApiOperation({ summary: 'Get total expenses for a user' })
    @ApiQuery({ name: 'userId', required: true, description: 'User ID' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Filter start date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'endDate', required: false, description: 'Filter end date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
    @ApiOkResponse({ type: Number, description: 'Total sum of expenses' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get('/total')
    public async getTotal(
      @Query('userId', ParseIntPipe) userId: number,
      @Query('startDate') startDate?: string,
      @Query('endDate') endDate?: string,
      @Query('categoryId', ParseIntPipe) categoryId?: number,
    ): Promise<number> {
      return await this.expenseService.getTotal(userId, startDate, endDate, categoryId);
    }
  }
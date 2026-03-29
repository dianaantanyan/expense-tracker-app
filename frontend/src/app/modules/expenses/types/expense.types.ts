export type ExpenseType = {
  id: number;
  amount: number;
  note?: string;
  date: string;
  category_id?: number;
  user_id?: number;
  category?: {
    id: number;
    name: string;
  };
};

export type CategoryType = {
  id: number;
  name: string;
  isGlobal?: boolean;
};

export type ExpenseFilters = {
  startDate?: string;
  endDate?: string;
  categoryId?: number;
};

export type CreateExpenseRequest = {
  amount: number;
  note?: string;
  date: string;
  category_id: number;
  user_id: number;
};

export type UpdateExpenseRequest = Partial<CreateExpenseRequest> & {
  id: number;
};
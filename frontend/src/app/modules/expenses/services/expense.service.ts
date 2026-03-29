import { ResponseType } from '../../core/types/api';
import { getErrorMessage } from '../../core/utils/api';
import { clientInstance } from '../../core/configs/fetcher';
import { CreateExpenseRequest, ExpenseFilters, ExpenseType, UpdateExpenseRequest } from '../types/expense.types';

function buildQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.append(key, String(value));
    }
  });
  return query.toString();
}

export const expenseService = {
  getAll: async (params: { userId: number } & ExpenseFilters): Promise<ResponseType<ExpenseType[]>> => {
    try {
      const query = buildQuery(params);

      const res = await clientInstance<ExpenseType[]>(`/expenses?${query}`, {
        method: 'GET',
      });

      return { data: res, error: null };
    } catch (error) {
      return { data: null, error: getErrorMessage(error) };
    }
  },

  getTotal: async (params: { userId: number } & ExpenseFilters): Promise<ResponseType<number>> => {
    try {
      const query = buildQuery(params);

      const res = await clientInstance<number>(`/expenses/total?${query}`, {
        method: 'GET',
      });

      return { data: res, error: null };
    } catch (error) {
      return { data: null, error: getErrorMessage(error) };
    }
  },

  create: async (data: CreateExpenseRequest): Promise<ResponseType<ExpenseType>> => {
    try {
      const res = await clientInstance<ExpenseType>('/expenses', {
        method: 'POST',
        data,
      });

      return { data: res, error: null };
    } catch (error) {
      return { data: null, error: getErrorMessage(error) };
    }
  },

  update: async (data: UpdateExpenseRequest): Promise<ResponseType<ExpenseType>> => {
    try {
      const res = await clientInstance<ExpenseType>(`/expenses/${data.id}`, {
        method: 'PATCH',
        data,
      });

      return { data: res, error: null };
    } catch (error) {
      return { data: null, error: getErrorMessage(error) };
    }
  },

  delete: async (id: number): Promise<ResponseType<null>> => {
    try {
      await clientInstance(`/expenses/${id}`, {
        method: 'DELETE',
      });

      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: getErrorMessage(error) };
    }
  },
};
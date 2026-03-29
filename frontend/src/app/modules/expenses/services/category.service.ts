import { ResponseType } from '../../core/types/api';
import { getErrorMessage } from '../../core/utils/api';
import { clientInstance } from '../../core/configs/fetcher';
import { CategoryType } from '../types/expense.types';

export const categoryService = {
  getAll: async (userId: number): Promise<ResponseType<CategoryType[]>> => {
    try {
      const res = await clientInstance<CategoryType[]>(`/category?userId=${userId}`, {
        method: 'GET',
      });
      return { data: res, error: null };
    } catch (error) {
      return { data: null, error: getErrorMessage(error) };
    }
  },
};

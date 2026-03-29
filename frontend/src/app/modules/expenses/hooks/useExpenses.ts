import { useCallback, useEffect, useState } from 'react';
import { expenseService } from '../services/expense.service';
import {
  CreateExpenseRequest,
  ExpenseFilters,
  ExpenseType,
  UpdateExpenseRequest,
} from '../types/expense.types';

const initialFilters: ExpenseFilters = {
  startDate: '',
  endDate: '',
  categoryId: undefined,
};

export function useExpenses(userId?: number) {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>(initialFilters);

  const fetchExpenses = useCallback(async (nextFilters?: ExpenseFilters) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const appliedFilters = nextFilters ?? filters;

    const [expensesRes, totalRes] = await Promise.all([
      expenseService.getAll({ userId, ...appliedFilters }),
      expenseService.getTotal({ userId, ...appliedFilters }),
    ]);

    if (expensesRes.error || totalRes.error) {
      setError(expensesRes.error ?? totalRes.error);
      setLoading(false);
      return;
    }

    setExpenses(expensesRes.data ?? []);
    setTotal(totalRes.data ?? 0);
    setFilters(appliedFilters);

    setLoading(false);
  }, [userId, filters]);

  const createExpense = useCallback(async (payload: Omit<CreateExpenseRequest, 'user_id'>) => {
    if (!userId) return;
    const { error: createError } = await expenseService.create({
      ...payload,
      user_id: userId,
    });
    if (createError) {
      setError(createError);
      return;
    }
    await fetchExpenses(filters);
  }, [fetchExpenses, filters, userId]);

  const updateExpense = useCallback(async (payload: Omit<UpdateExpenseRequest, 'user_id'>) => {
    if (!userId) return;
    const { error: updateError } = await expenseService.update({
      ...payload,
      user_id: userId,
    });
    if (updateError) {
      setError(updateError);
      return;
    }
    await fetchExpenses(filters);
  }, [fetchExpenses, filters, userId]);

  const deleteExpense = useCallback(async (id: number) => {
    const { error: deleteError } = await expenseService.delete(id);
    if (deleteError) {
      setError(deleteError);
      return;
    }
    await fetchExpenses(filters);
  }, [fetchExpenses, filters]);

  const resetFilters = useCallback(async () => {
    await fetchExpenses(initialFilters);
  }, [fetchExpenses]);

  useEffect(() => {
    if (!userId) return;
    void fetchExpenses(initialFilters);
  }, [fetchExpenses, userId]);

  return {
    expenses,
    total,
    loading,
    error,
    filters,
    setFilters,
    fetchExpenses,
    resetFilters,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}
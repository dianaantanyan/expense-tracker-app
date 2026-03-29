'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useExpenses } from '@/app/modules/expenses/hooks/useExpenses';
import { ExpenseForm } from '@/app/modules/expenses/components/ExpenseForm';
import { ExpenseList } from '@/app/modules/expenses/components/ExpenseList';
import { ExpenseFilter } from '@/app/modules/expenses/components/ExpenseFilter';
import { ExpenseTotal } from '@/app/modules/expenses/components/ExpenseTotal';
import { useAuth } from '@/app/modules/authentication/hooks/useAuth';
import { categoryService } from '@/app/modules/expenses/services/category.service';
import { CategoryType, ExpenseFilters, ExpenseType } from '@/app/modules/expenses/types/expense.types';
import styles from '@/app/styles/Expenses.module.css';

export default function ExpensesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [editingExpense, setEditingExpense] = useState<ExpenseType | null>(null);
  const {
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
  } = useExpenses(user?.id);

  useEffect(() => {
    if (!user?.id) return;
    void (async () => {
      const { data } = await categoryService.getAll(user.id);
      setCategories(data ?? []);
    })();
  }, [user?.id]);

  const onSubmitExpense = useCallback(async (payload: {
    amount: number;
    category_id: number;
    date: string;
    note?: string;
  }) => {
    if (editingExpense) {
      await updateExpense({ ...payload, id: editingExpense.id });
      setEditingExpense(null);
      return;
    }
    await createExpense(payload);
  }, [createExpense, editingExpense, updateExpense]);

  const onApplyFilters = useCallback(async () => {
    await fetchExpenses(filters);
  }, [fetchExpenses, filters]);

  const onResetFilters = useCallback(async () => {
    setEditingExpense(null);
    await resetFilters();
  }, [resetFilters]);

  return (
    <div className={styles.page}>
      <ExpenseTotal total={total} />
      <ExpenseFilter
        categories={categories}
        filters={filters as ExpenseFilters}
        onChange={setFilters}
        onApply={onApplyFilters}
        onReset={onResetFilters}
      />
      <ExpenseForm
        categories={categories}
        initialValues={editingExpense}
        onCancelEdit={() => setEditingExpense(null)}
        onSubmitExpense={onSubmitExpense}
        loading={loading}
      />
      {error && <p className={styles.errorText}>{error}</p>}
      <ExpenseList
        expenses={expenses}
        onEdit={setEditingExpense}
        onDelete={(id) => void deleteExpense(id)}
      />
    </div>
  );
}
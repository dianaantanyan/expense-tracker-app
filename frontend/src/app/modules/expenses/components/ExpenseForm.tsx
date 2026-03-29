'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styles from '../../../styles/Expenses.module.css';
import { CategoryType, CreateExpenseRequest, ExpenseType } from '../types/expense.types';

type ExpenseFormValues = Pick<CreateExpenseRequest, 'amount' | 'category_id' | 'date' | 'note'>;

type Props = {
  categories: CategoryType[];
  initialValues?: ExpenseType | null;
  loading?: boolean;
  onCancelEdit?: () => void;
  onSubmitExpense: (data: ExpenseFormValues) => Promise<void> | void;
};

const getDefaultValues = (expense?: ExpenseType | null): ExpenseFormValues => ({
  amount: expense?.amount ?? 0,
  category_id: expense?.category?.id ?? expense?.category_id ?? 0,
  date: expense?.date ? expense.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
  note: expense?.note ?? '',
});

export function ExpenseForm({
  categories,
  initialValues,
  loading = false,
  onCancelEdit,
  onSubmitExpense,
}: Props) {
  const { control, handleSubmit, reset } = useForm<ExpenseFormValues>({
    defaultValues: getDefaultValues(initialValues),
  });

  useEffect(() => {
    reset(getDefaultValues(initialValues));
  }, [initialValues, reset]);

  const onSubmit = async (data: ExpenseFormValues) => {
    await onSubmitExpense({
      ...data,
      amount: Number(data.amount),
      category_id: Number(data.category_id),
    });
    if (!initialValues) {
      reset(getDefaultValues(null));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
      <h2 className={styles.sectionTitle}>{initialValues ? 'Edit Expense' : 'Add Expense'}</h2>

      <div className={styles.fieldGrid}>
        <Controller
          name="amount"
          control={control}
          rules={{ required: true, min: 0.01 }}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Amount"
              className={styles.input}
            />
          )}
        />

        <Controller
          name="category_id"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <select {...field} className={styles.input}>
              <option value={0}>Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        />

        <Controller
          name="date"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <input {...field} type="date" className={styles.input} />
          )}
        />

        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <input {...field} placeholder="Note (optional)" className={styles.input} />
          )}
        />
      </div>

      <div className={styles.actionRow}>
        <button className={styles.button} disabled={loading}>
          {loading ? 'Saving...' : initialValues ? 'Save Changes' : 'Add Expense'}
        </button>
        {initialValues && onCancelEdit && (
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
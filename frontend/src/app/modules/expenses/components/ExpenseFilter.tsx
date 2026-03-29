import { ChangeEvent, useCallback } from 'react';
import styles from '../../../styles/Expenses.module.css';
import { CategoryType, ExpenseFilters } from '../types/expense.types';

type Props = {
  categories: CategoryType[];
  filters: ExpenseFilters;
  onChange: (next: ExpenseFilters) => void;
  onApply: () => void;
  onReset: () => void;
};

export function ExpenseFilter({ categories, filters, onChange, onApply, onReset }: Props) {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const normalizedValue = name === 'categoryId' ? (value ? Number(value) : undefined) : value;
    onChange({ ...filters, [name]: normalizedValue });
  }, [filters, onChange]);

  return (
    <div className={styles.filtersCard}>
      <h2 className={styles.sectionTitle}>Filters</h2>
      <div className={styles.fieldGrid}>
        <input
          name="startDate"
          type="date"
          value={filters.startDate ?? ''}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="endDate"
          type="date"
          value={filters.endDate ?? ''}
          onChange={handleChange}
          className={styles.input}
        />
        <select
          name="categoryId"
          value={filters.categoryId ?? ''}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.actionRow}>
        <button type="button" className={styles.button} onClick={onApply}>
          Apply Filters
        </button>
        <button type="button" className={styles.secondaryButton} onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
import styles from '../../../styles/Expenses.module.css';
import { ExpenseType } from '../types/expense.types';

type Props = {
  expenses: ExpenseType[];
  onDelete: (id: number) => void;
  onEdit: (expense: ExpenseType) => void;
};

export function ExpenseList({ expenses, onDelete, onEdit }: Props) {
  if (!expenses.length) {
    return <div className={styles.emptyState}>No expenses found for selected filters.</div>;
  }

  return (
    <div className={styles.list}>
      {expenses.map((expense) => (
        <div key={expense.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <p className={styles.amount}>${Number(expense.amount).toFixed(2)}</p>
            <p className={styles.categoryBadge}>{expense.category?.name ?? 'Uncategorized'}</p>
          </div>
          <p className={styles.cardMeta}>{expense.date.slice(0, 10)}</p>
          {expense.note && <p className={styles.cardMeta}>{expense.note}</p>}
          <div className={styles.actionRow}>
            <button type="button" className={styles.secondaryButton} onClick={() => onEdit(expense)}>
              Edit
            </button>
            <button type="button" className={styles.dangerButton} onClick={() => onDelete(expense.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
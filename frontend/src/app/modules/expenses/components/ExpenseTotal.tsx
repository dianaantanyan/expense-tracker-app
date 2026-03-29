import styles from '../../../styles/Expenses.module.css';

export function ExpenseTotal({ total }: { total: number }) {
  return (
    <div className={styles.totalCard}>
      <p className={styles.totalLabel}>Total Expenses</p>
      <h2 className={styles.totalValue}>${Number(total).toFixed(2)}</h2>
    </div>
  );
}
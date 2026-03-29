import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Expense Tracker',
  description: 'Manage your expenses efficiently',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
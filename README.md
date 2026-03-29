# Expense Tracker Application

## Project Overview

This project is a full-stack expense tracker application that allows users to register, log in, and manage their daily expenses. The focus of this project is on the **architecture and functionality** of both the backend and frontend, rather than on a complex UI design.  

The README documents the structure, features, and setup for the **entire project**, covering both th backend services (API, authentication, database) and the frontend architecture (modules, components, and state management), ensuring clarity for developers wor
---

### Backend Functionality

The backend provides full support for managing expenses and user authentication. In addition to the predefined expense categories (e.g., Food, Transport, Entertainment), users can **create, read, update, and delete custom categories**. This allows for flexible expense organization.  

Key features implemented in the backend:

- **User Authentication:** Registration and login with secure password handling.
- **Expense Management:** Add, edit, and delete expenses, including amount, category, date, and notes.
- **Category Management:** CRUD operations for expense categories, alongside predefined categories.
- **Expense Filtering & Overview:** Filter expenses by date or category and calculate total expenses.
- **Security:** Middleware and guards to protect API endpoints from unauthorized access.

---

### Frontend Architecture

- **Modules & Components:** Organized by feature (Auth, Expenses) to keep code modular and maintainable.
- **State Management:** Handles user authentication state, expense data, and category lists.
- **Routing:** Frontend routes are protected with authentication guards.
- **Design:** Focused on simplicity and clarity, pr# Expense Tracker Application

// src/types/IncomeTransaction.ts
export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
  }
  
  export interface Transaction {
    id: string;
    amount: number;
    description: string;
    date: string;
    type: TransactionType;
    userId?: string;
  }
  
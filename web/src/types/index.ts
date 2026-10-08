export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  /** Valor em centavos */
  amount: number;
  type: TransactionType;
  category: string;
  createdAt: string;
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CreateTransactionPayload {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
}

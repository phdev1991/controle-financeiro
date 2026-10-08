/**
 * Tipos centrais da aplicação.
 * Compartilhados entre controllers e testes para garantir consistência.
 */

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  /** Valor em centavos (inteiro) para evitar problemas de ponto flutuante */
  amount: number;
  type: TransactionType;
  category: string;
  createdAt: string; // ISO 8601
}

export interface CreateTransactionDTO {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface ApiError {
  error: string;
}

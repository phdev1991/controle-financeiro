import type {
  Transaction,
  Summary,
  CreateTransactionPayload,
  TransactionType,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Wrapper genérico para fetch com tratamento de erro.
 */
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `Erro ${response.status}: ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody.error) {
        errorMessage = errorBody.error;
      }
    } catch {
      // corpo não é JSON, mantém mensagem padrão
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export interface TransactionFilters {
  type?: TransactionType | '';
  category?: string;
}

export const api = {
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.set('type', filters.type);
    if (filters?.category) params.set('category', filters.category);
    const query = params.toString();
    return fetchApi<Transaction[]>(`/transactions${query ? `?${query}` : ''}`);
  },

  async createTransaction(
    payload: CreateTransactionPayload
  ): Promise<Transaction> {
    return fetchApi<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async deleteTransaction(id: string): Promise<void> {
    return fetchApi<void>(`/transactions/${id}`, { method: 'DELETE' });
  },

  async getSummary(): Promise<Summary> {
    return fetchApi<Summary>('/summary');
  },
};

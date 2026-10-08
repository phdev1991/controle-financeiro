import { describe, it, expect, beforeEach } from 'vitest';
import type { Transaction } from '../types/transaction';

// Reimplementamos a lógica de validação e cálculo aqui para testar
// sem precisar subir o servidor.

function toCents(amount: number): number {
  return Math.round(amount * 100);
}

function fromCents(cents: number): number {
  return cents / 100;
}

function validateTransactionDTO(body: unknown): string | null {
  if (body === null || typeof body !== 'object') {
    return 'Body deve ser um objeto JSON';
  }
  const dto = body as Record<string, unknown>;
  if (typeof dto.title !== 'string' || dto.title.trim().length === 0) {
    return 'Campo "title" é obrigatório e deve ser uma string não vazia';
  }
  if (typeof dto.amount !== 'number' || isNaN(dto.amount) || dto.amount <= 0) {
    return 'Campo "amount" é obrigatório e deve ser um número positivo maior que zero';
  }
  if (dto.type !== 'income' && dto.type !== 'expense') {
    return 'Campo "type" deve ser "income" ou "expense"';
  }
  if (typeof dto.category !== 'string' || dto.category.trim().length === 0) {
    return 'Campo "category" é obrigatório e deve ser uma string não vazia';
  }
  return null;
}

describe('Validação de transação', () => {
  it('aceita um payload válido', () => {
    const result = validateTransactionDTO({
      title: 'Salário',
      amount: 5000,
      type: 'income',
      category: 'Trabalho',
    });
    expect(result).toBeNull();
  });

  it('rejeita título vazio', () => {
    const result = validateTransactionDTO({
      title: '',
      amount: 100,
      type: 'income',
      category: 'Teste',
    });
    expect(result).toContain('title');
  });

  it('rejeita amount zero', () => {
    const result = validateTransactionDTO({
      title: 'Teste',
      amount: 0,
      type: 'income',
      category: 'Teste',
    });
    expect(result).toContain('amount');
  });

  it('rejeita amount negativo', () => {
    const result = validateTransactionDTO({
      title: 'Teste',
      amount: -50,
      type: 'expense',
      category: 'Teste',
    });
    expect(result).toContain('amount');
  });

  it('rejeita type inválido', () => {
    const result = validateTransactionDTO({
      title: 'Teste',
      amount: 100,
      type: 'invalid',
      category: 'Teste',
    });
    expect(result).toContain('type');
  });

  it('rejeita category vazia', () => {
    const result = validateTransactionDTO({
      title: 'Teste',
      amount: 100,
      type: 'income',
      category: '',
    });
    expect(result).toContain('category');
  });

  it('rejeita body nulo', () => {
    const result = validateTransactionDTO(null);
    expect(result).not.toBeNull();
  });
});

describe('Cálculo de centavos', () => {
  it('converte reais para centavos corretamente', () => {
    expect(toCents(10.99)).toBe(1099);
    expect(toCents(0.01)).toBe(1);
    expect(toCents(100)).toBe(10000);
  });

  it('converte centavos para reais corretamente', () => {
    expect(fromCents(1099)).toBe(10.99);
    expect(fromCents(1)).toBe(0.01);
    expect(fromCents(10000)).toBe(100);
  });

  it('evita erro de ponto flutuante', () => {
    // 0.1 + 0.2 !== 0.3 em JavaScript, mas em centavos:
    const sum = toCents(0.1) + toCents(0.2);
    expect(fromCents(sum)).toBeCloseTo(0.3, 2);
  });
});

describe('Cálculo de resumo', () => {
  it('calcula saldo corretamente', () => {
    const transactions: Transaction[] = [
      { id: '1', title: 'Salário', amount: 500000, type: 'income', category: 'Trabalho', createdAt: '2024-01-01' },
      { id: '2', title: 'Aluguel', amount: 150000, type: 'expense', category: 'Moradia', createdAt: '2024-01-02' },
      { id: '3', title: 'Freelance', amount: 100000, type: 'income', category: 'Trabalho', createdAt: '2024-01-03' },
    ];

    let totalIncome = 0;
    let totalExpense = 0;

    for (const t of transactions) {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
      }
    }

    expect(fromCents(totalIncome)).toBe(6000);
    expect(fromCents(totalExpense)).toBe(1500);
    expect(fromCents(totalIncome - totalExpense)).toBe(4500);
  });
});

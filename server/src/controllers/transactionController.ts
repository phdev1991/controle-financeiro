import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import type {
  Transaction,
  CreateTransactionDTO,
  Summary,
  TransactionType,
} from '../types/transaction';

/**
 * Armazenamento em memória.
 * Em produção, seria substituído por um repositório com banco de dados.
 */
const transactions: Transaction[] = [];

/**
 * Converte valor em reais (number) para centavos (inteiro).
 * Evita erros de ponto flutuante em cálculos financeiros.
 */
function toCents(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Converte centavos para reais.
 */
function fromCents(cents: number): number {
  return cents / 100;
}

/**
 * Valida os dados de entrada para criação de transação.
 * Retorna uma string de erro ou null se válido.
 */
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

/**
 * GET /transactions
 * Lista todas as transações, com filtros opcionais por tipo e categoria.
 */
export function listTransactions(req: Request, res: Response): void {
  const { type, category } = req.query;

  let result = [...transactions];

  // Ordena por data de criação (mais recente primeiro)
  result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (type === 'income' || type === 'expense') {
    result = result.filter((t) => t.type === type);
  }

  if (typeof category === 'string' && category.trim().length > 0) {
    const categoryLower = category.toLowerCase();
    result = result.filter(
      (t) => t.category.toLowerCase() === categoryLower
    );
  }

  res.json(result);
}

/**
 * POST /transactions
 * Cria uma nova transação.
 */
export function createTransaction(req: Request, res: Response): void {
  const validationError = validateTransactionDTO(req.body);

  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  const dto = req.body as CreateTransactionDTO;
  const amountInCents = toCents(dto.amount);

  const transaction: Transaction = {
    id: randomUUID(),
    title: dto.title.trim(),
    amount: amountInCents,
    type: dto.type,
    category: dto.category.trim(),
    createdAt: new Date().toISOString(),
  };

  transactions.push(transaction);

  res.status(201).json(transaction);
}

/**
 * DELETE /transactions/:id
 * Remove uma transação pelo ID.
 */
export function deleteTransaction(req: Request, res: Response): void {
  const { id } = req.params;
  const index = transactions.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: `Transação com id "${id}" não encontrada` });
    return;
  }

  transactions.splice(index, 1);

  res.status(204).send();
}

/**
 * GET /summary
 * Retorna o resumo financeiro: total de receitas, despesas e saldo.
 */
export function getSummary(_req: Request, res: Response): void {
  let totalIncomeCents = 0;
  let totalExpenseCents = 0;

  for (const t of transactions) {
    if (t.type === 'income') {
      totalIncomeCents += t.amount;
    } else {
      totalExpenseCents += t.amount;
    }
  }

  const summary: Summary = {
    totalIncome: fromCents(totalIncomeCents),
    totalExpense: fromCents(totalExpenseCents),
    balance: fromCents(totalIncomeCents - totalExpenseCents),
  };

  res.json(summary);
}

'use client';

import { useState, FormEvent } from 'react';
import type { CreateTransactionPayload, TransactionType } from '../types';

interface TransactionModalProps {
  onClose: () => void;
  onSubmit: (payload: CreateTransactionPayload) => Promise<void>;
}

export function TransactionModal({ onClose, onSubmit }: TransactionModalProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Informe um valor válido maior que zero.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        amount: parsedAmount,
        type,
        category: category.trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar transação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Nova Transação</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Salário, Aluguel, Supermercado"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Valor (R$)</label>
            <input
              id="amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Tipo</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoria</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Alimentação, Moradia, Transporte"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

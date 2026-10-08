'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Transaction, Summary, CreateTransactionPayload, TransactionType } from '../types';
import { api } from '../services/api';
import { SummaryCards } from '../components/SummaryCards';
import { TransactionFilters } from '../components/TransactionFilters';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionModal } from '../components/TransactionModal';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [txs, sum] = await Promise.all([
        api.getTransactions({
          type: typeFilter || undefined,
          category: categoryFilter || undefined,
        }),
        api.getSummary(),
      ]);
      setTransactions(txs);
      setSummary(sum);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao carregar dados.'
      );
    } finally {
      setLoading(false);
    }
  }, [typeFilter, categoryFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleCreateTransaction(payload: CreateTransactionPayload) {
    await api.createTransaction(payload);
    await fetchData();
  }

  async function handleDeleteTransaction(id: string) {
    try {
      await api.deleteTransaction(id);
      await fetchData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao excluir transação.'
      );
    }
  }

  // Extrai categorias únicas para o filtro
  const categories = [...new Set(transactions.map((t) => t.category))].sort();

  return (
    <div className="container">
      <header className="header">
        <h1>Controle Financeiro</h1>
        <p>Gerencie suas receitas e despesas de forma simples</p>
      </header>

      <SummaryCards summary={summary} />

      <TransactionFilters
        typeFilter={typeFilter}
        categoryFilter={categoryFilter}
        categories={categories}
        onTypeChange={setTypeFilter}
        onCategoryChange={setCategoryFilter}
      />

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <>
          <div style={{ marginBottom: '24px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              + Nova Transação
            </button>
          </div>

          <TransactionTable
            transactions={transactions}
            onDelete={handleDeleteTransaction}
          />
        </>
      )}

      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateTransaction}
        />
      )}
    </div>
  );
}

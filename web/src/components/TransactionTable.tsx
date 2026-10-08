import type { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100);
}

function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoString));
}

export function TransactionTable({ transactions, onDelete }: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>Nenhuma transação encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Transações</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Categoria</th>
            <th>Data</th>
            <th className="hide-mobile">Tipo</th>
            <th>Valor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.category}</td>
              <td>{formatDate(t.createdAt)}</td>
              <td className="hide-mobile">
                <span className={`badge badge-${t.type}`}>
                  {t.type === 'income' ? 'Receita' : 'Despesa'}
                </span>
              </td>
              <td className={`amount-${t.type}`}>
                {t.type === 'expense' ? '-' : '+'}
                {formatCurrency(t.amount)}
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(t.id)}
                  aria-label={`Excluir ${t.title}`}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

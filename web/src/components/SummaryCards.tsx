import type { Summary } from '../types';

interface SummaryCardsProps {
  summary: Summary;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="cards">
      <div className="card">
        <div className="card-label">Receitas</div>
        <div className="card-value income">
          {formatCurrency(summary.totalIncome)}
        </div>
      </div>
      <div className="card">
        <div className="card-label">Despesas</div>
        <div className="card-value expense">
          {formatCurrency(summary.totalExpense)}
        </div>
      </div>
      <div className="card">
        <div className="card-label">Saldo</div>
        <div className="card-value balance">
          {formatCurrency(summary.balance)}
        </div>
      </div>
    </div>
  );
}

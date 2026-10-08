import type { TransactionType } from '../types';

interface TransactionFiltersProps {
  typeFilter: TransactionType | '';
  categoryFilter: string;
  categories: string[];
  onTypeChange: (type: TransactionType | '') => void;
  onCategoryChange: (category: string) => void;
}

export function TransactionFilters({
  typeFilter,
  categoryFilter,
  categories,
  onTypeChange,
  onCategoryChange,
}: TransactionFiltersProps) {
  return (
    <div className="filters">
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value as TransactionType | '')}
        aria-label="Filtrar por tipo"
      >
        <option value="">Todos os tipos</option>
        <option value="income">Receitas</option>
        <option value="expense">Despesas</option>
      </select>

      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="Filtrar por categoria"
      >
        <option value="">Todas as categorias</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

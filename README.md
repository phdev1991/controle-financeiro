# Controle Financeiro Pessoal

Sistema full-stack para gerenciamento de receitas e despesas pessoais, desenvolvido como teste técnico para posição FullStack Júnior.

## Visão Geral

Aplicação web completa que permite:

- **Registrar** receitas e despesas com título, valor, tipo e categoria
- **Visualizar** saldo atual, total de receitas e total de despesas em cards
- **Filtrar** transações por tipo (receita/despesa) e categoria
- **Excluir** transações individuais
- **Consultar** histórico completo de transações

## Arquitetura

```
├── server/                 # Back-end (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/   # Lógica de negócio e validação
│   │   ├── routes/        # Definição de rotas
│   │   ├── types/         # Tipos TypeScript compartilhados
│   │   └── index.ts       # Entry point do servidor
│   └── tests/             # Testes unitários (Vitest)
│
└── web/                    # Front-end (Next.js + React + TypeScript)
    └── src/
        ├── components/    # Componentes reutilizáveis
        ├── pages/         # Páginas da aplicação
        ├── services/      # Camada de comunicação com API
        ├── types/         # Tipos TypeScript
        └── styles/        # Estilos globais (CSS)
```

## Stack Tecnológica

### Back-end
- **Node.js 18+** — Runtime JavaScript
- **Express 4** — Framework HTTP minimalista
- **TypeScript 5** — Tipagem estática
- **Vitest** — Framework de testes

### Front-end
- **Next.js 14** — Framework React com SSR/SSG
- **React 18** — Biblioteca de UI
- **TypeScript 5** — Tipagem estática
- **CSS Modules** — Estilização com escopo

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

## Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/controle-financeiro.git
cd controle-financeiro
```

### 2. Configure o Back-end

```bash
cd server
npm install
npm run dev
```

O servidor estará disponível em `http://localhost:8080`

### 3. Configure o Front-end

Em outro terminal:

```bash
cd web
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## API Endpoints

### `GET /transactions`

Lista todas as transações. Suporta filtros opcionais via query parameters.

**Query Parameters:**
- `type` (opcional): `income` ou `expense`
- `category` (opcional): nome da categoria

**Resposta (200):**
```json
[
  {
    "id": "uuid",
    "title": "Salário",
    "amount": 500000,
    "type": "income",
    "category": "Trabalho",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### `POST /transactions`

Cria uma nova transação.

**Body:**
```json
{
  "title": "Supermercado",
  "amount": 150.50,
  "type": "expense",
  "category": "Alimentação"
}
```

**Resposta (201):**
```json
{
  "id": "uuid",
  "title": "Supermercado",
  "amount": 15050,
  "type": "expense",
  "category": "Alimentação",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Erro (400):**
```json
{
  "error": "Campo 'amount' é obrigatório e deve ser um número positivo maior que zero"
}
```

### `DELETE /transactions/:id`

Remove uma transação pelo ID.

**Resposta (204):** Sem conteúdo

**Erro (404):**
```json
{
  "error": "Transação com id 'uuid' não encontrada"
}
```

### `GET /summary`

Retorna o resumo financeiro.

**Resposta (200):**
```json
{
  "totalIncome": 5000,
  "totalExpense": 1500,
  "balance": 3500
}
```

## Decisões Técnicas

### Armazenamento em Centavos

Valores monetários são armazenados como inteiros em centavos para evitar problemas de ponto flutuante. Por exemplo, R$ 10,99 é armazenado como `1099`.

### Separação de Camadas

- **Controllers**: Responsáveis pela lógica de negócio e validação
- **Routes**: Apenas definição de rotas e middlewares
- **Services** (front-end): Camada de abstração para comunicação com API
- **Types**: Tipos compartilhados para garantir consistência

### Validação no Back-end

Todas as entradas são validadas no back-end com mensagens de erro claras e específicas, garantindo integridade dos dados.

### Tratamento de Erros

- Back-end retorna erros com status HTTP apropriado (400, 404, 500)
- Front-end exibe mensagens de erro de forma amigável ao usuário
- Erros de rede são capturados e tratados

## Testes

### Back-end

```bash
cd server
npm test
```

Os testes cobrem:
- Validação de dados de entrada
- Cálculo de conversão de moeda
- Cálculo de resumo financeiro

## Funcionalidades Implementadas

### Obrigatórias
- ✅ API REST completa (GET, POST, DELETE)
- ✅ Endpoint de resumo financeiro
- ✅ Front-end com cards de resumo
- ✅ Listagem de transações
- ✅ Formulário de nova transação
- ✅ Exclusão de transações
- ✅ Tipagem TypeScript em todo o projeto
- ✅ Tratamento de erros básico

### Diferenciais
- ✅ Filtro por tipo e categoria
- ✅ Interface responsiva
- ✅ Testes unitários (Vitest)
- ✅ Documentação completa
- ✅ Código limpo e organizado

## Próximos Passos (Melhorias Futuras)

- [ ] Autenticação de usuários (JWT)
- [ ] Persistência com banco de dados (SQLite/PostgreSQL)
- [ ] Testes de integração (E2E)
- [ ] Paginação de transações
- [ ] Gráficos e relatórios
- [ ] Exportação de dados (CSV/PDF)
- [ ] Categorias predefinidas com ícones
- [ ] Edição de transações existentes

## Licença

Este projeto foi desenvolvido como teste técnico e está licenciado sob a licença MIT.

---

Desenvolvido com ❤️ por [Seu Nome](https://github.com/seu-usuario)

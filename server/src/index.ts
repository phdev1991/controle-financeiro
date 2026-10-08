import express from 'express';
import cors from 'cors';
import transactionRoutes from './routes/transactionRoutes';

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/', transactionRoutes);

// Tratamento de erro global
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Erro não tratado:', err.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

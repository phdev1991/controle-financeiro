import { Router } from 'express';
import {
  listTransactions,
  createTransaction,
  deleteTransaction,
  getSummary,
} from '../controllers/transactionController';

const router = Router();

router.get('/transactions', listTransactions);
router.post('/transactions', createTransaction);
router.delete('/transactions/:id', deleteTransaction);
router.get('/summary', getSummary);

export default router;

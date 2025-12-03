import { Router } from 'express';
import { createSale, getSales, getSale, getProducts, completeSale, cleanupExpiredSales } from '../controllers/salesController';

const router = Router();

router.post('/', createSale);
router.get('/', getSales);
router.get('/products', getProducts);
router.get('/:id', getSale);
router.patch('/:id/complete', completeSale);
router.post('/cleanup-expired', cleanupExpiredSales);

export default router;

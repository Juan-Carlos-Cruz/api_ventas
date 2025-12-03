import { Router } from 'express';
import { createSale, getSales, getSale, getProducts } from '../controllers/salesController';

const router = Router();

router.post('/', createSale);
router.get('/', getSales);
router.get('/products', getProducts);
router.get('/:id', getSale);

export default router;

import { Router } from 'express';
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  passportAdmin,
  updateProduct,
  uploaderProduct
} from '../controllers/products.js';

const router = Router();

router.get('/', getProducts);

router.get('/:pid', getProductById);

router.post('/', passportAdmin, uploaderProduct, addProduct);

router.put('/:pid', passportAdmin, updateProduct);

router.delete('/:pid', passportAdmin, deleteProduct);

export default router;

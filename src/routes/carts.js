import { Router } from 'express';
import {
  addCart,
  addProductToCart,
  deleteProductInCart,
  deleteProductsInCart,
  getCartById,
  getCarts,
  purchase,
  updateCart,
  updateProductQuantityInCart
} from '../controllers/carts.js';
import { passportCall } from '../utils.js';

const router = Router();

const passportUser = passportCall('user');

router.post('/', addCart);

router.get('/', getCarts);

router.get('/:cid', getCartById);

router.post('/:cid/product/:pid', passportUser, addProductToCart);

router.delete('/:cid/products/:pid', passportUser, deleteProductInCart);

router.put('/:cid', passportUser, updateCart);

router.put('/:cid/products/:pid', passportUser, updateProductQuantityInCart);

router.delete('/:cid', passportUser, deleteProductsInCart);

router.get('/:cid/purchase', passportUser, purchase);

export default router;

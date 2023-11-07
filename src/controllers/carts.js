import ticketModel from '../dao/models/tickets.js';
import { sendPurchaseEmail } from '../utils.js';
import { Carts, Products, cartProducts } from '../dao/factory.js';
import response from '../services/res/response.js';
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';
import {
  notFoundCartError,
  notFoundProductError,
  notFoundProductInCartError,
  updateCartError,
  updateProductQuantityInCartError
} from '../services/errors/info.js';

const cartManager = new Carts();
const productManager = new Products();

export const addCart = async (req, res) => {
  const cart = await cartManager.addCart();
  response(res, 201, `Creado con el id: ${cart._id}`);
};

export const getCarts = async (req, res, next) => {
  const carts = await cartManager.getCarts();

  if (carts.length === 0) {
    const error = new CustomError({
      name: 'No existen carritos',
      cause: 'No existen carritos',
      message: 'No existen carritos',
      code: EErrors.NOT_FOUND
    });
    next(error);
  } else {
    response(res, 200, carts);
  }
};

export const getCartById = async (req, res, next) => {
  const cid = req.params.cid;
  const cart = await cartManager.getCartById(cid);

  if (!cart) {
    const error = new CustomError({
      name: 'No existe el carrito',
      cause: notFoundCartError(cid),
      message: `No existe el carrito con el id: ${cid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
  } else if (cart.products.length === 0) {
    response(res, 200, 'El carrito esta vacío');
  } else {
    response(res, 200, cart);
  }
};

export const addProductToCart = async (req, res, next) => {
  const pid = req.params.pid;
  const cid = req.params.cid;
  const product = await productManager.getProductById(pid);
  const cart = await cartManager.getCartById(cid);

  if (!product) {
    const error = new CustomError({
      name: 'No existe el producto',
      cause: notFoundProductError(pid),
      message: `No existe el producto con el id: ${pid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
    return;
  }

  if (!cart) {
    const error = new CustomError({
      name: 'No existe el carrito',
      cause: notFoundCartError(cid),
      message: `No existe el carrito con el id: ${cid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
    return;
  }
  await cartManager.addProductToCart(cid, pid);

  response(res, 200, 'Se agrego el producto correctamente al carrito');
};

export const deleteProductInCart = async (req, res, next) => {
  const pid = req.params.pid;
  const cid = req.params.cid;
  const product = await productManager.getProductById(pid);
  const cart = await cartManager.getCartById(cid);

  if (!product) {
    const error = new CustomError({
      name: 'No existe el producto',
      cause: notFoundProductError(pid),
      message: `No existe el producto con el id: ${pid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
    return;
  }

  if (!cart) {
    const error = new CustomError({
      name: 'No existe el carrito',
      cause: notFoundCartError(cid),
      message: `No existe el carrito con el id: ${cid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
    return;
  }

  const productsInCart = await cartProducts(cart);

  const productIndex = productsInCart.findIndex(
    (product) => product._id._id == pid
  );

  if (productIndex === -1) {
    const error = new CustomError({
      name: 'No existe el producto en el carrito',
      cause: notFoundProductInCartError(pid, cid),
      message: `No existe el producto con el id: ${pid} en el carrito con el id: ${cid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
    return;
  }

  await cartManager.deleteProductInCart(cart._id, product._id);

  response(
    res,
    200,
    `Se elimino el producto con el id: ${pid} correctamente del carrito`
  );
};

export const updateCart = async (req, res, next) => {
  const cid = req.params.cid;
  const cart = await cartManager.getCartById(cid);
  if (!cart) {
    const error = new CustomError({
      name: 'No existe el carrito',
      cause: notFoundCartError(cid),
      message: `No existe el carrito con el id: ${cid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
    return;
  }

  const updateCart = req.body;
  const errors = [];

  for (const prod of updateCart) {
    if (typeof prod._id !== 'string') {
      errors.push({
        id: prod._id,
        quantity: prod.quantity,
        message: 'El _id del producto debe ser un string'
      });
    } else if (typeof prod.quantity !== 'number' || prod.quantity <= 0) {
      errors.push({
        id: prod._id,
        quantity: prod.quantity,
        message: 'La cantidad debe ser un numero positivo'
      });
    } else {
      const existProd = await productManager.getProductById(prod._id);
      if (!existProd) {
        const error = new CustomError({
          name: 'No existe el producto',
          cause: notFoundProductError(prod._id),
          message: `No existe el producto con el id: ${prod._id}`,
          code: EErrors.NOT_FOUND
        });
        next(error);
      }
    }
  }

  if (errors.length > 0) {
    console.log(errors);
    const error = new CustomError({
      name: 'Error al actualizar el carrito',
      cause: updateCartError(errors[0].id, errors[0].quantity),
      message: errors[0].message,
      code: EErrors.INVALID_TYPES
    });
    next(error);
    return;
  }

  await cartManager.updateCart(cart._id, updateCart);
  const updatedCart = await cartManager.getCartById(cid);
  response(res, 200, updatedCart);
};

export const updateProductQuantityInCart = async (req, res, next) => {
  const pid = req.params.pid;
  const cid = req.params.cid;
  const product = await productManager.getProductById(pid);
  const cart = await cartManager.getCartById(cid);

  if (!product) {
    const error = new CustomError({
      name: 'No existe el producto',
      cause: notFoundProductError(pid),
      message: `No existe el producto con el id: ${pid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
    return;
  }

  if (!cart) {
    const error = new CustomError({
      name: 'No existe el carrito',
      cause: notFoundCartError(cid),
      message: `No existe el carrito con el id: ${cid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
    return;
  }

  const productIndex = cart.products.findIndex(
    (product) => product._id._id == pid
  );

  if (productIndex === -1) {
    const error = new CustomError({
      name: 'No existe el producto en el carrito',
      cause: notFoundProductInCartError(pid, cid),
      message: `No existe el producto con el id: ${pid} en el carrito con el id: ${cid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
    return;
  }

  const updateQuantity = req.body;
  if (
    typeof updateQuantity.quantity === 'number' &&
    updateQuantity.quantity >= 0
  ) {
    await cartManager.updateProductQuantityInCart(
      cart._id,
      product._id,
      updateQuantity
    );
    const updatedCart = await cartManager.getCartById(cid);
    response(res, 200, updatedCart);
  } else {
    const error = new CustomError({
      name: 'Error al actualizar el carrito',
      cause: updateProductQuantityInCartError(updateQuantity.quantity),
      message: 'Clave o valor incorrecto',
      code: EErrors.INVALID_TYPES
    });
    next(error);
  }
};

export const deleteProductsInCart = async (req, res, next) => {
  const cid = req.params.cid;
  const cart = await cartManager.getCartById(cid);

  if (!cart) {
    const error = new CustomError({
      name: 'No existe el carrito',
      cause: notFoundCartError(cid),
      message: `No existe el carrito con el id: ${cid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
    return;
  }

  await cartManager.deleteProductsInCart(cart._id);
  response(res, 200, 'Se eliminaron los productos del carrito correctamente');
};

export const purchase = async (req, res, next) => {
  const cid = req.params.cid;
  const cart = await cartManager.getCartById(cid);
  const products = await cartProducts(cart);

  if (!cart) {
    const error = new CustomError({
      name: 'No existe el carrito',
      cause: notFoundCartError(cid),
      message: `No existe el carrito con el id: ${cid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
    return;
  }

  const withStock = [];
  const withoutStock = [];
  let totalPurchase = 0;

  for (const product of products) {
    if (product._id.stock > 0) {
      const newQuantity = { stock: product._id.stock - product.quantity };
      await productManager.updateProduct(product._id._id, newQuantity);
      await cartManager.deleteProductInCart(cid, product._id._id);
      const total = product._id.price * product.quantity;
      withStock.push(
        `${product._id.title} x ${product.quantity} = ${parseFloat(
          total.toFixed(2)
        )}`
      );
      totalPurchase += total;
    } else {
      withoutStock.push(`${product._id.title} x ${product.quantity}`);
    }
  }

  const ticket = {
    code: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
    amount: parseFloat(totalPurchase.toFixed(2)),
    purchaser: req.user.user.email
  };

  await ticketModel.create(ticket);

  await sendPurchaseEmail(
    req.user.user.email,
    withStock,
    withoutStock,
    ticket.amount,
    ticket.code
  );
  response(
    res,
    200,
    `Se completo con éxito la compra de los siguientes productos: (${withStock}) por un total de $${ticket.amount} y por falta de stock los siguientes productos van a quedar en el carrito: (${withoutStock})`
  );
};

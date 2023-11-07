import { Carts, Products, cartProducts, viewsProducts } from '../dao/factory.js';

const productManager = new Products();
const cartManager = new Carts();

export const publicAccess = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/products');
  }
  next();
};

export const privateAccess = (req, res, next) => {
  if (!req.session.user) {
    return res.status(403).redirect('/');
  }
  next();
};

export const login = (req, res) => {
  const message = req.session.messages;
  res.render('login', {
    message,
    style: 'login.css',
    title: 'Ecommerce - Iniciar sesión'
  });
  delete req.session.messages;
};

export const register = (req, res) => {
  const message = req.session.messages;
  res.render('register', {
    message,
    style: 'register.css',
    title: 'Ecommerce - Registro'
  });
  delete req.session.messages;
};

export const realtimeproducts = (req, res) => {
  res.render('realTimeProducts', {
    cart: req.session.user.cart,
    user: req.session.user,
    style: 'realTimeProducts.css',
    title: 'Ecommerce - Productos en tiempo real'
  });
};

export const chat = (req, res) => {
  res.render('chat', {
    style: 'chat.css',
    title: 'Ecommerce - Chat'
  });
};

export const products = async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const category = req.query.category;
  const disponibility = req.query.disponibility;
  let sort = req.query.sort;

  if (sort === 'asc') {
    sort = 1;
  } else if (sort === 'desc') {
    sort = -1;
  }

  const products = await productManager.getProducts(
    limit || 10,
    page || 1,
    category,
    disponibility,
    sort
  );

  if (products.totalPages < page) {
    res.render('404', { style: '404.css', title: 'Ecommerce - 404' });
    return;
  }

  const plainProducts = await viewsProducts(products);
  res.render('products', {
    cart: req.session.user.cart,
    products,
    plainProducts,
    user: req.session.user,
    style: 'products.css',
    title: 'Ecommerce - Productos'
  });
};

export const product = async (req, res) => {
  const pid = req.params.pid;
  const plainProduct = await productManager.getProductById(pid);
  res.render('product', {
    cart: req.session.user.cart,
    user: req.session.user,
    plainProduct,
    style: 'product.css',
    title: `Ecommerce - ${plainProduct.title}`
  });
};

export const cart = async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartManager.getCartById(cid);
  const plainProducts = await cartProducts(cart);
  res.render('carts', {
    cart: req.session.user.cart,
    user: req.session.user,
    plainProducts,
    style: 'carts.css',
    title: 'Ecommerce - Carrito'
  });
};

export const resetPassword = (req, res) => {
  res.render('resetPassword', {
    style: 'resetPassword.css',
    title: 'Ecommerce - Restaurar contraseña'
  });
};

export const notFound = (req, res) => {
  res.render('404', { style: '404.css', title: 'Ecommerce - 404' });
};

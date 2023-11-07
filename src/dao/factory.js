import config from '../config/config.js';
import mongoose from 'mongoose';

const mongoURL = config.mongoUrl;

export let Products;
export let Carts;
export let viewsProducts = async (products) => await products;
export let cartProducts = async (carts) => await carts;

switch (config.persistence) {
  case 'MONGO': {
    mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const { default: ProductsMongo } = await import(
      './mongoDb/ProductManager.js'
    );
    Products = ProductsMongo;
    const { default: CartsMongo } = await import('./mongoDb/CartManager.js');
    Carts = CartsMongo;
    const viewsProductsMongo = async (products) =>
      await products.docs.map((doc) => doc.toObject());
    viewsProducts = viewsProductsMongo;
    const viewsCartProductsMongo = async (cart) => {
      return cart.products;
    };
    cartProducts = viewsCartProductsMongo;
    break;
  }
  case 'FILE': {
    mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const { default: ProductsFile } = await import(
      './fileSystem/controllers/ProductManager.js'
    );
    Products = ProductsFile;
    const { default: CartsFile } = await import(
      './fileSystem/controllers/CartManager.js'
    );
    Carts = CartsFile;
    const viewsProductsFile = async (products) => await products;
    viewsProducts = viewsProductsFile;
    const viewsCartProductsFile = async (cart) => {
      const productInfo = [];
      const productManager = new Products();
      for (let i = 0; i < cart.products.length; i++) {
        const pid = cart.products[i]._id;
        const quantity = cart.products[i].quantity;
        const product = await productManager.getProductById(pid);
        const productObj = {
          _id: product,
          quantity
        };
        productInfo.push(productObj);
      }
      return productInfo;
    };
    cartProducts = viewsCartProductsFile;
    break;
  }
}

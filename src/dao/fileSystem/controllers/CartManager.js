import fs from 'fs';
import path from 'path';
import __dirname from '../../../utils.js';

export default class CartManager {
  constructor () {
    this.path = path.join(__dirname, '/dao/fileSystem/db/carts.json');
    this.carts = [];
    this.readJson();
  }

  readJson = async () => {
    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.carts = JSON.parse(data);
    }
  };

  saveJson = async () => {
    const data = JSON.stringify(this.carts, null, 4);
    fs.writeFileSync(this.path, data);
  };

  addCart = async () => {
    await this.readJson();
    const cart = {
      _id: null,
      products: []
    };

    if (this.carts.length === 0) {
      cart._id = 1;
    } else {
      cart._id =
        Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    }
    this.carts.push(cart);
    await this.saveJson();
    return cart;
  };

  getCartById = async (id) => {
    await this.readJson();
    const cart = this.carts.find((cart) => cart._id === id);
    return cart;
  };

  addProductToCart = async (cid, pid) => {
    await this.readJson();
    const cartIndex = this.carts.findIndex((cart) => cart._id === cid);

    if (cartIndex !== -1) {
      const cart = this.carts[cartIndex];
      const existingProductIndex = cart.products.findIndex(
        (product) => product._id === pid
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        const product = {
          _id: pid,
          quantity: 1
        };
        cart.products.push(product);
      }
      await this.saveJson();
    }
  };

  deleteProductsInCart = async (cid) => {
    await this.readJson();
    const cart = this.carts.find((cart) => cart._id === cid);
    const updatedCart = cart.products = [];
    await this.saveJson();
    return updatedCart;
  };

  deleteProductInCart = async (cid, pid) => {
    await this.readJson();
    const cart = this.carts.find((cart) => cart._id === cid);
    cart.products = cart.products.filter(
      (product) => product._id !== pid
    );
    await this.saveJson();
  };
}

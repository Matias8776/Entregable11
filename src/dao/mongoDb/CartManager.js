import cartsModel from '../models/carts.js';
import mongoose from 'mongoose';

export default class CartManager {
  getCarts = async () => {
    try {
      const carts = await cartsModel.find();
      return carts;
    } catch (error) {
      return { error: error.message };
    }
  };

  getCartById = async (cid) => {
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return;
    }
    try {
      const cart = await cartsModel.findById(cid).lean();
      return cart;
    } catch (error) {
      return { error: error.message };
    }
  };

  addCart = async (products) => {
    try {
      const cartData = {};
      if (products && products.length > 0) {
        cartData.products = products;
      }

      const cart = await cartsModel.create(cartData);
      return cart;
    } catch (error) {
      return { error: error.message };
    }
  };

  addProductToCart = async (cid, pid) => {
    try {
      const data = { _id: cid, 'products._id': pid };
      const cart = await cartsModel.findById(cid);
      const product = cart.products.some((product) => product._id.equals(pid));

      if (product) {
        const update = {
          $inc: { 'products.$.quantity': 1 }
        };
        await cartsModel.updateOne(data, update);
      } else {
        const update = {
          $push: {
            products: { _id: pid, quantity: 1 }
          }
        };
        await cartsModel.updateOne({ _id: cid }, update);
      }

      return await cartsModel.findById(cid);
    } catch (error) {
      return { error: error.message };
    }
  };

  deleteProductInCart = async (cid, pid) => {
    try {
      const updatedCart = await cartsModel.findByIdAndUpdate(
        cid,
        {
          $pull: { products: { _id: pid } }
        },
        { new: true }
      );

      return updatedCart;
    } catch (error) {
      return { error: error.message };
    }
  };

  updateCart = async (id, cart) => {
    try {
      return await cartsModel.updateOne(
        { _id: id },
        { $set: { products: cart } }
      );
    } catch (error) {
      return { error: error.message };
    }
  };

  deleteProductsInCart = async (cid) => {
    try {
      const updatedCart = await cartsModel.findByIdAndUpdate(
        cid,
        {
          $set: { products: [] }
        },
        { new: true }
      );

      return updatedCart;
    } catch (error) {
      return { error: error.message };
    }
  };

  updateProductQuantityInCart = async (cid, pid, qty) => {
    try {
      await cartsModel.updateOne(
        { _id: cid, 'products._id': pid },
        { $set: { 'products.$.quantity': qty.quantity } }
      );
    } catch (error) {
      return { error: error.message };
    }
  };
}

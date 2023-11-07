import { Products } from '../dao/factory.js';
import __dirname, { passportCall, uploader } from '../utils.js';
import path from 'path';
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';
import {
  duplicateKeyError,
  generateProductError,
  notFoundProductError
} from '../services/errors/info.js';
import response from '../services/res/response.js';

const productManager = new Products();

export const passportAdmin = passportCall('admin');

export const uploaderProduct = uploader.array('thumbnails');

export const getProducts = async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const category = req.query.category;
  const disponibility = req.query.disponibility;
  const sort = +req.query.sort;
  const products = await productManager.getProducts(
    limit || 10,
    page || 1,
    category,
    disponibility,
    sort
  );
  response(res, 200, products);
};

export const getProductById = async (req, res, next) => {
  const pid = req.params.pid;
  const product = await productManager.getProductById(pid);

  if (!product) {
    const error = new CustomError({
      name: 'No existe el producto',
      cause: notFoundProductError(pid),
      message: `No existe el producto con el id: ${pid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
  } else {
    response(res, 200, product);
  }
};

export const addProduct = async (req, res, next) => {
  let { title, description, price, thumbnails, code, stock, status, category } =
    req.body;

  if (req.files) {
    thumbnails = req.files.map((file) => {
      return path.join(__dirname, '/public/img/', file.filename);
    });
  }

  if (
    typeof title === 'string' &&
    typeof description === 'string' &&
    typeof price === 'number' &&
    price >= 0 &&
    typeof code === 'string' &&
    typeof stock === 'number' &&
    stock >= 0 &&
    typeof category === 'string'
  ) {
    const newProduct = await productManager.addProduct({
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status,
      category
    });

    if (!newProduct.success) {
      const error = new CustomError({
        name: 'Error al crear el producto',
        cause: duplicateKeyError(code),
        message: 'Código duplicado',
        code: EErrors.DUPLICATE_KEY
      });
      next(error);
    } else {
      response(
        res,
        201,
        `El producto se creo correctamente con el id: ${newProduct.id}`
      );
    }
  } else {
    const error = new CustomError({
      name: 'Error al crear el producto',
      cause: generateProductError({
        title,
        description,
        price,
        code,
        stock,
        category
      }),
      message: 'Faltan campos obligatorios o los datos no son validos',
      code: EErrors.INVALID_TYPES
    });
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  const pid = req.params.pid;
  const product = await productManager.getProductById(pid);

  if (!product) {
    const error = new CustomError({
      name: 'No existe el producto',
      cause: notFoundProductError(pid),
      message: `No existe el producto con el id: ${pid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
  } else {
    if (
      typeof req.body.title === 'string' ||
      typeof req.body.code === 'string' ||
      (typeof req.body.stock === 'number' && req.body.stock >= 0) ||
      typeof req.body.category === 'string' ||
      typeof req.body.description === 'string' ||
      (typeof req.body.price === 'number' && req.body.price >= 0)
    ) {
      const updateProduct = req.body;
      await productManager.updateProduct(product._id, updateProduct);
      const updatedProduct = await productManager.getProductById(pid);
      response(res, 200, updatedProduct);
    } else {
      const error = new CustomError({
        name: 'Error al actualizar el producto',
        cause: generateProductError({
          title: req.body.title,
          description: req.body.description,
          price: req.body.price,
          code: req.body.code,
          stock: req.body.stock,
          category: req.body.category
        }),
        message: 'Los datos no son validos',
        code: EErrors.INVALID_TYPES
      });
      next(error);
    }
  }
};

export const deleteProduct = async (req, res, next) => {
  const pid = req.params.pid;
  const product = await productManager.getProductById(pid);

  if (!product) {
    const error = new CustomError({
      name: 'No existe el producto',
      cause: notFoundProductError(pid),
      message: `No existe el producto con el id: ${pid}`,
      code: EErrors.NOT_FOUND
    });
    next(error);
  } else {
    await productManager.deleteProduct(product._id);
    response(res, 200, `Se elimino el producto con el id ${pid}`);
  }
};

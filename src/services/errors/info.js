export const generateProductError = (product) => {
  return `
  Una o mas propiedades del producto están incompletas o no son validas.
  Lista de propiedades requeridas:
  * title: necesita ser un string, recibido ${product.title}
  * description: necesita ser un string, recibido ${product.description}
  * price: necesita ser un numero positivo, recibido ${product.price}
  * stock: necesita ser un numero positivo, recibido ${product.stock}
  * code: necesita ser un string y ser único, recibido ${product.code}
  * category: necesita ser un string, recibido ${product.category}
  `;
};

export const duplicateKeyError = (code) => {
  return `El código ya existe y debe ser único, recibido ${code}`;
};

export const notFoundProductError = (pid) => {
  return `No existe el producto con el id: ${pid}`;
};

export const notFoundCartError = (cid) => {
  return `No existe el carrito con el id: ${cid}`;
};

export const notFoundProductInCartError = (pid, cid) => {
  return `No existe el producto con el id: ${pid} en el carrito con el id: ${cid}`;
};

export const updateProductQuantityInCartError = (quantity) => {
  return `quantity: necesita ser un numero positivo, recibido ${quantity}`;
};

export const updateCartError = (pid, quantity) => {
  return `
  _id: necesita ser un string, recibido ${pid}
  quantity: necesita ser un numero positivo, recibido ${quantity}
  `;
};

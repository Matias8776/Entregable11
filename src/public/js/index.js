/* eslint-disable no-undef */
const socket = io();

const productsContainer = document.getElementById('productsList');
const addForm = document.getElementById('addForm');
const deleteForm = document.getElementById('deleteForm');

socket.on('server:updatedProducts', async () => {
  await fetch('/api/products', {
    method: 'GET'
  })
    .then((response) => response.json())
    .then((response) => {
      let products = response;
      products = products.payload.docs;
      productsContainer.innerHTML = '';
      products.forEach((a) => {
        const newLiProduct = document.createElement('li');
        newLiProduct.innerHTML = `
            <div><strong>Id:</strong> ${a._id}</div>
            <div><strong>Título:</strong> ${a.title}</div>
            <div><strong>Descripción:</strong> ${a.description}</div>
            <div><strong>Precio:</strong> $${a.price}</div>
            <div><strong>Código:</strong> ${a.code}</div>
            <div><strong>Stock:</strong> ${a.stock}</div>
            <div><strong>Categoría:</strong> ${a.category}</div>
            `;
        productsContainer.appendChild(newLiProduct);
      });
    });
});

addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(addForm);

  const response = await fetch('/api/products', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();

  const errorElement = document.getElementById('errorAdd');
  if (response.status === 200 && data.status === 'success') {
    addForm.reset();
    socket.emit('client:updateProduct');
    errorElement.textContent = '';
  } else if (data.status === 'error') {
    if (errorElement) {
      errorElement.textContent = data.message;
    }
  }
});

deleteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(deleteForm);
  const pid = formData.get('id');
  const response = await fetch(`/api/products/${pid}`, {
    method: 'DELETE',
    body: formData
  });
  const data = await response.json();

  const errorElement = document.getElementById('errorDelete');
  if (response.status === 200 && data.status === 'success') {
    deleteForm.reset();
    socket.emit('client:updateProduct');
    errorElement.textContent = '';
  } else if (data.status === 'error') {
    if (errorElement) {
      errorElement.textContent = data.message;
    }
  }
});

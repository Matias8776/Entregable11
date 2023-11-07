/* eslint-disable no-undef */
const addButton = document.querySelector('.addButton');
const cid = document.querySelector('.addButton').getAttribute('data-cid');
const pid = document.querySelector('.addButton').getAttribute('data-pid');

addButton.addEventListener('click', function (event) {
  event.preventDefault();
  fetch(`/api/carts/${cid}/product/${pid}`, {
    method: 'POST'
  }).then(async (response) => {
    if (response.status === 200) {
      Toastify({
        text: 'Producto agregado al carrito',
        duration: 3000,
        gravity: 'bottom',
        position: 'center',
        style: {
          background: '#808080'
        }
      }).showToast();
    }
  });
});

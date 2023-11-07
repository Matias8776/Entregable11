/* eslint-disable no-undef */
const deleteButtons = document.querySelectorAll('.deleteButton');
const deleteButtonsArray = Array.from(deleteButtons);
const clearButton = document.querySelector('.clearButton');
const purchaseButton = document.querySelector('.purchaseButton');

document.addEventListener('DOMContentLoaded', function () {
  const cid = document.querySelector('[data-cart]').getAttribute('data-cart');
  deleteButtonsArray.forEach((deleteButton) => {
    deleteButton.addEventListener('click', function (event) {
      event.preventDefault();
      const pid = this.getAttribute('data-pid');
      fetch(`/api/carts/${cid}/products/${pid}`, {
        method: 'DELETE'
      }).then(async (response) => {
        if (response.status === 200) {
          Toastify({
            text: 'Producto eliminado del carrito',
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            style: {
              background: '#808080'
            }
          }).showToast();
          window.location.reload();
        }
      });
    });
  });
});

if (clearButton !== null) {
  clearButton.addEventListener('click', function (event) {
    event.preventDefault();
    const cid = document.querySelector('.clearButton').getAttribute('data-cid');
    fetch(`/api/carts/${cid}`, {
      method: 'DELETE'
    }).then(async (response) => {
      if (response.status === 200) {
        Toastify({
          text: 'Carrito vaciado',
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          style: {
            background: '#808080'
          }
        }).showToast();
        window.location.reload();
      }
    });
  });
}

if (purchaseButton !== null) {
  purchaseButton.addEventListener('click', function (event) {
    event.preventDefault();
    const cid = document
      .querySelector('.purchaseButton')
      .getAttribute('data-cid');
    fetch(`/api/carts/${cid}/purchase`).then(async (response) => {
      if (response.status === 200) {
        Toastify({
          text: 'Compra realizada, se ha enviado un email con el detalle',
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          style: {
            background: '#808080'
          }
        }).showToast();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    });
  });
}

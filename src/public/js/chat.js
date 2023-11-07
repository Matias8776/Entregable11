/* eslint-disable no-undef */
const socket = io();
const nombreUsuario = document.getElementById('nombreusuario');
const formulario = document.getElementById('formulario');
const inputmensaje = document.getElementById('mensaje');
const chat = document.getElementById('chat');
const container = document.getElementById('chat-messages');

let usuario = null;

if (!usuario) {
  Swal.fire({
    title: 'Bienvenido al chat',
    text: 'Ingresa tu usuario',
    input: 'text',
    inputValidator: (value) => {
      if (!value) {
        return 'Necesitas ingresar tu Nombre';
      }
    },
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then((username) => {
    usuario = username.value;
    nombreUsuario.innerHTML = usuario;
    socket.emit('nuevousuario', usuario);
  });
}

formulario.onsubmit = (e) => {
  e.preventDefault();
  const info = {
    user: usuario,
    message: inputmensaje.value
  };
  socket.emit('mensaje', info);
  inputmensaje.value = ' ';
};

function scrollToBottom () {
  container.scrollTop = container.scrollHeight;
}

socket.on('chat', (mensaje) => {
  const chatrender = mensaje
    .map((e) => {
      return `<p><strong>${e.user}:</strong> ${e.message}`;
    })
    .join(' ');
  chat.innerHTML = chatrender;
  scrollToBottom();
});

socket.on('broadcast', (usuario) => {
  Toastify({
    text: `${usuario} ingreso al chat`,
    duration: 3000,
    gravity: 'bottom',
    position: 'center',
    style: {
      background: '#808080'
    }
  }).showToast();
});

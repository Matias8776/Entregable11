const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(registerForm);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch('api/sessions/register', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (response) => {
    if (response.status === 200) {
      registerForm.reset();
      window.location.replace('/');
    } else {
      window.location.replace('/register');
    }
  });
});

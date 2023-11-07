const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(loginForm);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  await fetch('api/sessions/login', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (response) => {
    if (response.status === 200) {
      loginForm.reset();
      window.location.replace('/products');
    } else {
      window.location.replace('/');
    }
  });
});

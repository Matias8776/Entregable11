const resetPasswordForm = document.getElementById('resetPasswordForm');

resetPasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(resetPasswordForm);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  await fetch('api/sessions/resetPassword', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (response) => {
    const errorElement = document.getElementById('error');
    if (response.status === 200) {
      resetPasswordForm.reset();
      window.location.replace('/');
      errorElement.textContent = '';
    } else {
      const errorData = await response.json();
      errorElement.textContent = errorData.message;
    }
  });
});

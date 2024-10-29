const form = document.querySelector('form');
const usernameInput = form.querySelector('#username');
const passwordInput = form.querySelector('#password');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = usernameInput.value;
  const password = passwordInput.value;

  // створюємо об'єкт, який містить дані, які ми хочемо надіслати на сервер
  const data = {
    username: username,
    password: password
  };

  // відправляємо запит на сервер
  fetch('http://localhost:5000/api/v1/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
      if (!response.ok) {
        alert('Incorrect username or password.');
      }
      return response.json();
    })
  .then(data => {
    localStorage.setItem('userId', data[1]);
    //console.log(Id);
    window.location.href = '../front/calendar-page.html';
  })
  .catch(error => console.error(error));
});

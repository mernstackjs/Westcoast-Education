import HttpClient from '../../data/HttpClient.js';

const form = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

const userService = new HttpClient('users');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  errorMsg.textContent = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    errorMsg.textContent = 'Fyll i alla fält.';
    return;
  }

  const users = await userService.get(`?email=${email}`);

  if (users.length === 0) {
    errorMsg.textContent = 'Fel e-post eller lösenord.';
    return;
  }

  const user = users[0];

  if (user.password !== password) {
    errorMsg.textContent = 'Fel e-post eller lösenord.';
    return;
  }

  localStorage.setItem('user', JSON.stringify(user));

  window.location.href = '/src/student/site/index.html';
});

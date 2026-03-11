import HttpClient from '../../data/HttpClient.js';
import { User } from '../../data/responseTypes.js';

const form = document.querySelector('form') as HTMLFormElement;
const errorMsg = document.getElementById('errorMsg') as HTMLParagraphElement;

const userService = new HttpClient('users');

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  errorMsg.textContent = '';

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const { email, password } = data;

  console.log(email, password);

  if (!email || !password) {
    errorMsg.textContent = 'Fyll i alla fält.';
    return;
  }

  const users = await userService.get<User[]>(`?email=${email}`);

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
};

form.addEventListener('submit', handleSubmit);

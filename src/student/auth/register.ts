import HttpClient from '../../data/HttpClient.js';
import { User } from '../../data/responseTypes.js';
import { generateNextId } from '../../utils/idGenerator.js';

const form = document.querySelector('form') as HTMLFormElement;
const errorMsg = document.getElementById('errorMsg') as HTMLParagraphElement;

const userService = new HttpClient('users');

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const { name, email, password } = data;

  errorMsg.textContent = '';

  // const name = document.getElementById('name').value.trim();
  // const email = document.getElementById('email').value.trim();
  // const password = document.getElementById('password').value.trim();

  if (!name || !email || !password) {
    errorMsg.textContent = 'Fyll i alla fält.';
    return;
  }

  // Check if email already exists
  const check = await userService.get<User[]>(`?email=${email}`);

  if (check.length > 0) {
    errorMsg.textContent = 'E-post finns redan.';
    return;
  }

  // Fetch all users to generate next student ID
  const allUsers = await userService.get<User[]>();

  // Filter only students
  const students = allUsers.filter((u) => u.role === 'student');

  // Generate new ID
  const studentId = generateNextId(students, '#ST-', 101);

  // Create new user object
  const newUser = {
    id: studentId,
    name,
    email,
    password,
    role: 'student',
    joined: new Date().toISOString().split('T')[0],
    course: [],
    status: 'active',
  };

  // Save new user
  const user = await userService.post(newUser);
  // const res = await fetch('http://localhost:3001/users', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(newUser),
  // });

  // const user = await res.json();

  // Save to localStorage
  localStorage.setItem('user', JSON.stringify(user));

  // Redirect to home page
  window.location.href = '/src/student/site/index.html';
};

form.addEventListener('submit', handleSubmit);

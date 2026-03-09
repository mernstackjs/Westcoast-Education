const form = document.getElementById('registerForm');
const errorMsg = document.getElementById('errorMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  errorMsg.textContent = '';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!name || !email || !password) {
    errorMsg.textContent = 'Fyll i alla fält.';
    return;
  }

  // Check if email already exists
  const check = await fetch(`http://localhost:3001/users?email=${email}`);
  const existing = await check.json();

  if (existing.length > 0) {
    errorMsg.textContent = 'E-post finns redan.';
    return;
  }

  // Fetch all users to generate next student ID
  const allUsersRes = await fetch('http://localhost:3001/users');
  const allUsers = await allUsersRes.json();

  // Filter only students
  const students = allUsers.filter((u) => u.role === 'student');

  // Generate new ID
  let newIdNum = 101;
  if (students.length > 0) {
    const lastId = students
      .map((u) => parseInt(u.id.replace('#ST-', '')))
      .sort((a, b) => b - a)[0];
    newIdNum = lastId + 1;
  }

  const studentId = `#ST-${newIdNum}`;

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
  const res = await fetch('http://localhost:3001/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });

  const user = await res.json();

  // Save to localStorage
  localStorage.setItem('user', JSON.stringify(user));

  // Redirect to home page
  window.location.href = '/src/student/site/index.html';
});

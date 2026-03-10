import { createTitle } from '../../scripts/dom.js';

export async function ListOfStudentsPage(container) {
  const title = createTitle('Students');
  const card = document.createElement('div');
  card.className = 'card';

  const table = document.createElement('table');
  table.className = 'table';

  let students = [];
  try {
    const res = await fetch('http://localhost:3001/users');
    const users = await res.json();

    // Only student users
    students = users.filter((u) => u.role === 'student');
  } catch (err) {
    console.error('Failed to load students:', err);
  }

  const rows = students
    .map((student) => {
      const joinedDate = new Date(student.joined).toLocaleDateString('sv-SE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      console.log(student);
      const courseNames = student?.courses?.length
        ? student.courses.map((c) => c.title || c).join(', ')
        : '-';

      const statusClass =
        student.status === 'active' ? 'confirmed' : 'cancelled';
      const statusText = student.status === 'active' ? 'Active' : 'Inactive';

      return `
      <tr>
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${courseNames}</td>
        <td>${joinedDate}</td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
      </tr>
    `;
    })
    .join('');

  table.innerHTML = `
    <thead>
      <tr>
        <th>Student ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Course</th>
        <th>Joined</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  `;

  card.appendChild(table);

  container.appendChild(title);
  container.appendChild(card);
}

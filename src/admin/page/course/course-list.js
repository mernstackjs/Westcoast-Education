import { createTitle, createCard } from '../../../scripts/dom.js';

const COURSES_API_URL = 'http://localhost:3001/courses';

export function ListOfCourses(container) {
  const title = createTitle('Kurslista');
  const card = createCard();

  const table = document.createElement('table');
  table.className = 'table';

  table.innerHTML = `
    <thead>
      <tr>
        <th>Kurs ID</th>
        <th>Titel</th>
        <th>Kategori</th>
        <th>Nivå</th>
        <th>Typ</th>
        <th>Startdatum</th>
        <th>Varaktighet</th>
        <th>Pris</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');

  async function loadCourses() {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">Laddar kurser...</td>
      </tr>
    `;

    try {
      const response = await fetch(COURSES_API_URL);
      if (!response.ok) throw new Error('Failed to load courses');

      const courses = await response.json();

      if (!Array.isArray(courses) || courses.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8">Inga kurser hittades. Lägg till en kurs för att börja.</td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = '';

      courses.forEach((course) => {
        const tr = document.createElement('tr');

        const startDate = course.startDate
          ? new Date(course.startDate).toLocaleDateString('sv-SE', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : '-';

        const duration = course.duration || '-';
        const price = course.price ? `${course.price} SEK` : '-';

        tr.innerHTML = `
        <td>${course.courseNumber || '-'}</td>
          <td>${course.title || '-'}</td>
          <td>${course.category || '-'}</td>
          <td>${course.level || '-'}</td>
          <td>${course.type || '-'}</td>
          <td>${startDate}</td>
          <td>${duration}</td>
          <td>${price}</td>
        `;

        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error(error);
      tbody.innerHTML = `
        <tr>
          <td colspan="8">Misslyckades att ladda kurser. Vänligen uppdatera sidan.</td>
        </tr>
      `;
    }
  }

  card.appendChild(table);
  container.appendChild(title);
  container.appendChild(card);

  loadCourses();
}

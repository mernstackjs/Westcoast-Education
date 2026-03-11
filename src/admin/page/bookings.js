import { createTitle } from '../../../../dist/scripts/dom.js';
import AdminHttpClient from '../admin_http_client.js';

const bookingService = new AdminHttpClient('bookings');
const userService = new AdminHttpClient('users');
const coursesService = new AdminHttpClient('courses');

export async function BookingsPage(container) {
  const title = createTitle('Hantera Bokningar');
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <h2 class="card-title">Kursbokningar</h2>
    <div class="table-container"> 
      <table class="table">
        <thead>
          <tr>
            <th>Boknings ID</th>
            <th>Student</th>
            <th>Telefon</th>
            <th>Adress</th>
            <th>Kurs</th>
            <th>Datum</th>
            <th>Pris</th>
            <th>Status</th>
            <th>Åtgärd</th>
          </tr>
        </thead>
        <tbody id="bookings-tbody"></tbody>
      </table>
    </div>
  `;

  const tbody = card.querySelector('#bookings-tbody');

  async function loadBookings() {
    tbody.innerHTML = `<tr><td colspan="9">Laddar bokningar...</td></tr>`;

    try {
      const bookings = await bookingService.get();

      if (!bookings.length) {
        tbody.innerHTML = `<tr><td colspan="9">Inga bokningar hittades.</td></tr>`;
        return;
      }

      tbody.innerHTML = '';

      for (const booking of bookings) {
        const safeUserId = encodeURIComponent(booking.userId);
        const [student, course] = await Promise.all([
          userService.get(`/${safeUserId}`).catch(() => null),
          coursesService.get(`/${booking.courseId}`).catch(() => null),
        ]);

        const tr = document.createElement('tr');
        const bookingDate = booking.date
          ? new Date(booking.date).toLocaleDateString('sv-SE')
          : '-';
        const price = course?.price ? `${course.price} SEK` : '-';
        const statusClass =
          booking.status === 'confirmed'
            ? 'status-confirmed'
            : 'status-pending';

        tr.innerHTML = `
          <td>${booking.id}</td>
          <td><strong>${student ? student.name : 'Okänd Student'}</strong></td>
          <td>${booking?.phone || '-'}</td>
          <td>${booking?.address || '-'}</td>
          <td>${course ? course.title : 'Okänd Kurs'}</td>
          <td>${bookingDate}</td>
          <td>${price}</td>
          <td><span class="status-badge ${statusClass}">${booking.status.toUpperCase()}</span></td>
          <td class="action-cell"></td>
        `;

        const actionCell = tr.querySelector('.action-cell');

        if (booking.status === 'pending') {
          const approveBtn = document.createElement('button');
          approveBtn.textContent = 'Godkänn';
          approveBtn.className = 'btn-approve';

          approveBtn.addEventListener('click', async () => {
            approveBtn.disabled = true;
            approveBtn.textContent = 'Processar...';

            try {
              const bookingUpdate = await bookingService.patch(booking.id, {
                status: 'confirmed',
              });

              if (student && course) {
                const currentCourses = student.courses || student.course || [];

                const isAlreadyEnrolled = currentCourses.some(
                  (c) => c.id === course.id,
                );

                if (!isAlreadyEnrolled) {
                  const updatedCourses = [
                    ...currentCourses,
                    {
                      id: course.id,
                      title: course.title,
                      enrolledDate: new Date().toISOString(),
                    },
                  ];

                  await userService.patch(student.id, {
                    courses: updatedCourses,
                  });
                }
              }
              loadBookings();
            } catch (err) {
              alert('Ett fel uppstod: ' + err.message);
              approveBtn.disabled = false;
              approveBtn.textContent = 'Godkänn';
            }
          });
          actionCell.appendChild(approveBtn);
        }
        tbody.appendChild(tr);
      }
    } catch (error) {
      tbody.innerHTML = `<tr><td colspan="9" style="color:red;">Fel vid laddning: ${error.message}</td></tr>`;
    }
  }

  container.appendChild(title);
  container.appendChild(card);
  loadBookings();
}

import { createTitle } from '../../../../dist/scripts/dom.js';
import AdminHttpClient from '../admin_http_client.js';

const bookingService = new AdminHttpClient('bookings');
const userService = new AdminHttpClient('users');
const coursesService = new AdminHttpClient('courses');

export async function dashboardPage(container) {
  container.innerHTML = '<p>Laddar dashboard...</p>';

  try {
    const [courses, users, bookings] = await Promise.all([
      coursesService.get(),
      userService.get(),
      bookingService.get(),
    ]);

    // 2. Calculate Stats
    const totalCourses = courses.length;
    const totalStudents = users.length;
    const totalBookings = bookings.length;

    // Calculate Revenue only from confirmed bookings
    const totalRevenue = bookings
      .filter((b) => b.status === 'confirmed')
      .reduce((sum, b) => {
        const course = courses.find((c) => c.id == b.courseId);
        return sum + (Number(course?.price) || 0);
      }, 0);

    container.innerHTML = '';
    const title = createTitle('Admin Dashboard');
    const wrapper = document.createElement('div');

    /* ---------------- STATS CARDS (Dynamic) ---------------- */
    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats';
    statsContainer.innerHTML = `
      <div class="stat-card">
          <h3>Total Courses</h3>
          <p>${totalCourses}</p>
      </div>
      <div class="stat-card">
          <h3>Total Students</h3>
          <p>${totalStudents}</p>
      </div>
      <div class="stat-card">
          <h3>Total Bookings</h3>
          <p>${totalBookings}</p>
      </div>
      <div class="stat-card">
          <h3>Total Revenue</h3>
          <p>${totalRevenue.toLocaleString('sv-SE')} SEK</p>
      </div>
    `;

    /* ---------------- RECENT BOOKINGS (Dynamic) ---------------- */
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h2 class="card-title">Recent Bookings</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Student</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Course</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="recent-bookings-tbody"></tbody>
      </table>
    `;

    const tbody = card.querySelector('#recent-bookings-tbody');

    // Get the 5 most recent bookings (reversed)
    const recentBookings = bookings.slice(-5).reverse();

    recentBookings.forEach((booking) => {
      const student = users.find((u) => u.id == booking.userId);
      const course = courses.find((c) => c.id == booking.courseId);
      const bookingDate = booking.date
        ? new Date(booking.date).toLocaleDateString('sv-SE')
        : '-';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${booking.id}</td>
        <td>${student ? student.name : 'Okänd'}</td>
           <td>${booking.phone}</td>
              <td>${booking.address}</td>
        <td>${course ? course.title : 'Okänd kurs'}</td>
        <td>${bookingDate}</td>
        <td><span class="status-badge status-${booking.status}">${booking.status.toUpperCase()}</span></td>
      `;
      tbody.appendChild(tr);
    });

    wrapper.appendChild(statsContainer);
    wrapper.appendChild(card);
    container.appendChild(title);
    container.appendChild(wrapper);
  } catch (error) {
    console.error('Dashboard Error:', error);
    container.innerHTML = `<p style="color:red;">Error loading dashboard data.</p>`;
  }
}

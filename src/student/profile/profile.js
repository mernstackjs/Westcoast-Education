import HttpClient from '../../data/HttpClient.js';

const user = JSON.parse(localStorage.getItem('user'));
const bookingService = new HttpClient('bookings');
const courseService = new HttpClient('courses');

if (!user) {
  window.location.href = '/src/student/site/index.html';
}

const profileContainer = document.querySelector('.profile-container');

const renderProfile = async () => {
  if (!profileContainer) return;
  profileContainer.innerHTML = '';

  // --- Sidebar ---
  const aside = document.createElement('aside');
  aside.classList.add('profile-sidebar');

  const profileCard = document.createElement('div');
  profileCard.classList.add('profile-card');

  profileCard.innerHTML = `
    <div class="avatar-circle">${user?.name?.slice(0, 2).toUpperCase() || '??'}</div>
    <h2>${user?.name}</h2>
    <p class="badge">${user?.role}</p>
  `;

  const logoutBtn = document.createElement('button');
  logoutBtn.classList.add('btn-outline');
  logoutBtn.textContent = 'Logga ut';
  logoutBtn.onclick = () => {
    localStorage.removeItem('user');
    window.location.href = '/src/student/auth/login.html';
  };

  profileCard.appendChild(logoutBtn);
  aside.appendChild(profileCard);
  profileContainer.appendChild(aside);

  // --- Main Content Section ---
  const section = document.createElement('section');
  section.classList.add('profile-content');

  // Info Grid
  const infoGrid = document.createElement('div');
  infoGrid.classList.add('info-grid');
  infoGrid.innerHTML = `
    <div class="info-item"><label>E-post</label><p>${user.email}</p></div>
    <div class="info-item"><label>Medlem sedan</label><p>${new Date(user.joined).toLocaleDateString('sv-SE')}</p></div>
    <div class="info-item"><label>Status</label><p>${user.status}</p></div>
  `;
  section.appendChild(infoGrid);

  // Bookings List
  const bookingsSection = document.createElement('div');
  bookingsSection.classList.add('bookings-section');
  bookingsSection.innerHTML = '<h3>Mina Bokningar</h3>';

  const bookingsList = document.createElement('div');
  bookingsList.classList.add('bookings-grid');

  const bookings = await bookingService.get(
    `?userId=${encodeURIComponent(user.id)}`,
  );

  if (bookings.length > 0) {
    for (const b of bookings) {
      try {
        const courseData = await courseService.get(`?id=${b.courseId}`);
        const course = courseData[0];
        if (course) {
          const bookingCard = document.createElement('div');
          bookingCard.classList.add('booking-card');

          bookingCard.innerHTML = `
          <div class="booking-visual">
            <img src="${course.image}" alt="${course.title}">
          </div>
          
          <div class="booking-details">
            <div>
              <h4>${course.title}</h4>
              <p >${course.courseNumber} | ${course.level}</p>
              <p class="booking-date">
                <span class="material-symbols-outlined">calendar_today</span>
                Bokad: ${new Date(b.date).toLocaleDateString('sv-SE')}
              </p>
            </div>
            
            <div>
              <span class="status-badge status-${b.status.toLowerCase()}">
                ${b.status === 'confirmed' ? 'Bekräftad' : 'Väntar'}
              </span>
            </div>
          </div>
        `;
          bookingsList.appendChild(bookingCard);
        }
      } catch (err) {
        console.error(
          `Kunde inte ladda kursdetaljer för kurs ${b.courseId}`,
          err,
        );
      }
    }
  } else {
    bookingsList.innerHTML =
      '<p class="empty-msg">Du har inga bokade kurser än.</p>';
  }

  bookingsSection.appendChild(bookingsList);
  section.appendChild(bookingsSection);
  profileContainer.appendChild(section);
};

document.addEventListener('DOMContentLoaded', renderProfile);

import { BookingsPage } from './page/bookings.js';
import { dashboardPage } from './page/dashboard.js';
import { ListOfStudentsPage } from './page/students.js';

const content = document.getElementById('content');

function loadPage(page) {
  console.log(content);
  content.innerHTML = '';
  if (page === 'dashboard') {
    dashboardPage(content);
  }
  if (page === 'students') {
    ListOfStudentsPage(content);
  }
  if (page === 'bookings') {
    BookingsPage(content);
  }
}

document.querySelectorAll('#sidebar_menu li').forEach((li) => {
  li.addEventListener('click', () => {
    loadPage(li.dataset.page);
  });
});

loadPage('dashboard');

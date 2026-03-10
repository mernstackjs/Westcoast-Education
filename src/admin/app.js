import { BookingsPage } from './page/bookings.js';
import { addCoursePage } from './page/course/add-course.js';
import { ListOfCourses } from './page/course/course-list.js';
import { dashboardPage } from './page/dashboard.js';
import { ListOfStudentsPage } from './page/students.js';

const content = document.getElementById('content');
const menuItems = document.querySelectorAll('#sidebar_menu li');
const menuToggle = document.querySelector('.menu-toggle');

function setActiveMenu(page) {
  menuItems.forEach((li) => {
    li.classList.toggle('active', li.dataset.page === page);
  });
}

function loadPage(page) {
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

  if (page === 'add-course') {
    addCoursePage(content);
  }

  if (page === 'course-list') {
    ListOfCourses(content);
  }
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    document.body.classList.toggle('menu-open');
  });
}

menuItems.forEach((li) => {
  li.addEventListener('click', () => {
    const page = li.dataset.page;
    setActiveMenu(page);
    loadPage(page);
    document.body.classList.remove('menu-open');
  });
});

setActiveMenu('dashboard');
loadPage('dashboard');

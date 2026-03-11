import { User } from '../../data/responseTypes';

export function renderHeader() {
  const userData = localStorage.getItem('user');
  const user: User | null = userData ? JSON.parse(userData) : null;

  const headerContainer = document.getElementById('header') as HTMLElement;

  const navLinks = user
    ? `
      <a href="/src/student/site/index.html" class="nav-link">Hem</a>
      <a href="/src/student/course/course.html" class="nav-link">Kurser</a>
      <a href="/src/student/profile/profile.html" class="nav-link">Mitt konto</a>
      <a href="#" id="logoutBtn" class="nav-link logout">Logga ut</a>
    `
    : `
      <a href="/src/student/site/index.html" class="nav-link">Hem</a>
      <a href="/src/student/course/course.html" class="nav-link">Kurser</a>
      <a href="/src/student/auth/login.html" class="nav-link">Logga in</a>
      <a href="/src/student/auth/register.html" class="nav-link">Registrera dig</a>
    `;

  headerContainer.innerHTML = `
<header class="main-header">

<div class="logo-container">
<div class="logo-icon">
<span class="material-symbols-outlined">school</span>
</div>
<h2 class="brand-name">WestCoast</h2>
</div>

<button class="menu-toggle">
<span class="material-symbols-outlined">menu</span>
</button>

<div class="nav-wrapper">

<nav class="nav-links">
${navLinks}
</nav>

</div>

</header>
`;

  /* ==============================
     MOBILE MENU LOGIC
  ============================== */

  const menuToggle = headerContainer.querySelector(
    '.menu-toggle',
  ) as HTMLButtonElement;
  const navWrapper = headerContainer.querySelector(
    '.nav-wrapper',
  ) as HTMLElement;
  const navLinksElements = headerContainer.querySelectorAll(
    '.nav-link',
  ) as NodeListOf<HTMLAnchorElement>;

  menuToggle.addEventListener('click', () => {
    navWrapper.classList.toggle('active');
  });

  navLinksElements.forEach((link) => {
    link.addEventListener('click', () => {
      navWrapper.classList.remove('active');
    });
  });

  if (user) {
    const logoutBtn = document.getElementById('logoutBtn') as HTMLAnchorElement;

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      location.reload();
    });
  }
}

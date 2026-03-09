export function renderHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  const headerContainer = document.getElementById('header');

  const navLinks = user
    ? `
      <a href="/src/student/site/index.html" class="nav-link">Hem</a>
      <a href="/src/student/course/course.html" class="nav-link">Kurser</a>
      <a href="#" class="nav-link">Mitt konto</a>
      <a href="#" id="logoutBtn" class="nav-link">Logga ut</a>
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

  if (user) {
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      location.reload();
    });
  }
}

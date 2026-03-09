const menuBtn = document.getElementById('mobile-menu-btn');
const navWrapper = document.getElementById('nav-wrapper');

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    navWrapper.classList.toggle('active');
    const icon = menuBtn.querySelector('.material-symbols-outlined');
    icon.textContent = navWrapper.classList.contains('active')
      ? 'close'
      : 'menu';
  });
}

async function fetchCourses() {
  try {
    const response = await fetch('http://localhost:3001/courses');
    const courses = await response.json();
    const grid = document.getElementById('course-grid');

    grid.innerHTML = courses
      .map(
        (course) => `
          <article class="course-card card">
            <div class="image-container">
              <img src="${course.image || 'https://via.placeholder.com/300'}" alt="${course.title}" />
              <span class="badge">${course.category || 'Course'}</span>
            </div>
            <div class="course-info">
              <h3>${course.title}</h3>
              <p>${course.description.slice(0, 60)}...</p>
              <div class="course-footer">
                <span class="price">$${course.price}</span>
                <button class="btn-enroll">Enroll</button>
              </div>
            </div>
          </article>
        `,
      )
      .join('');
  } catch (err) {
    console.error('Make sure your json-server is running!', err);
  }
}

fetchCourses();

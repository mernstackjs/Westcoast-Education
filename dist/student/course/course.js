import HttpClient from '../../data/HttpClient.js';
const courseService = new HttpClient('courses');
let allCourses = [];
async function loadCatalog() {
    // const res = await fetch('http://localhost:3001/courses');
    // const data = await res.json();
    allCourses = await courseService.get();
    renderCourses(allCourses);
}
function renderCourses(courses) {
    const grid = document.querySelector('.course-grid');
    if (!grid)
        return;
    grid.innerHTML = courses
        .map((course) => `
      <div class="course-card">
        <div class="image-container">
          <span class="category-badge">${course.category || 'Webb'}</span>
          <img src="${course.image}" alt="${course.title}">
        </div>

        <div class="course-info">
          <h3>${course.title}</h3>

          <div class="course-stats">
            <span>${course.level || 'Medel nivå'}</span>
            <span>${course.duration || '12 veckor'}</span>
          </div>

          <div class="course-footer">
            <span class="price">${course.price} SEK</span>
            <a href="/src/student/course-details/course-details.html?id=${course.id}" class="btn-enroll">Starta kurs</a>
          </div>
        </div>
      </div>
    `)
        .join('');
}
const searchInput = document.getElementById('courseSearch');
const filterButtons = document.querySelectorAll('.filter-btn');
searchInput?.addEventListener('input', (e) => {
    const target = e.target;
    const value = target.value.toLowerCase();
    const filtered = allCourses.filter((course) => course.title.toLowerCase().includes(value));
    renderCourses(filtered);
});
filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        document
            .querySelectorAll('.filter-btn')
            .forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.dataset.category;
        if (category === 'Alla') {
            renderCourses(allCourses);
        }
        else {
            const filtered = allCourses.filter((course) => course.category === category);
            renderCourses(filtered);
        }
    });
});
loadCatalog();
//# sourceMappingURL=course.js.map
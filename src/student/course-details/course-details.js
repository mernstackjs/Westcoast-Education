import HttpClient from '../../data/HttpClient.js';

const courseService = new HttpClient('courses');
const bookingService = new HttpClient('bookings');

function getCourseId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadCourse() {
  const id = getCourseId();

  // const res = await fetch(`http://localhost:3001/courses/${id}`);
  const course = await courseService.get(`/${id}`);

  const container = document.getElementById('course-container');

  container.innerHTML = `

<nav class="breadcrumb">
<a href="/src/student/site/index.html">Hem</a> ›
<a href="/src/student/course/course.html">Kurser</a> ›
<span>${course.title}</span>
</nav>

<section class="course-hero">

<div class="hero-image">
<img src="${course.image}" alt="${course.title}">
</div>

<div class="hero-info">

<h1>${course.title}</h1>

<p class="course-desc">
${course.description || 'Denna kurs hjälper dig att lära dig nya saker steg för steg.'}
</p>

<div class="course-meta">

<div class="meta-box">
<span class="material-symbols-outlined">schedule</span>
${course.duration || '12 veckor'}
</div>

<div class="meta-box">
<span class="material-symbols-outlined">signal_cellular_alt</span>
${course.level || 'Medel nivå'}
</div>

<div class="meta-box">
<span class="material-symbols-outlined">category</span>
${course.category || 'Webb'}
</div>

</div>

<div class="price-box">
<div class="price">${course.price} SEK</div>
<button class="enroll-btn" id="bookCourseBtn">Boka kurs</button>
</div>

</div>

</section>

<section class="course-content">

<div>

<h2>Om kursen</h2>

<p>
Denna kurs hjälper dig att förstå ämnet bättre.
Du får enkla exempel och övningar.
Du kan studera i din egen takt.
</p>

<h2>Vad du lär dig</h2>

<ul class="learning-list">
<li>Förstå viktiga grunder</li>
<li>Arbeta med projekt</li>
<li>Bygga praktiska kunskaper</li>
<li>Förbereda dig för jobb</li>
</ul>

</div>

<aside>

<div class="info-card">

<h3>Kursinformation</h3>

<div class="info-row">
<span>Pris</span>
<span>${course.price} SEK</span>
</div>

<div class="info-row">
<span>Nivå</span>
<span>${course.level || 'Medel'}</span>
</div>

<div class="info-row">
<span>Längd</span>
<span>${course.duration || '12 veckor'}</span>
</div>

<div class="info-row">
<span>Kategori</span>
<span>${course.category || 'Webb'}</span>
</div>

<button class="sidebar-btn" id="bookCourseBtn2">
Boka kurs
</button>

</div>

</aside>

</section>
`;

  addBookingEvent(course.id);
}

async function addBookingEvent(courseId) {
  const user = JSON.parse(localStorage.getItem('user'));
  const buttons = document.querySelectorAll('#bookCourseBtn, #bookCourseBtn2');

  // Modal Elements
  const modal = document.getElementById('bookingModal');
  const bookingForm = document.getElementById('bookingForm');
  const closeModal = document.getElementById('closeModal');

  const disableButtons = () => {
    buttons.forEach((btn) => {
      btn.textContent = 'Redan bokad';
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
    });
  };

  if (user) {
    const safeUserId = encodeURIComponent(user.id);
    const safeCourseId = encodeURIComponent(courseId);

    const existing = await bookingService.get(
      `?userId=${safeUserId}&courseId=${safeCourseId}`,
    );

    if (existing.length > 0) disableButtons();
  }

  if (closeModal) {
    closeModal.onclick = () => {
      modal.style.display = 'none';
      bookingForm.reset();
    };
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!user) {
        window.location.href = '/src/student/auth/login.html';
        return;
      }

      modal.style.display = 'flex';

      if (bookingForm) {
        bookingForm.onsubmit = async (e) => {
          e.preventDefault();

          const phone = document.getElementById('modalPhone').value;
          const address = document.getElementById('modalAddress').value;

          try {
            const allBookings = await bookingService.get();

            const nextId =
              allBookings.length > 0
                ? Math.max(
                    ...allBookings.map(
                      (b) => parseInt(b.id.replace('#BK-', '')) || 0,
                    ),
                  ) + 1
                : 101;

            const booking = {
              id: `#BK-${nextId}`,
              userId: user.id,
              courseId: courseId,
              status: 'pending',
              date: new Date().toISOString().split('T')[0],
              phone: phone,
              address: address,
            };
            try {
              await bookingService.post(booking);
              // const response = await fetch('http://localhost:3001/bookings', {
              //   method: 'POST',
              //   headers: { 'Content-Type': 'application/json' },
              //   body: JSON.stringify(booking),
              // });

              alert('Din bokning är skickad. Admin måste godkänna.');
              modal.style.display = 'none';
              bookingForm.reset();
              disableButtons();
            } catch (error) {
              console.error('Fel vid bokning:', error);
            }
          } catch (error) {
            console.error('Error during booking:', error);
          }
        };
      }
    });
  });
}

loadCourse();

import HttpClient from '../../data/HttpClient.js';
import { generateNextId } from '../../utils/idGenerator.js';
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
    const container = document.querySelector('#course-container');
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
${course.description}
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
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const buttons = document.querySelectorAll('#bookCourseBtn, #bookCourseBtn2');
    // Modal Elements
    const modal = document.getElementById('bookingModal');
    const form = document.querySelector('form');
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
        try {
            const existing = await bookingService.get(`?userId=${encodeURIComponent(user.id)}&courseId=${courseId}`);
            if (existing.length > 0)
                disableButtons();
        }
        catch (err) {
            console.error('Error checking existing bookings', err);
        }
    }
    if (closeModal && modal) {
        closeModal.onclick = () => {
            modal.style.display = 'none';
            form?.reset();
        };
    }
    buttons.forEach((btn) => {
        btn.addEventListener('click', async () => {
            if (!user) {
                window.location.href = '/src/student/auth/login.html';
                return;
            }
            modal.style.display = 'flex';
            if (form) {
                form.onsubmit = async (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());
                    const { phone, address } = data;
                    try {
                        const allBookings = await bookingService.get();
                        const nextBookingId = generateNextId(allBookings, '#BK-', 101);
                        const booking = {
                            id: nextBookingId,
                            userId: user.id,
                            courseId: courseId,
                            status: 'pending',
                            date: new Date().toISOString().split('T')[0],
                            phone: phone,
                            address: address,
                        };
                        try {
                            await bookingService.post(booking);
                            alert('Din bokning är skickad. Admin måste godkänna.');
                            modal.style.display = 'none';
                            form.reset();
                            disableButtons();
                        }
                        catch (error) {
                            console.error('Fel vid bokning:', error);
                        }
                    }
                    catch (error) {
                        console.error('Error during booking:', error);
                    }
                };
            }
        });
    });
}
loadCourse();
//# sourceMappingURL=course-details.js.map
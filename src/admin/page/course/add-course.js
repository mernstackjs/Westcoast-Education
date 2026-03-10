import { createTitle, createCard } from '../../../scripts/dom.js';

const COURSES_API_URL = 'http://localhost:3001/courses';

const CLOUDINARY_CLOUD_NAME = 'dx74k8fal';
const CLOUDINARY_UPLOAD_PRESET = 'Westcoast-Education';

export function addCoursePage(container) {
  container.innerHTML = '';

  const title = createTitle('Add New Course');
  const card = createCard();

  const form = document.createElement('form');
  form.className = 'course-form';

  form.innerHTML = `
    <div class="form-layout">
      <div class="left-form">
        <label for="title">Course Title</label>
        <input id="title" name="title" type="text" placeholder="e.g. Advanced Web Development" required>
        
        <div class="two-col">
          <div>
            <label for="category">Category</label>
            <select id="category" name="category" required>
              <option value="Webbutveckling">Webbutveckling</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Marknadsföring">Marknadsföring</option>
            </select>
          </div>
          <div>
            <label for="level">Level</label>
            <select id="level" name="level">
              <option value="Nybörjare">Nybörjare (Beginner)</option>
              <option value="Medel">Medel (Intermediate)</option>
              <option value="Avancerad">Avancerad (Advanced)</option>
            </select>
          </div>
        </div>
        <div class="two-col">
          <div>
            <label for="courseNumber">Course Number</label>
            <input id="courseNumber" name="courseNumber" type="text" placeholder="e.g. CS-402" required>
          </div>
          <div>
            <label for="type">Course Type</label>
            <select id="type" name="type">
              <option value="Classroom">Classroom</option>
              <option value="Online">Online</option>
              <option value="Distance">Distance</option>
            </select>
          </div>
        </div>

        <div class="two-col">
          <div>
            <label for="startDate">Start Date</label>
            <input id="startDate" name="startDate" type="date">
          </div>
          <div>
            <label for="days">Number of Days</label>
            <input id="days" name="days" type="number" placeholder="e.g. 12" min="1">
          </div>
        </div>

        <label for="description">Description</label>
        <textarea id="description" name="description" rows="4" placeholder="Provide a detailed description..."></textarea>
      </div>

      <div class="right-form">
        <label class="popular-toggle">
          <input type="checkbox" name="popular"> Popular Course
        </label>

        <div class="image-upload">
          <label for="image">Course Image</label>
          <input type="file" id="image" name="image" accept="image/*">
        </div>

        <label for="price">Price ($)</label>
        <input id="price" name="price" type="number" placeholder="e.g. 599" min="0" step="0.01">

        <button type="submit" id="submit-btn">Save Course</button>
      </div>
    </div>
  `;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('#submit-btn');
    const formData = new FormData(form);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    let imageUrl = '';
    const imageFile = formData.get('image');

    // 1. Handle Cloudinary Upload
    if (imageFile && imageFile.size > 0) {
      try {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        uploadData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: uploadData },
        );

        if (!uploadResponse.ok) throw new Error('Cloudinary upload failed');

        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.secure_url;
      } catch (err) {
        console.error('Image Upload Error:', err);
        alert('Image upload failed. Saving course without image.');
      }
    }

    const course = {
      title: formData.get('title'),
      category: formData.get('category'),
      level: formData.get('level'),
      courseNumber: formData.get('courseNumber'),
      type: formData.get('type'),
      startDate: formData.get('startDate'),
      duration: `${formData.get('days') || 0} veckor`,
      description: formData.get('description'),
      popular: formData.get('popular') === 'on',
      price: Number(formData.get('price')) || 0,
      image: imageUrl || 'https://via.placeholder.com/300x200?text=No+Image',
    };

    // 3. Post to JSON Server
    try {
      const response = await fetch(COURSES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });

      if (!response.ok) throw new Error('Failed to save course');

      alert('Course saved successfully!');
      form.reset();
    } catch (error) {
      console.error('Server Error:', error);
      alert('Error saving course to database.');
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Course';
    }
  });

  card.appendChild(form);
  container.appendChild(title);
  container.appendChild(card);
}

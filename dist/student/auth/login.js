import HttpClient from '../../data/HttpClient.js';
const form = document.querySelector('form');
const errorMsg = document.getElementById('errorMsg');
const userService = new HttpClient('users');
const handleSubmit = async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const { email, password } = data;
    console.log(email, password);
    if (!email || !password) {
        errorMsg.textContent = 'Fyll i alla fält.';
        return;
    }
    const users = await userService.get(`?email=${email}`);
    if (users.length === 0) {
        errorMsg.textContent = 'Fel e-post eller lösenord.';
        return;
    }
    const user = users[0];
    if (user.password !== password) {
        errorMsg.textContent = 'Fel e-post eller lösenord.';
        return;
    }
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = '/src/student/site/index.html';
};
form.addEventListener('submit', handleSubmit);
//# sourceMappingURL=login.js.map
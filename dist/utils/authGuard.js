export function protectPage() {
    const user = localStorage.getItem('user');
    if (!user) {
        const currentPath = window.location.pathname;
        console.log('currentPath', currentPath);
        if (!currentPath.includes('login.html') &&
            !currentPath.includes('register.html')) {
            window.location.href = '/src/student/auth/login.html';
        }
    }
}
//# sourceMappingURL=authGuard.js.map
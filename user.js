// Redirect if not logged in
const token = localStorage.getItem('access_token');
if (!token) {
    window.location.href = '/login';
}

// Display username
document.getElementById('username').textContent = localStorage.getItem('username') || 'User';

// Logout handler
document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    window.location.href = '/';
});
import { authAPI, clearUser, redirectToLogin, getUser } from './api.js';

// Navigation
function navigateTo(page) {
    window.location.href = page;
}

// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// Auth Check - Run on page load for protected pages
async function protectPage() {
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('index.html') || currentPath === '/client/';
    
    if (!isLoginPage) {
        try {
            const user = await authAPI.getCurrentUser();
            if (!user || !user.id) {
                redirectToLogin();
            } else {
                displayUserInfo(user);
                return user;
            }
        } catch (error) {
            console.log('Auth check failed, redirecting to login');
            redirectToLogin();
        }
    }
}

// Display user info in header/navbar
function displayUserInfo(user) {
    const userElement = document.getElementById('currentUser');
    if (userElement) {
        userElement.textContent = user.name || user.email;
    }
}

// Logout handler
async function handleLogout() {
    try {
        await authAPI.logout();
        clearUser();
        redirectToLogin();
    } catch (error) {
        console.error('Logout error:', error);
        clearUser();
        redirectToLogin();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    protectPage();
    setupLogoutButton();
});

// Setup logout button if it exists
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
}

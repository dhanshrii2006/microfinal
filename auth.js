// Authentication and Role Management System

// Check if user has proper role before accessing a page
function checkAuth(requiredRole) {
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole) {
        // User not logged in, redirect to login
        window.location.href = 'login.html';
        return;
    }
    
    if (userRole !== requiredRole) {
        // User has wrong role, redirect to their correct dashboard
        if (userRole === 'student') {
            window.location.href = 'index.html';
        } else if (userRole === 'teacher') {
            window.location.href = 'teacher-dashboard.html';
        } else if (userRole === 'admin') {
            window.location.href = 'admin-dashboard.html';
        }
        return;
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userInitials');
        window.location.href = 'login.html';
    }
}

// Get current user role
function getUserRole() {
    return localStorage.getItem('userRole');
}

// Get current user name
function getUserName() {
    return localStorage.getItem('userName');
}

// Get current user initials
function getUserInitials() {
    return localStorage.getItem('userInitials');
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('userRole') !== null;
}

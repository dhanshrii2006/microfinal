// Dashboard JavaScript - Navigation and UI functions

// Navigate to a different page
function navigateTo(page) {
    const userRole = localStorage.getItem('userRole');
    
    // Check if user is logged in
    if (!userRole) {
        window.location.href = 'login.html';
        return;
    }
    
    // Navigate to the requested page
    window.location.href = page;
}

// Toggle sidebar visibility
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('.main');
    
    if (sidebar && main) {
        sidebar.classList.toggle('hidden');
        main.classList.toggle('sidebar-hidden');
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

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    // Close sidebar on mobile when clicking on page content
    const sidebar = document.querySelector('.sidebar');
    const pageContainer = document.querySelector('.page-container');
    
    if (pageContainer && sidebar) {
        pageContainer.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('hidden');
            }
        });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        const sidebar = document.querySelector('.sidebar');
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove('hidden');
        }
    });
});

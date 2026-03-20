// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Auth API Calls
export const authAPI = {
  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async logout() {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return res.json();
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include'
    });
    return res.json();
  }
};

// Courses API Calls (placeholder for future implementation)
export const coursesAPI = {
  async getCourses() {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      credentials: 'include'
    });
    return res.json();
  },

  async getCourseById(id) {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      credentials: 'include'
    });
    return res.json();
  },

  async enrollCourse(courseId) {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
      method: 'POST',
      credentials: 'include'
    });
    return res.json();
  }
};

// Error handler
export function handleAPIError(error) {
  if (error.message) {
    alert(`Error: ${error.message}`);
  } else {
    alert('An error occurred. Please try again.');
  }
  console.error('API Error:', error);
}

// Session check - redirect to login if not authenticated
export async function checkAuth() {
  try {
    const user = await authAPI.getCurrentUser();
    if (!user.id) {
      redirectToLogin();
      return null;
    }
    return user;
  } catch (err) {
    redirectToLogin();
    return null;
  }
}

export function redirectToLogin() {
  window.location.href = './index.html';
}

export function redirectToDashboard() {
  window.location.href = './dashboard.html';
}

// Store user data in sessionStorage
export function setUser(user) {
  sessionStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function clearUser() {
  sessionStorage.removeItem('user');
}

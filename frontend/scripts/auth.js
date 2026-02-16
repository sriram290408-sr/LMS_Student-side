// Auth Configuration
const API_BASE_URL = 'http://localhost:8000'; // Update with your actual backend URL

// Handle Google Login Callback
async function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    
    try {
        // Send Google token to our backend
        const backendResponse = await fetch(`${API_BASE_URL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: response.credential })
        });

        if (!backendResponse.ok) {
            throw new Error('Backend authentication failed');
        }

        const data = await backendResponse.json();
        
        // Store JWT and user info in localStorage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        console.log('Login successful:', data.user);
        
        // Redirect to dashboard or mycourse
        window.location.href = './mycourse.html';
        
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please try again.');
    }
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('access_token') !== null;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Logout
function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}

// Protect page - call this on protected pages
async function protectPage() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = '/Frontend/pages/login.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me?token=${token}`);
        if (!response.ok) {
            throw new Error('Session expired');
        }
    } catch (error) {
        console.error('Auth verification failed:', error);
        logout();
    }
}

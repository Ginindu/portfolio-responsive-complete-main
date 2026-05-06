/*===== LOGIN PAGE FUNCTIONALITY =====*/

// Login Form Handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    const loginEmail = document.getElementById('email');
    const loginPassword = document.getElementById('password');
    const passwordToggle = document.getElementById('password-toggle');

    // Password visibility toggle
    passwordToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const type = loginPassword.type === 'password' ? 'text' : 'password';
        loginPassword.type = type;
        updatePasswordToggleIcon(passwordToggle, type);
    });

    // Form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateLogin(loginEmail.value, loginPassword.value)) {
            return;
        }

        // Simulate login
        simulateLogin(loginEmail.value);
    });
}

// Validate login form
function validateLogin(email, password) {
    // Email validation
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }

    // Password validation
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return false;
    }

    return true;
}

// Simulate login process
function simulateLogin(email) {
    const button = loginForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    button.disabled = true;
    button.textContent = 'Signing in...';

    // Simulate API call
    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        showNotification('Login successful! Redirecting...', 'success');
        
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({
            email: email,
            loginTime: new Date().toISOString()
        }));

        // Redirect after 1 second
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }, 2000);
}

/*===== SIGNUP PAGE FUNCTIONALITY =====*/

// Signup Form Handler
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    const fullname = document.getElementById('fullname');
    const signupEmail = document.getElementById('signup-email');
    const signupPassword = document.getElementById('signup-password');
    const confirmPassword = document.getElementById('confirm-password');
    const signupPasswordToggle = document.getElementById('signup-password-toggle');
    const confirmPasswordToggle = document.getElementById('confirm-password-toggle');
    const strengthMeter = document.getElementById('strength-meter');
    const strengthText = document.getElementById('strength-text');
    const termsCheckbox = document.getElementById('terms');

    // Password strength meter
    signupPassword.addEventListener('input', () => {
        const strength = calculatePasswordStrength(signupPassword.value);
        updateStrengthMeter(strength, strengthMeter, strengthText);
    });

    // Password visibility toggles
    signupPasswordToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const type = signupPassword.type === 'password' ? 'text' : 'password';
        signupPassword.type = type;
        updatePasswordToggleIcon(signupPasswordToggle, type);
    });

    confirmPasswordToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const type = confirmPassword.type === 'password' ? 'text' : 'password';
        confirmPassword.type = type;
        updatePasswordToggleIcon(confirmPasswordToggle, type);
    });

    // Form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateSignup(fullname.value, signupEmail.value, signupPassword.value, confirmPassword.value, termsCheckbox.checked)) {
            return;
        }

        simulateSignup(fullname.value, signupEmail.value);
    });
}

// Validate signup form
function validateSignup(name, email, password, confirmPass, termsAccepted) {
    // Name validation
    if (name.trim().length < 2) {
        showNotification('Please enter your full name', 'error');
        return false;
    }

    // Email validation
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }

    // Password validation
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return false;
    }

    // Password match
    if (password !== confirmPass) {
        showNotification('Passwords do not match', 'error');
        return false;
    }

    // Terms acceptance
    if (!termsAccepted) {
        showNotification('You must agree to the Terms and Conditions', 'error');
        return false;
    }

    return true;
}

// Simulate signup process
function simulateSignup(name, email) {
    const button = signupForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    button.disabled = true;
    button.textContent = 'Creating account...';

    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        showNotification('Account created successfully! Redirecting...', 'success');
        
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({
            name: name,
            email: email,
            signupTime: new Date().toISOString()
        }));

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }, 2000);
}

/*===== UTILITY FUNCTIONS =====*/

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Calculate password strength
function calculatePasswordStrength(password) {
    let strength = 0;

    // Length checks
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Character type checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    // Map to strength levels
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'fair';
    return 'good';
}

// Update strength meter display
function updateStrengthMeter(strength, meter, text) {
    meter.className = 'password-strength__meter ' + strength;
    text.className = 'password-strength__text show ' + strength;

    if (strength === 'weak') {
        text.textContent = 'Weak password - Use uppercase, numbers, and symbols';
    } else if (strength === 'fair') {
        text.textContent = 'Fair password - Could be stronger';
    } else if (strength === 'good') {
        text.textContent = 'Strong password';
    }
}

// Update password toggle icon
function updatePasswordToggleIcon(toggle, type) {
    const icon = toggle.querySelector('i');
    if (type === 'password') {
        icon.className = 'bx bx-hide form__icon';
    } else {
        icon.className = 'bx bx-show form__icon';
    }
}

// Show notification (toast)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <i class='bx bx-${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info-circle'}'></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification styles dynamically
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background-color: var(--section-bg);
        border-left: 4px solid var(--first-color);
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        color: var(--text-color);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 1000;
        font-weight: var(--font-semi);
        font-size: 0.938rem;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification--success {
        border-left-color: #27ae60;
    }

    .notification--error {
        border-left-color: #e74c3c;
    }

    .notification i {
        font-size: 1.25rem;
    }

    @media screen and (max-width: 576px) {
        .notification {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
        }
    }
`;
document.head.appendChild(style);

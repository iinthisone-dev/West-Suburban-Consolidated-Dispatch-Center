console.log("WSCDC App loaded");

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // 1. NAVIGATION & HAMBURGER MENU
    // ========================================
    
    // Set the active nav link based on current page URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
                navLinksContainer.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            }
        });
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll event listener for navbar
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.main-nav');
        if (nav) {
            if (window.scrollY > 100) {
                nav.style.background = 'rgba(28, 40, 65, 0.95)';
            } else {
                nav.style.background = 'var(--navy)';
            }
        }
    });

    // ========================================
    // 2. FIREBASE AUTHENTICATION
    // ========================================

    // Sign Up Form Submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const phone = document.getElementById('signup-phone').value;
            const password = document.getElementById('signup-password').value;

            window.auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    
                    // Save additional user data to Firestore
                    return window.db.collection('users').doc(user.uid).set({
                        name: name,
                        email: email,
                        phone: phone,
                        role: 'user',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                })
                .then(() => {
                    console.log("User signed up and data saved");
                    alert("Account created successfully!");
                    closeModal('signupModal');
                    signupForm.reset();
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Sign up error:", errorCode, errorMessage);
                    alert("Error signing up: " + errorMessage);
                });
        });
    }

    // Sign In Form Submission
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;

            window.auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("User signed in:", user);
                    alert("Signed in successfully!");
                    closeModal('signinModal');
                    signinForm.reset();
                    updateUIForUser(user);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Sign in error:", errorCode, errorMessage);
                    alert("Error signing in: " + errorMessage);
                });
        });
    }

    // Auth State Observer
    window.auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("User is signed in:", user.email);
            // Load user data from Firestore
            window.db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        updateUIForUser(user, userData);
                    } else {
                        updateUIForUser(user);
                    }
                })
                .catch((error) => {
                    console.error("Error loading user data:", error);
                    updateUIForUser(user);
                });
        } else {
            console.log("User is signed out");
            updateUIForGuest();
        }
    });
});

// ========================================
// 3. MODAL FUNCTIONS
// ========================================

window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// Close modal when clicking outside the modal content
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// ========================================
// 4. UI UPDATE FUNCTIONS
// ========================================

function updateUIForUser(user, userData) {
    const navAuth = document.querySelector('.nav-auth');
    if (navAuth) {
        const displayName = userData && userData.name ? userData.name : user.email;
        navAuth.innerHTML = `
            <a href="profile.html" style="color: white; margin-right: 1rem; display: flex; align-items: center; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#ff6b35'" onmouseout="this.style.color='white'">
                <i class="fas fa-user-circle" style="margin-right: 0.5rem;"></i> ${displayName}
            </a>
            <button onclick="logout()" class="auth-btn signin-btn">Sign Out</button>
        `;
    }
}

function updateUIForGuest() {
    const navAuth = document.querySelector('.nav-auth');
    if (navAuth) {
        navAuth.innerHTML = `
            <button onclick="openModal('signinModal')" class="auth-btn signin-btn">
                <i class="fas fa-sign-in-alt"></i> Sign In
            </button>
            <button onclick="openModal('signupModal')" class="auth-btn signup-btn">
                <i class="fas fa-user-plus"></i> Sign Up
            </button>
        `;
    }
}

// Logout Function
window.logout = function() {
    window.auth.signOut().then(() => {
        alert("Signed out successfully!");
    }).catch((error) => {
        console.error("Sign out error:", error);
    });
}

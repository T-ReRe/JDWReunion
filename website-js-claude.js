// ===== SMOOTH SCROLLING =====
// Makes internal page links scroll smoothly
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ACTIVE NAV LINK HIGHLIGHTING =====
// Highlights the current page in navigation
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

setActiveNavLink();

// ===== MODAL FUNCTIONALITY FOR FAMILY ARCHIVES =====
// Used on the roots.html page for document popups
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Expose functions globally so they can be called from HTML onclick attributes
window.openModal = openModal;
window.closeModal = closeModal;

// ===== FAMILY TREE INTERACTIVITY =====
// Toggle expand/collapse for family tree nodes
function toggleNode(nodeId) {
    const node = document.getElementById(nodeId);
    if (node) {
        const isExpanded = node.classList.contains('expanded');
        
        if (isExpanded) {
            node.classList.remove('expanded');
            node.classList.add('collapsed');
        } else {
            node.classList.remove('collapsed');
            node.classList.add('expanded');
        }
        
        // Rotate the arrow icon
        const arrow = node.querySelector('.tree-arrow');
        if (arrow) {
            arrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
        }
    }
}

window.toggleNode = toggleNode;

// ===== GALLERY FUNCTIONALITY =====
// Image viewer for the family album page
let currentImageIndex = 0;
let galleryImages = [];

function openGalleryViewer(imageSrc, index) {
    const viewer = document.getElementById('imageViewer');
    const viewerImg = document.getElementById('viewerImage');
    
    if (viewer && viewerImg) {
        currentImageIndex = index;
        viewerImg.src = imageSrc;
        viewer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeGalleryViewer() {
    const viewer = document.getElementById('imageViewer');
    if (viewer) {
        viewer.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function navigateGallery(direction) {
    galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
    
    if (direction === 'next') {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    } else {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    }
    
    const viewerImg = document.getElementById('viewerImage');
    if (viewerImg && galleryImages[currentImageIndex]) {
        viewerImg.src = galleryImages[currentImageIndex].src;
    }
}

window.openGalleryViewer = openGalleryViewer;
window.closeGalleryViewer = closeGalleryViewer;
window.navigateGallery = navigateGallery;

// ===== GUESTBOOK FUNCTIONALITY =====
// Handle guestbook form submission
function handleGuestbookSubmit(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('guestName');
    const messageInput = document.getElementById('guestMessage');
    
    if (nameInput && messageInput) {
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        
        if (name && message) {
            addGuestbookEntry(name, message);
            nameInput.value = '';
            messageInput.value = '';
            
            // Show success message
            showNotification('Thank you for signing our guestbook!');
        }
    }
}

function addGuestbookEntry(name, message) {
    const guestbookEntries = document.getElementById('guestbookEntries');
    
    if (guestbookEntries) {
        const entry = document.createElement('div');
        entry.className = 'guestbook-entry';
        
        const date = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        entry.innerHTML = `
            <div class="guestbook-header">
                <strong>${escapeHtml(name)}</strong>
                <span class="guestbook-date">${date}</span>
            </div>
            <p class="guestbook-message">${escapeHtml(message)}</p>
        `;
        
        guestbookEntries.insertBefore(entry, guestbookEntries.firstChild);
    }
}

// Helper function to prevent XSS attacks
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Show notification messages
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #355e3b, #2a4a2e);
        color: #d4af37;
        padding: 20px 30px;
        border-radius: 10px;
        border: 2px solid #d4af37;
        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        z-index: 10000;
        animation: slideIn 0.5s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

window.handleGuestbookSubmit = handleGuestbookSubmit;

// ===== SCROLL ANIMATIONS =====
// Add animations to elements as they scroll into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply to elements with class 'animate-on-scroll'
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===== NEON TEXT ANIMATION (for Reunion Details page) =====
function initNeonAnimation() {
    const neonWords = document.querySelectorAll('.neon-word');
    
    neonWords.forEach((word, index) => {
        setTimeout(() => {
            word.classList.add('flicker');
        }, index * 500);
    });
}

if (document.querySelector('.neon-word')) {
    initNeonAnimation();
    setInterval(initNeonAnimation, 8000);
}

// ===== CONSOLE MESSAGE =====
// Easter egg for tech-savvy family members
console.log('%c🌳 JDW Family Reunion 2026 🌳', 'color: #d4af37; font-size: 24px; font-weight: bold;');
console.log('%cFrom One Root, Three Branches', 'color: #355e3b; font-size: 16px; font-style: italic;');
console.log('%cWebsite crafted with love for the Jackson, Denton & Williams family', 'color: #666; font-size: 12px;'); MOBILE NAVIGATION =====
// This handles the hamburger menu for mobile devices
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===== COUNTDOWN TIMER =====
// Counts down to July 10, 2026 at midnight
function updateCountdown() {
    const reunionDate = new Date('July 10, 2026 00:00:00').getTime();
    const now = new Date().getTime();
    const distance = reunionDate - now;
    
    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update the display with leading zeros for single digits
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (daysEl) daysEl.textContent = String(days).padStart(3, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    
    // If countdown is finished
    if (distance < 0) {
        if (daysEl) daysEl.textContent = '000';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
    }
}

// Update countdown every second
if (document.getElementById('countdown')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// =====
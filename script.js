// DocCrusher Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Animate stats on scroll
    const stats = document.querySelectorAll('.stat-number');
    const animateStats = () => {
        stats.forEach(stat => {
            const statTop = stat.getBoundingClientRect().top;
            const statBottom = stat.getBoundingClientRect().bottom;
            
            if (statTop < window.innerHeight && statBottom > 0) {
                const target = stat.textContent;
                const isPercentage = target.includes('%');
                const isCustom = target.includes('Custom');
                
                if (!isCustom && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    
                    if (isPercentage) {
                        const number = parseFloat(target);
                        animateNumber(stat, 0, number, 2000, '%');
                    } else {
                        const number = parseInt(target.replace(/,/g, ''));
                        animateNumber(stat, 0, number, 2000);
                    }
                }
            }
        });
    };

    // Number animation function
    const animateNumber = (element, start, end, duration, suffix = '') => {
        const startTime = performance.now();
        const difference = end - start;
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (difference * easeOutQuart));
            
            if (suffix === '%') {
                element.textContent = current.toFixed(1) + suffix;
            } else if (suffix === '+') {
                element.textContent = current.toLocaleString() + suffix;
            } else {
                element.textContent = current.toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    };

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .step, .pricing-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Add scroll event listener for stats
    window.addEventListener('scroll', animateStats);

    // Button click handlers
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Show demo modal or redirect
            if (this.textContent.includes('Demo')) {
                showDemoModal();
            } else if (this.textContent.includes('Trial')) {
                showTrialModal();
            } else {
                // Default action - could be a form or redirect
                console.log('CTA button clicked:', this.textContent);
            }
        });
    });

    // Modal functions
    const showDemoModal = () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Watch DocCrusher Demo</h2>
                <div class="demo-video">
                    <div class="video-placeholder">
                        <i class="fas fa-play-circle"></i>
                        <p>Demo video would play here</p>
                    </div>
                </div>
                <p>See how DocCrusher analyzes your documents and provides actionable insights.</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    };

    const showTrialModal = () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Start Your Free Trial</h2>
                <form class="trial-form">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="company">Company Name</label>
                        <input type="text" id="company" required>
                    </div>
                    <button type="submit" class="btn-primary">Start Free Trial</button>
                </form>
                <p class="form-note">No credit card required • 14-day free trial</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Form submission
        const form = modal.querySelector('.trial-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            console.log('Trial form submitted:', {
                name: this.querySelector('#name').value,
                email: this.querySelector('#email').value,
                company: this.querySelector('#company').value
            });
            
            // Show success message
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h2>Welcome to DocCrusher!</h2>
                        <p>We've sent you an email with your trial account details. Start crushing your documents today!</p>
                    </div>
                </div>
            `;
            
            // Close modal functionality
            const closeBtn = modal.querySelector('.close');
            closeBtn.onclick = () => modal.remove();
            modal.onclick = (e) => {
                if (e.target === modal) modal.remove();
            };
        });
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    };

    // Add CSS for modals
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
            position: relative;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        
        .close:hover {
            color: #ff6b35;
        }
        
        .demo-video {
            margin: 1rem 0;
        }
        
        .video-placeholder {
            background: #f8f9fa;
            border: 2px dashed #ddd;
            border-radius: 8px;
            padding: 3rem;
            text-align: center;
            color: #666;
        }
        
        .video-placeholder i {
            font-size: 3rem;
            color: #ff6b35;
            margin-bottom: 1rem;
        }
        
        .trial-form {
            margin: 1rem 0;
        }
        
        .form-group {
            margin-bottom: 1rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #333;
        }
        
        .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #ff6b35;
            box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }
        
        .form-note {
            font-size: 0.9rem;
            color: #666;
            text-align: center;
            margin-top: 1rem;
        }
        
        .success-message {
            text-align: center;
            padding: 2rem 0;
        }
        
        .success-message i {
            font-size: 4rem;
            color: #28a745;
            margin-bottom: 1rem;
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(modalStyles);

    // Initialize stats animation on page load
    setTimeout(animateStats, 1000);
});

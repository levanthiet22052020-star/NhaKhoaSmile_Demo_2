document.addEventListener('DOMContentLoaded', function () {
    animateNumbers();
    initSmoothScroll();
    initHeaderScroll();
    initScrollAnimations();
    initParallax();
    showPromoPopup();
});

function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.dataset.count);
                animateValue(target, 0, count, 2500);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
}

function animateValue(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(start + (end - start) * easeOutExpo);

        if (end >= 1000) {
            element.textContent = current.toLocaleString() + '+';
        } else {
            element.textContent = current + '+';
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 120;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.service-card, .feature-card, .testimonial-card, .branch-card, .quick-link-item, .about-features li'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `all 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${index % 4 * 0.1}s`;
        fadeObserver.observe(el);
    });
}

function initParallax() {
    const heroSection = document.querySelector('.hero');
    const floatingCards = document.querySelectorAll('.floating-card');

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                if (heroSection) {
                    const heroHeight = heroSection.offsetHeight;
                    if (scrolled < heroHeight) {
                        heroSection.style.backgroundPositionY = `${scrolled * 0.3}px`;
                    }
                }

                floatingCards.forEach((card, index) => {
                    const speed = index === 0 ? 0.08 : 0.12;
                    const yPos = scrolled * speed;
                    card.style.transform = `translateY(${-yPos}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });
}

function showPromoPopup() {
    const popup = document.getElementById('promoPopup');
    const hasSeenPopup = sessionStorage.getItem('hasSeenPromo');

    if (!hasSeenPopup && popup) {
        setTimeout(() => {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 4000);
    }
}

function closePopup() {
    const popup = document.getElementById('promoPopup');
    popup.classList.remove('active');
    document.body.style.overflow = '';
    sessionStorage.setItem('hasSeenPromo', 'true');
}

const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    .btn-primary {
        background-size: 200% 200%;
        animation: gradient-shift 3s ease infinite;
    }
`;
document.head.appendChild(style);

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
}

const bookingForm = document.querySelector('.booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Đang gửi...';
        submitBtn.disabled = true;

        setTimeout(() => {
            const name = this.querySelector('input[type="text"]').value;
            const phone = this.querySelector('input[type="tel"]').value;

            if (name && phone) {
                submitBtn.textContent = 'Gửi thành công!';
                submitBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';

                setTimeout(() => {
                    alert('Cảm ơn bạn đã đăng ký!\n\nChúng tôi sẽ liên hệ với bạn trong vòng 30 phút.');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 500);
            }
        }, 1500);
    });
}

document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.style.setProperty('--mouse-x', `${x}px`);
        this.style.setProperty('--mouse-y', `${y}px`);
    });
});

const dropdowns = document.querySelectorAll('.has-dropdown');
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', function () {
        const menu = this.querySelector('.dropdown');
        if (menu) {
            menu.style.display = 'block';
        }
    });

    dropdown.addEventListener('mouseleave', function () {
        const menu = this.querySelector('.dropdown');
        if (menu) {
            setTimeout(() => {
                menu.style.display = '';
            }, 200);
        }
    });
});

document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor-glow');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

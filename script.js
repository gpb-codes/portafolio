// =================== CONFIGURACIÓN GLOBAL ===================
const CONFIG = {
    animationDuration: 300,
    scrollThreshold: 100,
    debounceDelay: 100,
    notificationDuration: 4000,
    parallaxStrength: 0.5,
    typewriterSpeed: 50
};

// =================== ESTADO GLOBAL ===================
const STATE = {
    isMenuOpen: false,
    currentSection: 'inicio',
    theme: localStorage.getItem('theme') || 'dark'
};

// =================== INICIALIZACIÓN ===================
document.addEventListener('DOMContentLoaded', () => {
    logWelcome();
    initializeApp();
    loadTheme();
});

function initializeApp() {
    setupMenuToggle();
    setupNavLinks();
    setupFormSubmit();
    setupHeaderScroll();
    setupScrollAnimations();
    setupIntersectionObserver();
    setupButtonActions();
    setupProjectCards();
    setupSkillBars();
    setupServiceTable();
    loadVisitCounter();
    setupSocialLinks();
    setupKeyboardShortcuts();
    setupParallax();
    setupTypewriterEffect();
}

// =================== LOGS PERSONALIZADOS ===================
function logWelcome() {
    console.log('%c¡Bienvenido a mi Portafolio! 🚀',
        'color: #FFD700; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);');
    console.log('%cGabriel Pedreros © 2025',
        'color: #9D00FF; font-size: 14px; font-weight: 600;');
    console.log('%c✨ Desarrollador Web & Diseñador Digital',
        'color: #00ff00; font-size: 12px;');
}

// =================== MENÚ HAMBURGUESA MEJORADO ===================
function setupMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.querySelector('.nav-list');

    if (!menuToggle || !navList) return;

    // Click en el menú
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        STATE.isMenuOpen = !STATE.isMenuOpen;
        navList.classList.toggle('active');
        menuToggle.classList.toggle('active');
        console.log('Menú:', STATE.isMenuOpen ? 'Abierto' : 'Cerrado');
    });

    // Cerrar menú al hacer clic en un enlace
    const navLinks = navList.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && !e.target.closest('.menu-toggle') && STATE.isMenuOpen) {
            closeMenu();
        }
    });

    // Cerrar menú al presionar Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && STATE.isMenuOpen) {
            closeMenu();
        }
    });
}

function closeMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.querySelector('.nav-list');

    STATE.isMenuOpen = false;
    navList.classList.remove('active');
    menuToggle.classList.remove('active');
}

// =================== NAVEGACIÓN Y SCROLL MEJORADO ===================
function setupNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remover clase active de todos
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Scroll suave
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Actualizar nav active al hacer scroll
    window.addEventListener('scroll', debounce(updateActiveNav, CONFIG.debounceDelay));
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 300 && pageYOffset < sectionTop + sectionHeight - 300) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    STATE.currentSection = current;
}

// =================== HEADER SCROLL EFFECT MEJORADO ===================
function setupHeaderScroll() {
    const header = document.querySelector('.header');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (scrollTop > CONFIG.scrollThreshold) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                ticking = false;
            });
            ticking = true;
        }
    });
}

// =================== FORMULARIO DE CONTACTO MEJORADO ===================
function setupFormSubmit() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener valores
        const inputs = contactForm.querySelectorAll('input, textarea');
        let name = '';
        let email = '';
        let message = '';

        inputs.forEach(input => {
            if (input.type === 'text' || input.placeholder.toLowerCase().includes('nombre')) {
                name = input.value.trim();
            }
            if (input.type === 'email' || input.placeholder.toLowerCase().includes('email')) {
                email = input.value.trim();
            }
            if (input.tagName === 'TEXTAREA' || input.placeholder.toLowerCase().includes('mensaje')) {
                message = input.value.trim();
            }
        });

        // Validaciones
        if (!validateForm(name, email, message)) return;

        // Simular envío
        console.log('📧 Formulario enviado:', { name, email, message });

        showNotification('✅ ¡Mensaje enviado correctamente! Pronto nos pondremos en contacto.', 'success');

        // Limpiar formulario con animación
        contactForm.reset();
        animateFormReset(contactForm);
    });
}

function validateForm(name, email, message) {
    if (!name || !email || !message) {
        showNotification('⚠️ Por favor completa todos los campos', 'error');
        return false;
    }

    if (!isValidEmail(email)) {
        showNotification('❌ Por favor ingresa un email válido', 'error');
        return false;
    }

    if (name.length < 3) {
        showNotification('❌ El nombre debe tener al menos 3 caracteres', 'error');
        return false;
    }

    if (message.length < 10) {
        showNotification('❌ El mensaje debe tener al menos 10 caracteres', 'error');
        return false;
    }

    return true;
}

function animateFormReset(form) {
    form.style.opacity = '0.5';
    setTimeout(() => {
        form.style.opacity = '1';
    }, CONFIG.animationDuration);
}

// =================== VALIDAR EMAIL ===================
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// =================== NOTIFICACIONES MEJORADA ===================
function showNotification(message, type = 'success') {
    let notification = document.getElementById('notification');

    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.className = `notification show ${type}`;

    // Auto cerrar
    setTimeout(() => {
        notification.classList.remove('show');
    }, CONFIG.notificationDuration);
}

// =================== BOTONES DE ACCIÓN MEJORADO ===================
function setupButtonActions() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const text = button.textContent.toLowerCase();

            if (text.includes('proyectos')) {
                scrollToSection('proyectos');
            } else if (text.includes('contacto')) {
                scrollToSection('contacto');
            } else if (text.includes('descargar')) {
                downloadCV();
            } else if (text.includes('solicitar')) {
                scrollToSection('contacto');
            }

            // Efecto ripple
            createRipple(e, button);
        });
    });
}

// =================== EFECTO RIPPLE EN BOTONES ===================
function createRipple(e, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    // Inyectar CSS si no existe
    if (!document.querySelector('style[data-ripple]')) {
        const style = document.createElement('style');
        style.setAttribute('data-ripple', 'true');
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: rippleAnimation 0.6s ease-out;
                pointer-events: none;
            }
            @keyframes rippleAnimation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// =================== SCROLL A SECCIÓN ===================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(updateActiveNav, 100);
    } else {
        console.warn(`Sección "${sectionId}" no encontrada`);
    }
}

// =================== DESCARGAR CV ===================
function downloadCV() {
    const link = document.createElement('a');
    link.href = '/assets/CV-Gabriel-Pedreros.pdf';
    link.download = 'CV-Gabriel-Pedreros.pdf';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('📥 Descargando CV...', 'success');
    console.log('📥 CV descargado');
}

// =================== CONTADOR DE VISITAS MEJORADO ===================
function loadVisitCounter() {
    const visitCountElement = document.getElementById('visitCount');

    if (!visitCountElement) return;

    let visits = localStorage.getItem('visitCount');
    visits = visits ? parseInt(visits) + 1 : 1;

    localStorage.setItem('visitCount', visits);
    animateCounter(visitCountElement, visits);

    console.log(`👁️ Visitas: ${visits}`);
}

function animateCounter(element, finalValue) {
    let currentValue = 0;
    const increment = Math.ceil(finalValue / 30);
    const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            element.textContent = finalValue.toLocaleString();
            clearInterval(interval);
        } else {
            element.textContent = currentValue.toLocaleString();
        }
    }, 30);
}

// =================== ANIMACIONES AL SCROLL ===================
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);

    const animatableElements = document.querySelectorAll(
        '.service-card, .skill, .about-card, .learning-card, .project-card, .info-card, .feature-item'
    );

    animatableElements.forEach(el => observer.observe(el));
}

// =================== INTERSECTION OBSERVER ===================
function setupIntersectionObserver() {
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
}

// =================== TARJETAS DE PROYECTOS ===================
function setupProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const link = card.querySelector('.project-link');

        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const title = card.querySelector('.project-header h3')?.textContent || 'Proyecto';
                const href = link.getAttribute('href');

                // Validar que sea una URL válida
                if (href && href !== '#') {
                    showNotification(`🚀 Abriendo proyecto: ${title}`, 'success');
                    // Abrir en nueva pestaña después de 300ms
                    setTimeout(() => {
                        window.open(href, '_blank');
                    }, 300);
                } else {
                    showNotification(`⚠️ Este proyecto aún no tiene enlace disponible`, 'error');
                }
            });
        }
    });
}

// =================== ANIMACIÓN DE BARRAS DE HABILIDADES ===================
function setupSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar span');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fillBar 1.5s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// =================== TABLA DE SERVICIOS ===================
function setupServiceTable() {
    const table = document.querySelector('.services-table');

    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        row.addEventListener('mouseenter', function () {
            this.style.background = 'rgba(255, 215, 0, 0.08)';
        });

        row.addEventListener('mouseleave', function () {
            this.style.background = '';
        });
    });
}

// =================== ENLACES SOCIALES ===================
function setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');

    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-5px) scale(1.1)';
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) scale(1)';
        });

        const href = link.getAttribute('href');
        if (href === '#') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('🔗 Enlace no configurado aún', 'error');
            });
        }
    });
}

// =================== ATAJOS DE TECLADO ===================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Alt + C para contacto
        if (e.altKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            scrollToSection('contacto');
        }

        // Alt + H para inicio
        if (e.altKey && e.key.toLowerCase() === 'h') {
            e.preventDefault();
            scrollToSection('inicio');
        }

        // Alt + P para proyectos
        if (e.altKey && e.key.toLowerCase() === 'p') {
            e.preventDefault();
            scrollToSection('proyectos');
        }
    });
}

// =================== PARALLAX EFFECT ===================
function setupParallax() {
    const heroAnimation = document.querySelector('.hero-animation');

    if (!heroAnimation) return;

    window.addEventListener('scroll', throttle(() => {
        const scrollY = window.scrollY;
        heroAnimation.style.transform = `translateY(${scrollY * CONFIG.parallaxStrength}px)`;
    }, 100));
}

// =================== EFECTO TYPEWRITER ===================
function setupTypewriterEffect() {
    const heroTitle = document.querySelector('.hero-title');

    if (heroTitle && !heroTitle.dataset.typewriter) {
        heroTitle.dataset.typewriter = 'true';
        const originalText = heroTitle.textContent;

        // Esperar a que cargue la página
        setTimeout(() => {
            heroTitle.textContent = '';
            let index = 0;

            const typewriter = setInterval(() => {
                if (index < originalText.length) {
                    heroTitle.textContent += originalText.charAt(index);
                    index++;
                } else {
                    clearInterval(typewriter);
                }
            }, CONFIG.typewriterSpeed);
        }, 300);
    }
}

// =================== TEMA OSCURO/CLARO ===================
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    STATE.theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', STATE.theme);
}

function loadTheme() {
    if (STATE.theme === 'light') {
        document.body.classList.add('light-mode');
    }
}

// =================== FUNCIONES AUXILIARES ===================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// =================== LAZY LOADING DE IMÁGENES ===================
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, { threshold: 0.1 });

    images.forEach(img => imageObserver.observe(img));
}

setupLazyLoading();

// =================== ERROR HANDLING ===================
window.addEventListener('error', (event) => {
    console.error('❌ Error capturado:', event.error);
});

// =================== EXPORTAR FUNCIONES ===================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        scrollToSection,
        toggleDarkMode,
        isValidEmail,
        debounce,
        throttle
    };
}

// =================== LOG FINAL ===================
window.addEventListener('load', () => {
    console.log('%c✨ Portafolio cargado exitosamente',
        'color: #FFD700; font-size: 16px; font-weight: bold;');
    console.log('%c⌨️ Atajos disponibles: Alt+C (contacto), Alt+H (inicio), Alt+P (proyectos)',
        'color: #00ff00; font-size: 12px;');
});
/**
 * مخبز الخير - 21st.dev Premium Interactive Animations Script
 * Features:
 * - Interactive Before & After Oven Slider (Drag & Touch)
 * - 21st.dev Interactive Image Lightbox Modal with Pan & Keyboard Navigation
 * - Photo Gallery Category Filtering
 * - 3D Perspective Card Tilt on Mouse Move
 * - Scroll-Driven Reveal System (IntersectionObserver)
 * - Animated Metric Counters (0 -> Target with easeOutQuad)
 * - Scroll Reading Progress Bar
 * - Dynamic 21st.dev Mouse-Tracking Spotlight Gradients
 * - Interactive Ripple Effect on Buttons
 * - Theme Switcher (Dark Obsidian / Light Honey)
 * - WhatsApp Order Modal & Toast Notifications
 */

// Official Bakery Phone Number for WhatsApp & Calls
const BAKERY_PHONE = "201013984024";

// State
let currentModalQty = 1;
let currentLightboxIndex = 0;

// Gallery Items Database for Lightbox
const galleryItems = [
    {
        src: "baking-oven.jpg",
        title: "خبيز بلدي ساخن على المطرحة الخشبية",
        desc: "خبيز مستمر على مدار اليوم من الفجر حتى المساء بنار الحطب والغاز الطبيعي",
        product: "عيش بلدي مصري فاخر"
    },
    {
        src: "dough-prep.jpg",
        title: "عجن يدوي وإتقان الصنعة",
        desc: "دقيق بلدي منقى وخميرة طبيعية بدون أي محسنات صناعية لضمان الطعم التراثي الأصيل",
        product: "عيش بلدي مصري فاخر"
    },
    {
        src: "9f6d5da7-6466-4813-9289-5b43af554422.jpg",
        title: "عيش بلدي مصري بالردة الناعمة",
        desc: "الرغيف المصري الأصيل كما يجب أن يكون، طري ومحمص ومورق من بيت النار",
        product: "عيش بلدي مصري فاخر"
    },
    {
        src: "bakery-showcase.jpg",
        title: "فينو ومخبوزات متنوعة بالسمسم",
        desc: "أشهى ساندوتشات الفينو والخبز الفرنسي الطازج يومياً للمدارس والرحلات",
        product: "فينو ومخبوزات طازجة"
    },
    {
        src: "322f6495-8a37-4d49-adb7-1565832109fb.jpg",
        title: "عيش أسمر بالردة الكاملة (صحي ودايت)",
        desc: "خيار مثالي لمرضى السكري والدايت، غني بالألياف الطبيعية وخفيف على المعدة",
        product: "عيش أسمر بالردة (دايت)"
    },
    {
        src: "a4484cca-0df0-4397-a0d8-73a50113c60b.jpg",
        title: "عيش شامي أبيض هش وطري",
        desc: "الخيار المفضل للمطاعم ولأشهى سندوتشات الشاورما والمشويات",
        product: "عيش شامي أبيض فاخر"
    }
];

/* ==========================================================================
   Interactive Before & After Oven Slider
   ========================================================================== */
function initComparisonSlider() {
    const wrapper = document.getElementById('comparisonWrapper');
    const beforeContainer = document.getElementById('comparisonBeforeContainer');
    const sliderBar = document.getElementById('comparisonSliderBar');

    if (!wrapper || !beforeContainer || !sliderBar) return;

    let isDragging = false;

    function moveSlider(e) {
        const rect = wrapper.getBoundingClientRect();
        let clientX = e.clientX;
        if (e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX;
        }

        let offsetX = clientX - rect.left;
        let percentage = (offsetX / rect.width) * 100;
        percentage = Math.max(0, Math.min(100, percentage));

        beforeContainer.style.width = `${percentage}%`;
        sliderBar.style.left = `${percentage}%`;
    }

    wrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        moveSlider(e);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        moveSlider(e);
    });

    // Touch support for mobiles
    wrapper.addEventListener('touchstart', (e) => {
        isDragging = true;
        moveSlider(e);
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        moveSlider(e);
    }, { passive: true });
}

/* ==========================================================================
   21st.dev Interactive Lightbox Modal
   ========================================================================== */
function openLightboxByIndex(index) {
    if (index < 0 || index >= galleryItems.length) return;
    currentLightboxIndex = index;
    const item = galleryItems[index];

    displayLightboxItem(item.src, item.title, item.desc, item.product);
}

function openLightboxFromSrc(src, title = 'صورة من مخبز الخير', desc = 'أطيب أنواع الخبز والمخبوزات المصرية الطازجة', product = 'عيش بلدي مصري فاخر') {
    displayLightboxItem(src, title, desc, product);
}

function displayLightboxItem(src, title, desc, product) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const titleEl = document.getElementById('lightboxTitle');
    const descEl = document.getElementById('lightboxDesc');

    if (!modal || !img || !titleEl || !descEl) return;

    img.src = src;
    img.alt = title;
    titleEl.textContent = title;
    descEl.textContent = desc;

    modal.dataset.currentProduct = product;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function handleLightboxBackdropClick(event) {
    if (event.target.id === 'lightboxModal') {
        closeLightbox();
    }
}

function navigateLightbox(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + galleryItems.length) % galleryItems.length;
    openLightboxByIndex(currentLightboxIndex);
}

function orderFromLightbox() {
    const modal = document.getElementById('lightboxModal');
    const product = (modal && modal.dataset.currentProduct) || 'عيش بلدي مصري فاخر';
    closeLightbox();
    openOrderModal(product, 5, '20 رغيف', 1);
}

/* ==========================================================================
   Gallery Category Filter Tabs
   ========================================================================== */
function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const cards = document.querySelectorAll('.gallery-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-gallery-filter');

            cards.forEach(card => {
                const cat = card.getAttribute('data-gallery-cat');
                if (filter === 'all' || cat === filter) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.96)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 20);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   Scroll-Driven Reveal System (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (!revealElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Trigger counter if element contains counter metrics
                const counters = entry.target.querySelectorAll('[data-counter]');
                counters.forEach(counter => animateCounter(counter));
                
                if (entry.target.hasAttribute('data-counter')) {
                    animateCounter(entry.target);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   Animated Number Count-Up (0 -> Target)
   ========================================================================== */
function animateCounter(element) {
    if (element.dataset.animated === 'true') return;
    element.dataset.animated = 'true';

    const target = parseFloat(element.getAttribute('data-counter')) || 0;
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 1800; // 1.8s
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = progress * (2 - progress);
        const current = Math.round(target * easeOut);

        element.textContent = `${prefix}${current}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = `${prefix}${target}${suffix}`;
        }
    }

    requestAnimationFrame(update);
}

/* ==========================================================================
   Interactive 3D Perspective Card Tilt on Mouse Move
   ========================================================================== */
function init3DCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.product-card, .spotlight-card, .gallery-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
        });
    });
}

/* ==========================================================================
   Scroll Reading Progress Bar
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }, { passive: true });
}

/* ==========================================================================
   Button Click Material Ripple Effect
   ========================================================================== */
function initButtonRipple() {
    const buttons = document.querySelectorAll('button, .btn-primary-shimmer, .btn-secondary-glass, .btn-whatsapp-cta, .btn-phone-cta, .lightbox-order-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';

            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/* ==========================================================================
   Trigger Energetic Jiggle on Floating WhatsApp Button
   ========================================================================== */
function triggerCartJiggle() {
    const waBtn = document.getElementById('btnFloatingWa');
    if (waBtn) {
        waBtn.classList.remove('jiggle');
        void waBtn.offsetWidth;
        waBtn.classList.add('jiggle');
        setTimeout(() => waBtn.classList.remove('jiggle'), 700);
    }
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-bell';
    toast.innerHTML = `
        <i class="${iconClass} toast-icon"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

/* ==========================================================================
   Theme Toggle (Dark Obsidian / Light Honey)
   ========================================================================== */
function oppo() {
    const isDark = document.documentElement.classList.toggle('dark');
    document.body.classList.toggle('dark-theme', isDark);

    try {
        localStorage.setItem('bakery-theme', isDark ? 'dark' : 'light');
    } catch (e) {
        console.warn('localStorage not accessible', e);
    }

    updateThemeIcon(isDark);
    showToast(isDark ? 'تم تفعيل الوضع الليلي الفخم 🌙' : 'تم تفعيل الوضع النهاري المشرق ☀️');
}

function updateThemeIcon(isDark) {
    const box = document.getElementById("box");
    if (!box) return;

    if (isDark) {
        box.innerHTML = '<i class="fa-solid fa-sun" style="color: #F59E0B;"></i>';
        box.setAttribute('title', 'تبديل للوضع النهاري');
    } else {
        box.innerHTML = '<i class="fa-solid fa-moon"></i>';
        box.setAttribute('title', 'تبديل للوضع الليلي');
    }
}

(function initTheme() {
    try {
        const savedTheme = localStorage.getItem('bakery-theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark-theme');
            updateThemeIcon(true);
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark-theme');
            updateThemeIcon(false);
        }
    } catch (e) {
        // default light
    }
})();

/* ==========================================================================
   Legacy Compatibility Functions (sandidd & col)
   ========================================================================== */
function sandidd() {
    openOrderModal('عيش بلدي مصري فاخر', 5, '20 رغيف');
}

function col() {
    openOrderModal('عيش شامي أبيض فاخر', 6, '20 رغيف');
}

/* ==========================================================================
   DOM Ready Initialization
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
    // Before & After Oven Slider
    initComparisonSlider();

    // Photo Gallery Filter Tabs
    initGalleryFilters();

    // 3D Card Tilt & Spotlight
    init3DCardTilt();

    // Scroll Progress
    initScrollProgress();

    // Scroll Reveal
    initScrollReveal();

    // Button Ripples
    initButtonRipple();

    // Mobile Navigation
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const isActive = nav.classList.toggle("active");
            menuToggle.innerHTML = isActive 
                ? '<i class="fa-solid fa-xmark"></i>' 
                : '<i class="fa-solid fa-bars"></i>';
        });

        document.addEventListener('click', function (e) {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });

        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    // Navbar Scroll Shadow & Back to Top Visibility
    const header = document.getElementById('main-header');
    const backToTopBtn = document.getElementById('btnBackToTop');

    window.addEventListener('scroll', function () {
        const scrollPos = window.scrollY;

        if (header) {
            if (scrollPos > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        if (backToTopBtn) {
            if (scrollPos > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        highlightActiveNavLink();
    }, { passive: true });

    // Product Category Filter Tabs
    initProductFilters();
});

/* ==========================================================================
   Product Category Filtering
   ========================================================================== */
function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.96)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 20);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   Card Quantity Counter
   ========================================================================== */
function changeQty(button, delta) {
    const control = button.closest('.qty-control');
    if (!control) return;
    const qtyNumberEl = control.querySelector('.qty-number');
    if (!qtyNumberEl) return;

    let qty = parseInt(qtyNumberEl.textContent, 10) || 1;
    qty = Math.max(1, Math.min(50, qty + delta));
    qtyNumberEl.textContent = qty;

    qtyNumberEl.classList.remove('bump');
    void qtyNumberEl.offsetWidth;
    qtyNumberEl.classList.add('bump');
    setTimeout(() => qtyNumberEl.classList.remove('bump'), 180);

    triggerCartJiggle();
}

function quickOrderFromCard(button, productName, unitPrice, unit) {
    const card = button.closest('.product-card');
    let qty = 1;
    if (card) {
        const qtyEl = card.querySelector('.qty-number');
        if (qtyEl) {
            qty = parseInt(qtyEl.textContent, 10) || 1;
        }
    }
    triggerCartJiggle();
    openOrderModal(productName, unitPrice, unit, qty);
}

/* ==========================================================================
   Interactive Order Modal
   ========================================================================== */
function openOrderModal(productName = '', price = 5, unit = '20 رغيف', qty = 1) {
    const modalOverlay = document.getElementById('orderModalOverlay');
    if (!modalOverlay) return;

    const select = document.getElementById('orderProductSelect');
    if (select && productName) {
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === productName || select.options[i].text.includes(productName)) {
                select.selectedIndex = i;
                break;
            }
        }
    }

    currentModalQty = qty;
    const qtyNumberEl = document.getElementById('modalQtyNumber');
    if (qtyNumberEl) {
        qtyNumberEl.textContent = currentModalQty;
    }

    updateModalTotal();

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        const nameInput = document.getElementById('orderCustomerName');
        if (nameInput) nameInput.focus();
    }, 150);
}

function closeOrderModal() {
    const modalOverlay = document.getElementById('orderModalOverlay');
    if (!modalOverlay) return;

    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function handleModalBackdropClick(event) {
    if (event.target.id === 'orderModalOverlay') {
        closeOrderModal();
    }
}

function modalChangeQty(delta) {
    currentModalQty = Math.max(1, Math.min(100, currentModalQty + delta));
    const qtyNumberEl = document.getElementById('modalQtyNumber');
    if (qtyNumberEl) {
        qtyNumberEl.textContent = currentModalQty;
        qtyNumberEl.classList.remove('bump');
        void qtyNumberEl.offsetWidth;
        qtyNumberEl.classList.add('bump');
        setTimeout(() => qtyNumberEl.classList.remove('bump'), 180);
    }
    updateModalTotal();
    triggerCartJiggle();
}

function updateModalTotal() {
    const select = document.getElementById('orderProductSelect');
    const totalEl = document.getElementById('modalTotalEstimate');
    if (!select || !totalEl) return;

    const selectedOption = select.options[select.selectedIndex];
    const unitPrice = parseFloat(selectedOption.getAttribute('data-price')) || 5;
    const total = unitPrice * currentModalQty;

    totalEl.textContent = `${total} جنيه`;
}

function handleOrderSubmit(event) {
    event.preventDefault();

    const name = (document.getElementById('orderCustomerName')?.value || '').trim();
    const select = document.getElementById('orderProductSelect');
    const productName = select ? select.options[select.selectedIndex].value : 'عيش بلدي طازج';
    const unitPrice = select ? (parseFloat(select.options[select.selectedIndex].getAttribute('data-price')) || 5) : 5;
    const unit = select ? (select.options[select.selectedIndex].getAttribute('data-unit') || '') : '';
    const address = (document.getElementById('orderAddress')?.value || '').trim();
    const notes = (document.getElementById('orderNotes')?.value || '').trim();

    const totalEstimate = unitPrice * currentModalQty;

    let message = `السلام عليكم ورحمة الله،\nأريد عمل طلبية من *مخبز الخير*:\n\n`;
    message += `👤 *اسم العميل:* ${name}\n`;
    message += `🥖 *الصنف:* ${productName}\n`;
    message += `📦 *الكمية:* ${currentModalQty} (${unit})\n`;
    message += `💰 *الإجمالي التقديري:* ${totalEstimate} جنيه\n`;
    
    if (address) {
        message += `📍 *العنوان / الاستلام:* ${address}\n`;
    }
    if (notes) {
        message += `📝 *ملاحظات:* ${notes}\n`;
    }

    message += `\nشكراً لكم وبالتوفيق دائماً!`;

    const whatsappUrl = `https://wa.me/${BAKERY_PHONE}?text=${encodeURIComponent(message)}`;

    showToast('تم تجهيز طلبك بنجاح! جاري تحويلك إلى واتساب... 💬');
    triggerCartJiggle();

    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        closeOrderModal();
    }, 600);
}

// Close modals or navigate on Keyboard
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeLightbox();
        closeOrderModal();
        const nav = document.getElementById("nav");
        const menuToggle = document.getElementById("menu-toggle");
        if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            if (menuToggle) menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    } else if (e.key === 'ArrowRight') {
        const modal = document.getElementById('lightboxModal');
        if (modal && modal.classList.contains('active')) {
            navigateLightbox(-1); // In RTL: right is previous
        }
    } else if (e.key === 'ArrowLeft') {
        const modal = document.getElementById('lightboxModal');
        if (modal && modal.classList.contains('active')) {
            navigateLightbox(1);  // In RTL: left is next
        }
    }
});

/* ==========================================================================
   Smooth Scrolling & Active Link Highlighting
   ========================================================================== */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 180;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPosition >= top && scrollPosition < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

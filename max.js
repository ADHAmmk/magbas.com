/**
 * مخبز الخير - Main Interactive Script
 * Handles Theme Toggling (Dark/Light), Mobile Navigation, Product Filtering,
 * Quantity Selectors, WhatsApp Order Modal, and Smooth Scrolling.
 */

// Phone number for WhatsApp & calls
const BAKERY_PHONE = "201013984024";

// State
let currentModalQty = 1;

/* ==========================================================================
   Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function oppo() {
    const isDark = document.documentElement.classList.toggle('dark');
    document.body.classList.toggle('dark-theme', isDark);

    // Save user preference
    try {
        localStorage.setItem('bakery-theme', isDark ? 'dark' : 'light');
    } catch (e) {
        console.warn('localStorage not accessible', e);
    }

    // Update Theme Icon
    updateThemeIcon(isDark);
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

// Restore saved theme on initial page load
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
// Fix for the missing sandidd() function from original template
function sandidd() {
    openOrderModal('عيش بلدي مصري فاخر', 5, '20 رغيف');
}

// Enhanced col() function
function col() {
    openOrderModal('عيش شامي أبيض فاخر', 6, '20 رغيف');
}

/* ==========================================================================
   Mobile Navigation Toggle
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
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

        // Close mobile nav when clicking outside
        document.addEventListener('click', function (e) {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });

        // Close mobile nav when clicking any nav link
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

        // Active link highlighting on scroll
        highlightActiveNavLink();
    });

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
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.35s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
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
    openOrderModal(productName, unitPrice, unit, qty);
}

/* ==========================================================================
   Interactive Order Modal
   ========================================================================== */
function openOrderModal(productName = '', price = 5, unit = '20 رغيف', qty = 1) {
    const modalOverlay = document.getElementById('orderModalOverlay');
    if (!modalOverlay) return;

    // Set Product in dropdown if exists
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

    // Focus on customer name input
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
    }
    updateModalTotal();
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

    // Compose polite, structured Arabic WhatsApp message
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

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    closeOrderModal();
}

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeOrderModal();
        const nav = document.getElementById("nav");
        const menuToggle = document.getElementById("menu-toggle");
        if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            if (menuToggle) menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
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

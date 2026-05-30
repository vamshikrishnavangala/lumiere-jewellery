/* =============================================
   LUMIÈRE — Fine Jewellery
   Main JavaScript
   ============================================= */

// =================== LOADER ===================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    // Start hero animations
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150 + 300);
    });
  }, 1800);
});

// =================== CURSOR ===================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor scale on interactive elements
document.querySelectorAll('a, button, [data-tilt]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// =================== NAVIGATION ===================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  hamburger.classList.toggle('open');
});

function closeMobileMenu() {
  mobileMenu.classList.remove('active');
  hamburger.classList.remove('open');
}

// =================== SCROLL REVEAL ===================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger within parent
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sib, idx) => {
        if (sib === entry.target) delay = idx * 120;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => {
  if (!el.closest('.hero')) observer.observe(el);
});

// =================== PARALLAX HERO ===================
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const hero3d = document.getElementById('hero3d');
  if (hero3d && scrollY < window.innerHeight) {
    hero3d.style.transform = `translateY(calc(-50% + ${scrollY * 0.3}px))`;
  }
});

// =================== 3D CARD TILT ===================
document.querySelectorAll('[data-tilt]').forEach(card => {
  const inner = card.querySelector('.card-inner');
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 12;
    const rotateY = (x / rect.width) * 12;
    inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    inner.style.transform = '';
  });
});

// =================== COUNTER ANIMATION ===================
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString() + (target >= 1000 ? '+' : '+');
      }, 25);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// =================== TESTIMONIAL SLIDER ===================
const track = document.getElementById('testimonialTrack');
const cards = track.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('testimonialDots');
let currentSlide = 0;
let autoSlide;

// Create dots
cards.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(index) {
  const isMobile = window.innerWidth <= 900;
  const cardWidth = isMobile ? track.parentElement.offsetWidth : track.parentElement.offsetWidth / 2;
  track.style.transform = `translateX(-${index * (cardWidth + (isMobile ? 0 : 30))}px)`;
  document.querySelectorAll('.testimonial-dots .dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
  currentSlide = index;
}

function nextSlide() {
  const maxSlide = window.innerWidth <= 900 ? cards.length - 1 : cards.length - 2;
  currentSlide = (currentSlide + 1) % (maxSlide + 1);
  goToSlide(currentSlide);
}

autoSlide = setInterval(nextSlide, 4000);
track.addEventListener('mouseenter', () => clearInterval(autoSlide));
track.addEventListener('mouseleave', () => { autoSlide = setInterval(nextSlide, 4000); });

// =================== CART ===================
let cartItems = [];
let cartCount = 0;

function addToCart(name, price) {
  const existingIdx = cartItems.findIndex(item => item.name === name);
  if (existingIdx >= 0) {
    cartItems[existingIdx].qty++;
  } else {
    cartItems.push({ name, price, qty: 1 });
  }
  cartCount++;
  document.querySelector('.cart-count').textContent = cartCount;

  // Animate cart icon
  const cartIcon = document.querySelector('.nav-cart');
  cartIcon.style.transform = 'scale(1.3)';
  setTimeout(() => { cartIcon.style.transform = ''; }, 300);

  renderCart();
  openCart();
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (cartItems.length === 0) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    footer.style.display = 'none';
    return;
  }

  let total = 0;
  container.innerHTML = cartItems.map((item, i) => {
    total += item.price * item.qty;
    return `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Qty: ${item.qty}</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
          <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('cartTotal').textContent = '₹' + total.toLocaleString();
  footer.style.display = 'block';
}

function removeFromCart(index) {
  cartCount -= cartItems[index].qty;
  cartItems.splice(index, 1);
  document.querySelector('.cart-count').textContent = cartCount;
  renderCart();
}

function openCart() {
  document.getElementById('cartModal').classList.add('open');
  document.getElementById('cartOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartModal').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// Open cart on icon click
document.querySelector('.nav-cart').addEventListener('click', () => {
  renderCart();
  openCart();
});

function checkout() {
  alert('✦ Thank you for your interest!\n\nFor high-value purchases, our team will contact you within 24 hours to arrange a private consultation and secure payment.\n\n+91 40 1234 5678');
  closeCart();
}

// =================== CONTACT FORM ===================
function submitForm() {
  const name = document.getElementById('cname').value.trim();
  const email = document.getElementById('cemail').value.trim();
  const service = document.getElementById('cservice').value;

  if (!name || !email || !service) {
    alert('Please fill in all required fields.');
    return;
  }

  const success = document.getElementById('formSuccess');
  success.style.display = 'block';

  document.getElementById('cname').value = '';
  document.getElementById('cemail').value = '';
  document.getElementById('cphone').value = '';
  document.getElementById('cservice').value = '';

  setTimeout(() => { success.style.display = 'none'; }, 5000);
}

// =================== MOUSE PARALLAX ===================
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  const ring = document.getElementById('ring');
  if (ring) {
    ring.style.animationPlayState = 'paused';
    ring.style.transform = `rotateY(${x * 3}deg) rotateX(${-y * 2}deg)`;
  }
});

document.querySelector('.hero').addEventListener('mouseleave', () => {
  const ring = document.getElementById('ring');
  if (ring) ring.style.animationPlayState = 'running';
});

// =================== SMOOTH SCROLL ===================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// =================== STAT REVEAL ===================
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `revealUp 0.6s ${i * 0.1}s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.stat').forEach(el => statObserver.observe(el));

console.log('%c LUMIÈRE Fine Jewellery', 'color: #C9A84C; font-size: 20px; font-family: serif; font-style: italic;');
console.log('%c AWS Static Website — Ready for Deployment', 'color: #8A7A6A; font-size: 12px;');

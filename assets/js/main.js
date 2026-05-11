/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200});
sr.reveal('.tech-item',{interval: 200});

/*===== THEME TOGGLE =====*/
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'bx bx-sun theme-icon';
    } else {
        themeIcon.className = 'bx bx-moon theme-icon';
    }
}

/*===== SEARCH EXPAND/COLLAPSE =====*/
const searchContainer = document.querySelector('.nav__search');
const searchInput = document.getElementById('search-input');
const searchIcon = document.getElementById('search-icon');

if (searchIcon && searchInput) {
    // Click icon to expand/collapse search
    searchIcon.addEventListener('click', (e) => {
        e.preventDefault();
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
        }
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchContainer.classList.remove('active');
        }
    });

    // Allow Enter key to submit search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value;
            if (query.trim()) {
                console.log('Search for:', query);
                // Add your search functionality here
            }
        }
    });

    // Close search on Escape key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchContainer.classList.remove('active');
            searchInput.value = '';
        }
    });
}

/*===== ABOUT SLIDER DRAG =====*/
const bannerSlider = document.querySelector('.about__banner-slider');
if (bannerSlider) {
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  bannerSlider.addEventListener('pointerdown', (e) => {
    isDragging = true;
    bannerSlider.setPointerCapture(e.pointerId);
    bannerSlider.classList.add('active');
    startX = e.clientX;
    scrollLeft = bannerSlider.scrollLeft;
  });

  bannerSlider.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const x = e.clientX;
    const walk = x - startX;
    bannerSlider.scrollLeft = scrollLeft - walk;
  });

  const stopDragging = () => {
    isDragging = false;
    bannerSlider.classList.remove('active');
  };

  bannerSlider.addEventListener('pointerup', stopDragging);
  bannerSlider.addEventListener('pointercancel', stopDragging);
  bannerSlider.addEventListener('pointerleave', stopDragging);

  const banners = document.querySelectorAll('.about__banner');
  if (banners.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    banners.forEach((banner) => observer.observe(banner));
  }
}


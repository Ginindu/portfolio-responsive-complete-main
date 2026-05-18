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

/*===== ABOUT IMAGE REVEAL =====*/
const aboutImageWrap = document.querySelector('.about__image-wrap');
if (aboutImageWrap) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    aboutObserver.observe(aboutImageWrap);
}


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

/*===== SEARCH & HIGHLIGHT =====*/
const searchContainer = document.querySelector('.nav__search');
const searchInput = document.getElementById('search-input');
const searchIcon = document.getElementById('search-icon');
const searchResults = document.getElementById('search-results');

const searchableKeywords = [
    { term: "Data Science", target: "home" },
    { term: "Web Developer", target: "about" },
    { term: "Skills", target: "skills" },
    { term: "HTML5", target: "skills" },
    { term: "CSS3", target: "skills" },
    { term: "JavaScript", target: "skills" },
    { term: "Python", target: "skills" },
    { term: "Work", target: "work" },
    { term: "Contact", target: "contact" },
    { term: "Portfolio", target: "home" },
    { term: "Experience", target: "about" }
];

function unhighlightAll() {
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(h => {
        const parent = h.parentNode;
        parent.replaceChild(document.createTextNode(h.textContent), h);
        parent.normalize();
    });
}

function highlightText(element, keyword) {
    if (!keyword) return;
    
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    const nodesToHighlight = [];
    let node;
    
    while (node = walker.nextNode()) {
        if (node.parentElement.tagName.toLowerCase() === 'script' || 
            node.parentElement.tagName.toLowerCase() === 'style' ||
            node.parentElement.classList.contains('highlight')) {
            continue;
        }
        
        if (node.nodeValue.toLowerCase().includes(keyword.toLowerCase())) {
            nodesToHighlight.push(node);
        }
    }
    
    nodesToHighlight.forEach(node => {
        const regex = new RegExp(`(${keyword})`, 'gi');
        const fragment = document.createDocumentFragment();
        
        let lastIndex = 0;
        let match;
        
        while ((match = regex.exec(node.nodeValue)) !== null) {
            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(node.nodeValue.substring(lastIndex, match.index)));
            }
            
            const span = document.createElement('span');
            span.className = 'highlight';
            span.textContent = match[0];
            fragment.appendChild(span);
            
            lastIndex = regex.lastIndex;
        }
        
        if (lastIndex < node.nodeValue.length) {
            fragment.appendChild(document.createTextNode(node.nodeValue.substring(lastIndex)));
        }
        
        node.parentNode.replaceChild(fragment, node);
    });
}

if (searchIcon && searchInput && searchResults) {
    searchIcon.addEventListener('click', (e) => {
        e.preventDefault();
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
        } else {
            searchResults.classList.remove('show');
            unhighlightAll();
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchContainer.classList.remove('active');
            searchResults.classList.remove('show');
        }
    });

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase().trim();
        searchResults.innerHTML = '';
        
        unhighlightAll();
        if (val && val.length > 1) {
            const mainContent = document.querySelector('main.l-main');
            if (mainContent) {
                highlightText(mainContent, val);
            }
        }
        
        if (val) {
            const matches = searchableKeywords.filter(k => k.term.toLowerCase().includes(val));
            if (matches.length > 0) {
                searchResults.classList.add('show');
                matches.forEach(match => {
                    const div = document.createElement('div');
                    div.className = 'search__result-item';
                    
                    const regex = new RegExp(`(${val})`, 'gi');
                    div.innerHTML = match.term.replace(regex, '<span class="highlight">$1</span>');
                    
                    div.addEventListener('click', () => {
                        unhighlightAll();
                        const section = document.getElementById(match.target);
                        if (section) {
                            section.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            highlightText(section, match.term);
                        }
                        searchResults.classList.remove('show');
                        searchContainer.classList.remove('active');
                        searchInput.value = '';
                    });
                    
                    searchResults.appendChild(div);
                });
            } else {
                searchResults.classList.remove('show');
            }
        } else {
            searchResults.classList.remove('show');
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const val = searchInput.value.toLowerCase().trim();
            if (val) {
                unhighlightAll();
                highlightText(document.body, val);
                searchResults.classList.remove('show');
                searchContainer.classList.remove('active');
            }
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchContainer.classList.remove('active');
            searchResults.classList.remove('show');
            searchInput.value = '';
            unhighlightAll();
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

/*===== CHATBOT LOGIC =====*/
const chatbotBox = document.getElementById('chatbot-box');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSendBtn = document.getElementById('chatbot-send');
const chatbotOptionBtns = document.querySelectorAll('.chatbot__option-btn');
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotWrapper = document.getElementById('chatbot-wrapper');

if (chatbotToggle && chatbotWrapper && chatbotClose) {
  chatbotToggle.addEventListener('click', () => {
    chatbotWrapper.classList.toggle('show');
  });

  chatbotClose.addEventListener('click', () => {
    chatbotWrapper.classList.remove('show');
  });
}

const botResponses = {
  skills: "I specialize in Data Science, Web Development, HTML5, CSS3, JavaScript, Python, R, C++, and UI/UX Design.",
  experience: "I have experience building clean portfolio websites, practical data applications, and intuitive user interfaces. Check out my Work section!",
  hire: "You can hire me by filling out the contact form here or messaging me on LinkedIn.",
  default: "Thanks for reaching out! I'm currently a virtual assistant, so please use the contact form above to get in touch with Ginindu directly."
};

function appendMessage(text, sender) {
  if (!chatbotBox) return;
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chatbot__message');
  messageDiv.classList.add(sender === 'bot' ? 'chatbot__message--bot' : 'chatbot__message--user');
  messageDiv.innerHTML = `<p>${text}</p>`;
  chatbotBox.appendChild(messageDiv);
  chatbotBox.scrollTop = chatbotBox.scrollHeight;
}

function handleChatbotInput(query) {
  if (!query) return;
  
  appendMessage(query, 'user');
  
  setTimeout(() => {
    appendMessage(botResponses.default, 'bot');
  }, 600);
}

if (chatbotSendBtn && chatbotInput) {
  chatbotSendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const text = chatbotInput.value.trim();
    if (text) {
      handleChatbotInput(text);
      chatbotInput.value = '';
    }
  });

  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const text = chatbotInput.value.trim();
      if (text) {
        handleChatbotInput(text);
        chatbotInput.value = '';
      }
    }
  });
}

if (chatbotOptionBtns) {
  chatbotOptionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const questionType = btn.getAttribute('data-question');
      const questionText = btn.textContent;
      
      appendMessage(questionText, 'user');
      
      setTimeout(() => {
        appendMessage(botResponses[questionType] || botResponses.default, 'bot');
      }, 600);
    });
  });
}


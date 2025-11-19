// ========== Global Variables ==========
const nav = document.getElementById('navigation');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const projectsGrid = document.getElementById('projectsGrid');
const projectModal = document.getElementById('projectModal');
const addProjectBtn = document.getElementById('addProjectBtn');
const modalClose = document.getElementById('modalClose');
const cancelBtn = document.getElementById('cancelBtn');
const projectForm = document.getElementById('projectForm');

// ========== Check and Load Hero Image ==========
function setupHeroImage() {
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        // Try to load the image, if it fails it will show the gradient fallback
        const testImage = new Image();
        testImage.onload = function() {
            // Image loaded successfully, it will already be showing via the src attribute
        };
        testImage.onerror = function() {
            // If image doesn't exist, use gradient fallback
            heroImage.style.display = 'none';
            if (heroImage.parentElement) {
                heroImage.parentElement.style.background = 'linear-gradient(135deg, #243b53, #627d98)';
            }
        };
        testImage.src = heroImage.src;
    }
}

// ========== Navigation Scroll Effect ==========
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ========== Mobile Menu Toggle ==========
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ========== Smooth Scrolling ==========
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

// ========== Project Management ==========

// Load projects from localStorage on page load
function loadProjects() {
    const savedProjects = localStorage.getItem('portfolioProjects');
    if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        displayProjects(projects);
    } else {
        // Initialize with empty array
        return [];
    }
}

// Save projects to localStorage
function saveProjects(projects) {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
}

// Display projects in the grid
function displayProjects(projects) {
    // Clear existing projects
    const existingCards = projectsGrid.querySelectorAll('.project-card');
    existingCards.forEach(card => card.remove());
    
    // Add all projects
    projects.forEach((project, index) => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
        
        // Add animation delay
        setTimeout(() => {
            projectCard.style.opacity = '0';
            projectCard.style.transform = 'translateY(30px)';
            projectCard.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                projectCard.style.opacity = '1';
                projectCard.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
}

// Create project card HTML element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.id = project.id;
    
    const badgeClass = project.type === 'client' ? 'client' : 'personal';
    const badgeText = project.type === 'client' ? 'Client Work' : 'Personal';
    
    const tagsHTML = project.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
    
    const githubLink = project.github 
        ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
        </a>`
        : '';
    
    const liveLink = project.link 
        ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link primary">
            Visit
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
        </a>`
        : '';
    
    const imageSrc = project.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23f0f4f8" width="600" height="400"/%3E%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%239fb3c8" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21,15 16,10 5,21"%3E%3C/polyline%3E%3C/svg%3E%3Ctext fill="%23627d98" font-family="Arial" font-size="32" x="50%25" y="55%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
    
    card.innerHTML = `
        <div class="project-badge ${badgeClass}">${escapeHtml(badgeText)}</div>
        <button class="delete-btn" onclick="deleteProject('${project.id}')" aria-label="Delete project">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        <div class="project-image">
            <img src="${imageSrc}" alt="${escapeHtml(project.title)}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'600\\' height=\\'400\\'%3E%3Crect fill=\\'%23f0f4f8\\' width=\\'600\\' height=\\'400\\'/%3E%3Ctext fill=\\'%23627d98\\' font-family=\\'Arial\\' font-size=\\'32\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'%3ENo Image%3C/text%3E%3C/svg%3E'">
        </div>
        <div class="project-content">
            <h3 class="project-title">${escapeHtml(project.title)}</h3>
            <p class="project-description">${escapeHtml(project.description)}</p>
            <div class="project-tags">${tagsHTML}</div>
            <div class="project-links">
                ${liveLink}
                ${githubLink}
            </div>
        </div>
    `;
    
    return card;
}

// Add delete button styling
const deleteBtnStyle = document.createElement('style');
deleteBtnStyle.textContent = `
    .delete-btn {
        position: absolute;
        top: 1rem;
        left: 1rem;
        z-index: 10;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    
    .project-card:hover .delete-btn {
        opacity: 1;
    }
    
    .delete-btn:hover {
        background: #dc2626;
        transform: scale(1.1);
    }
    
    .delete-btn svg {
        width: 20px;
        height: 20px;
    }
`;
document.head.appendChild(deleteBtnStyle);

// Escape HTML to prevent XSS
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

// Delete project
function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        const savedProjects = localStorage.getItem('portfolioProjects');
        if (savedProjects) {
            const projects = JSON.parse(savedProjects);
            const updatedProjects = projects.filter(p => p.id !== id);
            saveProjects(updatedProjects);
            displayProjects(updatedProjects);
        }
    }
}

// Modal functions
addProjectBtn.addEventListener('click', () => {
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

modalClose.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Close modal on overlay click
projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        closeModal();
    }
});

function closeModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
    projectForm.reset();
}

// Handle form submission
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(projectForm);
    const tags = formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const project = {
        id: Date.now().toString(),
        title: formData.get('title'),
        description: formData.get('description'),
        image: formData.get('image'),
        link: formData.get('link'),
        github: formData.get('github'),
        tags: tags,
        type: formData.get('type')
    };
    
    const savedProjects = localStorage.getItem('portfolioProjects');
    const projects = savedProjects ? JSON.parse(savedProjects) : [];
    projects.push(project);
    
    saveProjects(projects);
    displayProjects(projects);
    closeModal();
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupHeroImage();
    loadProjects();
    
    // Add entrance animations to sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    document.querySelectorAll('#about, #projects, #contact').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease';
        observer.observe(section);
    });
});

// Export for global access
window.deleteProject = deleteProject;


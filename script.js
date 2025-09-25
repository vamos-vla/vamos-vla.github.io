// VAMOS Website JavaScript
// Smooth scrolling, animations, and interactive features

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Add offset for better positioning
                const offset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Add visual feedback for section navigation buttons
                if (this.classList.contains('section-nav-btn')) {
                    // Remove active class from all section nav buttons
                    document.querySelectorAll('.section-nav-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Flash effect for the target section
                    targetSection.style.transition = 'background-color 0.3s ease';
                    const originalBg = targetSection.style.backgroundColor;
                    targetSection.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                    
                    setTimeout(() => {
                        targetSection.style.backgroundColor = originalBg;
                    }, 1000);
                }
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all content sections for animations
    const animatedElements = document.querySelectorAll('.content-section, .result-item, .method-component, .team-member, .demo-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Video controls enhancement
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        // Add loading state
        video.addEventListener('loadstart', function() {
            this.style.opacity = '0.7';
        });
        
        video.addEventListener('canplay', function() {
            this.style.opacity = '1';
        });

        // Pause other videos when one starts playing
        video.addEventListener('play', function() {
            videos.forEach(otherVideo => {
                if (otherVideo !== this && !otherVideo.paused) {
                    otherVideo.pause();
                }
            });
        });
    });

    // Button hover effects enhancement
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Copy citation to clipboard
    const citationBox = document.querySelector('.citation-box');
    if (citationBox) {
        citationBox.addEventListener('click', function() {
            const citationText = this.textContent;
            
            // Create temporary textarea for copying
            const tempTextarea = document.createElement('textarea');
            tempTextarea.value = citationText;
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            
            try {
                document.execCommand('copy');
                showCopyFeedback(this);
            } catch (err) {
                console.error('Failed to copy citation:', err);
            }
            
            document.body.removeChild(tempTextarea);
        });
        
        // Add cursor pointer to indicate clickability
        citationBox.style.cursor = 'pointer';
        citationBox.title = 'Click to copy citation';
    }

    // Show copy feedback
    function showCopyFeedback(element) {
        const originalTitle = element.title;
        element.title = 'Citation copied to clipboard!';
        element.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            element.title = originalTitle;
            element.style.backgroundColor = '#34495e';
        }, 2000);
    }

    // Lazy loading for images (disabled to keep placeholders visible)
    const images = document.querySelectorAll('img');
    // Remove lazy loading that was causing placeholders to disappear
    // Images will now load normally and stay visible

    // Keyboard navigation enhancement
    document.addEventListener('keydown', function(e) {
        // Press 'C' to copy citation
        if (e.key === 'c' || e.key === 'C') {
            if (e.ctrlKey || e.metaKey) return; // Don't interfere with Ctrl+C
            
            const citationBox = document.querySelector('.citation-box');
            if (citationBox) {
                citationBox.click();
            }
        }
        
        // Press 'T' to scroll to top
        if (e.key === 't' || e.key === 'T') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    // Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sectionNavMenu = document.querySelector('.section-nav-menu');
    
    if (mobileMenuToggle && sectionNavMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            sectionNavMenu.classList.toggle('mobile-open');
            
            // Animate the dots
            const dots = this.querySelectorAll('.dot');
            if (sectionNavMenu.classList.contains('mobile-open')) {
                dots.forEach((dot, index) => {
                    setTimeout(() => {
                        dot.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            dot.style.transform = 'scale(1)';
                        }, 150);
                    }, index * 50);
                });
            }
        });
        
        // Close mobile menu when clicking on a navigation link
        const navLinks = sectionNavMenu.querySelectorAll('.section-nav-btn');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                sectionNavMenu.classList.remove('mobile-open');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !sectionNavMenu.contains(e.target)) {
                sectionNavMenu.classList.remove('mobile-open');
            }
        });
    }

    // Performance optimization: Debounce scroll events
    let scrollTimeout;
    const debouncedScrollHandler = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Add any scroll-based functionality here
            updateScrollProgress();
        }, 16); // ~60fps
    };

    // Scroll progress indicator
    const updateScrollProgress = () => {
        const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        // Create progress bar if it doesn't exist
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, #667eea, #764ba2);
                z-index: 1000;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);
        }
        
        progressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
    };

    window.addEventListener('scroll', debouncedScrollHandler);

    // Initialize scroll progress
    updateScrollProgress();

    // Error handling for missing assets
    const handleImageError = (img) => {
        img.style.backgroundColor = '#f0f0f0';
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
        img.style.color = '#666';
        img.style.fontSize = '14px';
        img.innerHTML = 'Image placeholder';
    };

    images.forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });

    // Video error handling
    videos.forEach(video => {
        video.addEventListener('error', function() {
            const container = this.parentElement;
            container.innerHTML = `
                <div style="
                    background: #f0f0f0;
                    padding: 2rem;
                    text-align: center;
                    color: #666;
                    border-radius: 8px;
                ">
                    <p>Video placeholder</p>
                    <p style="font-size: 0.9em; margin-top: 0.5rem;">Technical summary video would be displayed here</p>
                </div>
            `;
        });
    });

    // Accessibility improvements
    const improveAccessibility = () => {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 1001;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.prepend(skipLink);

        // Add main content landmark
        const firstSection = document.querySelector('.content-section');
        if (firstSection) {
            firstSection.id = 'main-content';
        }
    };

    improveAccessibility();

    // Trajectory type cycling functionality
    const initializeTrajectoryControls = () => {
        const trajectoryButtons = document.querySelectorAll('.trajectory-cycle-button');
        
        // Define different cycling orders for different scenarios
        const getTrajectoryOrder = (scenario) => {
            if (scenario === 'grass' || scenario === 'u_pole') {
                return ['all', 'original', 'modified'];
            }
            return ['all', 'original', 'left', 'right'];
        };
        
        trajectoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const demoItem = this.closest('.demo-item');
                const currentType = this.getAttribute('data-current');
                const scenario = demoItem.getAttribute('data-scenario');
                
                // Get scenario-specific trajectory order
                const trajectoryOrder = getTrajectoryOrder(scenario);
                
                // Find current index and get next type
                const currentIndex = trajectoryOrder.indexOf(currentType);
                const nextIndex = (currentIndex + 1) % trajectoryOrder.length;
                const nextType = trajectoryOrder[nextIndex];
                
                // Update button data
                this.setAttribute('data-current', nextType);
                
                // Update demo caption based on trajectory type using configuration
                const demoCaption = demoItem.querySelector('.demo-caption');
                
                if (demoCaption && scenario && typeof TRAJECTORY_COMMANDS !== 'undefined') {
                    const scenarioCommands = TRAJECTORY_COMMANDS[scenario];
                    if (scenarioCommands && scenarioCommands[nextType]) {
                        demoCaption.innerHTML = `<em>${scenarioCommands[nextType]}</em>`;
                    }
                }
                
                // Add cycling animation
                this.style.transform = 'scale(0.9)';
                const cycleIcon = this.querySelector('.cycle-indicator');
                if (cycleIcon) {
                    cycleIcon.style.transform = 'rotate(360deg)';
                    cycleIcon.style.transition = 'transform 0.6s ease';
                }
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    if (cycleIcon) {
                        cycleIcon.style.transform = 'rotate(0deg)';
                    }
                }, 150);
                
                // Update demo image based on trajectory type
                const demoImage = demoItem.querySelector('.demo-image');
                if (demoImage) {
                    // Get the new image source from data attributes
                    const newImageSrc = demoImage.getAttribute(`data-${nextType}`);
                    
                    if (newImageSrc) {
                        // Add loading state
                        demoImage.classList.add('loading');
                        
                        // Create a new image to preload
                        const newImg = new Image();
                        newImg.onload = function() {
                            // Image loaded successfully, update the source
                            demoImage.src = newImageSrc;
                            demoImage.classList.remove('loading', 'error');
                            
                            // Add visual feedback
                            demoImage.style.filter = 'brightness(1.1)';
                            setTimeout(() => {
                                demoImage.style.filter = 'brightness(1)';
                            }, 300);
                        };
                        
                        newImg.onerror = function() {
                            // Image failed to load, show fallback
                            console.warn(`Failed to load image: ${newImageSrc}`);
                            demoImage.classList.remove('loading');
                            demoImage.classList.add('error');
                            
                            // Show a subtle indicator that image is not available
                            demoImage.title = `Trajectory image not available for ${nextType}`;
                        };
                        
                        // Start loading the new image
                        newImg.src = newImageSrc;
                    } else {
                        // No data attribute for this trajectory type, show fallback
                        console.warn(`No image data found for trajectory type: ${nextType}`);
                        demoImage.classList.add('error');
                        demoImage.title = `No ${nextType} trajectory image available`;
                    }
                }
                
                // Add trajectory type indicator to demo item
                let indicator = demoItem.querySelector('.trajectory-indicator');
                if (!indicator) {
                    indicator = document.createElement('div');
                    indicator.className = 'trajectory-indicator';
                    indicator.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        padding: 0.3rem 0.6rem;
                        border-radius: 12px;
                        font-size: 0.8rem;
                        font-weight: 500;
                        color: white;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                        z-index: 10;
                        transition: all 0.3s ease;
                    `;
                    demoItem.style.position = 'relative';
                    demoItem.appendChild(indicator);
                }
                
                // Update indicator with trajectory type and color
                indicator.textContent = nextType.charAt(0).toUpperCase() + nextType.slice(1);
                
                // Set indicator color to match website theme
                indicator.style.backgroundColor = 'rgba(102, 126, 234, 0.8)';
                
                // Add animation effect
                indicator.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    indicator.style.transform = 'scale(1)';
                }, 200);
                
                
                // Log trajectory change for debugging
                console.log(`Trajectory cycled to: ${nextType}`);
            });
        });
    };

    // Initialize trajectory controls
    initializeTrajectoryControls();

    // Preload trajectory images for better performance
    const preloadTrajectoryImages = () => {
        const demoImages = document.querySelectorAll('.demo-image');
        const trajectoryTypes = ['all', 'original', 'left', 'right', 'modified'];
        
        demoImages.forEach(img => {
            trajectoryTypes.forEach(type => {
                const imageSrc = img.getAttribute(`data-${type}`);
                if (imageSrc && imageSrc !== img.src) {
                    const preloadImg = new Image();
                    preloadImg.src = imageSrc;
                    // Silent preload - no error handling needed here
                }
            });
        });
    };

    // Preload images after a short delay to not block initial page load
    setTimeout(preloadTrajectoryImages, 1000);

    // Console message for developers
    console.log(`
    🤖 VAMOS Website Loaded Successfully!
    
    Features:
    - Smooth scrolling navigation
    - Intersection Observer animations  
    - Video controls enhancement
    - Citation copy functionality
    - Keyboard shortcuts (C: copy citation, T: scroll to top)
    - Scroll progress indicator
    - Accessibility improvements
    - Mobile responsive design
    - Interactive trajectory type switching
    
    Built with modern web standards and best practices.
    `);
});

// Export functions for potential external use
window.VAMOSWebsite = {
    scrollToTop: () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },
    
    copyCitation: () => {
        const citationBox = document.querySelector('.citation-box');
        if (citationBox) {
            citationBox.click();
        }
    }
};

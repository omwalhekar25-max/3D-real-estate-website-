document.addEventListener('DOMContentLoaded', () => {
    const totalFrames = 240;
    const images = [];
    let loadedCount = 0;
    let currentFrame = 1;
    let targetFrame = 1;

    const canvas = document.getElementById('animation-canvas');
    const context = canvas.getContext('2d');

    const loaderBar = document.getElementById('loader-bar');
    const loaderPercentage = document.getElementById('loader-percentage');
    const preloader = document.getElementById('preloader');

    const scrubber = document.getElementById('frame-scrubber');
    const frameCounter = document.getElementById('frame-counter');
    const scrollPercentage = document.getElementById('scroll-percentage');

    const autoplayBtn = document.getElementById('autoplay-btn');
    const playIcon = autoplayBtn.querySelector('.play-icon');
    const pauseIcons = autoplayBtn.querySelectorAll('.pause-icon');

    // Helper to pad frames as three-digit string (e.g. 001, 045, 120)
    const getFrameFilename = (index) => {
        const padded = String(index).padStart(3, '0');
        return `ezgif-frame-${padded}.jpg`;
    };

    // Begin preloading sequence
    const preloadImages = () => {
        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            img.src = getFrameFilename(i);
            img.onload = () => {
                handleImageLoad();
            };
            img.onerror = () => {
                console.error(`Failed to load frame: ${getFrameFilename(i)}`);
                handleImageLoad(); // Proceed anyway to prevent lockup
            };
            images.push(img);
        }
    };

    const handleImageLoad = () => {
        loadedCount++;
        const percent = Math.floor((loadedCount / totalFrames) * 100);
        loaderBar.style.width = `${percent}%`;
        loaderPercentage.innerText = `${percent}%`;

        if (loadedCount === totalFrames) {
            onAllImagesLoaded();
        }
    };

    const onAllImagesLoaded = () => {
        // Fade out preloader
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 1000);

        // Initial setup
        resizeCanvas();
        requestAnimationFrame(updateLoop);
        triggerScrollUpdate();
    };

    // Scale canvas to cover the screen (object-fit: cover implementation)
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawFrame(Math.round(currentFrame));
    };

    window.addEventListener('resize', resizeCanvas);

    const drawFrame = (frameIndex) => {
        const img = images[frameIndex - 1];
        if (!img || !img.complete) return;

        context.clearRect(0, 0, canvas.width, canvas.height);

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgWidth = img.naturalWidth || img.width;
        const imgHeight = img.naturalHeight || img.height;

        const imgRatio = imgWidth / imgHeight;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, x, y;

        if (canvasRatio > imgRatio) {
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgRatio;
            x = 0;
            y = (canvasHeight - drawHeight) / 2;
        } else {
            drawWidth = canvasHeight * imgRatio;
            drawHeight = canvasHeight;
            x = (canvasWidth - drawWidth) / 2;
            y = 0;
        }

        context.drawImage(img, x, y, drawWidth, drawHeight);
    };

    // Linear Interpolation Loop for Butter-Smooth Frame Rendering
    const updateLoop = () => {
        const diff = targetFrame - currentFrame;
        
        // If separation is minute, snap and draw, else transition smoothly
        if (Math.abs(diff) < 0.02) {
            currentFrame = targetFrame;
        } else {
            currentFrame += diff * 0.12; // LERP coefficient
        }

        drawFrame(Math.round(currentFrame));

        // Sync HUD interface controls
        scrubber.value = Math.round(currentFrame);
        frameCounter.innerText = `${String(Math.round(currentFrame)).padStart(3, '0')} / ${totalFrames}`;

        requestAnimationFrame(updateLoop);
    };

    // Calculate Scroll Progress & Assign Target Frame
    const triggerScrollUpdate = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentVal = docHeight > 0 ? (scrollTop / docHeight) : 0;

        // Map scroll fraction to frames [1 - 240]
        targetFrame = 1 + scrollPercentVal * (totalFrames - 1);

        // Update progress readout
        scrollPercentage.innerText = `${Math.round(scrollPercentVal * 100)}%`;
    };

    window.addEventListener('scroll', triggerScrollUpdate, { passive: true });

    // Scrubber interaction binds back to page scrolling
    scrubber.addEventListener('input', (e) => {
        stopAutoplay();
        const frameIndex = parseInt(e.target.value);
        targetFrame = frameIndex;

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentVal = (frameIndex - 1) / (totalFrames - 1);
        window.scrollTo(0, scrollPercentVal * docHeight);
    });

    // --- Autoplay slow-rotation scroll automation ---
    let isAutoplay = false;
    let autoplaySpeed = 2; // pixel scrolling amount per tick

    const startAutoplay = () => {
        isAutoplay = true;
        autoplayBtn.classList.add('active');
        playIcon.classList.add('hidden');
        pauseIcons.forEach(icon => icon.classList.remove('hidden'));
        autoplayLoop();
    };

    const stopAutoplay = () => {
        if (isAutoplay) {
            isAutoplay = false;
            autoplayBtn.classList.remove('active');
            playIcon.classList.remove('hidden');
            pauseIcons.forEach(icon => icon.classList.add('hidden'));
        }
    };

    autoplayBtn.addEventListener('click', () => {
        if (isAutoplay) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    const autoplayLoop = () => {
        if (!isAutoplay) return;

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        let nextScrollY = window.scrollY + autoplaySpeed;

        if (nextScrollY >= docHeight - 2) {
            nextScrollY = 0; // Wrap around for seamless rotation experience
        }

        window.scrollTo(0, nextScrollY);
        requestAnimationFrame(autoplayLoop);
    };

    // User interaction terminates autoplay immediately
    window.addEventListener('wheel', stopAutoplay, { passive: true });
    window.addEventListener('touchstart', stopAutoplay, { passive: true });
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown'].includes(e.code)) {
            stopAutoplay();
        }
    });

    // --- Intersection Observer for text panel active fades ---
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -25% 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-section');
                
                // Active navbar item update
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-link').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}`) {
                        link.style.color = 'var(--gold)';
                    } else {
                        link.style.color = 'var(--text-muted)';
                    }
                });
            } else {
                entry.target.classList.remove('active-section');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-section').forEach(section => {
        observer.observe(section);
    });

    // --- Portfolio Filter Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    // --- Parallax hover tilt interaction on luxury panels ---
    document.querySelectorAll('.service-card, .testimonial-card, .portfolio-item, .contact-details, .inquiry-container, .newsletter-box').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((centerY - y) / centerY) * 4; // max 4deg tilt
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // Kickoff the preload
    preloadImages();
});

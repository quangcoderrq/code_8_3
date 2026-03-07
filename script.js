document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const introScreen = document.getElementById('intro-screen');
    const mainScreen = document.getElementById('main-screen');
    const bgMusic = document.getElementById('bg-music');
    const heartsContainer = document.getElementById('hearts-container');
    const book = document.querySelector('.book');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const sheets = document.querySelectorAll('.sheet');

    let currentSheet = 0;
    const isMobile = window.innerWidth <= 768;

    // --- MOBILE 2D SLIDER LOGIC ---
    let mobileSlides = [];
    let currentSlideIndex = 0;

    function initMobileSlides() {
        mobileSlides = Array.from(document.querySelectorAll('.side'));

        mobileSlides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next', 'flipped', 'exit');
            slide.style.transform = '';

            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.add('next');
            }
        });
        currentSlideIndex = 0;
    }

    // --- AUDIO AUTOPLAY ATTEMPT ---
    bgMusic.volume = 0.4;
    const attemptPlay = () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log("Audio play prevented", e));
        }
    };
    // Try immediately
    attemptPlay();
    // Try on any user interaction
    document.body.addEventListener('click', attemptPlay, { once: true });
    document.body.addEventListener('touchstart', attemptPlay, { once: true });

    // --- INITIALIZATION ---
    introScreen.addEventListener('click', () => {
        introScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');

        createPetals();
        createHearts();

        if (isMobile) {
            initMobileSlides();
            // Start first page typewriter immediately if it's a text page
            triggerTypewriter(mobileSlides[0]);
        } else {
            initPages();
        }
    });

    function initPages() {
        sheets.forEach((sheet, index) => {
            sheet.style.zIndex = sheets.length - index;
        });
        // Start first page typewriter immediately
        triggerTypewriter(sheets[0].querySelector('.side.front'));
    }

    // --- TURN LOGIC ---
    const turnPageNext = () => {
        if (isMobile) {
            handleMobileNext();
        } else {
            handleDesktopNext();
        }
        updateButtons();
    };

    const handleMobileNext = () => {
        if (currentSlideIndex >= mobileSlides.length - 1) return;

        // Current becomes prev
        const currentSlide = mobileSlides[currentSlideIndex];
        currentSlide.classList.remove('active');
        currentSlide.classList.add('prev');

        // Next becomes current
        currentSlideIndex++;
        const nextSlide = mobileSlides[currentSlideIndex];
        nextSlide.classList.remove('next');
        nextSlide.classList.add('active');

        // Trigger typewriter if text page
        setTimeout(() => triggerTypewriter(nextSlide), 300);
    };

    const turnPagePrev = () => {
        if (isMobile) {
            handleMobilePrev();
        } else {
            handleDesktopPrev();
        }
        updateButtons();
    };

    const handleMobilePrev = () => {
        if (currentSlideIndex <= 0) return;

        // Current becomes next
        const currentSlide = mobileSlides[currentSlideIndex];
        currentSlide.classList.remove('active');
        currentSlide.classList.add('next');

        // Prev becomes current
        currentSlideIndex--;
        const prevSlide = mobileSlides[currentSlideIndex];
        prevSlide.classList.remove('prev');
        prevSlide.classList.add('active');

        // Trigger typewriter if text page
        setTimeout(() => triggerTypewriter(prevSlide), 300);
    };

    const handleDesktopNext = () => {
        if (currentSheet < sheets.length) {
            book.classList.add('open');
            book.style.transform = 'translateX(0%)';
            const sheet = sheets[currentSheet];
            sheet.classList.add('flipped');
            sheet.style.zIndex = currentSheet + 1;

            // Trigger typewriter for the back of the flipped sheet
            const backSide = sheet.querySelector('.side.back');
            setTimeout(() => triggerTypewriter(backSide), 600);

            // Trigger typewriter for the front of the next sheet
            if (currentSheet + 1 < sheets.length) {
                const nextFrontSide = sheets[currentSheet + 1].querySelector('.side.front');
                setTimeout(() => triggerTypewriter(nextFrontSide), 600);
            }

            currentSheet++;
        }
    };

    const handleDesktopPrev = () => {
        if (currentSheet > 0) {
            currentSheet--;
            const sheet = sheets[currentSheet];
            sheet.classList.remove('flipped');
            sheet.style.zIndex = sheets.length - currentSheet;
            if (currentSheet === 0) {
                book.classList.remove('open');
            } else {
                book.classList.add('open');
                book.style.transform = 'translateX(0%)';
            }

            // Trigger typewriter for the front of the flipped-back sheet
            const frontSide = sheet.querySelector('.side.front');
            setTimeout(() => triggerTypewriter(frontSide), 600);

            // Trigger typewriter for the back of the previous sheet
            if (currentSheet > 0) {
                const prevBackSide = sheets[currentSheet - 1].querySelector('.side.back');
                setTimeout(() => triggerTypewriter(prevBackSide), 600);
            }
        }
    };

    nextBtn.addEventListener('click', turnPageNext);
    prevBtn.addEventListener('click', turnPagePrev);

    function updateButtons() {
        let isStart, isEnd;
        if (isMobile) {
            isStart = (currentSlideIndex === 0);
            isEnd = (currentSlideIndex === mobileSlides.length - 1);
        } else {
            isStart = (currentSheet === 0);
            isEnd = (currentSheet === sheets.length);
        }
        prevBtn.classList.toggle('hidden', isStart);
        nextBtn.classList.toggle('hidden', isEnd);
    }

    // --- HEART PARTICLES (RISING) ---
    function createHearts() {
        setInterval(() => {
            if (document.hidden) return;
            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            heart.innerHTML = ['❤️', '💖', '💗', '💕', '💘', '🌸'][Math.floor(Math.random() * 6)];

            // Spawn from bottom corners
            const isLeft = Math.random() > 0.5;
            const xPos = isLeft ? Math.random() * 20 : 80 + Math.random() * 19;

            heart.style.left = xPos + 'vw';
            const duration = Math.random() * 2 + 4;
            heart.style.setProperty('--duration', duration + 's');
            heart.style.fontSize = (Math.random() * 10 + 20) + 'px';

            heartsContainer.appendChild(heart);
            setTimeout(() => heart.remove(), duration * 1000);
        }, 400);
    }

    // --- TYPEWRITER ---
    const typeTimeouts = new Map();
    const typingSpeed = 50;

    function triggerTypewriter(pageElement) {
        if (!pageElement) return;
        const textElement = pageElement.querySelector('.typewriter-text');
        if (!textElement) return;

        // Cancel any ongoing typing for this element
        if (typeTimeouts.has(textElement)) {
            clearTimeout(typeTimeouts.get(textElement));
        }

        const fullText = textElement.getAttribute('data-text');
        // Clear immediately so it does not show all at once
        textElement.innerHTML = '';

        const timeoutId = setTimeout(() => {
            typeWriter(textElement, fullText, 0);
        }, 600);
        typeTimeouts.set(textElement, timeoutId);
    }

    function typeWriter(element, text, i) {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            const timeoutId = setTimeout(() => typeWriter(element, text, i + 1), typingSpeed);
            typeTimeouts.set(element, timeoutId);
        }
    }

    // --- PETALS ---
    function createPetals() {
        const petalCount = 15;
        for (let i = 0; i < petalCount; i++) {
            setTimeout(createSinglePetal, Math.random() * 3000);
        }
    }

    function createSinglePetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        const size = Math.random() * 10 + 8;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.animationDuration = `${Math.random() * 5 + 5}s`;

        const container = document.getElementById('falling-elements');
        if (container) {
            container.appendChild(petal);
            setTimeout(() => {
                petal.remove();
                createSinglePetal();
            }, 10000);
        }
    }
});

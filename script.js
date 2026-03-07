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
    let isBackVisible = false;
    const isMobile = window.innerWidth <= 768;

    // --- INITIALIZATION ---
    introScreen.addEventListener('click', () => {
        introScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');

        bgMusic.volume = 0.4;
        bgMusic.play().catch(e => console.log("Audio autoplay prevented"));

        createPetals();
        createHearts();
        initPages();
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
        if (currentSheet >= sheets.length) return;

        const sheet = sheets[currentSheet];
        if (!isBackVisible) {
            // Step 1: Flip current card to show BACK
            sheet.classList.add('flipped');
            sheet.style.transform = 'rotateY(-180deg)';
            isBackVisible = true;
            // Reveal back side text if any
            const backSide = sheet.querySelector('.side.back');
            setTimeout(() => triggerTypewriter(backSide), 600);
        } else {
            // Step 2: Push card away to show NEXT FRONT
            sheet.classList.add('exit');
            currentSheet++;
            isBackVisible = false;
            if (currentSheet < sheets.length) {
                const nextFront = sheets[currentSheet].querySelector('.side.front');
                setTimeout(() => triggerTypewriter(nextFront), 600);
            }
        }
    };

    const handleDesktopNext = () => {
        if (currentSheet < sheets.length) {
            if (currentSheet === 0) book.classList.add('open');
            const sheet = sheets[currentSheet];
            sheet.classList.add('flipped');
            setTimeout(() => {
                sheet.style.zIndex = 20 + currentSheet;
            }, 600);
            currentSheet++;
            if (currentSheet < sheets.length) {
                triggerTypewriter(sheets[currentSheet].querySelector('.side.front'));
            } else {
                book.classList.remove('open');
                book.style.transform = 'translateX(100%)';
            }
        }
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
        if (currentSheet === 0 && !isBackVisible) return;

        if (isBackVisible) {
            // Flip back to show front
            const sheet = sheets[currentSheet];
            sheet.classList.remove('flipped');
            sheet.style.transform = 'rotateY(0deg)';
            isBackVisible = false;
        } else {
            // Bring back previous sheet from exit
            currentSheet--;
            const sheet = sheets[currentSheet];
            sheet.classList.remove('exit');
            isBackVisible = true;
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
        }
    };

    nextBtn.addEventListener('click', turnPageNext);
    prevBtn.addEventListener('click', turnPagePrev);

    function updateButtons() {
        let isStart, isEnd;
        if (isMobile) {
            isStart = (currentSheet === 0 && !isBackVisible);
            isEnd = (currentSheet === sheets.length);
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
    const typedElements = new Set();
    const typingSpeed = 50;

    function triggerTypewriter(pageElement) {
        if (!pageElement) return;
        const textElement = pageElement.querySelector('.typewriter-text');
        if (!textElement) return;
        if (typedElements.has(textElement)) return;

        typedElements.add(textElement);
        const fullText = textElement.getAttribute('data-text');
        textElement.innerHTML = '';

        setTimeout(() => {
            typeWriter(textElement, fullText, 0);
        }, 800);
    }

    function typeWriter(element, text, i) {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(() => typeWriter(element, text, i), typingSpeed);
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

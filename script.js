document.addEventListener('DOMContentLoaded', () => {
    // --- INTRO & MUSIC ---
    const introScreen = document.getElementById('intro-screen');
    const mainScreen = document.getElementById('main-screen');
    const bgMusic = document.getElementById('bg-music');
    const fallingElementsContainer = document.getElementById('falling-elements');

    introScreen.addEventListener('click', () => {
        introScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');

        bgMusic.volume = 0.4;
        bgMusic.play().catch(e => console.log("Audio autoplay prevented"));

        createPetals();

        // Z-index initialization for pages
        initPages();
    });

    // --- FLIPBOOK LOGIC ---
    const book = document.querySelector('.book');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const sheets = document.querySelectorAll('.sheet');
    const heartsContainer = document.getElementById('hearts-container');

    let currentSheet = 0;
    const isMobile = window.innerWidth <= 768;

    function initPages() {
        sheets.forEach((sheet, index) => {
            sheet.style.zIndex = sheets.length - index;
        });
        createHearts();
    }

    const turnPageNext = () => {
        if (currentSheet < sheets.length) {
            if (currentSheet === 0 && !isMobile) book.classList.add('open');

            const sheet = sheets[currentSheet];
            sheet.classList.add('flipped');

            setTimeout(() => {
                sheet.style.zIndex = 20 + currentSheet;
            }, 600);

            currentSheet++;

            if (currentSheet < sheets.length) {
                const nextSheet = sheets[currentSheet];
                // Mobile: reveal sheet front, Desktop: reveal spread
                triggerTypewriter(nextSheet.querySelector('.side.front'));
            } else {
                if (!isMobile) {
                    book.classList.remove('open');
                    book.style.transform = 'translateX(100%)';
                }
            }
        }
        updateButtons();
    };

    const turnPagePrev = () => {
        if (currentSheet > 0) {
            currentSheet--;
            const sheet = sheets[currentSheet];
            sheet.classList.remove('flipped');

            sheet.style.zIndex = sheets.length - currentSheet;

            if (currentSheet === 0) {
                book.classList.remove('open');
            } else {
                if (!isMobile) {
                    book.classList.add('open');
                    book.style.transform = 'translateX(0%)';
                }
            }
        }
        updateButtons();
    };

    nextBtn.addEventListener('click', turnPageNext);
    prevBtn.addEventListener('click', turnPagePrev);

    function updateButtons() {
        if (currentSheet === 0) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }

        if (currentSheet === sheets.length) {
            nextBtn.classList.add('hidden');
        } else {
            nextBtn.classList.remove('hidden');
        }
    }

    // --- HEARTS PARTICLES ---
    function createHearts() {
        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            heart.innerHTML = ['❤️', '💖', '💗', '💕', '💘'][Math.floor(Math.random() * 5)];

            const side = Math.random() > 0.5 ? 'left' : 'right';
            const xPos = side === 'left' ? Math.random() * 20 : 80 + Math.random() * 20;

            heart.style.left = xPos + 'vw';
            const duration = Math.random() * 3 + 4;
            heart.style.setProperty('--duration', duration + 's');
            heart.style.fontSize = (Math.random() * 10 + 20) + 'px';

            heartsContainer.appendChild(heart);

            setTimeout(() => heart.remove(), duration * 1000);
        }, 500);
    }

    // --- TYPEWRITER LOGIC ---
    // Only type when page is revealed
    const typedElements = new Set();
    const typingSpeed = 50;

    function triggerTypewriter(pageElement) {
        if (!pageElement) return;
        const textElement = pageElement.querySelector('.typewriter-text');
        if (!textElement) return;

        // Prevent re-typing if already typed
        if (typedElements.has(textElement)) return;
        typedElements.add(textElement);

        const fullText = textElement.getAttribute('data-text');
        textElement.innerHTML = '';

        // Delay typing until page turn animation finishes (approx 1s)
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

    // --- FALLING PETALS ---
    function createPetals() {
        const petalCount = 20;
        for (let i = 0; i < petalCount; i++) {
            setTimeout(createSinglePetal, Math.random() * 3000);
        }
    }

    function createSinglePetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        const size = Math.random() * 12 + 8;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.animationDuration = `${Math.random() * 4 + 4}s`;
        petal.style.opacity = Math.random() * 0.4 + 0.2;

        fallingElementsContainer.appendChild(petal);
        setTimeout(() => {
            if (document.body.contains(petal)) petal.remove();
            createSinglePetal();
        }, 8000);
    }
});

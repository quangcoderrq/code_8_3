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
    }

    // --- TURN LOGIC ---
    const turnPageNext = () => {
        if (currentSheet < sheets.length) {
            // Deskto-only translation logic
            if (currentSheet === 0 && !isMobile) book.classList.add('open');

            const sheet = sheets[currentSheet];
            sheet.classList.add('flipped');

            // Adjust z-index after flip to stack correctly
            setTimeout(() => {
                sheet.style.zIndex = 20 + currentSheet;
            }, isMobile ? 300 : 600); // Faster z-index swap on mobile to avoid covering

            // On mobile, trigger typewriter for the BACK of the sheet that just flipped
            if (isMobile) {
                const backSide = sheet.querySelector('.side.back');
                if (backSide && backSide.classList.contains('text-page')) {
                    // Longer delay on mobile to wait for full 180deg flip
                    setTimeout(() => triggerTypewriter(backSide), 400);
                }
            }

            currentSheet++;

            // Trigger typewriter for the next side becoming visible
            if (currentSheet < sheets.length) {
                const nextSheet = sheets[currentSheet];
                // Desktop: reveal spread (right page is front). Mobile: next card is front.
                const delay = isMobile ? 1000 : 800;
                setTimeout(() => triggerTypewriter(nextSheet.querySelector('.side.front')), delay);
            } else if (!isMobile) {
                // End spread
                book.classList.remove('open');
                book.style.transform = 'translateX(100%)';
            }
        }
        updateButtons();
    };

    const turnPagePrev = () => {
        if (currentSheet > 0) {
            currentSheet--;
            const sheet = sheets[currentSheet];
            sheet.classList.remove('flipped');

            // Revert z-index back to stack on the right
            sheet.style.zIndex = sheets.length - currentSheet;

            if (currentSheet === 0) {
                if (!isMobile) book.classList.remove('open');
            } else if (!isMobile) {
                book.classList.add('open');
                book.style.transform = 'translateX(0%)';
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

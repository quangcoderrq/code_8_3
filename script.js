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

    // Each "turn" consists of 2 .page divs (a front and a back). 
    // HTML structure has pairs: p1(front), p2/p3(back/front), p4/p5(back/front), p6/p7(back/front)
    // We treat pairs of pages as "spreads" to flip together.

    // Setup pairing for realistic page turns.
    // The visual index is 0 (cover), 1 (spread 1), ...
    let currentSpread = 0;

    // Group pages into spreads.
    // spread 0: page-1 (front cover)
    // spread 1: page-2 (back of cover), page-3 (first text)
    // spread 2: page-4 (img 2), page-5 (text 2)
    // spread 3: page-6 (inner back cover), page-7 (outer back cover)
    const pages = document.querySelectorAll('.page');
    // Important: To stack correctly, lower numerical spreads need higher z-index when closed.
    function initPages() {
        pages.forEach((page, index) => {
            // Give z-index based on DOM order so page 1 is on top.
            page.style.zIndex = pages.length - index;
        });
    }

    // Since we modeled front/back separately, flipping spread N means:
    // we take the FRONT page of spread N, and the BACK page of spread N+1, and rotate them.
    // But for simpler CSS, we just rotate the Right page (front) and Left page (back) simultaneously.

    const turnPageNext = () => {
        if (currentSpread === 0) {
            // Opening book
            book.classList.add('open');
            // Flip page 1 (cover) to left
            document.getElementById('page-1').classList.add('flipped');
            // Reveal page 2 (back) by bringing it to front
            document.getElementById('page-2').style.zIndex = 100; // Bring flipped to top temporarily

            triggerTypewriter(document.getElementById('page-3'));
            currentSpread++;
        }
        else if (currentSpread === 1) {
            // Flip page 2 and 3 to left
            document.getElementById('page-2').classList.add('flipped');
            document.getElementById('page-3').classList.add('flipped');
            document.getElementById('page-4').style.zIndex = 99;

            triggerTypewriter(document.getElementById('page-5'));
            currentSpread++;
        }
        else if (currentSpread === 2) {
            // Flip page 4 and 5 to left
            document.getElementById('page-4').classList.add('flipped');
            document.getElementById('page-5').classList.add('flipped');
            document.getElementById('page-6').style.zIndex = 98;

            // Reaching end
            book.classList.remove('open');
            book.style.transform = 'translateX(100%)'; // Move book fully to left
            currentSpread++;
        }
        updateButtons();
    };

    const turnPagePrev = () => {
        if (currentSpread === 3) {
            // From end back to spread 2
            book.classList.add('open');
            book.style.transform = 'translateX(0%)';
            document.getElementById('page-4').classList.remove('flipped');
            document.getElementById('page-5').classList.remove('flipped');
            currentSpread--;
        }
        else if (currentSpread === 2) {
            document.getElementById('page-2').classList.remove('flipped');
            document.getElementById('page-3').classList.remove('flipped');
            currentSpread--;
        }
        else if (currentSpread === 1) {
            // Closing book
            book.classList.remove('open');
            document.getElementById('page-1').classList.remove('flipped');
            currentSpread--;
        }
        updateButtons();
    };

    nextBtn.addEventListener('click', turnPageNext);
    prevBtn.addEventListener('click', turnPagePrev);

    function updateButtons() {
        if (currentSpread === 0) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }

        if (currentSpread === 3) {
            nextBtn.classList.add('hidden');
        } else {
            nextBtn.classList.remove('hidden');
        }
    }


    // --- TYPEWRITER LOGIC ---
    // Only type when page is revealed
    const typedElements = new Set();
    const typingSpeed = 50;

    function triggerTypewriter(pageElement) {
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
        }, 1000);
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
        const petalCount = 30;
        for (let i = 0; i < petalCount; i++) {
            setTimeout(createSinglePetal, Math.random() * 3000);
        }
    }

    function createSinglePetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        const size = Math.random() * 15 + 10;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.animationDuration = `${Math.random() * 4 + 4}s`;
        petal.style.opacity = Math.random() * 0.5 + 0.3;

        fallingElementsContainer.appendChild(petal);
        setTimeout(() => {
            if (document.body.contains(petal)) petal.remove();
            createSinglePetal();
        }, 8000);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.getElementById('intro-screen');
    const mainScreen = document.getElementById('main-screen');
    const typewriterText = document.getElementById('typewriter-text');
    const bgMusic = document.getElementById('bg-music');
    const fallingElementsContainer = document.getElementById('falling-elements');

    // Mẫu lời chúc
    const message = "Nhân ngày Quốc tế Phụ nữ 8/3, chúc một nửa thế giới luôn xinh đẹp, rạng rỡ và ngập tràn hạnh phúc. Mỗi ngày của bạn đều là một ngày đặc biệt. Cảm ơn vì đã luôn mang đến tình yêu và sự ấm áp cho thế giới này!";
    
    // Config typing speed
    const typingSpeed = 60; // ms per character

    introScreen.addEventListener('click', () => {
        // 1. Ẩn màn hình Intro, hiện màn hình Main
        introScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');

        // 2. Play music 
        bgMusic.volume = 0.5;
        bgMusic.play().catch(e => console.log("Audio autoplay was prevented. User might need to interact again."));

        // 3. Chạy hiệu ứng đánh chữ
        setTimeout(() => {
            typeWriter(message, 0);
        }, 1200); // Đợi chuyển cảnh xong mới đánh chữ

        // 4. Bắt đầu tạo mưa cánh hoa
        createPetals();
    });

    function typeWriter(text, i) {
        if (i < text.length) {
            typewriterText.innerHTML += text.charAt(i);
            i++;
            setTimeout(() => typeWriter(text, i), typingSpeed);
        }
    }

    function createPetals() {
        const petalCount = 35;
        for (let i = 0; i < petalCount; i++) {
            setTimeout(createSinglePetal, Math.random() * 3000);
        }
    }

    function createSinglePetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Random thuộc tính cho cánh hoa
        const size = Math.random() * 15 + 10; // 10px - 25px
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.animationDuration = `${Math.random() * 4 + 4}s`; // 4s - 8s
        petal.style.opacity = Math.random() * 0.5 + 0.3;

        fallingElementsContainer.appendChild(petal);

        // Xóa cánh hoa sau khi rơi xong để tối ưu dung lượng
        setTimeout(() => {
            if(document.body.contains(petal)) {
                petal.remove();
            }
            createSinglePetal(); // Luôn duy trì số lượng cánh hoa
        }, 8000);
    }
});

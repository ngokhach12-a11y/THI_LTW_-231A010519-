/* --- PHẦN 1: LOGIC CHUNG (HEADER, FOOTER) --- */

// 1. Footer Copyright (Tự động lấy năm hiện tại)
const footer = document.querySelector('footer p');
if(footer) {
    footer.innerHTML = `&copy; ${new Date().getFullYear()} Cao Lê Hữu Trí.`;
    // Thêm link guide vào nếu chưa có
    const guideLink = document.createElement('a');
    guideLink.href = 'hosting_guide.txt';
    guideLink.textContent = ' | Hướng dẫn Hosting';
    guideLink.style.color = 'inherit';
    footer.appendChild(guideLink);
}

// 2. Scroll Header
const header = document.getElementById('site-header') || document.querySelector('.main-header');
if (header) {
    window.addEventListener('scroll', () => {
        window.scrollY > 50 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
    });
}

/* --- PHẦN 2: LOGIC BÀI 01 & 02 (GIỮ LẠI CŨ) --- */
// Gallery Bài 01
function changeImage(thumb) {
    const mainImg = document.getElementById('current-img');
    if (mainImg) {
        mainImg.src = thumb.src;
        document.querySelectorAll('.thumb').forEach(img => img.classList.remove('active'));
        thumb.classList.add('active');
    }
}

// Game Bài 02
function checkGuess() {
    // (Logic cũ của bạn - nếu cần thì copy lại vào đây, mình tóm tắt)
    const guess = document.getElementById('guessInput')?.value;
    const msg = document.getElementById('message');
    if(msg) msg.textContent = "Tính năng game đã được lưu ở version cũ.";
}

/* --- PHẦN 3: MUSIC PLAYER (BÀI 03) - LOGIC MỚI --- */
// Kiểm tra xem có đang ở trang Music Player không
if (document.querySelector('.music-container')) {
    const musicContainer = document.querySelector('.player');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const audio = document.getElementById('audio');
    const progress = document.getElementById('progress');
    const progressContainer = document.getElementById('progress-container');
    const title = document.getElementById('title');
    const cover = document.getElementById('cover');
    const playlistEl = document.getElementById('playlist-items');
    
  // Mảng bài hát yêu thích của tôi
    const songs = [
        { 
            name: "Nonstop Vinahouse 2025", 
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
        },
        { 
            name: "Remix Hot TikTok Trend", 
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" 
        },
        { 
            name: "Việt Mix Sôi Động", 
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" 
        }
    ];

    let songIndex = 0;

    // Khởi tạo bài hát
    function loadSong(song) {
        title.innerText = song.name;
        audio.src = song.src;
        // Logic: Highlight playlist
        updatePlaylistHighlight();
    }

    function playSong() {
        musicContainer.classList.add('play');
        playBtn.querySelector('i').classList.remove('fa-play');
        playBtn.querySelector('i').classList.add('fa-pause');
        audio.play();
    }

    function pauseSong() {
        musicContainer.classList.remove('play');
        playBtn.querySelector('i').classList.add('fa-play');
        playBtn.querySelector('i').classList.remove('fa-pause');
        audio.pause();
    }

    // Sự kiện Click Play
    playBtn.addEventListener('click', () => {
        const isPlaying = musicContainer.classList.contains('play');
        isPlaying ? pauseSong() : playSong();
    });

    // Next / Prev Song
    function prevSong() {
        songIndex--;
        if (songIndex < 0) songIndex = songs.length - 1;
        loadSong(songs[songIndex]);
        playSong();
    }

    function nextSong() {
        songIndex++;
        if (songIndex > songs.length - 1) songIndex = 0;
        loadSong(songs[songIndex]);
        playSong();
    }

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    // Thanh tiến trình (Time Update)
    audio.addEventListener('timeupdate', (e) => {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
    });

    // Tua nhạc (Click progress bar)
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });

    // Tự chuyển bài khi hết
    audio.addEventListener('ended', nextSong);

    // Tạo danh sách phát
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerText = song.name;
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
        });
        playlistEl.appendChild(li);
    });

    function updatePlaylistHighlight() {
        const items = playlistEl.querySelectorAll('li');
        items.forEach((item, index) => {
            if(index === songIndex) item.classList.add('active-song');
            else item.classList.remove('active-song');
        });
    }

    // Load bài đầu tiên
    loadSong(songs[songIndex]);
}

/* --- PHẦN 4: ABOUT PAGE (SỞ THÍCH & PROMPT) --- */
const hobbyList = document.getElementById('hobby-list');
if (hobbyList) {
    const aboutSection = document.getElementById('about-section');
    hobbyList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            // Thay đổi màu nền
            aboutSection.style.backgroundColor = '#dff9fb';
            // Prompt nhập liệu
            const userResponse = prompt("Bạn nghĩ gì về sở thích: " + e.target.innerText + "?");
            if (userResponse) {
                alert(`Mô tả: ${e.target.dataset.desc}\nÝ kiến của bạn: ${userResponse}`);
            }
        }
    });
}

/* --- PHẦN 5: CONTACT PAGE (VALIDATION & LOCALSTORAGE) --- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('c-name').value;
        const email = document.getElementById('c-email').value;
        const message = document.getElementById('c-message').value;

        // Validation Email đơn giản
        if (!email.includes('@')) {
            alert('Email không hợp lệ!');
            return;
        }

        // Lưu LocalStorage
        const contactData = { name, email, message, date: new Date().toString() };
        localStorage.setItem('lastContact', JSON.stringify(contactData));

        if (confirm(`Cảm ơn ${name}. Bạn có chắc chắn muốn gửi tin nhắn này không?`)) {
            alert("Gửi thành công! Chúng tôi đã lưu thông tin.");
            contactForm.reset();
        }
    });
}

/* --- PHẦN 6: TRẮC NGHIỆM (QUIZ) --- */
function checkQuiz() {
    let score = 0;
    // Giả sử câu hỏi HTML có name="q1", CSS có name="q2"...
    const q1 = document.querySelector('input[name="q1"]:checked');
    if (q1 && q1.value === 'dung') score++;
    
    const resultBox = document.getElementById('quiz-result');
    if (resultBox) resultBox.innerText = `Bạn đã đúng: ${score} câu.`;
}

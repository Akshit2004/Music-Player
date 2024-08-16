document.addEventListener('DOMContentLoaded', () => {
    const albumItems = document.querySelectorAll('.album-item');
    const recommendedItems = document.querySelectorAll('.recommended-item');
    const carouselItems = document.querySelectorAll('.carousel-item');

    const allItems = [...albumItems, ...recommendedItems, ...carouselItems];

    const audioPlayer = document.getElementById('audio-player');
    const playPauseButton = document.getElementById('play-pause');
    const progressBar = document.getElementById('progress-bar');
    const progressRange = document.getElementById('progress-range');
    const bottomPlayerSongTitle = document.getElementById('bottom-player-song-title');
    const bottomPlayerArtistName = document.getElementById('bottom-player-artist-name');
    const bottomPlayerAlbumCover = document.getElementById('bottom-player-album-cover');

    let isPlaying = false;

    allItems.forEach(item => {
        const playButton = item.querySelector('.play-button');
        const likeButton = item.querySelector('.like-button');

        playButton.addEventListener('click', () => {
            const songTitle = item.querySelector('p').innerText;
            const albumCover = item.querySelector('img').src;
            const audioSource = item.getAttribute('data-audio-src');
            const artistName = item.querySelectorAll('p')[1].innerText;

            if (!audioSource) {
                console.error('Audio source is missing for this item.');
                return;
            }

            audioPlayer.src = audioSource;
            bottomPlayerSongTitle.innerText = songTitle;
            bottomPlayerArtistName.innerText = artistName;
            bottomPlayerAlbumCover.src = albumCover;

            audioPlayer.load();
            audioPlayer.play().catch(error => {
                console.error('Error playing audio:', error);
            });

            isPlaying = true;
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        });

        likeButton.addEventListener('click', () => {
            likeButton.classList.toggle('liked');
            if (likeButton.classList.contains('liked')) {
                likeButton.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                likeButton.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    });

    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progress}%`;
        progressRange.value = progress;
    });

    progressRange.addEventListener('input', (e) => {
        const seekTime = (e.target.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    playPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            audioPlayer.pause();
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audioPlayer.play().catch(error => {
                console.error('Error playing audio:', error);
            });
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });

    // Add search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        allItems.forEach(item => {
            const title = item.querySelector('p').textContent.toLowerCase();
            if (title.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    // Theme toggle functionality
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    const body = document.body;

    // Check the saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggleCheckbox.checked = true;
    } else {
        body.classList.remove('light-mode');
        themeToggleCheckbox.checked = false;
    }

    themeToggleCheckbox.addEventListener('change', () => {
        if (themeToggleCheckbox.checked) {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Add functionality to "Start Listening" button
    const startListeningButton = document.querySelector('.cta-button');
    startListeningButton.addEventListener('click', () => {
        const firstCarouselItem = carouselItems[0];
        if (firstCarouselItem) {
            const songTitle = firstCarouselItem.querySelector('p').innerText;
            const albumCover = firstCarouselItem.querySelector('img').src;
            const audioSource = firstCarouselItem.getAttribute('data-audio-src');
            const artistName = firstCarouselItem.querySelectorAll('p')[1].innerText;

            if (!audioSource) {
                console.error('Audio source is missing for this item.');
                return;
            }

            audioPlayer.src = audioSource;
            bottomPlayerSongTitle.innerText = songTitle;
            bottomPlayerArtistName.innerText = artistName;
            bottomPlayerAlbumCover.src = albumCover;

            audioPlayer.load();
            audioPlayer.play().catch(error => {
                console.error('Error playing audio:', error);
            });

            isPlaying = true;
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        }
    });
});
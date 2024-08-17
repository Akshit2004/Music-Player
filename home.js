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
    const musicPlayer = document.getElementById('music-player');
    const queueToggleButton = document.getElementById('queue-toggle');
    const queueModal = document.getElementById('queue-modal');
    const queueList = document.getElementById('queue-list');

    let isPlaying = false;
    let queue = [];

    function addToQueue(song) {
        queue.push(song);
        updateQueueList();
        if (queue.length === 1 && !isPlaying) {
            playNextInQueue();
        }
    }

    function playNextInQueue() {
        if (queue.length === 0) {
            musicPlayer.classList.add('hidden');
            return;
        }

        const nextSong = queue.shift();
        audioPlayer.src = nextSong.audioSource;
        bottomPlayerSongTitle.innerText = nextSong.songTitle;
        bottomPlayerArtistName.innerText = nextSong.artistName;
        bottomPlayerAlbumCover.src = nextSong.albumCover;

        audioPlayer.load();
        audioPlayer.play().catch(error => {
            console.error('Error playing audio:', error);
        });

        isPlaying = true;
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        musicPlayer.classList.remove('hidden');
        updateQueueList();
    }

    function updateQueueList() {
        queueList.innerHTML = '';
        queue.forEach((song, index) => {
            const listItem = document.createElement('li');
            const text = document.createElement('span');
            text.innerText = `${index + 1}. ${song.songTitle} - ${song.artistName}`;
            listItem.appendChild(text);
            queueList.appendChild(listItem);
        });
    }

    queueToggleButton.addEventListener('click', () => {
        queueModal.classList.toggle('hidden');
        queueModal.style.display = queueModal.classList.contains('hidden') ? 'none' : 'block';
    });

    allItems.forEach(item => {
        const playButton = item.querySelector('.play-button');
        const likeButton = item.querySelector('.like-button');
        const addToQueueButton = item.querySelector('.add-to-queue-button');

        playButton.addEventListener('click', () => {
            const songTitle = item.querySelector('p').innerText;
            const albumCover = item.querySelector('img').src;
            const audioSource = item.getAttribute('data-audio-src');
            const artistName = item.querySelectorAll('p')[1].innerText;

            if (!audioSource) {
                console.error('Audio source is missing for this item.');
                return;
            }

            const song = {
                songTitle,
                albumCover,
                audioSource,
                artistName
            };

            queue.unshift(song);
            playNextInQueue();
        });

        likeButton.addEventListener('click', () => {
            likeButton.classList.toggle('liked');
            if (likeButton.classList.contains('liked')) {
                // Handle like action
            } else {
                // Handle unlike action
            }
        });

        addToQueueButton.addEventListener('click', () => {
            const songTitle = item.querySelector('p').innerText;
            const albumCover = item.querySelector('img').src;
            const audioSource = item.getAttribute('data-audio-src');
            const artistName = item.querySelectorAll('p')[1].innerText;

            if (!audioSource) {
                console.error('Audio source is missing for this item.');
                return;
            }

            const song = {
                songTitle,
                albumCover,
                audioSource,
                artistName
            };

            addToQueue(song);
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

    audioPlayer.addEventListener('ended', playNextInQueue);

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

    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    const body = document.body;

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

            const song = {
                songTitle,
                albumCover,
                audioSource,
                artistName
            };

            addToQueue(song);
        }
    });
});

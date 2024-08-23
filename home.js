document.addEventListener('DOMContentLoaded', () => {
    // Element selections
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
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button, .search-button');
    const startListeningButton = document.querySelector('.cta-button');

    // State variables
    let isPlaying = false;
    let queue = [];
    let currentSongIndex = -1;

    // Functions
    function addToQueue(song) {
        queue.push(song);
        updateQueueList();
        if (queue.length === 1 && !isPlaying) {
            currentSongIndex = 0;
            playSongAtIndex(currentSongIndex);
        }
    }

    function playSongAtIndex(index) {
        if (index < 0 || index >= queue.length) return;
        
        const song = queue[index];
        audioPlayer.src = song.audioSource;
        bottomPlayerSongTitle.textContent = song.songTitle;
        bottomPlayerArtistName.textContent = song.artistName;
        bottomPlayerAlbumCover.src = song.albumCover;

        audioPlayer.load();
        audioPlayer.play().catch(error => {
            console.error('Error playing audio:', error);
        });

        isPlaying = true;
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        musicPlayer.classList.remove('hidden');
    }

    function playNextSong() {
        if (queue.length === 0) return;
        currentSongIndex = (currentSongIndex + 1) % queue.length;
        playSongAtIndex(currentSongIndex);
    }

    function playPreviousSong() {
        if (queue.length === 0) return;
        currentSongIndex = (currentSongIndex - 1 + queue.length) % queue.length;
        playSongAtIndex(currentSongIndex);
    }

    function updateQueueList() {
        queueList.innerHTML = '';
        queue.forEach((song, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${song.songTitle} - ${song.artistName}`;
            queueList.appendChild(listItem);
        });
    }

    function togglePlayPause() {
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
    }

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        console.log('Performing search with query:', query);

        let matchCount = 0;
        allItems.forEach(item => {
            const title = item.querySelector('p').textContent.toLowerCase();
            const artist = item.querySelectorAll('p')[1]?.textContent.toLowerCase() || '';
            const isMatch = title.includes(query) || artist.includes(query);
            item.style.display = isMatch || query === '' ? 'inline-block' : 'none';
            if (isMatch) matchCount++;
        });
        console.log(`Found ${matchCount} matches`);
    }

    // Event Listeners
    allItems.forEach(item => {
        const playButton = item.querySelector('.play-button');
        const likeButton = item.querySelector('.like-button');
        const addToQueueButton = item.querySelector('.add-to-queue-button');

        if (playButton) {
            playButton.addEventListener('click', () => {
                const songTitle = item.querySelector('p').textContent;
                const albumCover = item.querySelector('img').src;
                const audioSource = item.getAttribute('data-audio-src');
                const artistName = item.querySelectorAll('p')[1].textContent;

                if (!audioSource) {
                    console.error('Audio source is missing for this item.');
                    return;
                }

                const song = { songTitle, albumCover, audioSource, artistName };
                queue.unshift(song);
                currentSongIndex = 0;
                playSongAtIndex(currentSongIndex);
            });
        }

        if (likeButton) {
            likeButton.addEventListener('click', () => {
                likeButton.classList.toggle('liked');
                // Handle like/unlike action
            });
        }

        if (addToQueueButton) {
            addToQueueButton.addEventListener('click', () => {
                const songTitle = item.querySelector('p').textContent;
                const albumCover = item.querySelector('img').src;
                const audioSource = item.getAttribute('data-audio-src');
                const artistName = item.querySelectorAll('p')[1].textContent;

                if (!audioSource) {
                    console.error('Audio source is missing for this item.');
                    return;
                }

                const song = { songTitle, albumCover, audioSource, artistName };
                addToQueue(song);
            });
        }
    });

    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', () => {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressRange) progressRange.value = progress;
        });

        audioPlayer.addEventListener('ended', playNextSong);
    }

    if (progressRange) {
        progressRange.addEventListener('input', (e) => {
            const seekTime = (e.target.value / 100) * audioPlayer.duration;
            audioPlayer.currentTime = seekTime;
        });
    }

    if (playPauseButton) {
        playPauseButton.addEventListener('click', togglePlayPause);
    }

    if (nextButton) {
        nextButton.addEventListener('click', playNextSong);
    }

    if (prevButton) {
        prevButton.addEventListener('click', playPreviousSong);
    }

    if (searchButton) {
        searchButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent form submission if it's in a form
            console.log('Search button clicked');
            performSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission
                performSearch();
            }
        });
    }

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
        });
    }

    if (queueToggleButton && queueModal) {
        queueToggleButton.addEventListener('click', () => {
            queueModal.classList.toggle('hidden');
            queueModal.style.display = queueModal.classList.contains('hidden') ? 'none' : 'block';
        });
    }

    if (startListeningButton) {
        startListeningButton.addEventListener('click', () => {
            const firstCarouselItem = carouselItems[0];
            if (firstCarouselItem) {
                const songTitle = firstCarouselItem.querySelector('p').textContent;
                const albumCover = firstCarouselItem.querySelector('img').src;
                const audioSource = firstCarouselItem.getAttribute('data-audio-src');
                const artistName = firstCarouselItem.querySelectorAll('p')[1].textContent;

                if (!audioSource) {
                    console.error('Audio source is missing for this item.');
                    return;
                }

                const song = { songTitle, albumCover, audioSource, artistName };
                addToQueue(song);
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effect to album, recommended, and carousel items
    const albumItems = document.querySelectorAll('.album-item');
    const recommendedItems = document.querySelectorAll('.recommended-item');
    const carouselItems = document.querySelectorAll('.carousel-item');

    const allItems = [...albumItems, ...recommendedItems, ...carouselItems];

    allItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            item.style.transform = 'scale(1.05)';
            item.style.transition = 'transform 0.3s';
        });

        item.addEventListener('mouseout', () => {
            item.style.transform = 'scale(1)';
        });

        item.addEventListener('click', () => {
            const songTitle = item.querySelector('p').innerText;
            const albumCover = item.querySelector('img').src;
            const audioSource = item.getAttribute('data-audio-src');
            const artistName = "Unknown Artist"; // Update this if you have artist information

            console.log(`Playing song: ${songTitle}`);
            console.log(`Audio source: ${audioSource}`);

            if (!audioSource) {
                console.error('Audio source is missing for this item.');
                return;
            }

            const bottomPlayerAudio = document.getElementById('bottom-player-audio');
            const bottomPlayerSongTitle = document.getElementById('bottom-player-song-title');
            const bottomPlayerArtistName = document.getElementById('bottom-player-artist-name');
            const bottomPlayerAlbumCover = document.getElementById('bottom-player-album-cover');

            bottomPlayerAudio.src = audioSource;
            bottomPlayerSongTitle.innerText = songTitle;
            bottomPlayerArtistName.innerText = artistName;
            bottomPlayerAlbumCover.src = albumCover;

            bottomPlayerAudio.load(); // Ensure the new source is loaded
            bottomPlayerAudio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        });
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
});
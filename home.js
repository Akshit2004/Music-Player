document.addEventListener('DOMContentLoaded', () => {
    // Add hover effect to album and recommended items
    const albumItems = document.querySelectorAll('.album-item');
    const recommendedItems = document.querySelectorAll('.recommended-item');

    albumItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            item.style.transform = 'scale(1.05)';
            item.style.transition = 'transform 0.3s';
        });

        item.addEventListener('mouseout', () => {
            item.style.transform = 'scale(1)';
        });

        item.addEventListener('click', () => {
            alert(`You clicked on ${item.querySelector('p').textContent}`);
        });
    });

    recommendedItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            item.style.transform = 'scale(1.05)';
            item.style.transition = 'transform 0.3s';
        });

        item.addEventListener('mouseout', () => {
            item.style.transform = 'scale(1)';
        });

        item.addEventListener('click', () => {
            alert(`You clicked on ${item.querySelector('p').textContent}`);
        });
    });

    // Add search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        const allItems = [...albumItems, ...recommendedItems];

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
});

document.addEventListener('DOMContentLoaded', () => {
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


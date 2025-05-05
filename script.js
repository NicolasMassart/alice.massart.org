function filterItems(category) {
    const items = document.querySelectorAll('.image-container');

    items.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    filterItems('all');
});

filterItems('all');

function toggleMenu() {
    document.querySelector('.menu').classList.toggle('active');
}
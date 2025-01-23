function filterItems(category) {
    const $items = document.querySelectorAll('.list-item');
        console.log($items);

    $items.forEach(item => {
        if (category === 'all') {
            item.classList.add('visible'); // Affiche tous les éléments
        } else if (item.classList.contains(category)) {
            item.classList.add('visible'); // Affiche les éléments correspondants
        } else {
            item.classList.remove('visible'); // Cache les éléments non correspondants
        }
    });
}

filterItems('all');

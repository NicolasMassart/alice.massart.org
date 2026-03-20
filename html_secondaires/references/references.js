document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("imageGrid");

    // Charger le CSV
    const res = await fetch("references.csv");
    const text = await res.text();

    // Découper en lignes et ignorer l’en-tête
    const lignes = text.trim().split("\n").slice(1);

    lignes.forEach(ligne => {
        const [categorie, nom, artiste, date, media, typeMedia] = ligne.split(";");

        // Création du conteneur principal
        const container = document.createElement("div");
        container.classList.add("image-container");

        // Ajouter toutes les catégories comme classes CSS (ignorer les vides)
        categorie.trim().split(/\s+/).forEach(cat => {
            if (cat) container.classList.add(cat);
        });

        // Construire le chemin du média
        const mediaPath = "../../src/img/refs/" + media.trim();
        const typeClean = typeMedia ? typeMedia.trim().toLowerCase() : "image";

        // Détection du type de média (image ou vidéo)
        let mediaHTML = "";
        if (typeClean === "video") {
            mediaHTML = `
                <video autoplay muted loop>
                    <source src="${mediaPath}" type="video/mp4">
                </video>
            `;
        } else {
            mediaHTML = `<img src="${mediaPath}" alt="${nom}">`;
        }

        // Bloc de légende
        const legendeHTML = `
            <div class="slide">
                <div class="legende">
                    <h3><em>${nom}</em></h3>
                    <p>${artiste}</p>
                    <p>(${date})</p>
                </div>
            </div>
        `;

        container.innerHTML = mediaHTML + legendeHTML;
        grid.appendChild(container);
    });

    // Tous les liens dans les légendes ouvrent dans un nouvel onglet
    document.querySelectorAll('.legende a').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // Afficher toutes les références par défaut
    filterItems('all');
});

// --- Fonction de filtrage ---
function filterItems(category) {
    const items = document.querySelectorAll(".image-container");
    items.forEach(item => {
        if (category === "all" || item.classList.contains(category)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}

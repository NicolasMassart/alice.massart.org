// Fonction pour convertir un texte en slug
const slugify = str => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/<[^>]*>/g, "")  // retire les tags HTML
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

document.addEventListener("DOMContentLoaded", async () => {
  const containerProjets = document.querySelector(".projets");

  const res = await fetch("projets.csv");
  const text = await res.text();

  const lignes = text.trim().split("\n").slice(1);

  // Fonction pour retirer les guillemets EXTÉRIEURS et corriger "" -> "
  const clean = str =>
    str
      .trim()
      .replace(/^"(.*)"$/, "$1")   // retire les guillemets autour du champ
      .replace(/""/g, '"');        // transforme "" en "

  lignes.forEach(ligne => {
    const champs = ligne.split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    const [
      categorie,
      nom,
      date,
      description,
      media,
      typeMedia,
      contenuSupplementaire
    ] = champs.map(clean);
    console.log(contenuSupplementaire);


    // Créer le conteneur du projet
    const projetDiv = document.createElement("div");
    projetDiv.classList.add("image-container");

    // Ajouter les classes de catégorie pour le filtrage
    const categoryClasses = categorie
      .split(/[,;|]+/)          // supporte plusieurs catégories séparées
      .map(cat => cat.trim().toLowerCase())
      .filter(Boolean)
      .map(cat => cat
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
      );
    projetDiv.classList.add(...categoryClasses);

    // Media : image ou vidéo
    let mediaInner = "";
    const altNom = nom.replace(/<a\b[^>]*>|<\/a>/gi, "");

    if (typeMedia.trim() === "video") {
      mediaInner = `
        <video class="videoPlay" autoplay muted loop>
          <source src="../../src/img/${media.trim()}" type="video/mp4" />
        </video>
      `;
    } else {
      mediaInner = `
        <img src="../../src/img/${media.trim()}" alt="${altNom}" />
      `;
    }
    const mediaHTML = `<div class="projet-media">${mediaInner}</div>`;

    const legendeHTML = `
      <div class="projet-info">
        <div class="projet-info-header">
          <h3>${nom}</h3>
          <span class="projet-date">${date}</span>
        </div>
        <p class="projet-desc">${description}</p>
        <a href="details/detail.html?slug=${slugify(nom)}" class="btn-savoir-plus">En savoir plus →</a>
      </div>
    `;

    projetDiv.innerHTML = mediaHTML + legendeHTML;
    containerProjets.appendChild(projetDiv);
  });

  // Afficher toutes les références par défaut
  filterItems('all');

  // Forcer les liens <a> à s'ouvrir dans un nouvel onglet (sauf "En savoir plus")
  document.querySelectorAll('.legende a:not(.btn-savoir-plus)').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  // Gestion des vidéos
  const videos = document.querySelectorAll('.videoPlay');

  document.addEventListener('visibilitychange', () => {
    videos.forEach(video => {
      if (document.visibilityState === 'visible') {
        video.play();
      } else {
        video.pause();
      }
    });
  });

  window.addEventListener('load', () => {
    videos.forEach(video => video.play());
  });
});

// --- Fonction de filtrage ---
function filterItems(category) {
    const items = document.querySelectorAll(".image-container");
    items.forEach(item => {
        if (category === "all" || item.classList.contains(category)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });

    document.querySelectorAll('.filter-buttons button').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = [...document.querySelectorAll('.filter-buttons button')]
        .find(btn => btn.getAttribute('onclick') === `filterItems('${category}')`);
    if (activeBtn) activeBtn.classList.add('active');
}

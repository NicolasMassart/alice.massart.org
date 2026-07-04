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

  const res = await fetch("projets.csv", { cache: 'no-store' });
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


    // Créer le conteneur du projet (carte cliquable)
    const projetDiv = document.createElement("a");
    projetDiv.classList.add("image-container");
    projetDiv.href = `details/detail.html?slug=${slugify(nom)}&media=${encodeURIComponent(media.trim())}&typeMedia=${encodeURIComponent(typeMedia.trim())}`;

    // Ajouter les classes de catégorie pour le filtrage
    const categoryClasses = categorie
      .split(/[,;|\s]+/)        // supporte plusieurs catégories séparées (virgule, point-virgule, espace)
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

    const categoryLabels = {
      'graphisme': 'Graphisme',
      'edition': 'Édition',
      'photographie': 'Photographie',
      'jeu-video': 'Jeu vidéo',
      'experience-immersive': 'Expérience immersive',
      'doe': "Design d'objet et d'espace",
      'installation': 'Installation',
      'modelisation-3d': 'Modélisation 3D',
      'logiciel': 'Logiciel',
      'code-creatif': 'Code Créatif',
      'son': 'Son & Musique',
    };
    const tagsHTML = categoryClasses
      .map(cls => `<span class="projet-tag">${categoryLabels[cls] || cls}</span>`)
      .join('');

    const legendeHTML = `
      <div class="projet-info">
        <div class="projet-info-header">
          <h3>${nom}</h3>
          <span class="projet-date">${date}</span>
        </div>
        <p class="projet-desc">${description}</p>
        <div class="projet-footer">
          <div class="projet-tags">${tagsHTML}</div>
          <span class="btn-savoir-plus">En savoir plus →</span>
        </div>
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
    const categories = Array.isArray(category) ? category : [category];
    const items = document.querySelectorAll(".image-container");
    items.forEach(item => {
        const match = categories[0] === 'all' || categories.some(cat => item.classList.contains(cat));
        item.classList.toggle('hidden', !match);
    });

    document.querySelectorAll('.filter-buttons button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = [...document.querySelectorAll('.filter-buttons button')]
        .find(btn => {
            try {
                const arg = btn.getAttribute('onclick').replace("filterItems(", "").replace(")", "");
                const parsed = JSON.parse(arg.replace(/'/g, '"'));
                const btnCats = Array.isArray(parsed) ? parsed : [parsed];
                return btnCats.length === categories.length && btnCats.every((c, i) => c === categories[i]);
            } catch { return false; }
        });
    if (activeBtn) activeBtn.classList.add('active');
}

document.addEventListener("DOMContentLoaded", async () => {
  const containerProfessionnel = document.querySelector(".projets.professionnel");
  const containerPersonnel = document.querySelector(".projets.personnel");
  const containerScolaire = document.querySelector(".projets.scolaire");

  const res = await fetch("projets.csv");
  const text = await res.text();

  const lignes = text.trim().split("\n").slice(1);
  lignes.forEach(ligne => {
    const [categorie, nom, date, description, media, typeMedia] = ligne.split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/); // CSV safe

    // Créer le conteneur du projet
    const projetDiv = document.createElement("div");
    projetDiv.classList.add("image-container");

    // Media : image ou vidéo
    let mediaHTML = "";
    if (typeMedia.trim() === "video") {
      mediaHTML = `
        <video class="videoPlay" autoplay muted loop>
          <source src="../../src/img/${media.trim()}" type="video/mp4" />
        </video>
      `;
    } else {
      mediaHTML = `<img src="../../src/img/${media.trim()}" alt="${nom}" />`;
    }

    // Légende
    const legendeHTML = `
      <div class="slide">
        <div class="legende">
          <h2>${nom}</h2>
          <p>${date}</p>
          <p>${description}</p>
        </div>
      </div>
    `;

    projetDiv.innerHTML = mediaHTML + legendeHTML;

    // Placer selon la catégorie
    if (categorie.toLowerCase().includes("profession")) {
      containerProfessionnel.appendChild(projetDiv);
    } else if (categorie.toLowerCase().includes("personnel")) {
      containerPersonnel.appendChild(projetDiv);
    } else {
      containerScolaire.appendChild(projetDiv);
    }
  });

    document.querySelectorAll('.legende a').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    });
});

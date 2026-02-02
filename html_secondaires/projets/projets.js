document.addEventListener("DOMContentLoaded", async () => {
  const containerProfessionnel = document.querySelector(".projets.professionnel");
  const containerPersonnel = document.querySelector(".projets.personnel");
  const containerScolaire = document.querySelector(".projets.scolaire");

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

    // Media : image ou vidéo
    let mediaHTML = "";
    const altNom = nom.replace(/<a\b[^>]*>|<\/a>/gi, "");

    if (typeMedia.trim() === "video") {
      mediaHTML = `
        <video class="videoPlay" autoplay muted loop>
          <source src="../../src/img/${media.trim()}" type="video/mp4" />
        </video>
      `;
    } else {
      mediaHTML = `
        <img src="../../src/img/${media.trim()}" alt="${altNom}" />
      `;
    }

    const legendeHTML = `
      <div class="slide">
        <div class="legende">
          <h2>${nom}</h2>
          <p>${date}</p>
          <p>${description}</p>
          ${contenuSupplementaire || ""}
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

  // Forcer les liens <a> à s'ouvrir dans un nouvel onglet
  document.querySelectorAll('.legende a').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
});

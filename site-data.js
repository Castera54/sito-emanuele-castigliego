// Funzioni condivise: caricamento dati JSON, popolamento header/footer, utilità.

async function caricaJSON(percorso) {
  const risposta = await fetch(percorso);
  if (!risposta.ok) throw new Error("Impossibile caricare " + percorso);
  return risposta.json();
}

function formattaDataItaliana(stringaData) {
  const mesi = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
    "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  const d = new Date(stringaData);
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()} ${mesi[d.getMonth()]} ${d.getFullYear()}`;
}

// Semplice convertitore da Markdown (sottoinsieme) a HTML: paragrafi, grassetto, corsivo.
function markdownSemplice(testo) {
  if (!testo) return "";
  const paragrafi = testo.trim().split(/\n\s*\n/);
  return paragrafi.map((p) => {
    let html = p
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
    return `<p>${html}</p>`;
  }).join("\n");
}

async function popolaHeaderFooter() {
  try {
    const site = await caricaJSON("/data/site.json");

    const brandSubtitle = document.getElementById("brand-subtitle");
    if (brandSubtitle && site.sottotitolo) brandSubtitle.textContent = site.sottotitolo;

    const brandPhoto = document.getElementById("brand-photo");
    if (brandPhoto && site.fotoProfilo) {
      brandPhoto.src = site.fotoProfilo;
      brandPhoto.style.objectPosition = site.fotoProfiloPosizione || "center";
    }

    const footerIcons = document.getElementById("footer-social-icons");
    if (footerIcons) {
      let html = "";
      if (site.instagram) html += `<a href="${site.instagram}" target="_blank" rel="noopener">Instagram</a>`;
      if (site.facebook) html += `<a href="${site.facebook}" target="_blank" rel="noopener">Facebook</a>`;
      if (site.twitter) html += `<a href="${site.twitter}" target="_blank" rel="noopener">X</a>`;
      footerIcons.innerHTML = html;
    }

    const footerEmail = document.getElementById("footer-email");
    if (footerEmail && site.email) {
      footerEmail.href = "mailto:" + site.email;
      footerEmail.textContent = site.email;
      footerEmail.style.display = "block";
    }

    const footerYear = document.getElementById("footer-year");
    if (footerYear && site.annoCorrente) footerYear.textContent = site.annoCorrente;

    return site;
  } catch (e) {
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", popolaHeaderFooter);

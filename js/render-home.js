// Popola le sezioni dinamiche della home: hero, storia, battaglie, incarichi, social, blog.

// Converte grassetto/corsivo Markdown in HTML per singole righe di testo (usato da hero/storia).
function formattaInline(testo) {
  if (!testo) return "";
  return testo
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

async function renderHero() {
  try {
    const site = await caricaJSON("/data/site.json");
    const eyebrow = document.getElementById("hero-eyebrow");
    const titolo = document.getElementById("hero-titolo");
    const lead = document.getElementById("hero-lead");
    const immagine = document.getElementById("hero-immagine");
    if (eyebrow && site.heroEyebrow) eyebrow.textContent = site.heroEyebrow;
    if (titolo && site.titolo) titolo.textContent = site.titolo;
    if (lead && site.heroTesto) lead.textContent = site.heroTesto;
    if (immagine && site.fotoHero) {
      immagine.src = site.fotoHero;
      immagine.style.objectPosition = site.fotoHeroPosizione || "center";
    }
  } catch (e) {
    console.error(e);
  }
}

async function renderStoria() {
  const testo = document.getElementById("storia-testo");
  const foto = document.getElementById("storia-foto");
  try {
    const storia = await caricaJSON("/data/storia.json");
    if (testo) {
      testo.innerHTML = (storia.blocchi || []).map((b) => {
        const html = formattaInline(b.testo);
        return b.tipo === "citazione" ? `<blockquote>"${html}"</blockquote>` : `<p>${html}</p>`;
      }).join("\n");
    }
    if (foto) {
      foto.innerHTML = (storia.foto || []).map((f) => `
        <img src="${f.immagine}" alt="${f.alt || ''}" style="object-position: ${f.posizione || 'center'};">
      `).join("");
    }
  } catch (e) {
    if (testo) testo.innerHTML = "<p>Non è stato possibile caricare la storia.</p>";
    console.error(e);
  }
}

async function renderBattaglie() {
  const contenitore = document.getElementById("battaglie-grid");
  if (!contenitore) return;
  try {
    const datiBattaglie = await caricaJSON("/data/battaglie.json");
    const battaglie = datiBattaglie.battaglie || [];
    contenitore.innerHTML = battaglie.map((b) => `
      <article class="battaglia-card">
        <div class="battaglia-img">
          <img src="${b.immagine}" alt="${b.titolo}" loading="lazy" style="object-position: ${b.focus || 'center'};">
          <span class="battaglia-tag">${b.categoria}</span>
        </div>
        <div class="battaglia-body">
          <h3>${b.titolo}</h3>
          <p>${b.sintesi}</p>
          <details>
            <summary>Leggi di più</summary>
            <p>${b.dettaglio}</p>
            <ul class="fonti">
              ${b.fonti.map((f) => `<li><a href="${f.url}" target="_blank" rel="noopener">${f.titolo} ↗</a></li>`).join("")}
            </ul>
          </details>
        </div>
      </article>
    `).join("");
  } catch (e) {
    contenitore.innerHTML = "<p>Non è stato possibile caricare le battaglie politiche.</p>";
    console.error(e);
  }
}

async function renderIncarichi() {
  const contenitore = document.getElementById("incarichi-timeline");
  if (!contenitore) return;
  try {
    const datiIncarichi = await caricaJSON("/data/incarichi.json");
    const incarichi = datiIncarichi.incarichi || [];
    contenitore.innerHTML = incarichi.map((i) => `
      <div class="timeline-item ${i.stato === 'attuale' ? 'timeline-attuale' : 'timeline-concluso'}">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <span class="timeline-periodo">${i.periodo}</span>
          <h3>${i.ruolo}</h3>
          <p>${i.descrizione}</p>
          ${i.stato === 'attuale' ? '<span class="badge-attuale">In corso</span>' : ''}
        </div>
      </div>
    `).join("");
  } catch (e) {
    contenitore.innerHTML = "<p>Non è stato possibile caricare gli incarichi.</p>";
    console.error(e);
  }
}

async function renderSocial() {
  const seguimi = document.getElementById("social-follow");
  const griglia = document.getElementById("social-grid");
  try {
    const site = await caricaJSON("/data/site.json");
    if (seguimi) {
      let html = "";
      if (site.instagram) html += `<a href="${site.instagram}" target="_blank" rel="noopener" class="social-follow-btn instagram">📷 ${site.instagramHandle || "Instagram"}</a>`;
      if (site.facebook) html += `<a href="${site.facebook}" target="_blank" rel="noopener" class="social-follow-btn facebook">👍 Seguimi su Facebook</a>`;
      seguimi.innerHTML = html;
    }
    if (griglia) {
      const datiSocial = await caricaJSON("/data/social.json");
      const social = datiSocial.posts || [];
      griglia.innerHTML = social.map((s) => `
        <a class="social-card" href="${s.link}" target="_blank" rel="noopener">
          <span class="social-platform social-${s.piattaforma}">${s.piattaforma}</span>
          <p>${s.testo}</p>
          <span class="social-date">${formattaDataItaliana(s.data)}</span>
        </a>
      `).join("");
    }
  } catch (e) {
    if (griglia) griglia.innerHTML = "<p>Non è stato possibile caricare i post social.</p>";
    console.error(e);
  }
}

async function renderBlogPreview() {
  const contenitore = document.getElementById("blog-preview-grid");
  if (!contenitore) return;
  try {
    const datiPosts = await caricaJSON("/data/posts.json");
    const posts = datiPosts.posts || [];
    const ordinati = [...posts].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 3);
    if (ordinati.length === 0) {
      contenitore.innerHTML = "<p>Presto nuovi articoli dal blog.</p>";
      return;
    }
    contenitore.innerHTML = ordinati.map((post) => `
      <a class="blog-card" href="/blog-post.html?slug=${encodeURIComponent(post.slug)}">
        <span class="blog-date">${formattaDataItaliana(post.data)}</span>
        <h3>${post.titolo}</h3>
        <p>${post.estratto}</p>
        <span class="blog-readmore">Continua a leggere →</span>
      </a>
    `).join("");
  } catch (e) {
    contenitore.innerHTML = "<p>Non è stato possibile caricare gli articoli del blog.</p>";
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderHero();
  renderStoria();
  renderBattaglie();
  renderIncarichi();
  renderSocial();
  renderBlogPreview();
});

// Animazioni "reveal" allo scroll: aggiunge la classe .in-view quando un
// elemento entra nel viewport, così le regole CSS possono animarlo.
(function () {
  function avvia() {
    const elementi = document.querySelectorAll(".reveal, .reveal-group");
    if (!("IntersectionObserver" in window) || elementi.length === 0) {
      elementi.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const osservatore = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            osservatore.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    elementi.forEach((el) => osservatore.observe(el));

    // Per i contenitori popolati in modo asincrono (fetch), ricontrolla
    // periodicamente nei primi secondi nel caso il contenuto arrivi dopo
    // che l'elemento è già visibile.
    let tentativi = 0;
    const timer = setInterval(() => {
      tentativi += 1;
      document.querySelectorAll(".reveal-group:not(.in-view)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("in-view");
        }
      });
      if (tentativi > 10) clearInterval(timer);
    }, 300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", avvia);
  } else {
    avvia();
  }
})();

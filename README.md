# Sito di Emanuele Castigliego

Sito statico (HTML/CSS/JS puro, nessun passaggio di build necessario) pronto per essere pubblicato su Netlify, con un pannello di amministrazione integrato per scrivere il blog e aggiornare i contenuti senza toccare il codice.

## Struttura del progetto

```
index.html          Home page (presentazione, storia, battaglie, incarichi, social, blog)
blog.html            Elenco di tutti gli articoli del blog
blog-post.html        Pagina di un singolo articolo (letto da data/posts.json tramite ?slug=)
404.html              Pagina di errore personalizzata
css/style.css          Tutto lo stile del sito
js/                    Script per il menu mobile e per caricare i contenuti dinamici
images/                Tutte le foto e i loghi
data/                  Contenuti del sito in formato JSON (modificabili anche a mano)
  site.json            Dati generali, email, link social
  battaglie.json        Le card delle battaglie politiche
  incarichi.json         La timeline degli incarichi
  social.json            I post "in evidenza" della sezione social
  posts.json             Gli articoli del blog
admin/                 Pannello Decap CMS (ex Netlify CMS)
  index.html
  config.yml
netlify.toml            Configurazione di Netlify (nessuna build richiesta)
```

Non essendoci un passaggio di build, qualsiasi modifica ai file in `data/*.json` (fatta a mano o tramite il pannello admin) è visibile sul sito subito dopo il deploy, senza bisogno di ricompilare nulla.

## Come pubblicare il sito su Netlify

1. **Carica il progetto su GitHub** (o GitLab/Bitbucket): crea un nuovo repository e carica tutti i file di questa cartella così come sono.
2. Vai su [app.netlify.com](https://app.netlify.com) e scegli **"Add new site" → "Import an existing project"**.
3. Collega il repository appena creato.
4. Nelle impostazioni di build lascia tutto vuoto: **Build command: (nessuno)**, **Publish directory: `.`** (la root). Il file `netlify.toml` incluso imposta già questi valori automaticamente.
5. Fai il deploy. In pochi secondi il sito sarà online su un indirizzo tipo `nome-a-caso.netlify.app`. Da **Site settings → Domain management** puoi cambiare il sottodominio o collegare un dominio personalizzato.

## Come attivare il pannello per scrivere il blog (Decap CMS)

Il pannello si trova all'indirizzo `tuosito.netlify.app/admin/`. Per farlo funzionare serve attivare due funzioni gratuite di Netlify:

1. Nel pannello del sito su Netlify, vai su **Site configuration → Identity** e clicca **Enable Identity**.
2. Sempre in Identity, sotto **Registration**, imposta **"Invite only"** (così solo le persone invitate possono accedere al pannello).
3. Scendi su **Services → Git Gateway** e clicca **Enable Git Gateway**: questo permette al pannello di salvare le modifiche direttamente su GitHub senza che Emanuele debba avere un account GitHub.
4. Torna su **Identity → Invite users** e invita l'indirizzo email di Emanuele. Riceverà una mail con un link per impostare la password.
5. Dopo aver impostato la password, Emanuele può andare su `tuosito.netlify.app/admin/`, fare login, e da lì:
   - scrivere e pubblicare nuovi **articoli del blog**;
   - modificare il testo e le foto della sezione **"Chi sono / La mia storia"**;
   - aggiornare i **post in evidenza** della sezione social;
   - modificare **battaglie politiche** e **incarichi**;
   - aggiornare **email, link social, foto profilo e foto principale della home** nelle impostazioni del sito.

Ogni salvataggio nel pannello crea automaticamente un commit su GitHub e il sito si aggiorna da solo in pochi secondi, senza che nessuno debba scrivere codice.

## Cosa aggiornare prima di andare online

- **Email di contatto**: in `data/site.json` il campo `email` è vuoto. Se Emanuele vuole un indirizzo email pubblico in fondo al sito, va aggiunto lì (o dal pannello admin, sezione "Impostazioni sito").
- **URL del sito**: dopo il primo deploy, aggiorna il campo `url` in `data/site.json` con l'indirizzo Netlify reale (o il dominio personalizzato), utile per i meta-tag di condivisione social.
- **Facebook / X**: Instagram e Facebook sono già collegati. Se Emanuele apre un account X (Twitter) o una pagina Facebook diversa da quella attuale, si aggiornano dallo stesso file/pannello.

## Note sui contenuti

- Tutte le foto usate sono quelle fornite direttamente da Emanuele (nessuna immagine presa dal web senza conferma).
- I loghi di PD, GD Nuova Pescara e GD Abruzzo sono quelli forniti/ufficiali.
- I testi sulle "battaglie politiche" sono basati su articoli di stampa reali, con link alla fonte in fondo a ogni card ("Leggi di più").
- I post nella sezione "Social" sono contenuti d'esempio scritti per riflettere temi reali già trattati, pensati per essere sostituiti/aggiornati da Emanuele con i post reali tramite il pannello admin, dato che Instagram non permette di leggere i post automaticamente da un sito esterno senza un'integrazione più complessa (API ufficiali a pagamento/con approvazione Meta).

## Sviluppo in locale

Per vedere il sito sul proprio computer prima di pubblicarlo basta un server statico qualsiasi, ad esempio con Python:

```
python3 -m http.server 8000
```

e poi aprire `http://localhost:8000` nel browser. Non serve installare nulla (npm, Node, ecc.).

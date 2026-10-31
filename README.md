# Hry na učení

Interaktivní procvičovací hry pro iPad (Safari, bez instalace).

**Adresa:** https://marekfikejs-deere81.github.io/hry/

## Jak přidat hru
Nahraj nový soubor `nazev-hry.html` do kořene repozitáře. Rozcestník (`index.html`) ho najde sám.
Předmět a popis dlaždice určují značky v hlavičce hry:

```html
<title>Název hry</title>
<meta name="hra:predmet" content="Matematika">
<meta name="hra:popis" content="Krátký popis pod názvem">
```

Předměty s vlastní barvou: Matematika, Český jazyk, Prvouka, Angličtina. Jiný název se zobrazí šedě.

## Požadavky na každou novou hru
- Funguje na iPadu **i na iPhonu/mobilu** – na výšku i na šířku (Safari, bez instalace).
- Úloha i ovládání (číselník, volby) se vejdou na jednu obrazovku bez posouvání; když se nevejde dlouhá nápověda, plocha jde posunout a nic se neusekne.
- Otestovat aspoň na 390×844, 844×390, 360×640 a 1180×820.

## Výsledky pro rodiče
Každá hra načítá `stats.js` a hlásí výsledky: `hs('start','Režim')`, po každé úloze `hs('task','Dovednost','Úloha',výsledek)` (true/2 = napoprvé, 1 = po opravě, false/0 = nezvládl), na konci `hs('end',skóre,max)`.
Přehled: https://marekfikejs-deere81.github.io/hry/rodice/ (odkaz je i dole v rozcestníku).
Synchronizace do Google tabulky: `rodice/NAVOD-synchronizace.md`. **Každá nová hra musí výsledky hlásit stejně.**

## Soubory
- `index.html` – rozcestník (hry najde sám; dole odkaz Pro rodiče)
- `stats.js` – záznam výsledků (+ adresa synchronizace `SYNC_URL`)
- `rodice/` – přehled výsledků, skript pro Google tabulku, návod
- `apple-touch-icon.png`, `icon-512.png` – ikona na plochu iPadu
- `*.html` – jednotlivé hry

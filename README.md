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

## Soubory
- `index.html` – rozcestník (neupravovat)
- `apple-touch-icon.png`, `icon-512.png` – ikona na plochu iPadu
- `*.html` – jednotlivé hry

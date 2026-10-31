# Výsledky na mobilu rodiče – nastavení (asi 10 minut, jednou)

Hry ukládají výsledky v iPadu. Aby je šlo vidět i na tvém telefonu, posílají se do tvé Google tabulky.
Data zůstávají v tvém Google účtu. Číst je umí jen ten, kdo zná klíč.

Nastavení udělej na počítači (Windows PC), jde to snáz než na mobilu.

## 1. Google tabulka a skript
1. Otevři https://sheets.new (přihlášený jako marek.fikejs@gmail.com). Tabulku pojmenuj třeba **Výsledky Matěj**.
2. Menu **Rozšíření → Apps Script**.
3. Smaž ukázkový kód a vlož celý obsah souboru `rodice/google-apps-script.js` z tohoto repozitáře.
4. Na řádku `const READ_KEY = 'SEM-NAPIS-SVUJ-KLIC';` nahraď text vlastním klíčem (např. 12 písmen a čísel, bez mezer). Klíč si poznamenej.
5. Ulož (ikona diskety).

## 2. Zveřejnění jako webová aplikace
1. Vpravo nahoře **Implementovat → Nová implementace**.
2. Typ (ozubené kolečko) → **Webová aplikace**.
3. **Spustit jako:** Já. **Kdo má přístup:** Kdokoli.
4. **Implementovat** → Google se zeptá na oprávnění → povol (u hlášky „Aplikace není ověřená“ dej *Rozšířené → Přejít na…*; je to tvůj vlastní skript).
5. Zkopíruj **adresu webové aplikace** (končí na `/exec`).

## 3. Adresa do her
1. V repozitáři otevři `stats.js` → tužka (upravit).
2. Řádek `var SYNC_URL='';` změň na `var SYNC_URL='https://script.google.com/macros/s/…/exec';`
3. **Commit changes.** Za 1–2 minuty to platí na webu.

## 4. Mobil rodiče
1. Otevři https://marekfikejs-deere81.github.io/hry/rodice/ (nebo v rozcestníku dole **Pro rodiče**).
2. Dole **Nastavení a záloha** → zadej klíč → **Uložit a načíst**.
3. Safari → Sdílet → **Přidat na plochu**. Ikona „Výsledky“ pak otevře přehled jedním ťuknutím.

Tip: klíč jde dát i do odkazu `…/hry/rodice/#k=TVUJKLIC` (po otevření se uloží a z adresy zmizí). Takový odkaz neposílej dál.

## Dobré vědět
- Výsledky, které Matěj odehrál před nastavením, iPad pošle sám při další hře.
- Když je iPad offline, výsledky počkají a odešlou se později.
- Když změníš kód skriptu, musíš udělat **Implementovat → Spravovat implementace → upravit → Nová verze** (adresa zůstane stejná).
- Kdo zná adresu `/exec`, může do tabulky teoreticky zapsat nesmysl, ale bez klíče nic nepřečte. Adresa je vidět v `stats.js` ve veřejném repozitáři.

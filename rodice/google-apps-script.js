/* Úložiště výsledků her pro rodiče – Google Apps Script.
   Vlož celý tento kód do Rozšíření → Apps Script v nové Google tabulce.
   Návod: NAVOD-synchronizace.md */

// Vymysli si vlastní klíč (např. 12 písmen a čísel). Zadáš ho jednou na stránce „Pro rodiče“.
const READ_KEY = 'SEM-NAPIS-SVUJ-KLIC';

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('vysledky');
  if (!sh) { sh = ss.insertSheet('vysledky'); sh.appendRow(['id', 'data', 'upraveno', 'hra', 'začátek']); }
  return sh;
}

// iPad posílá výsledky (každá hra = jeden řádek, při změně se řádek přepíše)
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const list = Array.isArray(body.s) ? body.s.slice(0, 100) : [];
    const sh = sheet_();
    const n = sh.getLastRow();
    const ids = n > 1 ? sh.getRange(2, 1, n - 1, 1).getValues().map(r => String(r[0])) : [];
    list.forEach(s => {
      if (!s || typeof s.id !== 'string' || s.id.length > 24 || typeof s.g !== 'string') return;
      const json = JSON.stringify(s);
      if (json.length > 45000) return;
      const row = [s.id, json, new Date(), String(s.t || s.g).slice(0, 80), new Date(Number(s.st) || Date.now())];
      const i = ids.indexOf(s.id);
      if (i >= 0) sh.getRange(i + 2, 1, 1, 5).setValues([row]);
      else { sh.appendRow(row); ids.push(s.id); }
    });
    return out_({ ok: true, n: list.length });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Stránka „Pro rodiče“ čte výsledky – jen se správným klíčem
function doGet(e) {
  if (!e.parameter.key || e.parameter.key !== READ_KEY) return out_({ ok: false, error: 'klic' });
  const sh = sheet_();
  const n = sh.getLastRow();
  const s = n > 1 ? sh.getRange(2, 2, n - 1, 1).getValues()
    .map(r => { try { return JSON.parse(r[0]); } catch (x) { return null; } }).filter(Boolean) : [];
  return out_({ ok: true, s: s });
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

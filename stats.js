/* Záznam výsledků her – sdílený pro všechny hry.
   Každá hra volá:
     HS.start('Režim')                 – začátek hry (zápas, třetina, úroveň…)
     HS.task('Dovednost','Úloha',výsl) – po každé úloze; výsl: true/2 = napoprvé, 1 = po opravě, false/0 = nezvládl
     HS.end(skóre, maximum)            – konec hry
   Data se ukládají v zařízení (localStorage, klíč hry-vysledky-v1)
   a když je vyplněná SYNC_URL, posílají se i do Google tabulky rodiče.
   Přehled pro rodiče: rodice/index.html */
(function(){
  'use strict';

  /* ===== NASTAVENÍ =====
     Adresa webové aplikace Google Apps Script (končí na /exec).
     Návod: rodice/NAVOD-synchronizace.md. Prázdné = výsledky zůstanou jen v zařízení. */
  var SYNC_URL='';

  var KEY='hry-vysledky-v1', PKEY='hry-vysledky-k-odeslani', IKEY='hry-vysledky-sync-init', MAX_SESS=800;
  function now(){return Date.now()}
  function getJ(k,d){try{var v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v}catch(e){return d}}
  function setJ(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
  function load(){var d=getJ(KEY,null); return d&&Array.isArray(d.s)?d:{v:1,s:[]}}
  function save(d){
    if(setJ(KEY,d)) return;
    // plné úložiště: u nejstarší čtvrtiny her nech jen souhrn
    d.s.slice(0,Math.ceil(d.s.length/4)).forEach(function(x){
      if(x.a&&x.a.length){x.n=x.a.length; x.ok=x.a.filter(function(a){return a.r===2}).length; x.a=[]}
    });
    setJ(KEY,d);
  }

  /* ----- odesílání do Google tabulky ----- */
  var timer=null, busy=false;
  function mark(s){var p=getJ(PKEY,{}); p[s.id]=s.l; setJ(PKEY,p)}
  function flush(beacon){
    if(!SYNC_URL||busy) return;
    var p=getJ(PKEY,{}), ids=Object.keys(p); if(!ids.length) return;
    var list=load().s.filter(function(x){return p.hasOwnProperty(x.id)}).slice(-60);
    if(!list.length){setJ(PKEY,{}); return}
    var body=JSON.stringify({s:list});
    if(beacon){ try{navigator.sendBeacon&&navigator.sendBeacon(SYNC_URL,new Blob([body],{type:'text/plain;charset=utf-8'}))}catch(e){} return }
    busy=true;
    fetch(SYNC_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:body})
      .then(function(r){return r.json()})
      .then(function(j){
        if(!j||!j.ok) return;
        var q=getJ(PKEY,{});            // co se mezitím změnilo, zůstane k odeslání
        list.forEach(function(s){if(q[s.id]===s.l) delete q[s.id]});
        setJ(PKEY,q);
        if(Object.keys(q).length) later(1500);
      })
      .catch(function(){})
      .then(function(){busy=false});
  }
  function later(ms){if(!SYNC_URL) return; clearTimeout(timer); timer=setTimeout(function(){flush(false)},ms)}

  var file=(location.pathname.split('/').pop()||'').replace(/\.html?$/i,'')||'hra';
  function meta(n){var m=document.querySelector('meta[name="'+n+'"]'); return m?m.content.trim():''}
  var cur=null;
  function upd(fn){
    if(!cur) return null;
    var d=load(), s=null;
    for(var i=d.s.length-1;i>=0;i--) if(d.s[i].id===cur){s=d.s[i];break}
    if(!s) return null;
    fn(s); s.l=now(); save(d); mark(s); return s;
  }
  var HS={
    start:function(mode){
      var d=load();
      d.s=d.s.filter(function(x){return x.d||(x.a&&x.a.length)||x.n});   // prázdné rozehrané hry pryč
      var id=now().toString(36)+Math.random().toString(36).slice(2,6);
      d.s.push({id:id,g:file,t:document.title,p:meta('hra:predmet')||'Ostatní',m:mode||'',st:now(),l:now(),d:0,a:[]});
      if(d.s.length>MAX_SESS) d.s=d.s.slice(-MAX_SESS);
      save(d); cur=id;
    },
    task:function(skill,item,res,val){
      if(!cur) HS.start('');
      var r=res===true?2:res===false?0:Math.max(0,Math.min(2,+res||0));
      upd(function(s){
        var o={k:String(skill==null?'':skill),q:String(item==null?'':item),r:r,t:now()-s.st};
        if(val!=null&&isFinite(val)) o.v=Math.round(val);
        s.a.push(o);
      });
      later(4000);
    },
    end:function(score,max){
      upd(function(s){s.d=1; if(score!=null)s.sc=score; if(max!=null)s.mx=max});
      cur=null; later(300);
    },
    load:load, KEY:KEY, SYNC_URL:SYNC_URL,
    pending:function(){return Object.keys(getJ(PKEY,{})).length}
  };
  window.HS=HS;

  if(SYNC_URL){
    // první spuštění s novou adresou: pošli i všechno, co už v zařízení je
    if(getJ(IKEY,'')!==SYNC_URL){ load().s.forEach(mark); setJ(IKEY,SYNC_URL) }
    later(1500);
    window.addEventListener('pagehide',function(){flush(true)});
    document.addEventListener('visibilitychange',function(){if(document.hidden)flush(true)});
    window.addEventListener('online',function(){later(500)});
  }
  // Požádej Safari, ať data nemaže (funguje hlavně u ikony na ploše)
  try{if(navigator.storage&&navigator.storage.persist) navigator.storage.persist().catch(function(){})}catch(e){}
})();

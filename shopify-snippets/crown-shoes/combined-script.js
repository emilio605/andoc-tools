// ============================================================
// Crown Shoes — Personalizaciones del tema Platform
// ============================================================
// PARTE 1: Color Filter Swatches (páginas de colección)
// PARTE 2: Variant Buttons — Talla y Color (página de producto)
//
// Estructura real del tema Platform (Groupthought):
//   <component-custom-select class="custom-select">
//     <button class="custom-select__button" role="combobox">...</button>
//     <fieldset>
//       <legend class="visually-hidden">Talla</legend>
//       <ul class="custom-select__dropdown product-variant-selectors__option-list">
//         <li class="product-variant-selectors__option-list-item">
//           <input type="radio" name="options[Talla]-..." value="34">
//           <label>34</label>
//         </li>
//       </ul>
//     </fieldset>
//   </component-custom-select>
// ============================================================

// ── PARTE 1: Color Filter Swatches en colección ─────────────

(function () {
  'use strict';

  var CF = { 'ambar':'#C9A534','azul':'#1E3A8A','crema':'#F5EDD6','dorado':'#D4AF37','negro':'#1C1C1C','nude':'#D4A491','plateado':'#B0B0B0','rojo':'#C0272D','rosado':'#F4B8C1','print':null };
  var ci = {}, dr = false;

  function nk(s) { return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim(); }
  function th(s) { return s.replace(/(\.(jpe?g|png|gif|webp|avif))(\?.*)?$/i,'_80x$1$3'); }
  function gh() { var m=window.location.pathname.match(/\/collections\/([^\/\?#]+)/); return m?m[1]:null; }

  function ldF(cb) {
    if (dr) { cb(); return; }
    var h = gh(); if (!h) { dr=true; cb(); return; }
    fetch('/collections/'+encodeURIComponent(h)+'/products.json?limit=250')
      .then(function(r){return r.json();})
      .then(function(d){
        (d.products||[]).forEach(function(p){
          var ix=-1;
          (p.options||[]).forEach(function(o,i){if(/colou?r/i.test(o))ix=i;});
          if(ix<0)return;
          var ck=[];
          (p.variants||[]).forEach(function(v){
            var val=v['option'+(ix+1)]; if(!val)return;
            var k=nk(val);
            if(!ci[k]&&v.featured_image&&v.featured_image.src) ci[k]=th(v.featured_image.src);
            if(ck.indexOf(k)===-1) ck.push(k);
          });
          if(ck.length===1&&!ci[ck[0]]&&p.images&&p.images[0]) ci[ck[0]]=th(p.images[0].src);
        });
        dr=true; cb();
      }).catch(function(){dr=true; cb();});
  }

  function isF() {
    if(document.getElementById('cs-fs'))return;
    var s=document.createElement('style'); s.id='cs-fs';
    s.textContent='.cs-fsw{display:inline-block;width:22px;height:22px;border-radius:50%;border:1.5px solid rgba(0,0,0,.15);margin-right:8px;vertical-align:middle;flex-shrink:0;position:relative;top:-1px;background-size:cover;background-position:center;overflow:hidden;}';
    document.head.appendChild(s);
  }

  function fiF() {
    var r=Array.from(document.querySelectorAll('input[name*="color" i][type="checkbox"],input[name*="colour" i][type="checkbox"]'));
    if(r.length>0)return r;
    var ss=document.querySelectorAll('details,[class*="filter"],[class*="facet"],[class*="accordion"]');
    for(var i=0;i<ss.length;i++){
      var hh=ss[i].querySelector('summary,button,h2,h3,h4,[class*="heading"],[class*="title"]');
      if(hh&&/^color$/i.test(hh.textContent.trim())){
        var ii=Array.from(ss[i].querySelectorAll('input[type="checkbox"]'));
        if(ii.length>0)return ii;
      }
    }
    return [];
  }

  function asF() {
    fiF().forEach(function(inp){
      var lbl=inp.id?document.querySelector('label[for="'+inp.id+'"]'):inp.closest('label');
      if(!lbl||lbl.querySelector('.cs-fsw'))return;
      var rv=(inp.value||'').trim();
      var k=/^gid:|^\d+$/.test(rv)?nk(lbl.textContent.replace(/\s*\d+\s*$/,'').trim()):nk(rv);
      if(!k)return;
      var img=ci[k],fb=CF[k];
      if(!img&&fb===undefined)return;
      var sw=document.createElement('span'); sw.className='cs-fsw'; sw.setAttribute('aria-hidden','true');
      if(img) sw.style.backgroundImage='url('+img+')';
      else if(fb) sw.style.backgroundColor=fb;
      else sw.style.background='repeating-linear-gradient(45deg,#c0392b 0px 3px,#fff 3px 6px,#2980b9 6px 9px,#fff 9px 12px)';
      var il=lbl.querySelector('input');
      if(il&&il.nextSibling) lbl.insertBefore(sw,il.nextSibling); else lbl.insertBefore(sw,lbl.firstChild);
    });
  }

  function initFilter() {
    isF();
    ldF(function(){asF();});
    new MutationObserver(function(m){
      if(!m.some(function(x){return x.addedNodes.length>0;}))return;
      if(dr) asF(); else ldF(function(){asF();});
    }).observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initFilter);
  else initFilter();
})();


// ── PARTE 2: Variant Buttons en página de producto ───────────

(function () {
  'use strict';

  var BRAND_COLOR = '#C41670';

  var CF = { 'ambar':'#C9A534','azul':'#1E3A8A','crema':'#F5EDD6','dorado':'#D4AF37','negro':'#1C1C1C','nude':'#D4A491','plateado':'#B0B0B0','rojo':'#C0272D','rosado':'#F4B8C1','print':null };
  var ci = {};
  var STYLE_ID = 'cs-vs';

  function nk(s) { return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim(); }
  function th(s) { return s.replace(/(\.(jpe?g|png|gif|webp|avif))(\?.*)?$/i,'_80x$1$3'); }
  function gph() { var m=window.location.pathname.match(/\/products\/([^\/\?#]+)/); return m?m[1]:null; }

  function lpi(handle, cb) {
    fetch('/products/'+encodeURIComponent(handle)+'.json')
      .then(function(r){return r.json();})
      .then(function(d){
        var p=d.product||{}, ix=-1;
        (p.options||[]).forEach(function(o,i){if(/colou?r/i.test(o.name||o))ix=i;});
        if(ix>=0){
          (p.variants||[]).forEach(function(v){
            var val=v['option'+(ix+1)]; if(!val)return;
            var k=nk(val);
            if(!ci[k]&&v.featured_image&&v.featured_image.src) ci[k]=th(v.featured_image.src);
          });
          var uc=[];
          (p.variants||[]).forEach(function(v){
            var k=v['option'+(ix+1)]; k=k?nk(k):null;
            if(k&&uc.indexOf(k)===-1) uc.push(k);
          });
          if(uc.length===1&&!ci[uc[0]]&&p.images&&p.images[0]) ci[uc[0]]=th(p.images[0].src);
        }
        cb();
      }).catch(function(){cb();});
  }

  function ivs() {
    if(document.getElementById(STYLE_ID))return;
    var s=document.createElement('style'); s.id=STYLE_ID;
    s.textContent=[
      '.cs-ol{font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;margin-bottom:10px;display:block;}',
      '.cs-ol span{font-weight:400;text-transform:none;}',
      '.cs-vb{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:4px;}',
      '.cs-sb{cursor:pointer;background:#fff;color:#1c1c1c;border:1.5px solid #d0d0d0;border-radius:4px;padding:8px 14px;font-size:14px;font-family:inherit;line-height:1;min-width:44px;text-align:center;transition:border-color .15s,background .15s,color .15s;}',
      '.cs-sb:hover:not(:disabled){border-color:#888;}',
      '.cs-sb.cs-s{border-color:'+BRAND_COLOR+';background:'+BRAND_COLOR+';color:#fff;font-weight:600;}',
      '.cs-sb:disabled{opacity:.35;text-decoration:line-through;cursor:not-allowed;}',
      '.cs-cb{cursor:pointer;background:none;border:2px solid #d0d0d0;border-radius:50%;padding:3px;width:46px;height:46px;display:flex;align-items:center;justify-content:center;transition:border-color .15s;}',
      '.cs-cb:hover:not(:disabled){border-color:#888;}',
      '.cs-cb.cs-s{border-color:#1c1c1c;border-width:2.5px;}',
      '.cs-cb:disabled{opacity:.35;cursor:not-allowed;}',
      '.cs-csw{display:block;width:34px;height:34px;border-radius:50%;background-size:cover;background-position:center;border:1px solid rgba(0,0,0,.1);}',
    ].join('');
    document.head.appendChild(s);
  }

  function processComp(comp) {
    if (comp.dataset.csr) return;
    comp.dataset.csr = '1';

    // Obtener nombre de opción desde el legend
    var legend = comp.querySelector('legend');
    var optionName = legend ? legend.textContent.trim() : '';
    var isTalla = /talla|size|taille/i.test(optionName);
    var isColor = /colou?r/i.test(optionName);
    if (!isTalla && !isColor) return;

    // Radio inputs y botón combobox visible
    var radios = Array.from(comp.querySelectorAll('input[type="radio"]'));
    if (radios.length === 0) return;
    var comboBtn = comp.querySelector('.custom-select__button');

    // Label dinámico "Talla: 35"
    var dynLabel = document.createElement('span');
    dynLabel.className = 'cs-ol';
    var checked = comp.querySelector('input[type="radio"]:checked');
    var currentVal = checked ? checked.value : (radios[0] ? radios[0].value : '');
    function ul(v) { dynLabel.innerHTML = optionName + ': <span>' + v + '</span>'; }
    ul(currentVal);

    // Contenedor de botones
    var container = document.createElement('div');
    container.className = 'cs-vb';

    radios.forEach(function(radio) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.value = radio.value;

      if (isColor) {
        btn.className = 'cs-cb';
        btn.title = radio.value;
        var k = nk(radio.value);
        var sw = document.createElement('span');
        sw.className = 'cs-csw';
        if (ci[k])            sw.style.backgroundImage = 'url('+ci[k]+')';
        else if (CF[k])       sw.style.backgroundColor = CF[k];
        else if (CF[k]===null) sw.style.background = 'repeating-linear-gradient(45deg,#c0392b 0px 3px,#fff 3px 6px,#2980b9 6px 9px,#fff 9px 12px)';
        btn.appendChild(sw);
      } else {
        btn.className = 'cs-sb';
        btn.textContent = radio.value;
      }

      if (radio.disabled) btn.disabled = true;
      if (radio.checked)  btn.classList.add('cs-s');

      btn.addEventListener('click', function() {
        container.querySelectorAll('button').forEach(function(b){b.classList.remove('cs-s');});
        btn.classList.add('cs-s');
        ul(radio.value);
        // Marcar el radio y disparar el evento que usa el tema
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        // Actualizar el span data-selected-value del botón combobox (por si el tema lo lee)
        if (comboBtn) {
          var sv = comboBtn.querySelector('[data-selected-value]');
          if (sv) sv.textContent = radio.value;
        }
      });

      container.appendChild(btn);
    });

    // Ocultar el botón combobox (la flecha dropdown visible)
    if (comboBtn) comboBtn.style.display = 'none';

    // Ocultar el label externo que el tema renderiza FUERA del component-custom-select
    // (el "Talla" / "Color" que aparece como hermano o en el padre)
    var parent = comp.parentElement;
    if (parent) {
      var prev = comp.previousElementSibling;
      while (prev) {
        if (prev.textContent.trim() === optionName) {
          prev.style.display = 'none';
          break;
        }
        prev = prev.previousElementSibling;
      }
      // También buscar en el padre por si está envuelto un nivel más arriba
      if (!prev) {
        var grandParent = parent.parentElement;
        if (grandParent) {
          Array.from(grandParent.children).forEach(function(el) {
            if (!el.contains(comp) && el.textContent.trim() === optionName) {
              el.style.display = 'none';
            }
          });
        }
      }
    }

    // Insertar label + botones al inicio del componente
    comp.insertBefore(container, comp.firstChild);
    comp.insertBefore(dynLabel, comp.firstChild);

    // Sincronizar si el radio cambia externamente (URL con variante)
    radios.forEach(function(radio) {
      radio.addEventListener('change', function() {
        if (radio.checked) {
          ul(radio.value);
          container.querySelectorAll('button').forEach(function(b){
            b.classList.toggle('cs-s', b.dataset.value === radio.value);
          });
        }
      });
    });
  }

  function pps() {
    document.querySelectorAll('component-custom-select').forEach(function(comp) {
      processComp(comp);
    });
  }

  function init() {
    var h = gph(); if (!h) return;
    ivs();
    lpi(h, function() { pps(); });
    new MutationObserver(function(m){
      if(m.some(function(x){return x.addedNodes.length>0;})) pps();
    }).observe(document.body, {childList:true, subtree:true});
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

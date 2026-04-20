// ============================================================
// Crown Shoes — Personalizaciones del tema Platform
// ============================================================
// PARTE 1: Color Filter Swatches (páginas de colección)
// PARTE 2: Variant Buttons — Talla y Color (página de producto)
// ============================================================
// Pegar entre <script> y </script> justo antes de </body>
// en layout/theme.liquid
// ============================================================

// ── PARTE 1: Color Filter Swatches en colección ─────────────

(function () {
  'use strict';

  var COLOR_FALLBACK = {
    'ambar': '#C9A534', 'azul': '#1E3A8A', 'crema': '#F5EDD6',
    'dorado': '#D4AF37', 'negro': '#1C1C1C', 'nude': '#D4A491',
    'plateado': '#B0B0B0', 'rojo': '#C0272D', 'rosado': '#F4B8C1',
    'print': null,
  };

  var colorImages = {};
  var dataReady   = false;
  var STYLE_ID    = 'cs-filter-style';

  function normalizeKey(str) {
    return (str || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  }

  function shopifyThumb(src) {
    return src.replace(/(\.(jpe?g|png|gif|webp|avif))(\?.*)?$/i, '_80x$1$3');
  }

  function getCollectionHandle() {
    var m = window.location.pathname.match(/\/collections\/([^\/\?#]+)/);
    return m ? m[1] : null;
  }

  function loadFilterData(callback) {
    if (dataReady) { callback(); return; }
    var handle = getCollectionHandle();
    if (!handle) { dataReady = true; callback(); return; }

    fetch('/collections/' + encodeURIComponent(handle) + '/products.json?limit=250')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        (data.products || []).forEach(function (product) {
          var colorIdx = -1;
          (product.options || []).forEach(function (opt, i) {
            if (/colou?r/i.test(opt)) colorIdx = i;
          });
          if (colorIdx < 0) return;

          var productColorKeys = [];
          (product.variants || []).forEach(function (variant) {
            var val = variant['option' + (colorIdx + 1)];
            if (!val) return;
            var key = normalizeKey(val);
            if (!colorImages[key] && variant.featured_image && variant.featured_image.src) {
              colorImages[key] = shopifyThumb(variant.featured_image.src);
            }
            if (productColorKeys.indexOf(key) === -1) productColorKeys.push(key);
          });

          // Fallback: producto de un solo color → primera imagen del producto
          if (productColorKeys.length === 1 && !colorImages[productColorKeys[0]] &&
              product.images && product.images.length > 0) {
            colorImages[productColorKeys[0]] = shopifyThumb(product.images[0].src);
          }
        });
        dataReady = true;
        callback();
      })
      .catch(function () { dataReady = true; callback(); });
  }

  function injectFilterStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = '.cs-fswatch{display:inline-block;width:22px;height:22px;border-radius:50%;border:1.5px solid rgba(0,0,0,0.15);margin-right:8px;vertical-align:middle;flex-shrink:0;position:relative;top:-1px;background-size:cover;background-position:center;overflow:hidden;}';
    document.head.appendChild(s);
  }

  function findColorFilterInputs() {
    // Estrategia 1: input con "color" en el name
    var byName = Array.from(document.querySelectorAll(
      'input[name*="color" i][type="checkbox"], input[name*="colour" i][type="checkbox"]'
    ));
    if (byName.length > 0) return byName;

    // Estrategia 2: sección cuyo encabezado sea exactamente "Color"
    var sections = document.querySelectorAll('details, [class*="filter"], [class*="facet"], [class*="accordion"]');
    for (var i = 0; i < sections.length; i++) {
      var heading = sections[i].querySelector('summary, button, h2, h3, h4, [class*="heading"], [class*="title"]');
      if (heading && /^color$/i.test(heading.textContent.trim())) {
        var inputs = Array.from(sections[i].querySelectorAll('input[type="checkbox"]'));
        if (inputs.length > 0) return inputs;
      }
    }
    return [];
  }

  function addFilterSwatches() {
    var inputs = findColorFilterInputs();
    inputs.forEach(function (input) {
      var label = input.id
        ? document.querySelector('label[for="' + input.id + '"]')
        : input.closest('label');
      if (!label || label.querySelector('.cs-fswatch')) return;

      var rawValue = (input.value || '').trim();
      var key = /^gid:|^\d+$/.test(rawValue)
        ? normalizeKey(label.textContent.replace(/\s*\d+\s*$/, '').trim())
        : normalizeKey(rawValue);
      if (!key) return;

      var imgSrc = colorImages[key];
      var fallback = COLOR_FALLBACK[key];
      if (!imgSrc && fallback === undefined) return;

      var swatch = document.createElement('span');
      swatch.className = 'cs-fswatch';
      swatch.setAttribute('aria-hidden', 'true');

      if (imgSrc) {
        swatch.style.backgroundImage = 'url(' + imgSrc + ')';
      } else if (fallback) {
        swatch.style.backgroundColor = fallback;
      } else {
        swatch.style.background = 'repeating-linear-gradient(45deg,#c0392b 0px 3px,#fff 3px 6px,#2980b9 6px 9px,#fff 9px 12px)';
      }

      var inputInLabel = label.querySelector('input');
      if (inputInLabel && inputInLabel.nextSibling) {
        label.insertBefore(swatch, inputInLabel.nextSibling);
      } else {
        label.insertBefore(swatch, label.firstChild);
      }
    });
  }

  function initFilter() {
    injectFilterStyles();
    loadFilterData(function () { addFilterSwatches(); });
    new MutationObserver(function (mutations) {
      if (!mutations.some(function (m) { return m.addedNodes.length > 0; })) return;
      if (dataReady) addFilterSwatches();
      else loadFilterData(function () { addFilterSwatches(); });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initFilter);
  else initFilter();
})();


// ── PARTE 2: Variant Buttons en página de producto ───────────

(function () {
  'use strict';

  var BRAND_COLOR = '#C41670';

  var COLOR_FALLBACK = {
    'ambar': '#C9A534', 'azul': '#1E3A8A', 'crema': '#F5EDD6',
    'dorado': '#D4AF37', 'negro': '#1C1C1C', 'nude': '#D4A491',
    'plateado': '#B0B0B0', 'rojo': '#C0272D', 'rosado': '#F4B8C1',
    'print': null,
  };

  var colorImages = {};
  var STYLE_ID = 'cs-variant-style';

  function normalizeKey(str) {
    return (str || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  }

  function shopifyThumb(src) {
    return src.replace(/(\.(jpe?g|png|gif|webp|avif))(\?.*)?$/i, '_80x$1$3');
  }

  function getProductHandle() {
    var m = window.location.pathname.match(/\/products\/([^\/\?#]+)/);
    return m ? m[1] : null;
  }

  function loadProductImages(handle, callback) {
    fetch('/products/' + encodeURIComponent(handle) + '.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var product = data.product || {};
        var colorIdx = -1;
        (product.options || []).forEach(function (opt, i) {
          if (/colou?r/i.test(opt.name || opt)) colorIdx = i;
        });
        if (colorIdx >= 0) {
          (product.variants || []).forEach(function (v) {
            var val = v['option' + (colorIdx + 1)];
            if (!val) return;
            var key = normalizeKey(val);
            if (!colorImages[key] && v.featured_image && v.featured_image.src)
              colorImages[key] = shopifyThumb(v.featured_image.src);
          });
          var uc = [];
          (product.variants || []).forEach(function (v) {
            var k = v['option' + (colorIdx + 1)]; k = k ? normalizeKey(k) : null;
            if (k && uc.indexOf(k) === -1) uc.push(k);
          });
          if (uc.length === 1 && !colorImages[uc[0]] && product.images && product.images[0])
            colorImages[uc[0]] = shopifyThumb(product.images[0].src);
        }
        callback();
      })
      .catch(function () { callback(); });
  }

  function injectVariantStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = [
      '.cs-opt-label{font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;margin-bottom:10px;display:block;}',
      '.cs-opt-label span{font-weight:400;text-transform:none;}',
      '.cs-variant-btns{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:4px;}',
      // Botón talla
      '.cs-size-btn{cursor:pointer;background:#fff;color:#1c1c1c;border:1.5px solid #d0d0d0;border-radius:4px;padding:8px 14px;font-size:14px;font-family:inherit;line-height:1;min-width:44px;text-align:center;transition:border-color .15s,background .15s,color .15s;}',
      '.cs-size-btn:hover:not(:disabled){border-color:#888;}',
      '.cs-size-btn.cs-sel{border-color:' + BRAND_COLOR + ';background:' + BRAND_COLOR + ';color:#fff;font-weight:600;}',
      '.cs-size-btn:disabled{opacity:.35;text-decoration:line-through;cursor:not-allowed;}',
      // Botón color
      '.cs-color-btn{cursor:pointer;background:none;border:2px solid #d0d0d0;border-radius:50%;padding:3px;width:46px;height:46px;display:flex;align-items:center;justify-content:center;transition:border-color .15s;}',
      '.cs-color-btn:hover:not(:disabled){border-color:#888;}',
      '.cs-color-btn.cs-sel{border-color:#1c1c1c;border-width:2.5px;}',
      '.cs-color-btn:disabled{opacity:.35;cursor:not-allowed;}',
      '.cs-color-swatch{display:block;width:34px;height:34px;border-radius:50%;background-size:cover;background-position:center;border:1px solid rgba(0,0,0,0.1);}',
    ].join('\n');
    document.head.appendChild(s);
  }

  function replaceSelect(select, type, labelEl, selectContainer) {
    if (select.dataset.csReplaced) return;
    select.dataset.csReplaced = '1';

    var origLabel = labelEl ? labelEl.textContent.trim() : (type === 'color' ? 'Color' : 'Talla');

    // Label dinámico "Talla: 36" / "Color: Crema"
    var dynLabel = document.createElement('span');
    dynLabel.className = 'cs-opt-label';
    function updateLabel(val) {
      dynLabel.innerHTML = origLabel + ': <span>' + val + '</span>';
    }
    var currentVal = select.options[select.selectedIndex] ? select.options[select.selectedIndex].value : '';
    updateLabel(currentVal);

    // Ocultar label original y el contenedor del select (incluye el SVG de la flecha)
    if (labelEl) labelEl.style.display = 'none';
    var hideTarget = selectContainer || select;
    hideTarget.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;';

    // Crear botones
    var container = document.createElement('div');
    container.className = 'cs-variant-btns';

    Array.from(select.options).forEach(function (option) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.value = option.value;

      if (type === 'color') {
        btn.className = 'cs-color-btn';
        btn.title = option.value;
        var key = normalizeKey(option.value);
        var sw = document.createElement('span');
        sw.className = 'cs-color-swatch';
        if (colorImages[key])           sw.style.backgroundImage = 'url(' + colorImages[key] + ')';
        else if (COLOR_FALLBACK[key])   sw.style.backgroundColor = COLOR_FALLBACK[key];
        else if (COLOR_FALLBACK[key] === null)
          sw.style.background = 'repeating-linear-gradient(45deg,#c0392b 0px 3px,#fff 3px 6px,#2980b9 6px 9px,#fff 9px 12px)';
        btn.appendChild(sw);
      } else {
        btn.className = 'cs-size-btn';
        btn.textContent = option.value;
      }

      if (option.disabled) btn.disabled = true;
      if (option.selected) btn.classList.add('cs-sel');

      btn.addEventListener('click', function () {
        container.querySelectorAll('button').forEach(function (b) { b.classList.remove('cs-sel'); });
        btn.classList.add('cs-sel');
        updateLabel(option.value);
        select.value = option.value;
        // Platform theme escucha el evento "change" en el select
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });

      container.appendChild(btn);
    });

    // Insertar: dynLabel + botones antes del contenedor oculto
    hideTarget.parentNode.insertBefore(dynLabel, hideTarget);
    hideTarget.parentNode.insertBefore(container, hideTarget);

    // Sincronizar si el select cambia desde el tema (ej. URL con variante)
    select.addEventListener('change', function () {
      updateLabel(select.value);
      container.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('cs-sel', b.dataset.value === select.value);
      });
    });
  }

  function processProductSelects() {
    // Platform theme: variant-selects contiene los selects de opciones
    // Cada opción está en un wrapper con el select y un SVG (la flecha del dropdown)
    var selects = document.querySelectorAll(
      'variant-selects select[name^="options"], ' +
      '.product-form__input select[name^="options"], ' +
      'select[name^="options["]'
    );

    selects.forEach(function (select) {
      if (select.dataset.csReplaced) return;

      // Encontrar el wrapper (.product-form__input o similar) y el label
      var wrapper       = select.closest('.product-form__input') ||
                          select.closest('[class*="variant-input"]') ||
                          select.parentElement.parentElement;
      var labelEl       = wrapper ? wrapper.querySelector('label, legend, .form__label') : null;
      var selectWrapper = select.closest('.select') || select.parentElement; // div con select + SVG

      var nameTxt  = (select.getAttribute('name') || '').toLowerCase();
      var labelTxt = labelEl ? labelEl.textContent.toLowerCase().trim() : '';
      var optionName = '';

      // Platform puede tener data-option-name en el wrapper padre
      var outerWrapper = select.closest('[data-option-name]');
      if (outerWrapper) optionName = outerWrapper.getAttribute('data-option-name').toLowerCase();

      var isTalla = /talla|size|taille/i.test(nameTxt) || /talla|size/i.test(labelTxt) || /talla|size/i.test(optionName);
      var isColor = /colou?r/i.test(nameTxt) || /^color/i.test(labelTxt) || /colou?r/i.test(optionName);

      if (isTalla)      replaceSelect(select, 'size',  labelEl, selectWrapper);
      else if (isColor) replaceSelect(select, 'color', labelEl, selectWrapper);
    });
  }

  function initVariants() {
    var handle = getProductHandle();
    if (!handle) return;

    injectVariantStyles();

    loadProductImages(handle, function () {
      processProductSelects();
    });

    // MutationObserver: Platform carga el form como módulo ES, puede tardar
    new MutationObserver(function (mutations) {
      if (mutations.some(function (m) { return m.addedNodes.length > 0; }))
        processProductSelects();
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initVariants);
  else initVariants();
})();

/**
 * Crown Shoes — Selector de variantes en página de producto
 * Tema: Platform (Groupthought)
 *
 * - Talla: botones horizontales con fill rosa al seleccionar
 *          el label muestra "Talla: 36" dinámicamente
 * - Color: círculos con imagen de variante
 *          el label muestra "Color: Crema" dinámicamente
 *
 * INSTALACIÓN:
 * Pegar en theme.liquid justo antes de </body>:
 *
 *   <script>
 *     // [contenido de este archivo]
 *   </script>
 */

(function () {
  'use strict';

  // Color de marca Crown Shoes para el estado seleccionado
  var BRAND_COLOR = '#C41670';

  var COLOR_FALLBACK = {
    'ambar':    '#C9A534',
    'azul':     '#1E3A8A',
    'crema':    '#F5EDD6',
    'dorado':   '#D4AF37',
    'negro':    '#1C1C1C',
    'nude':     '#D4A491',
    'plateado': '#B0B0B0',
    'rojo':     '#C0272D',
    'rosado':   '#F4B8C1',
    'print':    null,
  };

  var colorImages = {};
  var STYLE_ID = 'cs-variant-btn-style';

  // ─── Utilidades ───────────────────────────────────────────────────────────

  function normalizeKey(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .trim();
  }

  function shopifyThumb(src) {
    return src.replace(/(\.(jpe?g|png|gif|webp|avif))(\?.*)?$/i, '_80x$1$3');
  }

  function getProductHandle() {
    var m = window.location.pathname.match(/\/products\/([^\/\?#]+)/);
    return m ? m[1] : null;
  }

  // ─── Carga imágenes de variante ───────────────────────────────────────────

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
          (product.variants || []).forEach(function (variant) {
            var val = variant['option' + (colorIdx + 1)];
            if (!val) return;
            var key = normalizeKey(val);
            if (!colorImages[key] && variant.featured_image && variant.featured_image.src) {
              colorImages[key] = shopifyThumb(variant.featured_image.src);
            }
          });

          // Fallback: producto de un solo color → usar primera imagen
          var uniqueColors = [];
          (product.variants || []).forEach(function (v) {
            var val = v['option' + (colorIdx + 1)];
            var key = val ? normalizeKey(val) : null;
            if (key && uniqueColors.indexOf(key) === -1) uniqueColors.push(key);
          });

          if (
            uniqueColors.length === 1 &&
            !colorImages[uniqueColors[0]] &&
            product.images && product.images.length > 0
          ) {
            colorImages[uniqueColors[0]] = shopifyThumb(product.images[0].src);
          }
        }

        callback();
      })
      .catch(function () { callback(); });
  }

  // ─── Estilos ──────────────────────────────────────────────────────────────

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      /* Label con valor seleccionado */
      '.cs-option-label { font-size:13px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; margin-bottom:10px; display:block; }',
      '.cs-option-label span { font-weight:400; text-transform:none; }',

      /* Contenedor de botones */
      '.cs-variant-btns { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px; }',

      /* Botón de talla */
      '.cs-size-btn {',
      '  cursor:pointer; background:#fff; color:#1c1c1c;',
      '  border:1.5px solid #d0d0d0; border-radius:4px;',
      '  padding:8px 14px; font-size:14px; font-family:inherit;',
      '  line-height:1; min-width:44px; text-align:center;',
      '  transition:border-color .15s, background .15s, color .15s;',
      '}',
      '.cs-size-btn:hover:not(:disabled) { border-color:#888; }',
      '.cs-size-btn.cs-selected {',
      '  border-color:' + BRAND_COLOR + ';',
      '  background:' + BRAND_COLOR + ';',
      '  color:#fff; font-weight:600;',
      '}',
      '.cs-size-btn:disabled { opacity:.35; text-decoration:line-through; cursor:not-allowed; }',

      /* Botón de color */
      '.cs-color-btn {',
      '  cursor:pointer; background:none;',
      '  border:2px solid #d0d0d0; border-radius:50%;',
      '  padding:3px; width:46px; height:46px;',
      '  display:flex; align-items:center; justify-content:center;',
      '  transition:border-color .15s, border-width .15s;',
      '}',
      '.cs-color-btn:hover:not(:disabled) { border-color:#888; }',
      '.cs-color-btn.cs-selected { border-color:#1c1c1c; border-width:2.5px; }',
      '.cs-color-btn:disabled { opacity:.35; cursor:not-allowed; }',
      '.cs-color-swatch {',
      '  display:block; width:34px; height:34px; border-radius:50%;',
      '  background-size:cover; background-position:center;',
      '  border:1px solid rgba(0,0,0,0.1);',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  // ─── Reemplazo de <select> ────────────────────────────────────────────────

  function replaceSelect(select, type, labelEl) {
    if (select.dataset.csReplaced) return;
    select.dataset.csReplaced = '1';

    var originalLabelText = labelEl ? labelEl.textContent.trim() : (type === 'color' ? 'Color' : 'Talla');

    // Nuevo label dinámico: "Talla: <valor>"
    var dynamicLabel = document.createElement('span');
    dynamicLabel.className = 'cs-option-label';

    function updateLabel(val) {
      dynamicLabel.innerHTML = originalLabelText + ': <span>' + val + '</span>';
    }
    updateLabel(select.options[select.selectedIndex] ? select.options[select.selectedIndex].value : '');

    // Ocultar label original
    if (labelEl) labelEl.style.display = 'none';

    // Contenedor de botones
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
        var swatch = document.createElement('span');
        swatch.className = 'cs-color-swatch';

        if (colorImages[key]) {
          swatch.style.backgroundImage = 'url(' + colorImages[key] + ')';
        } else if (COLOR_FALLBACK[key]) {
          swatch.style.backgroundColor = COLOR_FALLBACK[key];
        } else if (COLOR_FALLBACK[key] === null) {
          swatch.style.background = 'repeating-linear-gradient(45deg,#c0392b 0px 3px,#fff 3px 6px,#2980b9 6px 9px,#fff 9px 12px)';
        }
        btn.appendChild(swatch);
      } else {
        btn.className = 'cs-size-btn';
        btn.textContent = option.value;
      }

      if (option.disabled) btn.disabled = true;
      if (option.selected) btn.classList.add('cs-selected');

      btn.addEventListener('click', function () {
        container.querySelectorAll('button').forEach(function (b) {
          b.classList.remove('cs-selected');
        });
        btn.classList.add('cs-selected');
        updateLabel(option.value);
        select.value = option.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });

      container.appendChild(btn);
    });

    // Ocultar el select (debe quedar en el DOM para el form)
    select.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;';

    // Insertar: label dinámico + botones
    var insertBefore = labelEl || select;
    insertBefore.parentNode.insertBefore(dynamicLabel, insertBefore);
    insertBefore.parentNode.insertBefore(container, insertBefore);

    // Sincronizar si el select cambia externamente
    select.addEventListener('change', function () {
      updateLabel(select.value);
      container.querySelectorAll('button').forEach(function (btn) {
        btn.classList.toggle('cs-selected', btn.dataset.value === select.value);
      });
    });
  }

  // ─── Procesar selects del producto ───────────────────────────────────────

  function processProductSelects() {
    var selects = document.querySelectorAll(
      'variant-selects select, .product-form select[name^="options"]'
    );

    selects.forEach(function (select) {
      if (select.dataset.csReplaced) return;

      var wrapper  = select.closest('.product-form__input, [class*="option-wrapper"]');
      var labelEl  = wrapper ? wrapper.querySelector('label') : null;
      var labelTxt = labelEl ? labelEl.textContent.toLowerCase() : '';
      var nameTxt  = (select.getAttribute('name') || '').toLowerCase();

      if (/talla|size|taille/i.test(nameTxt) || /talla|size/i.test(labelTxt)) {
        replaceSelect(select, 'size', labelEl);
      } else if (/colou?r/i.test(nameTxt) || /^color/i.test(labelTxt.trim())) {
        replaceSelect(select, 'color', labelEl);
      }
    });
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  function init() {
    if (!getProductHandle()) return;

    injectStyles();

    loadProductImages(getProductHandle(), function () {
      processProductSelects();
    });

    var observer = new MutationObserver(function (mutations) {
      if (mutations.some(function (m) { return m.addedNodes.length > 0; })) {
        processProductSelects();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

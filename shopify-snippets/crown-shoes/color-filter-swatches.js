/**
 * Crown Shoes — Color Filter Swatches con imágenes de variante
 * Tema: Platform (Groupthought)
 *
 * INSTALACIÓN:
 * 1. Shopify Admin → Online Store → Themes → ··· → Edit code
 * 2. Abrir layout/theme.liquid
 * 3. Pegar el bloque <script>...</script> justo antes de </body>:
 *
 *    <script>
 *      // [pegar todo el contenido de este archivo aquí]
 *    </script>
 */

(function () {
  'use strict';

  // Colores de respaldo si un producto no tiene imagen
  var COLOR_FALLBACK = {
    'ambar':    '#C9A534',
    'ámbar':    '#C9A534',
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
  var dataReady   = false;
  var STYLE_ID    = 'cs-swatches-style';

  // ─── Utilidades ───────────────────────────────────────────────────────────

  function getCollectionHandle() {
    var m = window.location.pathname.match(/\/collections\/([^\/\?#]+)/);
    return m ? m[1] : null;
  }

  function shopifyThumb(src) {
    // Inserta _80x antes de la extensión para obtener thumbnail pequeño
    return src.replace(/(\.(jpe?g|png|gif|webp|avif))(\?.*)?$/i, '_80x$1$3');
  }

  function normalizeKey(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '') // quita tildes
      .trim();
  }

  // ─── Carga de datos via API de Shopify ────────────────────────────────────

  function loadData(callback) {
    if (dataReady) { callback(); return; }

    var handle = getCollectionHandle();
    if (!handle) { dataReady = true; callback(); return; }

    fetch('/collections/' + encodeURIComponent(handle) + '/products.json?limit=250')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        (data.products || []).forEach(function (product) {

          // Detectar qué índice de opción es el Color
          var colorIdx = -1;
          (product.options || []).forEach(function (opt, i) {
            if (/colou?r/i.test(opt)) colorIdx = i;
          });
          if (colorIdx < 0) return;

          // Recopilar todos los valores de color únicos en este producto
          var productColorKeys = [];
          (product.variants || []).forEach(function (variant) {
            var val = variant['option' + (colorIdx + 1)];
            if (!val) return;
            var key = normalizeKey(val);

            // 1er intento: imagen asignada directamente a la variante
            if (!colorImages[key] && variant.featured_image && variant.featured_image.src) {
              colorImages[key] = shopifyThumb(variant.featured_image.src);
            }

            if (productColorKeys.indexOf(key) === -1) productColorKeys.push(key);
          });

          // 2do intento (fallback): si el producto tiene UNA sola variante de color
          // y aún no tiene imagen mapeada, usar la primera imagen del producto
          if (
            productColorKeys.length === 1 &&
            !colorImages[productColorKeys[0]] &&
            product.images && product.images.length > 0
          ) {
            colorImages[productColorKeys[0]] = shopifyThumb(product.images[0].src);
          }
        });

        dataReady = true;
        callback();
      })
      .catch(function () {
        dataReady = true;
        callback();
      });
  }

  // ─── Estilos ──────────────────────────────────────────────────────────────

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.cs-swatch {',
      '  display: inline-block;',
      '  width: 22px;',
      '  height: 22px;',
      '  border-radius: 50%;',
      '  border: 1.5px solid rgba(0,0,0,0.15);',
      '  margin-right: 8px;',
      '  vertical-align: middle;',
      '  flex-shrink: 0;',
      '  position: relative;',
      '  top: -1px;',
      '  background-size: cover;',
      '  background-position: center;',
      '  overflow: hidden;',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  // ─── Búsqueda de inputs de color en el filtro ─────────────────────────────

  function findColorFilterInputs() {
    // Estrategia 1: inputs con "color" en el name (filter.p.option.Color)
    var byName = Array.from(document.querySelectorAll(
      'input[name*="color" i][type="checkbox"], input[name*="colour" i][type="checkbox"]'
    ));
    if (byName.length > 0) return byName;

    // Estrategia 2: buscar la sección de filtro cuyo encabezado sea "Color"
    // y tomar todos los checkboxes dentro de ella
    var sections = document.querySelectorAll(
      'details, [class*="filter"], [class*="facet"], [class*="accordion"]'
    );
    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      var heading = section.querySelector(
        'summary, button, h2, h3, h4, [class*="heading"], [class*="title"], [class*="label"]'
      );
      if (heading && /^color$/i.test(heading.textContent.trim())) {
        var inputs = Array.from(section.querySelectorAll('input[type="checkbox"]'));
        if (inputs.length > 0) return inputs;
      }
    }

    return [];
  }

  // ─── Inserción de swatches ────────────────────────────────────────────────

  function addSwatches() {
    var inputs = findColorFilterInputs();

    inputs.forEach(function (input) {
      var label = input.id
        ? document.querySelector('label[for="' + input.id + '"]')
        : input.closest('label');

      if (!label || label.querySelector('.cs-swatch')) return;

      // Obtener clave de color: primero del value del input, sino del texto del label
      var rawValue = (input.value || '').trim();
      // Los GIDs de Shopify Search&Discovery no son nombres de color
      var key = /^gid:|^\d+$/.test(rawValue)
        ? normalizeKey(label.textContent.replace(/\s*\d+\s*$/, '').trim())
        : normalizeKey(rawValue);

      if (!key) return;

      var imgSrc   = colorImages[key];
      var fallback = COLOR_FALLBACK[key];

      // Necesitamos al menos imagen o color de respaldo
      if (!imgSrc && fallback === undefined) return;

      var swatch = document.createElement('span');
      swatch.className = 'cs-swatch';
      swatch.setAttribute('aria-hidden', 'true');

      if (imgSrc) {
        swatch.style.backgroundImage = 'url(' + imgSrc + ')';
      } else if (fallback) {
        swatch.style.backgroundColor = fallback;
      } else {
        swatch.style.background =
          'repeating-linear-gradient(45deg,#c0392b 0px 3px,#fff 3px 6px,#2980b9 6px 9px,#fff 9px 12px)';
      }

      // Insertar después del checkbox (si está dentro del label) o al inicio
      var inputInLabel = label.querySelector('input');
      if (inputInLabel && inputInLabel.nextSibling) {
        label.insertBefore(swatch, inputInLabel.nextSibling);
      } else {
        label.insertBefore(swatch, label.firstChild);
      }
    });
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  function init() {
    injectStyles();

    loadData(function () { addSwatches(); });

    // Reaplicar cuando el drawer AJAX del tema Platform carga los filtros
    var observer = new MutationObserver(function (mutations) {
      var hasNew = mutations.some(function (m) { return m.addedNodes.length > 0; });
      if (!hasNew) return;
      if (dataReady) {
        addSwatches();
      } else {
        loadData(function () { addSwatches(); });
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

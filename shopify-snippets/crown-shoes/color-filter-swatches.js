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
 *
 * CÓMO FUNCIONA:
 * - Lee los productos de la colección actual via /collections/{handle}/products.json
 * - Por cada producto, busca la imagen asignada a cada variante de color
 * - Muestra esa imagen como swatch circular en el filtro
 * - Si una variante no tiene imagen asignada, usa un color de respaldo
 * - Compatible con el drawer AJAX del tema Platform (MutationObserver)
 */

(function () {
  'use strict';

  // Colores de respaldo por si una variante no tiene imagen asignada
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

  var colorImages = {};   // { 'rojo': 'https://cdn.shopify.com/...', ... }
  var dataReady   = false;
  var STYLE_ID    = 'cs-swatches-style';

  // ─── Utilidades ───────────────────────────────────────────────────────────

  function getCollectionHandle() {
    var m = window.location.pathname.match(/\/collections\/([^\/\?#]+)/);
    return m ? m[1] : null;
  }

  // Transforma URL de CDN de Shopify para obtener un thumbnail pequeño
  // Ejemplo: image.jpg → image_80x.jpg
  function shopifyThumb(src) {
    return src.replace(/(\.(jpe?g|png|gif|webp|avif))(\?.*)?$/i, '_80x$1$3');
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

          // Por cada variante del producto, tomar su imagen asignada
          (product.variants || []).forEach(function (variant) {
            var val = variant['option' + (colorIdx + 1)];
            if (!val) return;

            var key = val.toLowerCase().trim();

            // Solo guardar la primera imagen encontrada para ese color
            if (colorImages[key]) return;

            var fi = variant.featured_image;
            if (fi && fi.src) {
              colorImages[key] = shopifyThumb(fi.src);
            }
          });
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

  // ─── Inserción de swatches ────────────────────────────────────────────────

  function addSwatches() {
    // Busca todos los checkboxes de filtro de color
    // En Shopify, los filtros de opción usan name="filter.p.option.{Nombre}"
    var inputs = document.querySelectorAll(
      'input[name*="color" i][type="checkbox"], input[name*="colour" i][type="checkbox"]'
    );

    inputs.forEach(function (input) {
      var label = input.id
        ? document.querySelector('label[for="' + input.id + '"]')
        : input.closest('label');

      if (!label || label.querySelector('.cs-swatch')) return;

      var key     = (input.value || '').toLowerCase().trim();
      var imgSrc  = colorImages[key];
      var fallback = COLOR_FALLBACK[key];

      if (!imgSrc && fallback === undefined) return;

      var swatch = document.createElement('span');
      swatch.className = 'cs-swatch';
      swatch.setAttribute('aria-hidden', 'true');

      if (imgSrc) {
        swatch.style.backgroundImage = 'url(' + imgSrc + ')';
      } else if (fallback) {
        swatch.style.backgroundColor = fallback;
      } else {
        // Print u otros colores sin imagen ni hex: patrón por defecto
        swatch.style.background =
          'repeating-linear-gradient(45deg, #c0392b 0px 3px, #fff 3px 6px, #2980b9 6px 9px, #fff 9px 12px)';
      }

      // Insertar después del input (si está dentro del label) o al inicio
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

    // Cargar imágenes de variantes y luego aplicar swatches
    loadData(function () {
      addSwatches();
    });

    // MutationObserver: reaplicar cuando el drawer de filtros se abre (AJAX)
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

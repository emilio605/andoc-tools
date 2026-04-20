/**
 * Crown Shoes — Color Filter Swatches
 * Tema: Platform (Groupthought)
 *
 * INSTALACIÓN:
 * 1. En Shopify Admin > Online Store > Themes > Edit code
 * 2. Abrir layout/theme.liquid
 * 3. Pegar el contenido de este archivo justo antes de </body>
 *    usando una etiqueta <script>:
 *
 *    <script>
 *      // [pegar el código de abajo]
 *    </script>
 */

(function () {
  'use strict';

  // Mapa de colores: nombre en minúsculas → hex
  var COLOR_MAP = {
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
    'print':    'print',
  };

  var STYLE_ID = 'cs-swatches-style';

  var CSS = [
    '.cs-swatch {',
    '  display: inline-block;',
    '  width: 18px;',
    '  height: 18px;',
    '  border-radius: 50%;',
    '  border: 1.5px solid rgba(0,0,0,0.18);',
    '  margin-right: 7px;',
    '  vertical-align: middle;',
    '  flex-shrink: 0;',
    '  position: relative;',
    '  top: -1px;',
    '}',
    '.cs-swatch--print {',
    '  background: repeating-linear-gradient(',
    '    45deg,',
    '    #c0392b 0px 3px,',
    '    #fff 3px 6px,',
    '    #2980b9 6px 9px,',
    '    #fff 9px 12px',
    '  );',
    '}',
    '.cs-swatch--plateado {',
    '  background: linear-gradient(135deg, #d8d8d8 0%, #f0f0f0 40%, #a8a8a8 100%);',
    '}',
    '.cs-swatch--dorado {',
    '  background: linear-gradient(135deg, #c8a415 0%, #f0d060 50%, #a07010 100%);',
    '}',
  ].join('\n');

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function buildSwatch(colorName, hexValue) {
    var swatch = document.createElement('span');
    var slug = colorName.replace(/[áä]/g, 'a');
    swatch.className = 'cs-swatch cs-swatch--' + slug;
    swatch.setAttribute('aria-hidden', 'true');
    if (hexValue && hexValue !== 'print') {
      swatch.style.backgroundColor = hexValue;
    }
    return swatch;
  }

  function addSwatches() {
    // Busca inputs de filtro de color por el atributo name de Shopify
    // Los filtros de opción de producto tienen name="filter.p.option.{Nombre}"
    var inputs = document.querySelectorAll(
      'input[name*="color" i][type="checkbox"], input[name*="colour" i][type="checkbox"]'
    );

    inputs.forEach(function (input) {
      var label = input.id
        ? document.querySelector('label[for="' + input.id + '"]')
        : input.closest('label');

      if (!label) return;
      if (label.querySelector('.cs-swatch')) return; // ya tiene swatch

      var colorName = (input.value || '').toLowerCase().normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // quita tildes para comparar
        .trim();

      // Busca con y sin tildes
      var originalName = (input.value || '').toLowerCase().trim();
      var hexValue = COLOR_MAP[originalName] !== undefined
        ? COLOR_MAP[originalName]
        : COLOR_MAP[colorName];

      if (hexValue === undefined) return;

      var swatch = buildSwatch(originalName, hexValue);

      // Insertar después del input (si está dentro del label) o al inicio
      var inputInsideLabel = label.querySelector('input');
      if (inputInsideLabel && inputInsideLabel.nextSibling) {
        label.insertBefore(swatch, inputInsideLabel.nextSibling);
      } else {
        label.insertBefore(swatch, label.firstChild);
      }
    });
  }

  function init() {
    injectStyles();
    addSwatches();

    // MutationObserver para el drawer de filtros (Platform usa AJAX)
    var observer = new MutationObserver(function (mutations) {
      var hasAdditions = mutations.some(function (m) { return m.addedNodes.length > 0; });
      if (hasAdditions) addSwatches();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

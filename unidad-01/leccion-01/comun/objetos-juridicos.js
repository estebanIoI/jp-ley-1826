/* Motivos vectoriales sin personajes para las mediaciones de la lección 1. */
(function (global) {
  'use strict';
  var P = global.Personajes;
  if (!P) throw new Error('Cargar personajes.js antes de objetos-juridicos.js');
  var C = P.C;
  var J = {};
  J.documento = function (x, y, s, acento) {
    return '<g class="obj-documento" transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
      '<rect x="5" y="6" width="82" height="106" rx="8" fill="' + C.marino + '" opacity=".13"/>' +
      '<path d="M0 8 Q0 0 8 0 H60 L82 22 V98 Q82 106 74 106 H8 Q0 106 0 98 Z" fill="' + C.blanco + '"/>' +
      '<path d="M60 0 V22 H82 Z" fill="' + C.niebla + '"/>' +
      '<rect x="13" y="37" width="55" height="5" rx="2" fill="' + C.celeste + '"/>' +
      '<rect x="13" y="50" width="55" height="5" rx="2" fill="' + C.celeste + '"/>' +
      '<rect x="13" y="63" width="39" height="5" rx="2" fill="' + C.celeste + '"/>' +
      '<circle cx="60" cy="83" r="11" fill="' + (acento || C.oxido) + '"/><path d="M55 83 l4 4 7 -9" fill="none" stroke="' + C.blanco + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</g>';
  };
  J.expediente = function (x, y, s, color) {
    return '<g class="obj-expediente" transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
      '<rect x="12" y="0" width="78" height="90" rx="5" fill="' + C.blanco + '"/>' +
      '<rect x="23" y="15" width="55" height="4" rx="2" fill="' + C.celeste + '"/>' +
      '<rect x="23" y="27" width="43" height="4" rx="2" fill="' + C.celeste + '"/>' +
      '<path d="M0 27 H38 L47 36 H102 V95 Q102 101 96 101 H6 Q0 101 0 95 Z" fill="' + (color || C.teal) + '"/>' +
      '<rect x="15" y="55" width="68" height="6" rx="3" fill="' + C.blanco + '" opacity=".85"/>' +
      '<rect x="15" y="69" width="46" height="5" rx="2.5" fill="' + C.blanco + '" opacity=".6"/>' +
      '</g>';
  };
  /* Juan y Esteban (26–27/10/2026): sin martillo ni balanza. «mazo» dibuja ahora un sello oficial sobre su base,
     en el mismo espacio, para no alterar las escenas que lo usan. */
  J.mazo = function (x, y, s) {
    return '<g class="obj-mazo obj-sello" transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
      '<rect x="19" y="81" width="107" height="13" rx="5" fill="' + C.marino + '"/>' +
      '<path d="M42 81 L49 56 H97 L104 81 Z" fill="' + C.oxido + '"/>' +
      '<rect x="64" y="24" width="18" height="34" rx="6" fill="' + C.madera + '"/><circle cx="73" cy="20" r="13" fill="' + C.madera + '"/>' +
      '<rect x="50" y="86" width="46" height="3.5" rx="1.75" fill="' + C.crema + '" opacity=".8"/>' +
      '</g>';
  };
  J.flecha = function (x1, y1, x2, y2, color, clase) {
    var dx = x2 - x1, dy = y2 - y1, largo = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / largo, uy = dy / largo, bx = x2 - 15 * ux, by = y2 - 15 * uy;
    return '<g class="obj-flecha ' + (clase || '') + '"><path d="M' + x1 + ' ' + y1 + ' L' + bx + ' ' + by + '" fill="none" stroke="' + (color || C.oxido) + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M' + x2 + ' ' + y2 + ' L' + (bx - 8 * uy) + ' ' + (by + 8 * ux) + ' L' + (bx + 8 * uy) + ' ' + (by - 8 * ux) + ' Z" fill="' + (color || C.oxido) + '"/></g>';
  };
  J.bandeja = function (x, y, s, color) {
    return '<g class="obj-bandeja" transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
      '<path d="M0 25 H24 L34 52 H116 L126 25 H150 L137 75 Q135 82 128 82 H22 Q15 82 13 75 Z" fill="' + (color || C.teal) + '"/>' +
      '<rect x="11" y="80" width="128" height="7" rx="3" fill="' + C.marino + '" opacity=".55"/></g>';
  };
  P.objJ = J;
})(window);

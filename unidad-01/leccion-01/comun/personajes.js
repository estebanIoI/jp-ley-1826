/* Personajes e ilustraciones planas · Ley 1826 de 2017 · JP-OVA
   Mismo lenguaje que los corredores de las diapositivas de Juan: figuras planas sin
   contorno, pantalón azul marino, camisas claras o verde azulado, cabello oscuro,
   sombra elíptica gris y acentos óxido. Todo se dibuja en SVG; no hay imágenes.
   Las ilustraciones son decorativas (aria-hidden): el contenido está en el HTML. */
(function (global) {
  'use strict';

  var C = {
    piel: ['#F3CDBB', '#D9A384', '#A86E50', '#6B4332'],
    pelo: '#221E2B', canas: '#B9B6B0',
    marino: '#1F3D5F', celeste: '#A8BCCB', teal: '#30615B', tealClaro: '#6E9A92',
    blanco: '#FFFFFF', oxido: '#AD4D32', naranja: '#D8693F', crema: '#F2F3B8',
    coral: '#F0CAC7', niebla: '#D7E4E6', gris: '#494949', grisClaro: '#C9CCCB',
    toga: '#2A2C33', madera: '#8A5A3C', zapato: '#162C45', papel: '#FFFFFF'
  };

  function oscurecer(hex, f) {
    var n = parseInt(hex.slice(1), 16), k = 1 - (f || 0.14);
    var r = Math.round((n >> 16) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  function rad(a) { return a * Math.PI / 180; }
  function r1(v) { return Math.round(v * 10) / 10; }

  /* Ángulos absolutos en grados medidos desde la vertical hacia abajo; positivo = hacia
     donde mira la figura. Brazos: [brazo, antebrazo]; piernas: [muslo, pantorrilla]. */
  var POSES = {
    pie:      { af: [6, 2],     ab: [-6, -2],   lf: [4, 0],    lb: [-4, 0] },
    camina:   { af: [24, 42],   ab: [-24, -12], lf: [24, 6],   lb: [-20, -30] },
    corre:    { af: [72, 98],   ab: [-58, -18], lf: [55, 10],  lb: [-36, -102] },
    senala:   { af: [96, 94],   ab: [-6, -2],   lf: [4, 0],    lb: [-4, 0] },
    explica:  { af: [138, 162], ab: [-6, -2],   lf: [6, 0],    lb: [-6, 0] },
    alto:     { af: [92, 172],  ab: [-6, -2],   lf: [6, 0],    lb: [-6, 0] },
    carga:    { af: [24, 98],   ab: [16, 92],   lf: [4, 0],    lb: [-4, 0] },
    entrega:  { af: [78, 86],   ab: [-14, -4],  lf: [18, 2],   lb: [-14, -8] },
    recibe:   { af: [62, 80],   ab: [-10, -2],  lf: [10, 0],   lb: [-10, -2] },
    celebra:  { af: [150, 172], ab: [-150, -172], lf: [6, 0],  lb: [-6, 0] },
    sentado:  { af: [26, 86],   ab: [18, 80],   lf: [86, 2],   lb: [82, 4] },
    agobio:   { af: [150, -150], ab: [-150, 150], lf: [8, 0],  lb: [-8, 0] }
  };
  var L = { brazo: 31, ante: 29, muslo: 44, pierna: 44 };

  function extremo(x, y, ang, largo) {
    return [x + largo * Math.sin(rad(ang)), y + largo * Math.cos(rad(ang))];
  }

  function miembro(p0, angs, largos, color, ancho) {
    var p1 = extremo(p0[0], p0[1], angs[0], largos[0]);
    var p2 = extremo(p1[0], p1[1], angs[1], largos[1]);
    return {
      svg: '<polyline points="' + [p0, p1, p2].map(function (p) { return r1(p[0]) + ',' + r1(p[1]); }).join(' ') +
        '" fill="none" stroke="' + color + '" stroke-width="' + ancho + '" stroke-linecap="round" stroke-linejoin="round"/>',
      fin: p2, codo: p1
    };
  }

  function zapato(p, ang, color) {
    return '<path transform="translate(' + r1(p[0]) + ' ' + r1(p[1] + 5) + ') rotate(' + r1(-ang) + ')" d="M-6 -5 H8 Q15 -5 15 1 V4 H-7 Z" fill="' + color + '"/>';
  }

  function cabello(estilo, hx, hy, color) {
    var cap = '<path d="M' + (hx - 15) + ' ' + (hy + 3) + ' C' + (hx - 19) + ' ' + (hy - 7) + ' ' + (hx - 12) + ' ' + (hy - 17) + ' ' + (hx - 2) + ' ' + (hy - 18) +
      ' C' + (hx + 4) + ' ' + (hy - 20) + ' ' + (hx + 10) + ' ' + (hy - 18) + ' ' + (hx + 13) + ' ' + (hy - 12) +
      ' C' + (hx + 19) + ' ' + (hy - 14) + ' ' + (hx + 20) + ' ' + (hy - 7) + ' ' + (hx + 15) + ' ' + (hy - 4) +
      ' Q' + (hx + 9) + ' ' + (hy - 2) + ' ' + (hx + 4) + ' ' + (hy - 5) +
      ' C' + (hx - 2) + ' ' + (hy - 6) + ' ' + (hx - 5) + ' ' + (hy + 2) + ' ' + (hx - 7) + ' ' + (hy + 8) +
      ' Q' + (hx - 13) + ' ' + (hy + 10) + ' ' + (hx - 15) + ' ' + (hy + 3) + 'Z" fill="' + color + '"/>';
    var atras = '';
    if (estilo === 'cola') atras = '<path d="M' + (hx - 10) + ' ' + (hy - 8) + ' C' + (hx - 22) + ' ' + (hy - 14) + ' ' + (hx - 30) + ' ' + (hy - 3) + ' ' + (hx - 48) + ' ' + (hy + 10) + ' C' + (hx - 36) + ' ' + (hy + 10) + ' ' + (hx - 23) + ' ' + (hy + 7) + ' ' + (hx - 12) + ' ' + (hy + 5) + 'Z" fill="' + color + '"/>';
    if (estilo === 'moño') atras = '<circle cx="' + (hx - 14) + '" cy="' + (hy - 7) + '" r="8" fill="' + color + '"/>';
    if (estilo === 'largo') atras = '<path d="M' + (hx - 11) + ' ' + (hy - 10) + ' C' + (hx - 23) + ' ' + (hy - 5) + ' ' + (hx - 14) + ' ' + (hy + 6) + ' ' + (hx - 23) + ' ' + (hy + 15) + ' C' + (hx - 30) + ' ' + (hy + 24) + ' ' + (hx - 22) + ' ' + (hy + 32) + ' ' + (hx - 11) + ' ' + (hy + 30) + ' Q' + (hx + 1) + ' ' + (hy + 25) + ' ' + (hx + 1) + ' ' + (hy + 9) + 'Z" fill="' + color + '"/>';
    if (estilo === 'rizado') atras = '<circle cx="' + (hx - 6) + '" cy="' + (hy - 5) + '" r="16" fill="' + color + '"/><circle cx="' + (hx - 17) + '" cy="' + (hy - 12) + '" r="8" fill="' + color + '"/><circle cx="' + (hx - 15) + '" cy="' + (hy + 6) + '" r="9" fill="' + color + '"/>';
    return { atras: atras, cap: cap };
  }

  function mano(p, piel) {
    return '<g transform="translate(' + r1(p[0]) + ' ' + r1(p[1]) + ')">' +
      '<path d="M-4 -4 Q1 -7 5 -3 L8 1 Q9 4 6 5 L1 6 Q-4 6 -6 2 Z" fill="' + piel + '"/>' +
      '<path d="M3 -2 L8 -5 M4 0 L10 -2" fill="none" stroke="' + oscurecer(piel, .12) + '" stroke-width="1.15" stroke-linecap="round"/>' +
      '</g>';
  }

  var PROPS = {
    documento: function (p) {
      return '<g transform="translate(' + r1(p[0] - 4) + ' ' + r1(p[1] - 22) + ') rotate(-8)"><rect width="19" height="25" rx="2" fill="' + C.papel + '"/>' +
        '<rect x="4" y="6" width="11" height="2" fill="' + C.grisClaro + '"/><rect x="4" y="11" width="11" height="2" fill="' + C.grisClaro + '"/><rect x="4" y="16" width="7" height="2" fill="' + C.grisClaro + '"/></g>';
    },
    carpeta: function (p) {
      return '<g transform="translate(' + r1(p[0] - 6) + ' ' + r1(p[1] - 15) + ')"><rect width="28" height="20" rx="2" fill="' + C.oxido + '"/><rect x="2" y="-3" width="11" height="5" rx="1.5" fill="' + C.oxido + '"/><rect x="4" y="5" width="20" height="2" fill="' + C.coral + '"/></g>';
    },
    mazo: function (p) {
      return '<g transform="translate(' + r1(p[0]) + ' ' + r1(p[1]) + ') rotate(-35)"><rect x="-2" y="-20" width="4" height="24" rx="2" fill="' + C.madera + '"/><rect x="-10" y="-27" width="20" height="10" rx="3" fill="' + oscurecer(C.madera, .2) + '"/></g>';
    },
    baston: function (p) {
      return '<rect transform="translate(' + r1(p[0] - 3) + ' ' + r1(p[1] - 6) + ') rotate(-24)" width="26" height="7" rx="2" fill="' + C.naranja + '"/>';
    },
    maletin: function (p) {
      return '<g transform="translate(' + r1(p[0] - 12) + ' ' + r1(p[1] + 1) + ')"><path d="M8 0 V-3 H16 V0" fill="none" stroke="' + C.zapato + '" stroke-width="2.4"/><rect y="0" width="24" height="17" rx="3" fill="' + C.zapato + '"/><rect x="10" y="6" width="4" height="3" fill="' + C.naranja + '"/></g>';
    },
    reloj: function (p) {
      return '<g transform="translate(' + r1(p[0] + 4) + ' ' + r1(p[1] - 6) + ')"><rect x="-2" y="-14" width="4" height="5" fill="' + C.gris + '"/><circle r="10" fill="' + C.teal + '"/><circle r="7.5" fill="' + C.blanco + '"/><path d="M0 0 V-5 M0 0 L4 2" stroke="' + C.oxido + '" stroke-width="1.8" stroke-linecap="round"/></g>';
    }
  };

  function persona(o) {
    o = o || {};
    var pose = POSES[o.pose] || POSES.pie;
    var piel = o.piel || C.piel[0], pelo = o.pelo || C.pelo;
    var camisa = o.camisa || C.blanco, saco = o.chaqueta || null;
    var pantalon = o.pantalon || C.marino, zap = o.zapatos || C.zapato;
    var toga = !!o.toga, manga = toga ? C.toga : (saco || camisa);
    var hf = [5, 0], hb = [-4, 0], sf = [8, -53], sb = [-4, -53];
    var anchoP = 19, anchoB = 13;

    var piernaB = miembro(hb, pose.lb, [L.muslo, L.pierna], oscurecer(pantalon, .18), anchoP);
    var piernaF = miembro(hf, pose.lf, [L.muslo, L.pierna], pantalon, anchoP);
    var brazoB = miembro(sb, pose.ab, [L.brazo, L.ante], oscurecer(manga, .16), anchoB);
    var brazoF = miembro(sf, pose.af, [L.brazo, L.ante], manga, anchoB);
    var piso = Math.max(piernaB.fin[1], piernaF.fin[1]) + 9;
    if (o.anclaje === 'cadera') piso = 0;

    var hx = 3, hy = -81, pelo2 = cabello(o.peinado || 'corto', hx, hy, pelo);
    var g = [];
    g.push(brazoB.svg, mano(brazoB.fin, oscurecer(piel, .08)));
    if (o.propAtras && PROPS[o.propAtras]) g.push(PROPS[o.propAtras](brazoB.fin));
    g.push(piernaB.svg, zapato(piernaB.fin, pose.lb[1], oscurecer(zap, .1)));
    g.push(piernaF.svg, zapato(piernaF.fin, pose.lf[1], zap));
    g.push('<rect x="-17" y="-8" width="36" height="14" rx="6" fill="' + pantalon + '"/>');
    if (toga) {
      g.push('<path d="M-16 -56 Q-16 -62 -10 -62 H12 Q18 -62 18 -56 L23 40 H-21 Z" fill="' + C.toga + '"/>' +
        '<path d="M-3 -62 L3 -52 L9 -62 Z" fill="' + C.blanco + '"/>');
    } else {
      g.push('<path d="M-20 -51 Q-20 -61 -9 -64 Q1 -67 12 -63 Q21 -60 22 -50 L19 2 Q1 7 -18 2 Z" fill="' + (saco || camisa) + '"/>');
      if (saco) g.push('<path d="M-5 -63 Q2 -60 9 -63 L7 -24 L-1 -24 Z" fill="' + camisa + '"/>' +
        '<path d="M-7 -63 L2 -51 L-2 -33 L-12 -54 Z" fill="' + oscurecer(saco, .13) + '"/>' +
        '<path d="M12 -62 L3 -51 L8 -33 L18 -52 Z" fill="' + oscurecer(saco, .2) + '"/>' +
        '<path d="M2 -52 L5 -47 L3 -30 L0 -30 L-1 -47 Z" fill="' + C.teal + '"/>' +
        '<path d="M-15 -1 Q0 2 17 -1" fill="none" stroke="' + oscurecer(saco, .17) + '" stroke-width="1.5"/>');
    }
    g.push('<rect x="-2" y="-70" width="10" height="10" rx="2" fill="' + oscurecer(piel, .08) + '"/>');
    g.push(pelo2.atras,
      '<path d="M-11 -89 Q-6 -98 5 -96 Q15 -94 16 -84 L19 -78 Q20 -75 17 -74 L15 -72 Q15 -65 10 -63 Q2 -60 -6 -65 Q-13 -71 -12 -81 Z" fill="' + piel + '"/>',
      '<path d="M-11 -82 Q-15 -84 -15 -78 Q-14 -73 -10 -73" fill="' + piel + '" stroke="' + oscurecer(piel, .1) + '" stroke-width="1"/>',
      '<path d="M8 -65 Q11 -65 13 -67" fill="none" stroke="' + oscurecer(piel, .12) + '" stroke-width="1" stroke-linecap="round"/>', pelo2.cap);
    g.push(brazoF.svg, mano(brazoF.fin, piel));
    if (o.prop && PROPS[o.prop]) g.push(PROPS[o.prop](brazoF.fin));

    var s = o.s || 1, mira = o.mira === -1 ? -1 : 1;
    var sombra = o.sombra === false ? '' : '<ellipse cx="' + (o.x || 0) + '" cy="' + (o.y || 0) + '" rx="' + r1(40 * s) + '" ry="' + r1(6 * s) + '" fill="#000" opacity=".09"/>';
    return sombra + '<g class="persona ' + (o.clase || '') + '" transform="translate(' + (o.x || 0) + ' ' + (o.y || 0) + ') scale(' + (s * mira) + ' ' + s + ')">' +
      '<g transform="translate(0 ' + r1(-piso) + ')">' + g.join('') + '</g></g>';
  }

  /* ---------- Objetos ---------- */
  var O = {};
  O.suelo = function (y, ancho) {
    return '<rect x="0" y="' + y + '" width="' + (ancho || 760) + '" height="60" fill="#000" opacity=".045"/>';
  };
  O.etiqueta = function (x, y, texto, fondo, color, tam) {
    tam = tam || 13;
    var w = Math.round(texto.length * tam * 0.62 + 22);
    return '<g transform="translate(' + x + ' ' + y + ')"><rect x="' + (-w / 2) + '" y="' + (-tam - 4) + '" width="' + w + '" height="' + (tam * 2 + 2) + '" rx="' + (tam + 1) + '" fill="' + (fondo || C.marino) + '"/>' +
      '<text x="0" y="' + (tam * 0.38) + '" text-anchor="middle" font-family="Montserrat,Arial,sans-serif" font-weight="700" font-size="' + tam + '" fill="' + (color || C.blanco) + '">' + texto + '</text></g>';
  };
  O.estrado = function (x, y, w, h, color) {
    color = color || C.teal;
    return '<g transform="translate(' + x + ' ' + y + ')"><rect x="0" y="0" width="' + w + '" height="' + h + '" rx="4" fill="' + color + '"/>' +
      '<rect x="-6" y="-8" width="' + (w + 12) + '" height="10" rx="3" fill="' + oscurecer(color, .25) + '"/>' +
      '<circle cx="' + (w / 2) + '" cy="' + (h / 2) + '" r="' + Math.min(14, h / 4) + '" fill="' + C.crema + '" opacity=".9"/></g>';
  };
  O.escritorio = function (x, y, w) {
    return '<g transform="translate(' + x + ' ' + y + ')"><rect x="0" y="0" width="' + w + '" height="8" rx="3" fill="' + C.marino + '"/>' +
      '<rect x="8" y="8" width="7" height="52" fill="' + oscurecer(C.marino, .2) + '"/><rect x="' + (w - 15) + '" y="8" width="7" height="52" fill="' + oscurecer(C.marino, .2) + '"/></g>';
  };
  O.silla = function (x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')"><rect x="-4" y="-46" width="8" height="48" rx="3" fill="' + C.oxido + '"/><rect x="-4" y="-2" width="40" height="8" rx="3" fill="' + C.oxido + '"/><rect x="28" y="4" width="6" height="40" fill="' + oscurecer(C.oxido, .2) + '"/><rect x="0" y="4" width="6" height="40" fill="' + oscurecer(C.oxido, .2) + '"/></g>';
  };
  O.carpetas = function (x, y, n, clase) {
    var col = [C.oxido, C.niebla, C.crema, C.teal, C.coral, C.celeste], s = '';
    for (var i = 0; i < n; i++) {
      var dx = ((i * 37) % 11) - 5;
      s += '<g class="carpeta" style="--i:' + i + '" transform="translate(' + (x + dx) + ' ' + (y - i * 11) + ')"><rect x="0" y="-10" width="62" height="10" rx="2" fill="' + col[i % col.length] + '"/><rect x="4" y="-7" width="20" height="2" fill="#fff" opacity=".7"/></g>';
    }
    return '<g class="' + (clase || '') + '">' + s + '</g>';
  };
  O.calendario = function (x, y, w, dia, mes, anio) {
    var h = w * 1.05;
    return '<g transform="translate(' + x + ' ' + y + ')"><rect x="6" y="6" width="' + w + '" height="' + h + '" rx="12" fill="' + C.teal + '"/>' +
      '<rect width="' + w + '" height="' + h + '" rx="12" fill="' + C.blanco + '"/>' +
      '<path d="M0 12 Q0 0 12 0 H' + (w - 12) + ' Q' + w + ' 0 ' + w + ' 12 V' + (h * 0.26) + ' H0 Z" fill="' + C.oxido + '"/>' +
      '<rect x="' + (w * 0.25 - 4) + '" y="-10" width="8" height="22" rx="4" fill="' + C.gris + '"/><rect x="' + (w * 0.75 - 4) + '" y="-10" width="8" height="22" rx="4" fill="' + C.gris + '"/>' +
      '<text x="' + (w / 2) + '" y="' + (h * 0.19) + '" text-anchor="middle" font-family="Montserrat,Arial,sans-serif" font-weight="800" font-size="' + (w * 0.12) + '" fill="#fff" letter-spacing="2">' + mes + '</text>' +
      '<text x="' + (w / 2) + '" y="' + (h * 0.72) + '" text-anchor="middle" font-family="Montserrat,Arial,sans-serif" font-weight="800" font-size="' + (w * 0.46) + '" fill="' + C.teal + '">' + dia + '</text>' +
      '<text x="' + (w / 2) + '" y="' + (h * 0.9) + '" text-anchor="middle" font-family="Montserrat,Arial,sans-serif" font-weight="700" font-size="' + (w * 0.13) + '" fill="' + C.gris + '">' + anio + '</text></g>';
  };
  O.reloj = function (x, y, r) {
    return '<g transform="translate(' + x + ' ' + y + ')"><circle r="' + r + '" fill="' + C.teal + '"/>' +
      Array.apply(null, Array(12)).map(function (_, i) { var a = i * 30; return '<rect x="-1.5" y="' + (-r * 0.86) + '" width="3" height="' + (r * 0.12) + '" fill="#fff" transform="rotate(' + a + ')"/>'; }).join('') +
      '<rect class="aguja-min" x="-2" y="' + (-r * 0.72) + '" width="4" height="' + (r * 0.72) + '" rx="2" fill="' + C.niebla + '"/>' +
      '<rect class="aguja-hora" x="-2.5" y="' + (-r * 0.5) + '" width="5" height="' + (r * 0.5) + '" rx="2" fill="' + C.niebla + '" transform="rotate(62)"/><circle r="' + (r * 0.07) + '" fill="' + C.niebla + '"/></g>';
  };
  O.balanza = function (x, y, s, clase) {
    s = s || 1;
    var plato = function (px) {
      return '<g class="plato" transform="translate(' + px + ' 0)"><path d="M0 0 L-22 46 M0 0 L22 46" stroke="' + C.gris + '" stroke-width="1.6"/><path d="M-30 46 H30 Q26 60 0 60 Q-26 60 -30 46 Z" fill="' + C.oxido + '"/></g>';
    };
    return '<g class="balanza ' + (clase || '') + '" transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<rect x="-5" y="0" width="10" height="150" fill="' + C.marino + '"/><path d="M-38 160 Q-38 146 -20 146 H20 Q38 146 38 160 Z" fill="' + C.marino + '"/>' +
      '<g class="viga"><rect x="-100" y="-4" width="200" height="8" rx="4" fill="' + C.teal + '"/>' + plato(-96) + plato(96) + '</g>' +
      '<circle cx="0" cy="0" r="11" fill="' + C.crema + '" stroke="' + C.teal + '" stroke-width="4"/></g>';
  };
  O.muro = function (x, y, w, h) {
    var s = '<g transform="translate(' + x + ' ' + y + ')"><rect width="' + w + '" height="' + h + '" fill="' + C.oxido + '"/>';
    for (var fy = 0, f = 0; fy < h; fy += 18, f++) {
      for (var fx = (f % 2) * -18; fx < w; fx += 36) s += '<rect x="' + Math.max(0, fx + 2) + '" y="' + (fy + 2) + '" width="' + Math.min(32, w - Math.max(0, fx + 2) - 2) + '" height="14" rx="2" fill="' + oscurecer(C.oxido, -0.12) + '" opacity=".55"/>';
    }
    return s + '</g>';
  };
  O.corte = function (x, y, w) {
    var h = w * 0.75, s = '<g transform="translate(' + x + ' ' + y + ')">';
    s += '<path d="M' + (-w * 0.06) + ' ' + (h * 0.28) + ' L' + (w / 2) + ' 0 L' + (w * 1.06) + ' ' + (h * 0.28) + ' Z" fill="' + C.teal + '"/>';
    s += '<rect x="0" y="' + (h * 0.28) + '" width="' + w + '" height="' + (h * 0.07) + '" fill="' + oscurecer(C.teal, .25) + '"/>';
    for (var i = 0; i < 5; i++) s += '<rect x="' + (w * 0.06 + i * w * 0.2) + '" y="' + (h * 0.38) + '" width="' + (w * 0.09) + '" height="' + (h * 0.5) + '" fill="' + C.niebla + '"/>';
    s += '<rect x="' + (-w * 0.04) + '" y="' + (h * 0.88) + '" width="' + (w * 1.08) + '" height="' + (h * 0.12) + '" fill="' + oscurecer(C.teal, .25) + '"/>';
    return s + '</g>';
  };
  O.rejas = function (x, y, w, h) {
    var s = '<g transform="translate(' + x + ' ' + y + ')"><rect width="' + w + '" height="' + h + '" rx="6" fill="' + C.gris + '"/><rect x="6" y="6" width="' + (w - 12) + '" height="' + (h - 12) + '" rx="3" fill="' + C.niebla + '"/>';
    for (var i = 1; i < 5; i++) s += '<rect x="' + (i * w / 5 - 3) + '" y="4" width="6" height="' + (h - 8) + '" rx="3" fill="' + C.marino + '"/>';
    return s + '</g>';
  };
  O.caja = function (x, y, w, candado) {
    var h = w * 0.7;
    return '<g transform="translate(' + x + ' ' + y + ')"><rect width="' + w + '" height="' + h + '" rx="5" fill="' + C.madera + '"/><rect y="0" width="' + w + '" height="' + (h * 0.25) + '" rx="5" fill="' + oscurecer(C.madera, .2) + '"/>' +
      (candado ? '<g transform="translate(' + (w / 2) + ' ' + (h * 0.45) + ')"><path d="M-8 0 V-8 A8 8 0 0 1 8 -8 V0" fill="none" stroke="' + C.gris + '" stroke-width="4"/><rect x="-12" y="-1" width="24" height="20" rx="3" fill="' + C.crema + '"/><circle cy="8" r="3" fill="' + C.gris + '"/></g>' : '') + '</g>';
  };
  O.puerta = function (x, y, w, h, color, clase) {
    return '<g class="puerta ' + (clase || '') + '" transform="translate(' + x + ' ' + y + ')"><rect x="-8" y="-8" width="' + (w + 16) + '" height="' + (h + 8) + '" rx="' + (w / 2 + 8) + '" fill="' + oscurecer(color, .3) + '"/>' +
      '<rect width="' + w + '" height="' + h + '" rx="' + (w / 2) + '" fill="' + color + '"/><circle cx="' + (w * 0.8) + '" cy="' + (h * 0.58) + '" r="4" fill="' + C.crema + '"/></g>';
  };
  O.lupa = function (x, y, r) {
    return '<g transform="translate(' + x + ' ' + y + ')"><rect x="' + (r * 0.6) + '" y="' + (r * 0.6) + '" width="' + (r * 0.32) + '" height="' + (r * 1.1) + '" rx="4" fill="' + C.marino + '" transform="rotate(-45 ' + (r * 0.7) + ' ' + (r * 0.7) + ')"/><circle r="' + r + '" fill="' + C.niebla + '" stroke="' + C.marino + '" stroke-width="' + (r * 0.22) + '"/></g>';
  };
  O.hoja = function (x, y, s, rot, clase) {
    return '<g class="' + (clase || '') + '" transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ') scale(' + (s || 1) + ')"><rect width="40" height="52" rx="3" fill="' + C.papel + '"/><rect x="8" y="10" width="24" height="3" fill="' + C.grisClaro + '"/><rect x="8" y="18" width="24" height="3" fill="' + C.grisClaro + '"/><rect x="8" y="26" width="24" height="3" fill="' + C.grisClaro + '"/><rect x="8" y="34" width="14" height="3" fill="' + C.grisClaro + '"/><rect x="24" y="40" width="10" height="6" rx="2" fill="' + C.oxido + '"/></g>';
  };
  O.planta = function (x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M0 0 C-4 -30 -26 -40 -30 -64 C-12 -56 -2 -36 0 0 Z" fill="' + C.teal + '"/><path d="M2 0 C6 -36 22 -52 34 -70 C36 -46 18 -26 2 0 Z" fill="' + C.tealClaro + '"/><path d="M0 0 C-2 -24 2 -50 0 -84 C10 -60 8 -30 0 0 Z" fill="' + oscurecer(C.teal, .15) + '"/><path d="M-14 0 H16 L12 24 H-10 Z" fill="' + C.oxido + '"/></g>';
  };
  O.burbuja = function (x, y, w, h, color) {
    return '<g transform="translate(' + x + ' ' + y + ')"><rect width="' + w + '" height="' + h + '" rx="' + (h / 2) + '" fill="' + (color || C.blanco) + '"/><path d="M' + (w * 0.22) + ' ' + (h - 2) + ' L' + (w * 0.16) + ' ' + (h + 14) + ' L' + (w * 0.36) + ' ' + (h - 2) + ' Z" fill="' + (color || C.blanco) + '"/></g>';
  };

  global.Personajes = { persona: persona, obj: O, C: C, oscurecer: oscurecer };
})(window);

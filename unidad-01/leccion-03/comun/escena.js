/* Escenas del objeto virtual · Ley 1826 de 2017 · JP-OVA (revisión 3)
   - Una idea por escena (<section class="escena">); «Anterior», puntos y «Siguiente» al pie
     recorren las escenas del apartado (reunión con Juan). ?escena=N abre una concreta.
   - Tarjetas que giran (.giro, aria-pressed).
   - Puntos activos (.punto[data-capa]) que abren una capa (.capa) sobre la ilustración.
   - Comparador antes/ahora (.comparador con input[type=range]).
   Escape cierra la capa abierta y el foco vuelve al punto que la abrió. */
(function () {
  'use strict';
  var raiz = document.querySelector('[data-ova]');
  if (!raiz) return;
  var escenas = [].slice.call(raiz.querySelectorAll('.escena'));
  /* Modo diapositiva (?escena=N): una escena por diapositiva de Genially, que es quien
     navega; el HTML no trae títulos ni navegación propia (revisión 5). */
  var param = parseInt(new URLSearchParams(location.search).get('escena'), 10);
  var unaEscena = param > 0;
  if (unaEscena) raiz.classList.add('una-escena');
  /* Los puntos de la ilustración abren mensajes sobre la lámina sin alterar
     el alto de la escena. Otras capas (como la decisión B2) conservan su flujo. */
  escenas.forEach(function (e) {
    var lamina = e.querySelector('.lamina:not(.pano)');
    if (!lamina) return;
    [].forEach.call(e.querySelectorAll('.punto[data-capa]'), function (p) {
      var c = document.getElementById(p.dataset.capa);
      if (!c || !e.contains(c)) return;
      c.classList.remove('en-texto', 'arriba');
      c.classList.add('mensaje');
      lamina.appendChild(c);
    });
  });
  var actual = 0, abierta = null, origen = null;

  /* Navegación interna al pie de la mediación */
  var nav = document.createElement('nav');
  nav.className = 'ova-nav';
  nav.setAttribute('aria-label', 'Escenas de este apartado');
  nav.innerHTML = '<button type="button" class="btn sec" data-ir="-1"><i class="fas fa-arrow-left" aria-hidden="true"></i><span>Anterior</span></button>' +
    '<span class="pos"><span class="puntos-nav">' + escenas.map(function (e, i) {
      return '<button type="button" class="dot" data-escena="' + i + '" aria-label="Ir a ' + (i + 1) + ' de ' + escenas.length + ': ' + (e.dataset.titulo || '') + '"></button>';
    }).join('') + '</span><span class="cuenta" aria-hidden="true"></span></span>' +
    '<button type="button" class="btn" data-ir="1"><span>Siguiente</span><i class="fas fa-arrow-right" aria-hidden="true"></i></button>';
  var avance = document.createElement('div');
  avance.className = 'avance'; avance.setAttribute('aria-hidden', 'true');
  avance.innerHTML = '<span></span>';
  if (escenas.length > 1 && !unaEscena) { raiz.appendChild(nav); raiz.appendChild(avance); }
  var dots = [].slice.call(nav.querySelectorAll('.dot'));
  var vivo = document.createElement('p');
  vivo.className = 'sr'; vivo.setAttribute('aria-live', 'polite');
  raiz.appendChild(vivo);

  function ir(i, foco) {
    cerrar();
    actual = Math.max(0, Math.min(i, escenas.length - 1));
    escenas.forEach(function (e, k) {
      e.hidden = k !== actual;
      e.classList.toggle('entra', k === actual);
    });
    dots.forEach(function (d, k) {
      d.setAttribute('aria-current', k === actual ? 'step' : 'false');
      if (k < actual) d.classList.add('visto');
    });
    nav.querySelector('[data-ir="-1"]').disabled = actual === 0;
    nav.querySelector('[data-ir="1"]').disabled = actual === escenas.length - 1;
    nav.querySelector('.cuenta').textContent = (actual + 1) + ' de ' + escenas.length + ' · Avance ' + Math.round((actual + 1) / escenas.length * 100) + ' %';
    avance.firstChild.style.width = ((actual + 1) / escenas.length * 100) + '%';
    vivo.textContent = (actual + 1) + ' de ' + escenas.length + ': ' + (escenas[actual].dataset.titulo || '');
    if (foco) { var t = escenas[actual].querySelector('h2'); if (t) { t.tabIndex = -1; t.focus({ preventScroll: true }); } }
    raiz.dispatchEvent(new CustomEvent('escena', { detail: { indice: actual, escena: escenas[actual] } }));
  }
  nav.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.ir) ir(actual + Number(b.dataset.ir), true);
    if (b.dataset.escena) ir(Number(b.dataset.escena), true);
  });

  /* Capas superpuestas */
  function abrir(id, desde) {
    var capa = document.getElementById(id); if (!capa) return;
    if (abierta === capa) { cerrar(); return; }
    cerrar();
    abierta = capa; origen = desde || null;
    capa.hidden = false;
    capa.classList.remove('aparece'); void capa.offsetWidth; capa.classList.add('aparece');
    var lamina = capa.closest('.lamina'), escena = capa.closest('.escena');
    if (lamina) lamina.dataset.estado = id;
    if (escena) escena.dataset.estado = id;
    if (desde) { desde.setAttribute('aria-expanded', 'true'); desde.classList.add('visto'); }
    var t = capa.querySelector('h3') || capa;
    t.tabIndex = -1; t.focus({ preventScroll: true });
    raiz.dispatchEvent(new CustomEvent('capa', { detail: { id: id } }));
  }
  function cerrar() {
    if (!abierta) return;
    abierta.hidden = true;
    [abierta.closest('.lamina'), abierta.closest('.escena')].forEach(function (el) {
      if (el && el.dataset.estado === abierta.id) delete el.dataset.estado;
    });
    if (origen) { origen.setAttribute('aria-expanded', 'false'); origen.focus({ preventScroll: true }); }
    var id = abierta.id;
    abierta = null; origen = null;
    raiz.dispatchEvent(new CustomEvent('capa-cerrada', { detail: { id: id } }));
  }
  raiz.addEventListener('click', function (e) {
    var p = e.target.closest('[data-capa]');
    if (p) { abrir(p.dataset.capa, p); return; }
    if (e.target.closest('.cerrar')) cerrar();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && abierta) { e.preventDefault(); cerrar(); }
  });
  [].forEach.call(raiz.querySelectorAll('.capa'), function (c) {
    c.hidden = true;
    c.setAttribute('role', 'dialog');
    c.setAttribute('aria-modal', 'false');
    if (!c.querySelector('.cerrar')) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'btn sec cerrar'; b.textContent = 'Cerrar';
      b.setAttribute('aria-label', 'Cerrar (Esc)');
      c.appendChild(b);
    }
  });
  [].forEach.call(raiz.querySelectorAll('[data-capa]'), function (p) {
    p.setAttribute('aria-expanded', 'false');
    p.setAttribute('aria-controls', p.dataset.capa);
  });

  /* Comparador antes / ahora */
  [].forEach.call(raiz.querySelectorAll('.comparador'), function (cmp) {
    var r = cmp.querySelector('input[type=range]');
    var lados = (cmp.closest('.escena') || cmp).querySelectorAll('[data-lado]');
    function pintar() {
      var v = Number(r.value);   /* posición de la división: a la derecha se ve más «Antes» */
      cmp.style.setProperty('--corte', v + '%');
      var lado = v >= 50 ? 'antes' : 'ahora';
      cmp.dataset.lado = lado;
      r.setAttribute('aria-valuetext', lado === 'ahora' ? (r.dataset.ahora || 'Ahora') : (r.dataset.antes || 'Antes'));
      [].forEach.call(lados, function (l) {
        var ocultar = l.dataset.lado !== lado;
        if (ocultar && l.getAttribute('aria-expanded') === 'true') cerrar();
        l.hidden = ocultar;
      });
    }
    r.addEventListener('input', pintar);
    [].forEach.call(cmp.querySelectorAll('[data-ir-lado]'), function (b) {
      b.addEventListener('click', function () { r.value = b.dataset.irLado === 'ahora' ? 0 : 100; pintar(); });
    });
    pintar();
  });

  /* Escenario 360° ilustrado (.lamina.pano): la pista mide 3 zonas; se gira con las flechas,
     arrastrando o con el teclado, y del final se vuelve al inicio. */
  [].forEach.call(raiz.querySelectorAll('.lamina.pano'), function (pano) {
    var pista = pano.querySelector('.pano-pista'), zonas = 3, zona = 0, x0 = null, dx = 0;
    function pintar(animar) {
      pista.style.transition = animar ? 'transform .6s cubic-bezier(.4,.1,.3,1)' : 'none';
      pista.style.transform = 'translateX(calc(' + (-zona * 100 / zonas) + '% + ' + dx + 'px))';
    }
    function girar(d) { cerrar(); zona = (zona + d + zonas) % zonas; dx = 0; pintar(true); }
    [].forEach.call(pano.querySelectorAll('[data-girar]'), function (b) {
      b.addEventListener('click', function () { girar(Number(b.dataset.girar)); });
    });
    pano.addEventListener('keydown', function (e) {
      if (e.target !== pano) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); girar(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); girar(-1); }
    });
    pista.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; x0 = e.clientX; pista.setPointerCapture(e.pointerId); });
    pista.addEventListener('pointermove', function (e) { if (x0 === null) return; dx = e.clientX - x0; pintar(false); });
    pista.addEventListener('pointerup', function () {
      if (x0 === null) return;
      var umbral = pano.clientWidth * 0.18, d = dx < -umbral ? 1 : dx > umbral ? -1 : 0;
      x0 = null; dx = 0; if (d) girar(d); else pintar(true);
    });
    pintar(false);
  });

  /* Tarjetas que giran */
  [].forEach.call(raiz.querySelectorAll('.giro'), function (g) {
    g.setAttribute('aria-pressed', 'false');
    g.addEventListener('click', function () {
      g.setAttribute('aria-pressed', String(g.getAttribute('aria-pressed') !== 'true'));
    });
  });

  /* Ilustraciones: cada <svg data-dibujo="nombre"> se completa con window.DIBUJOS[nombre] */
  [].forEach.call(raiz.querySelectorAll('svg[data-dibujo]'), function (s) {
    var fn = window.DIBUJOS && window.DIBUJOS[s.dataset.dibujo];
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    if (fn) s.innerHTML = fn(window.Personajes);
  });

  /* Visto y avance (patrón de Juan, docs/patrones-juan.md): lo que abre contenido queda
     marcado con fa-circle-check y una escena con 3 o más elementos lleva barra de avance. */
  var VISTOS = '[data-capa], .giro, [role=tab], [data-visto], .nodo';
  escenas.forEach(function (e) {
    var n = e.querySelectorAll(VISTOS).length;
    if (n < 3) return;
    var barra = document.createElement('div');
    barra.className = 'avance-escena';
    barra.setAttribute('role', 'progressbar');
    barra.setAttribute('aria-valuemin', '0');
    barra.setAttribute('aria-valuemax', String(n));
    barra.setAttribute('aria-valuenow', '0');
    barra.setAttribute('aria-label', 'Avance: 0 de ' + n);
    barra.innerHTML = '<span></span>';
    e.appendChild(barra);
  });
  function marcar(el) {
    if (!el || el.hasAttribute('data-visto-ok')) return;
    el.setAttribute('data-visto-ok', '');
    el.classList.add('visto');
    if (!(el instanceof SVGElement)) {
      (el.querySelector('.n') || el).insertAdjacentHTML('beforeend', '<i class="fas fa-circle-check marca-visto" aria-hidden="true"></i>');
    }
    var e = el.closest('.escena'), barra = e && e.querySelector('.avance-escena');
    if (!barra) return;
    var total = Number(barra.getAttribute('aria-valuemax'));
    var vistos = e.querySelectorAll('[data-visto-ok]').length;
    barra.setAttribute('aria-valuenow', String(vistos));
    barra.setAttribute('aria-label', 'Avance: ' + vistos + ' de ' + total);
    barra.firstChild.style.width = (100 * vistos / total) + '%';
    var yaCompleto = barra.classList.contains('completo');
    barra.classList.toggle('completo', vistos >= total);
    if (!yaCompleto && vistos >= total) celebrar(barra);
  }
  /* Celebración al completar la exploración (como en el motor de Audiencias, 27/10/2026): confeti en su propia capa,
     por encima de toda la escena, que sale de la barra de avance y cae. Solo tras una acción del usuario; sin animación
     si el usuario la reduce. */
  var celebrarListo = false;
  function celebrar(desde) {
    if (!celebrarListo || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    var b = desde.getBoundingClientRect(), capa = document.createElement('div'), c = document.createElement('div');
    capa.className = 'confeti-capa'; capa.setAttribute('aria-hidden', 'true'); c.className = 'confeti';
    c.style.left = (b.left + b.width / 2) + 'px'; c.style.top = (b.top + b.height / 2) + 'px';
    for (var k = 0; k < 48; k++) {
      var p = document.createElement('i');
      p.style.setProperty('--x', ((Math.random() - 0.5) * innerWidth * 0.9) + 'px');
      p.style.setProperty('--s', (20 + Math.random() * 60) + 'px');
      p.style.setProperty('--y', ((innerHeight - b.top) * (0.4 + Math.random() * 0.55)) + 'px');
      p.style.setProperty('--r', (Math.random() * 900 - 450) + 'deg');
      p.style.setProperty('--t', (Math.random() * 0.25) + 's');
      c.appendChild(p);
    }
    capa.appendChild(c); document.body.appendChild(capa);
    setTimeout(function () { capa.remove(); }, 2400);
  }
  raiz.addEventListener('click', function (ev) { marcar(ev.target.closest && ev.target.closest(VISTOS)); });
  raiz.addEventListener('keyup', function (ev) {
    var t = ev.target.closest && ev.target.closest('[role=tab][aria-selected=true]');
    if (t) marcar(t);
  });
  [].forEach.call(raiz.querySelectorAll('[role=tab][aria-selected=true]'), marcar);
  setTimeout(function () { celebrarListo = true; }, 600); /* lo marcado al cargar no se celebra */

  /* Carrusel de páginas (patrón de Juan, caso1.html): el texto largo se pagina dentro de la
     escena, con «Anterior / Siguiente», puntos y «Página n de N». Una página con data-visto
     cuenta para el avance al mostrarse. */
  [].forEach.call(raiz.querySelectorAll('[data-carrusel]'), function (car) {
    var paginas = [].slice.call(car.querySelectorAll(':scope > .car-paginas > .car-pagina'));
    var n = paginas.length, actual = 0;
    var nav = document.createElement('div');
    nav.className = 'car-nav';
    nav.innerHTML = '<button type="button" class="btn sec car-ant" aria-label="Página anterior"><i class="fas fa-arrow-left" aria-hidden="true"></i></button>' +
      '<div class="car-puntos"></div><span class="car-cuenta" aria-live="polite"></span>' +
      '<button type="button" class="btn car-sig" aria-label="Página siguiente"><i class="fas fa-arrow-right" aria-hidden="true"></i></button>';
    car.appendChild(nav);
    var puntos = paginas.map(function (p, i) {
      p.setAttribute('role', 'group');
      p.setAttribute('aria-roledescription', 'página');
      p.setAttribute('aria-label', 'Página ' + (i + 1) + ' de ' + n);
      var d = document.createElement('button');
      d.type = 'button'; d.className = 'dot';
      d.setAttribute('aria-label', 'Ir a la página ' + (i + 1));
      d.addEventListener('click', function () { mostrar(i); });
      nav.querySelector('.car-puntos').appendChild(d);
      return d;
    });
    function mostrar(i) {
      actual = Math.max(0, Math.min(n - 1, i));
      paginas.forEach(function (p, k) { p.hidden = k !== actual; });
      puntos.forEach(function (d, k) {
        if (k === actual) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
      });
      puntos[actual].classList.add('visto');
      nav.querySelector('.car-cuenta').textContent = 'Página ' + (actual + 1) + ' de ' + n;
      var ant = nav.querySelector('.car-ant'), sig = nav.querySelector('.car-sig');
      ant.disabled = actual === 0;
      sig.disabled = actual === n - 1;
      /* el foco no se pierde en un botón que se deshabilita */
      if (document.activeElement === sig && sig.disabled) ant.focus();
      if (document.activeElement === ant && ant.disabled) sig.focus();
      if (paginas[actual].hasAttribute('data-visto')) marcar(paginas[actual]);
    }
    nav.querySelector('.car-ant').addEventListener('click', function () { mostrar(actual - 1); });
    nav.querySelector('.car-sig').addEventListener('click', function () { mostrar(actual + 1); });
    car.addEventListener('keydown', function (e) {
      if (e.target.closest('select, input, textarea')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(actual + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(actual - 1); }
    });
    car.mostrar = mostrar;
    car.dataset.listo = '';
    mostrar(0);
  });

  /* «Ver más» (patrón de Juan, leccion1-parte1.html): [data-ver] despliega su detalle */
  [].forEach.call(raiz.querySelectorAll('[data-ver]'), function (b) {
    var det = document.getElementById(b.dataset.ver);
    b.setAttribute('aria-controls', b.dataset.ver);
    b.setAttribute('aria-expanded', 'false');
    det.hidden = true;
    b.addEventListener('click', function () {
      var abrir = det.hidden;
      det.hidden = !abrir;
      b.setAttribute('aria-expanded', String(abrir));
      var tarjeta = b.closest('.tarjeta-ver');
      if (tarjeta) tarjeta.classList.toggle('abierta', abrir);
    });
  });

  window.OVA = { ir: ir, abrir: abrir, cerrar: cerrar, raiz: raiz, marcar: marcar };
  ir((param || 1) - 1, false);
})();

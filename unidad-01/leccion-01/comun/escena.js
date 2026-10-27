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
    cerrarLectura();
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

  /* La lectura íntegra es un apoyo de la vista autónoma. En Genially (?escena=N)
     cada fragmento se consulta en la interacción de su escena, sin un botón
     genérico que duplique el contenido sobre la mediación. */
  var lecturaAbierta = null, lecturaOrigen = null;
  function cerrarLectura() {
    if (!lecturaAbierta) return;
    lecturaAbierta.hidden = true;
    if (lecturaOrigen) {
      lecturaOrigen.setAttribute('aria-expanded', 'false');
      lecturaOrigen.focus({ preventScroll: true });
    }
    lecturaAbierta = null; lecturaOrigen = null;
  }
  escenas.forEach(function (e, i) {
    if (unaEscena || e.hasAttribute('data-lectura-integrada')) return;
    var fragmentos = [].slice.call(e.querySelectorAll('[data-f]'));
    if (fragmentos.length < 2) return;
    var vistos = [];
    var notas = [];
    var texto = fragmentos.map(function (f) {
      var copia = f.cloneNode(true);
      [].forEach.call(copia.querySelectorAll('sup'), function (s) { s.textContent = ' [' + s.textContent + ']'; });
      var t = copia.textContent.replace(/\s+/g, ' ').trim();
      if (f.closest('.nota-pie')) { notas.push(t); return ''; }
      return t;
    }).filter(function (t) {
      if (!t || vistos.indexOf(t) !== -1) return false;
      vistos.push(t); return true;
    }).join(' ').replace(/\s+([,.;:])/g, '$1');
    var boton = document.createElement('button');
    boton.type = 'button'; boton.className = 'lectura-abrir';
    boton.innerHTML = '<i class="fas fa-book-open" aria-hidden="true"></i><span>Leer texto íntegro</span><i class="fas fa-arrow-right lectura-flecha" aria-hidden="true"></i>';
    var id = 'lectura-integra-' + i;
    boton.setAttribute('aria-controls', id);
    boton.setAttribute('aria-expanded', 'false');
    var contenedor = e.querySelector('.texto');
    var frase = contenedor && contenedor.querySelector(':scope > .frase');
    var opciones = contenedor && contenedor.querySelector(':scope > .opciones');
    if (frase) {
      frase.classList.add('con-lectura');
      frase.insertBefore(boton, frase.firstChild);
    } else if (opciones) opciones.appendChild(boton);
    else if (contenedor) contenedor.appendChild(boton);
    var capa = document.createElement('div');
    capa.id = id; capa.className = 'lectura-fondo'; capa.hidden = true;
    capa.innerHTML = '<div class="lectura-ventana" role="dialog" aria-modal="true" aria-labelledby="' + id + '-titulo" tabindex="-1">' +
      '<header><span><i class="fas fa-book-open" aria-hidden="true"></i> Lectura completa de la escena</span>' +
      '<button type="button" class="lectura-cerrar" aria-label="Cerrar lectura (Esc)">Cerrar ✕</button></header>' +
      '<div class="lectura-cuerpo"><h3 id="' + id + '-titulo"></h3><p></p><p class="lectura-notas" hidden></p></div></div>';
    capa.querySelector('h3').textContent = e.dataset.titulo || 'Texto de la ficha';
    capa.querySelector('.lectura-cuerpo > p').textContent = texto;
    if (notas.length) {
      var pie = capa.querySelector('.lectura-notas');
      pie.textContent = notas.join(' '); pie.hidden = false;
    }
    e.appendChild(capa);
    boton.addEventListener('click', function () {
      cerrar(); cerrarLectura();
      lecturaAbierta = capa; lecturaOrigen = boton;
      capa.hidden = false; boton.setAttribute('aria-expanded', 'true');
      boton.classList.add('lectura-vista');
      capa.querySelector('.lectura-cerrar').focus({ preventScroll: true });
    });
    capa.querySelector('.lectura-cerrar').addEventListener('click', cerrarLectura);
    capa.addEventListener('click', function (event) { if (event.target === capa) cerrarLectura(); });
  });
  document.addEventListener('keydown', function (event) {
    if (!lecturaAbierta) return;
    if (event.key === 'Escape') { event.preventDefault(); cerrarLectura(); }
    if (event.key === 'Tab') { event.preventDefault(); lecturaAbierta.querySelector('.lectura-cerrar').focus({ preventScroll: true }); }
  });

  /* Cuando una oración de la ficha se distribuye entre objetos, el mensaje del
     objeto muestra también su formulación completa. Los fragmentos data-f se
     conservan para la trazabilidad, pero no se presentan como frases truncadas. */
  function textoFuente(fragmentos) {
    return fragmentos.map(function (f) {
      var copia = f.cloneNode(true);
      [].forEach.call(copia.querySelectorAll('sup'), function (s) { s.textContent = ' [' + s.textContent + ']'; });
      return copia.textContent.replace(/\s+/g, ' ').trim();
    }).join(' ').replace(/\s+([,.;:])/g, '$1');
  }
  function escenaPorTitulo(titulo) {
    return escenas.find(function (e) { return e.dataset.titulo === titulo; });
  }
  [
    ['Una reforma estructural', [[0, 3, ['a1-paralelo', 'a1-acusador']]]],
    ['La finalidad primordial', [[0, 2, ['a3-como']]]],
    ['Un nuevo modelo', [[0, 2, ['a4-ritual', 'a4-escrito']]]],
    ['Simplifica los ritos procesales', [[0, 2, ['c5-escrito']], [2, 4, ['c5-audiencias', 'c5-corte']]]]
  ].forEach(function (item) {
    var e = escenaPorTitulo(item[0]); if (!e) return;
    var fragmentos = [].slice.call(e.querySelectorAll('[data-f]'));
    item[1].forEach(function (grupo) {
      var completo = textoFuente(fragmentos.slice(grupo[0], grupo[1]));
      grupo[2].forEach(function (id) {
        var capa = document.getElementById(id);
        if (!capa || !e.contains(capa)) return;
        var parcial = [].slice.call(capa.querySelectorAll('p')).find(function (p) { return p.querySelector('[data-f]'); });
        if (parcial) parcial.hidden = true;
        var p = document.createElement('p');
        p.className = 'idea-completa';
        p.textContent = completo;
        capa.insertBefore(p, capa.querySelector('.cerrar'));
      });
    });
  });

  /* En tarjetas, comparador y pestañas, unir las piezas es la acción final de
     la mediación. La ventana conserva el texto literal y separa la nota al pie. */
  [
    ['Congestión judicial e impunidad', 'Unir las tres tarjetas', 'La idea completa'],
    ['Lo que censuró la Corte', 'Unir los cuatro hallazgos', 'Las censuras completas'],
    ['Dos décadas después', 'Comparar las dos leyes', 'La comparación completa'],
    ['Proporcionalidad', 'Relacionar las tres vistas', 'El contraste completo']
  ].forEach(function (config, i) {
    var e = escenaPorTitulo(config[0]); if (!e) return;
    var fragmentos = [].slice.call(e.querySelectorAll('[data-f]'));
    var cuerpo = fragmentos.filter(function (f) { return !f.closest('.nota-pie'); });
    var notas = fragmentos.filter(function (f) { return !!f.closest('.nota-pie'); });
    var boton = document.createElement('button');
    boton.type = 'button'; boton.className = 'conectar-abrir';
    boton.innerHTML = '<i class="fas fa-link" aria-hidden="true"></i><span></span><i class="fas fa-arrow-right" aria-hidden="true"></i>';
    boton.querySelector('span').textContent = config[1];
    var id = 'conexion-' + i;
    boton.setAttribute('aria-controls', id); boton.setAttribute('aria-expanded', 'false');
    var destino = e.querySelector('.rejilla') || e.querySelector('.texto');
    if (destino && destino.classList.contains('rejilla')) destino.insertAdjacentElement('afterend', boton);
    else if (destino) destino.appendChild(boton);
    var capa = document.createElement('div');
    capa.id = id; capa.className = 'lectura-fondo conexion-fondo'; capa.hidden = true;
    capa.innerHTML = '<div class="lectura-ventana" role="dialog" aria-modal="true" aria-labelledby="' + id + '-titulo" tabindex="-1">' +
      '<header><span><i class="fas fa-link" aria-hidden="true"></i> Ideas relacionadas</span>' +
      '<button type="button" class="lectura-cerrar" aria-label="Cerrar (Esc)">Cerrar ✕</button></header>' +
      '<div class="lectura-cuerpo"><h3 id="' + id + '-titulo"></h3><p class="idea-completa"></p><p class="lectura-notas" hidden></p></div></div>';
    capa.querySelector('h3').textContent = config[2];
    capa.querySelector('.idea-completa').textContent = textoFuente(cuerpo);
    if (notas.length) {
      var nota = capa.querySelector('.lectura-notas');
      nota.textContent = textoFuente(notas); nota.hidden = false;
    }
    e.appendChild(capa);
    boton.addEventListener('click', function () {
      cerrar(); cerrarLectura();
      lecturaAbierta = capa; lecturaOrigen = boton;
      capa.hidden = false; boton.setAttribute('aria-expanded', 'true');
      boton.classList.add('visto');
      capa.querySelector('.lectura-cerrar').focus({ preventScroll: true });
    });
    capa.querySelector('.lectura-cerrar').addEventListener('click', cerrarLectura);
    capa.addEventListener('click', function (event) { if (event.target === capa) cerrarLectura(); });
  });

  /* Comparador antes / ahora */
  [].forEach.call(raiz.querySelectorAll('.comparador'), function (cmp) {
    var r = cmp.querySelector('input[type=range]');
    var divisor = cmp.querySelector('.divisor');
    function medirVista() { cmp.style.setProperty('--vista-alto', (cmp.clientWidth * 428 / 700) + 'px'); }
    medirVista();
    if (window.ResizeObserver) new ResizeObserver(medirVista).observe(cmp);
    else window.addEventListener('resize', medirVista);
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
    if (divisor) {
      function moverDesdePunto(e) {
        var rect = cmp.getBoundingClientRect();
        r.value = String(Math.max(0, Math.min(100, Math.round((e.clientX - rect.left) / rect.width * 100))));
        pintar();
      }
      divisor.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.preventDefault();
        divisor.setPointerCapture(e.pointerId);
        divisor.classList.add('arrastrando');
        moverDesdePunto(e);
      });
      divisor.addEventListener('pointermove', function (e) {
        if (divisor.hasPointerCapture(e.pointerId)) moverDesdePunto(e);
      });
      function terminarArrastre(e) {
        if (divisor.hasPointerCapture(e.pointerId)) divisor.releasePointerCapture(e.pointerId);
        divisor.classList.remove('arrastrando');
      }
      divisor.addEventListener('pointerup', terminarArrastre);
      divisor.addEventListener('pointercancel', terminarArrastre);
    }
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
    if (e.hasAttribute('data-progreso-propio')) return;
    var n = e.querySelectorAll(VISTOS).length;
    if (n < 3) return;
    var barra = document.createElement('div');
    barra.className = 'avance-escena';
    barra.setAttribute('role', 'progressbar');
    barra.setAttribute('aria-valuemin', '0');
    barra.setAttribute('aria-valuemax', String(n));
    barra.setAttribute('aria-valuenow', '0');
    barra.setAttribute('aria-label', 'Avance: 0 de ' + n);
    barra.innerHTML = '<span></span><output class="avance-porcentaje" aria-hidden="true">0%</output>';
    e.appendChild(barra);
  });
  function marcar(el) {
    if (!el || el.closest('[data-progreso-propio]') || el.hasAttribute('data-visto-ok')) return;
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
    var porcentaje = Math.round(100 * vistos / total);
    barra.firstChild.style.width = porcentaje + '%';
    barra.querySelector('.avance-porcentaje').textContent = porcentaje + '%';
    barra.classList.toggle('completo', vistos >= total);
    var estado = e.querySelector('.c7-estado span');
    if (estado) {
      estado.textContent = vistos >= total ? 'Exploración completa' : vistos + ' de ' + total + ' vistas';
      e.classList.toggle('exploracion-completa', vistos >= total);
    }
  }
  raiz.addEventListener('click', function (ev) { marcar(ev.target.closest && ev.target.closest(VISTOS)); });
  raiz.addEventListener('keyup', function (ev) {
    var t = ev.target.closest && ev.target.closest('[role=tab][aria-selected=true]');
    if (t) marcar(t);
  });
  [].forEach.call(raiz.querySelectorAll('[role=tab][aria-selected=true]'), marcar);

  /* A3: las dos claves constituyen una exploración breve con avance propio. */
  var a3 = escenaPorTitulo('La finalidad primordial');
  if (a3) raiz.addEventListener('capa', function (event) {
    if (event.detail.id !== 'a3-como' && event.detail.id !== 'a3-objetivo') return;
    var vistos = a3.querySelectorAll('.a3-controles [data-capa].visto').length;
    var cuenta = a3.querySelector('#a3-cuenta'), barra = a3.querySelector('#a3-avance');
    if (cuenta) cuenta.textContent = vistos + ' de 2';
    if (barra) barra.value = vistos;
    var mision = a3.querySelector('.a3-mision');
    if (mision) mision.classList.toggle('completa', vistos === 2);
  });

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

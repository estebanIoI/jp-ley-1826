/* Piloto A1: SVG dibujado a mano según referencias/personajes/modelo-aprobado.png.
   Mantiene intacta la API anterior y no afecta las demás escenas. */
(function (global) {
  'use strict';
  var P = global.Personajes;
  if (!P) throw new Error('Cargar personajes.js antes del piloto A1');

  /* Colores planos muestreados del PNG aprobado, sin degradados ni contornos. */
  var C = Object.freeze({
    cabello: '#001A29', pielAzul: '#EFB6AB', pielVerde: '#A66A48',
    chaquetaAzul: '#90ADBB', chaquetaVerde: '#325F5A',
    camiseta: '#E3F0EF', pantalon: '#003D5A', zapato: '#001A29',
    documento: '#D9613F', sombra: '#D6D6D6'
  });

  var POSES = Object.freeze({
    pie: { piernas: 'pie', brazo: 'bajo' },
    senala: { piernas: 'pie', brazo: 'senala' },
    senalaIzquierda: { piernas: 'pie', brazo: 'senala', mira: -1 },
    explica: { piernas: 'pie', brazo: 'abierto' },
    presenta: { piernas: 'corre', brazo: 'entrega' },
    camina: { piernas: 'camina', brazo: 'balanceo' },
    corre: { piernas: 'corre', brazo: 'balanceo' },
    entrega: { piernas: 'corre', brazo: 'entrega' },
    recibe: { piernas: 'corre', brazo: 'recibe' },
    analiza: { piernas: 'pie', brazo: 'analiza' }
  });

  function trazo(d, color, clase) {
    return '<path' + (clase ? ' class="' + clase + '"' : '') + ' d="' + d + '" fill="' + color + '"/>';
  }

  function piernas(nombre) {
    var p = C.pantalon, z = C.zapato;
    if (nombre === 'corre') return (
      trazo('M122 144 C105 148 93 162 82 180 L49 189 L26 186 L15 214 L47 223 L99 223 C118 220 137 201 151 180 L168 157 Z', p) +
      trazo('M21 190 L34 196 L20 222 L11 244 L0 250 L2 238 Z', z) +
      trazo('M155 146 C178 149 191 170 205 193 C218 215 224 248 238 280 L210 289 C193 260 179 234 167 218 L130 179 Z', p) +
      trazo('M207 283 L235 274 Q243 282 253 284 L262 292 Q256 297 243 297 L208 298 Z', z));
    if (nombre === 'camina') return (
      trazo('M121 145 C105 154 100 177 87 198 L57 251 L33 240 L53 193 L91 151 Z', p) +
      trazo('M31 235 L57 249 L43 273 L17 263 Z', z) +
      trazo('M151 145 C173 147 191 170 204 195 L231 272 L205 285 L172 226 L134 181 Z', p) +
      trazo('M201 281 L229 269 Q240 281 254 284 L260 293 L207 298 Z', z));
    return (
      trazo('M119 144 Q138 148 155 151 L151 208 L142 278 L111 280 L113 217 Z', p) +
      trazo('M145 149 Q162 146 177 145 L184 207 L200 279 L169 283 L149 217 Z', p) +
      trazo('M109 277 L143 274 L152 290 Q142 295 126 296 L104 295 Z', z) +
      trazo('M167 279 L200 275 Q207 285 219 289 L220 296 L167 297 Z', z));
  }

  function peloDetras(tipo) {
    if (tipo === 'verde') return trazo(
      'M177 27 C159 18 146 27 145 43 C136 50 122 51 111 47 C120 60 145 61 160 58 C177 60 193 47 192 36 Z', C.cabello);
    return trazo(
      'M177 29 C160 13 140 22 133 34 C121 42 107 44 91 42 C103 54 119 58 134 57 C119 63 101 64 78 61 C99 77 133 73 151 65 C176 67 193 55 193 42 Z', C.cabello);
  }

  function brazoDetras(chaqueta, piel, tipo) {
    if (tipo === 'balanceo') return (
      trazo('M115 88 C101 83 93 89 86 101 L59 145 Q55 153 62 156 L75 157 L105 123 Q117 109 126 103 Z', chaqueta) +
      trazo('M59 145 Q52 145 49 153 Q48 160 55 162 L67 158 L67 150 Z', piel));
    return (
      trazo('M113 87 C98 85 94 94 86 109 L61 155 Q58 162 65 166 L80 165 L110 126 Q123 109 126 100 Z', chaqueta) +
      trazo('M60 156 Q52 160 55 168 Q59 175 69 171 L77 163 Z', piel));
  }

  function brazoDelante(nombre, chaqueta, piel) {
    var manga, mano;
    switch (nombre) {
      case 'entrega':
        manga = 'M181 88 C195 81 207 89 219 98 L246 115 Q253 119 249 125 L242 134 Q237 139 230 135 L199 116 Q186 113 174 105 Z';
        mano = 'M243 114 Q250 111 257 115 L265 120 L260 129 Q254 132 245 126 Z';
        break;
      case 'recibe':
        manga = 'M180 88 C191 81 201 84 209 92 L231 112 Q237 118 232 124 L223 131 Q217 134 212 128 L188 113 L175 108 Z';
        mano = 'M226 110 Q238 102 245 107 Q250 113 244 118 L235 125 L223 124 Z';
        break;
      case 'senala':
        manga = 'M181 87 C194 82 204 89 213 99 L235 118 Q242 124 236 131 L228 137 Q221 139 215 133 L186 113 L174 105 Z';
        mano = 'M231 118 L247 113 L258 110 Q262 112 259 116 L248 123 Q261 120 262 124 Q260 129 248 131 L234 133 Z';
        break;
      case 'analiza':
        manga = 'M180 87 Q195 82 203 97 L196 130 Q191 137 183 134 L176 128 Q175 113 171 103 Z';
        mano = 'M183 126 Q190 118 194 111 Q199 111 198 116 L194 134 Q189 140 182 135 Z';
        break;
      case 'balanceo':
        manga = 'M179 86 C193 84 202 92 208 105 L225 143 Q227 151 219 155 L207 157 Q200 154 197 145 L180 117 Z';
        mano = 'M207 148 L222 145 Q233 150 230 159 Q224 165 213 160 Z';
        break;
      case 'abierto':
        manga = 'M180 86 C195 82 205 90 213 99 L236 113 Q243 120 238 128 L229 133 Q224 137 216 130 L186 113 Z';
        mano = 'M234 113 Q244 108 252 109 Q260 111 260 116 L245 128 L233 125 Z';
        break;
      default:
        manga = 'M179 87 Q194 82 203 96 L217 139 Q220 149 213 153 L201 155 Q194 151 191 143 L176 109 Z';
        mano = 'M201 146 L216 140 Q229 146 224 155 Q219 164 207 159 Z';
    }
    return '<g class="brazo-delante">' + trazo(manga, chaqueta) + trazo(mano, piel) + '</g>';
  }

  function accesorio(nombre, pose) {
    if (nombre === 'documento') return '<g class="documento">' + trazo(
      pose === 'presenta' || pose === 'entrega'
        ? 'M253 112 L290 83 L299 95 L264 127 Z'
        : 'M208 117 L247 89 L255 101 L218 130 Z', C.documento) + '</g>';
    if (nombre === 'carpeta') return '<g class="documento">' + trazo('M198 115 L240 110 L243 145 L202 149 Z', C.documento) + '</g>';
    return '';
  }

  function persona(o) {
    o = o || {};
    var tipo = o.tipo === 'verde' ? 'verde' : 'azul';
    var pose = POSES[o.pose] || POSES.pie;
    var chaqueta = tipo === 'verde' ? C.chaquetaVerde : C.chaquetaAzul;
    var piel = tipo === 'verde' ? C.pielVerde : C.pielAzul;
    var escala = Number(o.s) || 1;
    var mira = o.mira === -1 ? -1 : (pose.mira || 1);
    var figura = '';
    figura += peloDetras(tipo);
    figura += brazoDetras(chaqueta, piel, pose.brazo);
    figura += piernas(pose.piernas);
    figura += trazo('M122 76 Q139 70 170 77 C185 85 189 112 182 143 Q149 153 116 143 Q108 110 122 76 Z', C.camiseta);
    figura += trazo('M115 82 Q127 74 141 77 C136 95 132 112 128 133 L139 148 Q122 158 100 153 L104 122 Q103 92 115 82 Z', chaqueta);
    figura += trazo('M165 77 Q181 77 193 91 L194 126 L188 158 Q174 156 153 147 L168 119 Z', chaqueta);
    figura += trazo('M149 61 L171 59 L174 80 L154 82 Z', piel);
    figura += trazo('M156 31 Q170 23 184 31 Q192 39 190 51 L184 66 Q179 72 167 70 Q151 66 149 52 Q148 39 156 31 Z', piel);
    figura += trazo('M151 39 Q148 26 160 20 Q177 14 188 25 Q193 31 189 38 Q181 34 176 39 Q163 34 153 46 Z', C.cabello);
    figura += brazoDelante(pose.brazo, chaqueta, piel);
    figura += accesorio(o.prop, o.pose);
    return '<ellipse cx="' + (o.x || 0) + '" cy="' + (o.y || 0) + '" rx="' + (80 * escala) + '" ry="7" fill="' + C.sombra + '"/>' +
      '<g class="persona-piloto" data-arquetipo="' + tipo + '" data-pose="' + (o.pose || 'pie') + '" transform="translate(' + (o.x || 0) + ' ' + (o.y || 0) + ') scale(' + (escala * mira) + ' ' + escala + ') translate(-145 -298)">' + figura + '</g>';
  }

  P.pilotoA1 = { persona: persona, paleta: C, poses: POSES };
})(window);

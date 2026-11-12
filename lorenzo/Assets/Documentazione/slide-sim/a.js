/* Interactive drawings, set A: 1c 4a 4e 4g 4h 4i 5c 5d 5g 5h */
(function () {
  var SIM = window.SIM, OVR = window.OVR;
  var INK = '#1b1b1b', PAP = '#f4f4f1', G1 = '#e9e9e5', G2 = '#d2d2cc', G3 = '#8c8c8c', G4 = '#585858', RED = '#1b1b1b';
  var CSS = '<style>.sx{transition:transform .4s ease,opacity .4s ease,stroke-width .4s ease,fill-opacity .4s ease,stroke .4s ease,fill .4s ease}</style>';

  function wrap(inner, defs) {
    return '<svg viewBox="0 0 560 340" xmlns="http://www.w3.org/2000/svg">' + CSS + (defs ? '<defs>' + defs + '</defs>' : '') + inner + '</svg>';
  }
  function seg(labels) {
    return '<div class="seg">' + labels.map(function (l, i) { return '<button data-s="' + i + '">' + l + '</button>'; }).join('') + '</div>';
  }
  function Q(root, id) { return root.querySelector('#' + id); }
  function op(root, id, v) { var e = Q(root, id); if (e) e.style.opacity = v; }
  function tx(root, id, s) { var e = Q(root, id); if (e) e.textContent = s; }
  function lbl(root, s) { var e = root.querySelector('.lbl'); if (e) e.textContent = s; }
  function T(x, y, s, a) { return '<text x="' + x + '" y="' + y + '" ' + (a || '') + '>' + s + '</text>'; }
  function clamp(s, n) { s = Math.round(s); return s < 0 ? 0 : s > n ? n : s; }

  /* ---------- 1c Project, Scene, GameObject ---------- */
  (function () {
    var go1 = ['Camera', 'Altare', 'Luce'], go2 = ['Camera', 'Canvas', 'Button'];
    var o = '';
    [go1, go2].forEach(function (list, k) {
      var x = k ? 306 : 46;
      list.forEach(function (n, i) {
        o += '<rect x="' + x + '" y="' + (92 + i * 68) + '" width="208" height="52" fill="' + G1 + '" stroke="' + INK + '" stroke-width="2"/>' + T(x + 16, 124 + i * 68, n);
      });
    });
    SIM['1c'] = {
      steps: 3,
      html: wrap(
        '<g id="s1c_p" class="sx"><rect x="10" y="10" width="540" height="320" fill="' + G1 + '" stroke="' + INK + '" stroke-width="2"/>' + T(24, 36, 'Project', 'style="font-size:20px"') + '</g>' +
        '<g id="s1c_s" class="sx"><rect x="30" y="50" width="240" height="260" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2"/><rect x="290" y="50" width="240" height="260" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2"/>' +
        T(46, 76, 'Scene: Museo', 'style="font-size:17px"') + T(306, 76, 'Scene: Menu', 'style="font-size:17px"') + '</g>' +
        '<g id="s1c_o" class="sx">' + o + '</g>'),
      set: function (root, s) {
        ['p', 's', 'o'].forEach(function (k, i) {
          var g = Q(root, 's1c_' + k), on = s === i + 1;
          g.style.opacity = (s === 0 || on) ? 1 : 0.3;
          var r = g.querySelectorAll('rect');
          for (var j = 0; j < r.length; j++) r[j].style.stroke = on ? RED : INK;
        });
      }
    };
    OVR['1c'] = {
      k: '1c', t: 'Project, Scene, *GameObject*', sim: '1c', wide: 1,
      p: ['Il progetto è la scatola grande. Dentro ci sono le scene, cioè i livelli, e dentro ogni scena ci sono i GameObject.'],
      caps: ['Tre livelli, uno dentro l\'altro.',
        'Il **Project** è la cartella con tutto: scene, modelli, texture, script.',
        'Le **Scene** sono i livelli. Ognuna è un file che si apre da solo.',
        'I **GameObject** sono gli oggetti dentro la scena. Tutto quello che vedi è un GameObject.'],
      n: 'Apri la cartella del progetto nel Finder per far vedere che è davvero una cartella di file.'
    };
  })();

  /* ---------- 4a Vertex, edge, face ---------- */
  (function () {
    var A = [230, 140], B = [410, 140], C = [410, 320], D = [230, 320], E = [330, 50], F = [510, 50], G = [510, 230], H = [330, 230];
    function ln(a, b, extra) { return '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" ' + (extra || '') + '/>'; }
    function poly(pts, fill, id) { return '<polygon ' + (id ? 'id="' + id + '" ' : '') + 'points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="' + fill + '"/>'; }
    var edges = [[A, B], [B, C], [C, D], [D, A], [A, E], [B, F], [E, F], [C, G], [F, G]];
    var verts = [A, B, C, D, E, F, G];
    var html = wrap(
      poly([A, B, F, E], G1) + poly([B, C, G, F], G2) + poly([A, B, C, D], PAP) +
      '<polygon id="s4a_hl" class="sx" points="' + [A, B, C, D].map(function (p) { return p.join(','); }).join(' ') + '" fill="' + RED + '" fill-opacity="0"/>' +
      '<g stroke="' + G3 + '" stroke-width="2" stroke-dasharray="7 7">' + ln(H, E) + ln(H, G) + ln(H, D) + '</g>' +
      '<g id="s4a_e" stroke="' + INK + '" stroke-width="2" stroke-linecap="round">' +
      edges.map(function (e) { return ln(e[0], e[1], 'class="sx"'); }).join('') + '</g>' +
      '<g id="s4a_v">' + verts.map(function (v) { return '<circle class="sx" cx="' + v[0] + '" cy="' + v[1] + '" r="10" fill="' + RED + '" opacity="0"/>'; }).join('') + '</g>' +
      T(20, 190, '', 'id="s4a_l" style="font-size:26px"'));
    var names = ['cubo', '8 vertices', '12 edges', '6 faces'];
    SIM['4a'] = {
      steps: 3, html: html,
      set: function (root, s) {
        var ls = root.querySelectorAll('#s4a_e line');
        for (var i = 0; i < ls.length; i++) {
          ls[i].style.strokeWidth = s === 2 ? 7 : 2;
          ls[i].style.stroke = s === 2 ? RED : INK;
        }
        var vs = root.querySelectorAll('#s4a_v circle');
        for (var j = 0; j < vs.length; j++) vs[j].style.opacity = s === 1 ? 1 : 0;
        Q(root, 's4a_hl').style.fillOpacity = s === 3 ? 0.35 : 0;
        tx(root, 's4a_l', names[s]);
      }
    };
    OVR['4a'] = {
      k: '4a', t: 'Vertex, edge, *face*', sim: 'g4a'.replace('g', ''), simw: 1.2,
      p: ['Ogni modello 3D è fatto di **vertices** (punti), uniti da **edges** (linee), che chiudono delle **faces** (superfici).', 'Il modello non ha niente dentro: è solo una buccia.'],
      caps: ['Un cubo: 8 vertices, 12 edges, 6 faces.',
        'Un **vertex** è un punto nello spazio.',
        'Un **edge** è la linea che unisce due vertices.',
        'Una **face** è la superficie chiusa dagli edges.']
    };
  })();

  /* ---------- 4e Normals e backface culling ---------- */
  (function () {
    var cx = 170;
    var cam = '<g id="s4e_cam" style="transform:translate(' + cx + 'px,70px) rotate(0deg)" class="sx">' +
      '<g stroke="' + G3 + '" stroke-width="2" stroke-dasharray="6 6"><line x1="-16" y1="28" x2="-70" y2="100"/><line x1="16" y1="28" x2="70" y2="100"/></g>' +
      '<rect x="-20" y="-14" width="40" height="28" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<polygon points="-10,14 10,14 16,28 -16,28" fill="' + G2 + '" stroke="' + INK + '" stroke-width="2"/></g>';
    SIM['4e'] = {
      steps: 3,
      html: wrap(
        '<line id="s4e_wall" class="sx" x1="40" y1="170" x2="300" y2="170" stroke="' + INK + '" stroke-width="9"/>' +
        '<line x1="' + cx + '" y1="170" x2="' + cx + '" y2="124" stroke="' + RED + '" stroke-width="3"/>' +
        '<polygon points="' + cx + ',112 ' + (cx - 8) + ',128 ' + (cx + 8) + ',128" fill="' + RED + '"/>' +
        T(cx + 14, 134, 'normal', 'fill="' + RED + '" style="fill:' + RED + '"') +
        T(40, 205, 'muro', 'style="fill:' + G4 + '"') +
        T(40, 150, 'non disegnata', 'id="s4e_nd" class="sx" opacity="0" style="font-size:14px"') +
        cam +
        T(cx + 40, 74, 'camera', 'id="s4e_cl" class="sx" style="font-size:14px;transform:translate(0,0)"') +
        T(465, 90, 'Game view', 'text-anchor="middle"') +
        '<rect x="380" y="100" width="170" height="110" fill="' + G1 + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<rect id="s4e_iw" class="sx" x="395" y="148" width="140" height="16" fill="' + INK + '"/>' +
        T(465, 160, 'vuoto', 'id="s4e_ie" class="sx" text-anchor="middle" opacity="0" style="fill:' + G3 + '"')) +
        seg(['Davanti / Front', 'Dietro / Front', 'Dietro / Both', 'Davanti / Both']) + '<div class="lbl"></div>',
      set: function (root, s) {
        var front = (s === 0 || s === 3), both = s >= 2, vis = front || both;
        var c = Q(root, 's4e_cam');
        c.style.transform = 'translate(' + cx + 'px,' + (front ? 70 : 270) + 'px) rotate(' + (front ? 0 : 180) + 'deg)';
        var cl = Q(root, 's4e_cl');
        cl.style.transform = 'translate(0px,' + (front ? 0 : 200) + 'px)';
        var w = Q(root, 's4e_wall');
        w.style.opacity = vis ? 1 : 0.3;
        w.style.strokeDasharray = vis ? 'none' : '14 10';
        op(root, 's4e_nd', vis ? 0 : 1);
        op(root, 's4e_iw', vis ? 1 : 0);
        op(root, 's4e_ie', vis ? 0 : 1);
        lbl(root, 'Camera: ' + (front ? 'davanti' : 'dietro') + ' · Render Face: ' + (both ? 'Both' : 'Front'));
      }
    };
    OVR['4e'] = {
      k: '4e', t: '*Normals* e backface culling', sim: '4e', simw: 1.2,
      p: ['Ogni face ha un lato davanti, indicato dalla sua **normal**.'],
      caps: ['Unity disegna solo il lato davanti: da qui il muro si vede.',
        'Da dietro il muro non viene disegnato (backface culling). Ci vedi attraverso.',
        'Con Render Face **Both** il muro si disegna da entrambi i lati.',
        'Da davanti, Both non cambia niente: il muro si vede.'],
      n: 'Dal vivo: GameObject > 3D Object > Quad, poi gira la camera. Da dietro sparisce. Poi mostra il muro della demo. Aggiungere due screenshot del Quad da davanti e da dietro.'
    };
  })();

  /* ---------- 4g Smooth o flat shading ---------- */
  (function () {
    var R = 130, cx = 280, cy = 172, NL = 12, NB = 6, tilt = 0.35;
    function P(i, j) {
      var th = i / NL * 2 * Math.PI, ph = -Math.PI / 2 + j / NB * Math.PI;
      return [Math.cos(ph) * Math.sin(th), Math.sin(ph), Math.cos(ph) * Math.cos(th)];
    }
    function tl(v) { var c = Math.cos(tilt), s = Math.sin(tilt); return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c]; }
    function nrm(v) { var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
    function hex(n) { var h = n.toString(16); return h.length < 2 ? '0' + h : h; }
    var L = nrm([-0.45, 0.55, 0.7]), facets = '';
    for (var j = 0; j < NB; j++) for (var i = 0; i < NL; i++) {
      var c = [P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)].map(tl);
      var n = nrm([c[0][0] + c[1][0] + c[2][0] + c[3][0], c[0][1] + c[1][1] + c[2][1] + c[3][1], c[0][2] + c[1][2] + c[2][2] + c[3][2]]);
      if (n[2] < 0.02) continue;
      var l = Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]);
      var g = Math.round(88 + (244 - 88) * (0.1 + 0.9 * l)), col = '#' + hex(g) + hex(g) + hex(g - 1);
      var pts = c.map(function (v) { return (cx + R * v[0]).toFixed(1) + ',' + (cy - R * v[1]).toFixed(1); }).join(' ');
      facets += '<polygon points="' + pts + '" fill="' + col + '" stroke="' + G4 + '" stroke-width="2" stroke-linejoin="round"/>';
    }
    SIM['4g'] = {
      steps: 1,
      html: wrap(
        '<g id="s4g_f" class="sx">' + facets + '</g>' +
        '<circle id="s4g_s" class="sx" cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="url(#s4g_gr)" stroke="' + INK + '" stroke-width="2" opacity="0"/>',
        '<radialGradient id="s4g_gr" cx="35%" cy="30%" r="75%" fx="35%" fy="30%"><stop offset="0" stop-color="' + PAP + '"/><stop offset="1" stop-color="' + G4 + '"/></radialGradient>') +
        seg(['Flat', 'Smooth']) + '<div class="lbl"></div>',
      set: function (root, s) {
        op(root, 's4g_f', s === 0 ? 1 : 0);
        op(root, 's4g_s', s === 1 ? 1 : 0);
        lbl(root, s === 0 ? 'Flat: una normal per ogni faccia' : 'Smooth: normal condivise tra i vertici vicini');
      }
    };
    OVR['4g'] = {
      k: '4g', t: 'Smooth o *flat shading*', sim: '4g', simw: 1.2,
      p: ['Anche i vertici hanno una normale.'],
      caps: ['Normali separate: la luce si ferma su ogni faccia e si vedono gli spigoli.',
        'Normali condivise tra i vertici vicini: la luce scivola e la superficie sembra liscia.'],
      warn: 'Nell\'import del modello: scheda Model, **Normals** su Calculate e **Smoothing Angle** per decidere da che angolo si vede lo spigolo.'
    };
  })();

  /* ---------- 4h Il pivot ---------- */
  (function () {
    var pv = [[280, 180], [205, 180], [280, 300]], ang = [70, -70, 70];
    var lp = [[280, 212], [205, 212], [280, 330]];
    SIM['4h'] = {
      steps: 2,
      html: wrap(
        '<rect x="30" y="173" width="175" height="14" fill="' + INK + '"/><rect x="355" y="173" width="175" height="14" fill="' + INK + '"/>' +
        '<rect x="205" y="174" width="150" height="12" fill="none" stroke="' + G3 + '" stroke-width="2" stroke-dasharray="6 5"/>' +
        '<rect id="s4h_door" x="205" y="174" width="150" height="12" fill="' + G2 + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<circle id="s4h_pv" class="sx" cx="0" cy="0" r="10" fill="' + RED + '" stroke="#f4f4f1" stroke-width="3" style="transform:translate(280px,180px)"/>' +
        T(0, 0, 'pivot', 'id="s4h_pl" class="sx" text-anchor="middle" style="transform:translate(280px,212px);fill:' + RED + '"') +
        T(20, 30, 'Vista dall\'alto', 'style="font-size:14px;fill:' + G4 + '"') +
        T(30, 160, 'muro', 'style="font-size:14px;fill:' + G4 + '"')) +
        seg(['Center', 'Sul cardine', 'Lontano']) + '<div class="lbl"></div>',
      set: function (root, s) {
        s = clamp(s, 2);
        var d = Q(root, 's4h_door');
        d.style.transition = 'none';
        d.style.transformOrigin = pv[s][0] + 'px ' + pv[s][1] + 'px';
        d.style.transform = 'rotate(0deg)';
        void d.getBoundingClientRect();
        d.style.transition = 'transform 1.1s ease-in-out';
        d.style.transform = 'rotate(' + ang[s] + 'deg)';
        Q(root, 's4h_pv').style.transform = 'translate(' + pv[s][0] + 'px,' + pv[s][1] + 'px)';
        Q(root, 's4h_pl').style.transform = 'translate(' + lp[s][0] + 'px,' + lp[s][1] + 'px)';
        lbl(root, 'Pivot: ' + ['Center', 'Sul cardine', 'Lontano'][s]);
      }
    };
    OVR['4h'] = {
      k: '4h', t: 'Il *pivot*', sim: '4h', simw: 1.2,
      p: ['Ogni oggetto si sposta, ruota e scala attorno al suo **pivot**, che non sempre è al centro.'],
      caps: ['Pivot al centro: la porta gira su se stessa.',
        'Pivot sul cardine: la porta si apre come deve.',
        'Pivot lontano: la porta vola attorno a un punto fuori da lei.'],
      warn: 'Se il pivot è sbagliato, metti l\'oggetto dentro un GameObject vuoto che fa da cardine.',
      n: 'Il pulsante Pivot/Center in alto nella Scene cambia solo il gizmo, non il gioco. Esempio della porta ripreso dal corso Unity.'
    };
  })();

  /* ---------- 4i Transform ---------- */
  (function () {
    var PX = 60, OX = 110, OY = 190;
    function px(x) { return OX + PX * x; }
    function py(y) { return OY - PX * y; }
    // [parent world x, child local x, child local y]
    var ST = [[0, 2, 0], [3, 2, 0], [3, 3, 1]];
    function pos(x, y) { return 'translate(' + px(x) + 'px,' + py(y) + 'px)'; }
    var FS = 'style="font-size:17px"';
    SIM['4i'] = {
      steps: 2,
      html: wrap(
        '<line id="s4i_ln" class="sx" x1="0" y1="0" x2="1" y2="0" stroke="' + G4 + '" stroke-width="2" stroke-dasharray="8 6" vector-effect="non-scaling-stroke"/>' +
        '<g id="s4i_p" class="sx"><rect x="-50" y="-50" width="100" height="100" fill="' + G1 + '" stroke="' + INK + '" stroke-width="2"/>' + T(0, -60, 'altare', 'text-anchor="middle"') + '</g>' +
        '<g id="s4i_c" class="sx"><rect x="-35" y="-35" width="70" height="70" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2"/>' + T(0, -45, 'offerta', 'text-anchor="middle"') + '</g>' +
        '<circle id="s4i_dp" class="sx" cx="0" cy="0" r="6" fill="' + INK + '"/><circle id="s4i_dc" class="sx" cx="0" cy="0" r="6" fill="' + INK + '"/>' +
        T(20, 298, 'altare', FS) + T(130, 298, '', 's4i_a'.replace('s', 'id="s') + '" ' + FS + ' class="sx"') +
        T(20, 322, 'offerta', FS) + T(130, 322, '', 'id="s4i_b" class="sx" ' + FS) + T(310, 322, '', 'id="s4i_c2" class="sx" ' + FS)) +
        '<div class="lbl"></div>',
      set: function (root, s) {
        s = clamp(s, 2);
        var st = ST[s], wx = st[0], lx = st[1], ly = st[2];
        var cwx = wx + lx, cwy = ly;
        Q(root, 's4i_p').style.transform = pos(wx, 0);
        Q(root, 's4i_dp').style.transform = pos(wx, 0);
        Q(root, 's4i_c').style.transform = pos(cwx, cwy);
        Q(root, 's4i_dc').style.transform = pos(cwx, cwy);
        var ln = Q(root, 's4i_ln'), x0 = px(wx), y0 = py(0), x1 = px(cwx), y1 = py(cwy);
        ln.style.transform = 'translate(' + x0 + 'px,' + y0 + 'px) rotate(' + Math.atan2(y1 - y0, x1 - x0) + 'rad) scale(' + Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)) + ',1)';
        tx(root, 's4i_a', 'World ' + wx + ', 0');
        tx(root, 's4i_b', 'Local ' + lx + ', ' + ly);
        tx(root, 's4i_c2', 'World ' + cwx + ', ' + cwy);
        Q(root, 's4i_b').style.fill = s === 2 ? RED : INK;
        Q(root, 's4i_c2').style.fill = s === 1 ? RED : INK;
        lbl(root, 'Inspector (offerta): Position ' + lx + ', ' + ly + ', 0   [Local, in metri]');
      }
    };
    OVR['4i'] = {
      k: '4i', t: '*Transform*', sim: '4i', simw: 1.2,
      caps: ['**Position** in metri, **Rotation** in gradi, **Scale** quanto è grande. L\'offerta è figlia dell\'altare.',
        'Muovo il padre: il figlio lo segue. **Local** non cambia, **World** sì.',
        'Muovo solo il figlio: cambia **Local**, cioè la posizione rispetto al padre. È quello che mostra l\'Inspector.'],
      n: 'Trascina l\'offerta dentro l\'altare: i numeri cambiano anche se l\'oggetto non si è mosso.'
    };
  })();

  /* ---------- 5c Texture, material, shader ---------- */
  (function () {
    var xs = [10, 210, 410], names = ['Texture', 'Material', 'Shader'], subs = ['immagine', 'impostazioni', 'programma GPU'];
    function icon(i, x) {
      var m = x + 70, o = '';
      if (i === 0) {
        for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++)
          o += '<rect x="' + (m - 36 + c * 24) + '" y="' + (140 + r * 24) + '" width="24" height="24" fill="' + ((r + c) % 2 ? G2 : G3) + '"/>';
        o += '<rect x="' + (m - 36) + '" y="140" width="72" height="72" fill="none" stroke="' + INK + '" stroke-width="2"/>';
      } else if (i === 1) {
        o = '<circle cx="' + m + '" cy="176" r="38" fill="' + G2 + '" stroke="' + INK + '" stroke-width="2"/>' +
          '<path d="M' + (m - 26) + ',162 Q' + m + ',148 ' + (m + 26) + ',162" fill="none" stroke="' + PAP + '" stroke-width="5"/>';
      } else {
        o = [[60, 148], [44, 172], [66, 196], [34, 220]].map(function (a) {
          return '<line x1="' + (x + 30) + '" y1="' + a[1] + '" x2="' + (x + 30 + a[0]) + '" y2="' + a[1] + '" stroke="' + INK + '" stroke-width="2"/>';
        }).join('');
      }
      return o;
    }
    var boxes = xs.map(function (x, i) {
      return '<g id="s5c_b' + i + '" class="sx" opacity="0.15"><rect x="' + x + '" y="70" width="140" height="200" fill="' + PAP + '" stroke="' + INK + '" stroke-width="2"/>' +
        T(x + 70, 108, names[i], 'text-anchor="middle" style="font-size:22px"') + icon(i, x) + T(x + 70, 252, subs[i], 'text-anchor="middle" style="font-size:14px"') + '</g>';
    }).join('');
    function arrow(id, x0, x1, label) {
      return '<g id="' + id + '" class="sx" opacity="0"><line x1="' + (x0 + 4) + '" y1="170" x2="' + (x1 - 8) + '" y2="170" stroke="' + INK + '" stroke-width="2"/>' +
        '<polygon points="' + (x1 - 4) + ',170 ' + (x1 - 16) + ',162 ' + (x1 - 16) + ',178" fill="' + INK + '"/>' +
        T((x0 + x1) / 2, 150, label, 'text-anchor="middle" style="font-size:14px"') + '</g>';
    }
    SIM['5c'] = {
      steps: 3,
      html: wrap(boxes + arrow('s5c_a1', 150, 210, 'dentro') + arrow('s5c_a2', 350, 410, 'usa')),
      set: function (root, s) {
        for (var i = 0; i < 3; i++) {
          var g = Q(root, 's5c_b' + i);
          g.style.opacity = s >= i + 1 ? 1 : 0.15;
          g.querySelector('rect:not([fill="none"])').style.stroke = (s === i + 1) ? RED : INK;
        }
        op(root, 's5c_a1', s >= 2 ? 1 : 0);
        op(root, 's5c_a2', s >= 3 ? 1 : 0);
      }
    };
    OVR['5c'] = {
      k: '5c', t: 'Texture, material, *shader*', sim: '5c', wide: 1,
      caps: ['La texture da sola non va sul modello: va dentro un **material**, e il material usa uno **shader**.',
        'La **texture** è un\'immagine. Da sola non si appoggia al modello.',
        'Il **material** la tiene dentro, insieme alle altre impostazioni della superficie.',
        'Lo **shader** è il programma che dice alla GPU come disegnare la superficie.']
    };
  })();

  /* ---------- 5d Lit e Unlit ---------- */
  (function () {
    SIM['5d'] = {
      steps: 1,
      html: wrap(
        '<g id="s5d_rays" class="sx" stroke="' + G3 + '" stroke-width="2" stroke-dasharray="7 6"><line x1="268" y1="60" x2="185" y2="132"/><line x1="292" y1="60" x2="375" y2="132"/></g>' +
        '<circle cx="150" cy="205" r="80" fill="' + INK + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<circle id="s5d_ov" class="sx" cx="150" cy="205" r="80" fill="url(#s5d_gr)" stroke="' + INK + '" stroke-width="2"/>' +
        '<circle cx="410" cy="205" r="80" fill="' + G3 + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<circle id="s5d_lt" class="sx" cx="280" cy="45" r="18" fill="' + RED + '" stroke="' + INK + '" stroke-width="2"/>' +
        T(250, 51, 'luce', 'text-anchor="end"') +
        T(150, 320, 'Lit', 'text-anchor="middle" style="font-size:22px"') + T(410, 320, 'Unlit', 'text-anchor="middle" style="font-size:22px"'),
        '<radialGradient id="s5d_gr" cx="62%" cy="26%" r="80%" fx="62%" fy="26%"><stop offset="0" stop-color="' + PAP + '"/><stop offset="1" stop-color="' + G4 + '"/></radialGradient>') +
        seg(['Light on', 'Light off']),
      set: function (root, s) {
        var on = s === 0;
        op(root, 's5d_ov', on ? 1 : 0.04);
        op(root, 's5d_rays', on ? 1 : 0);
        var lt = Q(root, 's5d_lt');
        lt.style.fill = on ? RED : PAP;
      }
    };
    OVR['5d'] = {
      k: '5d', t: 'Lit e *Unlit*', sim: '5d', simw: 1.2,
      caps: ['**Lit** reagisce alle luci: ombre e riflessi. Si usa quasi sempre.',
        '**Unlit** ha sempre lo stesso colore e ignora le luci: cielo, schermi, effetti.'],
      n: 'Mostra la stessa statua con i due shader e spegni la luce.'
    };
  })();

  /* ---------- 5g Tiling e offset ---------- */
  (function () {
    var NS = [1, 2, 4, 8], X0 = 160, Y0 = 40, SZ = 240;
    function grid(n) {
      var t = SZ / n, o = '';
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
        var x = X0 + c * t, y = Y0 + r * t;
        o += '<rect x="' + x + '" y="' + y + '" width="' + t + '" height="' + t + '" fill="' + ((r === 0 && c === 0) ? RED : PAP) + '"' + ((r === 0 && c === 0) ? ' fill-opacity="0.25"' : '') + ' stroke="' + INK + '" stroke-width="2"/>' +
          '<line x1="' + x + '" y1="' + y + '" x2="' + (x + t) + '" y2="' + (y + t) + '" stroke="' + G4 + '" stroke-width="2"/>' +
          '<line x1="' + (x + t) + '" y1="' + y + '" x2="' + x + '" y2="' + (y + t) + '" stroke="' + G4 + '" stroke-width="2"/>';
      }
      return '<g id="s5g_g' + n + '" class="sx" opacity="0">' + o + '</g>';
    }
    SIM['5g'] = {
      steps: 3,
      html: wrap(NS.map(grid).join('') + T(280, 322, '', 'id="s5g_t" text-anchor="middle" style="font-size:22px"')) +
        '<input type="range" class="rng" min="0" max="3" step="1" value="0"><div class="lbl"></div>',
      set: function (root, s) {
        s = clamp(s, 3);
        NS.forEach(function (n, i) { op(root, 's5g_g' + n, i === s ? 1 : 0); });
        var n = NS[s];
        tx(root, 's5g_t', 'Tiling ' + n + ', ' + n);
        lbl(root, 'Tiling ' + n + ', ' + n);
      }
    };
    OVR['5g'] = {
      k: '5g', t: 'Tiling e *offset*', sim: '5g', simw: 1.2,
      p: ['Un pavimento grande con Tiling 1 ha mattonelle enormi. Si alza il tiling invece di fare una texture gigante.'],
      caps: ['**Tiling** è quante volte la texture si ripete. **Offset** è di quanto si sposta.',
        'Tiling 2: la texture si ripete due volte per lato.',
        'Tiling 4: le mattonelle sono più piccole.',
        'Tiling 8: stessa texture, mattonelle piccole.']
    };
  })();

  /* ---------- 5h Quanto pesa una texture ---------- */
  (function () {
    var SIZES = [512, 1024, 2048, 4096], MB = [1, 4, 16, 64], K = [0.125, 0.25, 0.5, 1];
    var cx = 280, cy = 165, S = 250;
    var ghosts = [0.5, 0.25, 0.125].map(function (k) {
      var s = S * k;
      return '<rect x="' + (cx - s / 2) + '" y="' + (cy - s / 2) + '" width="' + s + '" height="' + s + '" fill="none" stroke="' + G2 + '" stroke-width="2" stroke-dasharray="6 5"/>';
    }).join('');
    SIM['5h'] = {
      steps: 3,
      html: wrap(
        '<rect x="' + (cx - S / 2) + '" y="' + (cy - S / 2) + '" width="' + S + '" height="' + S + '" fill="none" stroke="' + G2 + '" stroke-width="2" stroke-dasharray="6 5"/>' + ghosts +
        '<rect id="s5h_q" class="sx" x="' + (cx - S / 2) + '" y="' + (cy - S / 2) + '" width="' + S + '" height="' + S + '" fill="' + G2 + '" stroke="' + INK + '" stroke-width="2" vector-effect="non-scaling-stroke" style="transform-origin:' + cx + 'px ' + cy + 'px"/>' +
        '<text id="s5h_t" x="280" y="322" text-anchor="middle" style="font-size:20px"></text>') +
        '<input type="range" class="rng" min="0" max="3" step="1" value="0"><div class="lbl"></div>',
      set: function (root, s) {
        s = clamp(s, 3);
        var q = Q(root, 's5h_q');
        q.style.transform = 'scale(' + K[s] + ')';
        q.style.fill = s === 3 ? RED : G2;
        q.style.fillOpacity = s === 3 ? 0.3 : 1;
        var t = Q(root, 's5h_t');
        t.innerHTML = SIZES[s] + ' × ' + SIZES[s] + ' · circa <tspan style="fill:' + RED + '">' + MB[s] + ' MB</tspan>';
        lbl(root, SIZES[s] + ' × ' + SIZES[s] + ' · circa ' + MB[s] + ' MB');
      }
    };
    OVR['5h'] = {
      k: '5h', t: 'Quanto pesa *una texture*', sim: '5h', simw: 1.2,
      p: ['Ogni volta che il lato raddoppia, la memoria si moltiplica per quattro. Nell\'import della texture, **Max Size** decide la dimensione nel gioco.'],
      caps: ['Lato 512: circa 1 MB senza compressione.',
        'Lato 1024 (1K): circa 4 MB.',
        'Lato 2048 (2K): circa 16 MB.',
        'Lato 4096 (4K): circa 64 MB.'],
      warn: 'Le texture del Legionario sono molto grandi: nel kit vanno ridotte a 2K.'
    };
  })();
})();

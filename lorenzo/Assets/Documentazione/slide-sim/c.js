/* Slide simulations, batch C: UI, audio, animation, camera, particles, level design, 24h timeline.
   Runs before the deck script. Registers SIM[name] and OVR[key]. */
(function () {
  'use strict';
  var SIM = window.SIM, OVR = window.OVR;
  var K = '#1b1b1b', P = '#f4f4f1', G1 = '#e9e9e5', G2 = '#d2d2cc', G3 = '#8c8c8c', G4 = '#585858', R = '#1b1b1b';
  var D = Math.PI / 180;

  function H(extra) {
    return '<svg viewBox="0 0 560 340" width="100%" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible" stroke-linecap="round" stroke-linejoin="round" ' + (extra || '') + '>';
  }
  function T(x, y, s, o) { o = o || ''; return '<text x="' + x + '" y="' + y + '" ' + (/fill="/.test(o) ? '' : 'fill="' + K + '" ') + o + '>' + s + '</text>'; }
  function seg(a) {
    return '<div class="seg">' + a.map(function (t, i) { return '<button data-s="' + i + '">' + t + '</button>'; }).join('') + '</div>';
  }
  function rng(max) { return '<input type="range" class="rng" min="0" max="' + max + '" step="1" value="0">'; }
  function lbl() { return '<div class="lbl" data-k="lbl"></div>'; }
  function q(r, k) { return r.querySelector('[data-k="' + k + '"]'); }
  function qa(r, k) { return Array.prototype.slice.call(r.querySelectorAll('[data-k="' + k + '"]')); }
  function A(el, o) { for (var k in o) el.setAttribute(k, o[k]); }
  function sync(r, s) { var i = r.querySelector('input.rng'); if (i && +i.value !== s) i.value = s; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function setLbl(r, t) { var l = q(r, 'lbl'); if (l) l.textContent = t; }

  /* arm helpers */
  function armHTML(k, sw, jr) {
    return '<g data-k="' + k + '"><polyline data-k="' + k + 'p" fill="none" stroke="' + K + '" stroke-width="' + sw + '"/>' +
      '<circle data-k="' + k + 'j0" r="' + jr + '" fill="' + P + '" stroke="' + K + '" stroke-width="2"/>' +
      '<circle data-k="' + k + 'j1" r="' + jr + '" fill="' + P + '" stroke="' + K + '" stroke-width="2"/>' +
      '<circle data-k="' + k + 'j2" r="' + jr + '" fill="' + K + '" stroke="' + K + '" stroke-width="2"/></g>';
  }
  function armSet(r, k, x, y, a1, a2, l1, l2) {
    var ex = x + l1 * Math.cos(a1 * D), ey = y + l1 * Math.sin(a1 * D);
    var hx = ex + l2 * Math.cos((a1 + a2) * D), hy = ey + l2 * Math.sin((a1 + a2) * D);
    A(q(r, k + 'p'), { points: x + ',' + y + ' ' + ex + ',' + ey + ' ' + hx + ',' + hy });
    A(q(r, k + 'j0'), { cx: x, cy: y });
    A(q(r, k + 'j1'), { cx: ex, cy: ey });
    A(q(r, k + 'j2'), { cx: hx, cy: hy });
    return { ex: ex, ey: ey, hx: hx, hy: hy };
  }

  /* ---------- 12c Anchors ---------- */
  SIM.anchors = {
    steps: 3,
    html: H() +
      '<defs><clipPath id="c12clip"><rect data-k="clipr" x="0" y="0" width="10" height="10"/></clipPath></defs>' +
      '<rect data-k="scr" fill="' + P + '" stroke="' + K + '" stroke-width="2"/>' +
      '<rect data-k="ghost" width="100" height="40" fill="none" stroke="' + G2 + '" stroke-width="2" stroke-dasharray="6 5"/>' +
      '<line data-k="al" stroke="' + G4 + '" stroke-width="2" stroke-dasharray="4 4"/>' +
      '<g clip-path="url(#c12clip)"><g data-k="panel"><rect width="100" height="40" fill="' + G2 + '" stroke="' + K + '" stroke-width="2"/>' +
      T(50, 25, 'Objectives', 'text-anchor="middle" font-size="13"') + '</g></g>' +
      '<circle data-k="anc" r="7" fill="' + R + '"/>' +
      T(280, 322, '', 'text-anchor="middle" data-k="t"') + '</svg>' +
      seg(['16:9', 'Ultrawide', 'Stretta', 'Anchor al centro']),
    set: function (r, s) {
      var W = [320, 460, 150, 150][s], Hh = [180, 180, 240, 240][s], cx = 280, cy = 160, x = cx - W / 2, y = cy - Hh / 2;
      A(q(r, 'scr'), { x: x, y: y, width: W, height: Hh });
      A(q(r, 'clipr'), { x: x, y: y, width: W, height: Hh });
      var px, py, ax, ay, lx, ly;
      if (s < 3) { px = x + W - 118; py = y + 18; ax = x + W; ay = y; lx = px + 100; ly = py; }
      else { px = cx + 50; py = cy - 80; ax = cx; ay = cy; lx = px; ly = py + 20; }
      q(r, 'panel').setAttribute('transform', 'translate(' + px + ',' + py + ')');
      A(q(r, 'ghost'), { x: px, y: py, opacity: s === 3 ? 1 : 0 });
      A(q(r, 'anc'), { cx: ax, cy: ay });
      A(q(r, 'al'), { x1: ax, y1: ay, x2: lx, y2: ly });
      q(r, 't').textContent = s < 3 ? 'anchor: alto a destra' : 'anchor: centro';
    }
  };
  OVR['12c'] = { k: '12c', t: 'Anchors e *RectTransform*', sim: 'anchors',
    p: ['Gli elementi della UI hanno un Transform speciale, il **RectTransform**. Gli **anchor** dicono a quale bordo dello schermo restano attaccati quando la finestra cambia forma.'],
    caps: ['16:9: il pannello sta nell\'angolo in alto a destra.',
      'Ultrawide: l\'anchor lo tiene ancora in quell\'angolo.',
      'Stretta: stesso angolo, stessa distanza dal bordo.',
      '**Anchor al centro**: lo schermo si stringe e il pannello esce dal bordo.'] };

  /* ---------- 12d Raycast ---------- */
  SIM.raycast = {
    steps: 1,
    html: H() +
      '<circle cx="280" cy="22" r="8" fill="' + K + '"/>' + T(300, 28, 'clic') +
      '<line data-k="ray" x1="280" y1="30" x2="280" y2="118" stroke="' + K + '" stroke-width="4"/>' +
      '<rect x="120" y="120" width="320" height="40" fill="none" stroke="' + G4 + '" stroke-width="2" stroke-dasharray="7 5"/>' +
      T(280, 146, '', 'text-anchor="middle" font-size="13" data-k="pt"') +
      '<rect data-k="btn" x="200" y="236" width="160" height="60" fill="' + P + '" stroke="' + K + '" stroke-width="2"/>' +
      T(280, 273, 'Button', 'text-anchor="middle" data-k="bt"') +
      '<circle data-k="hit" cx="280" r="9" fill="' + R + '"/>' + '</svg>' +
      seg(['Raycast Target acceso', 'spento']),
    set: function (r, s) {
      var on = s === 0, y2 = on ? 118 : 234;
      A(q(r, 'ray'), { y2: y2, stroke: on ? R : K });
      A(q(r, 'hit'), { cy: y2, fill: on ? R : K });
      q(r, 'pt').textContent = 'Panel · Raycast Target ' + (on ? 'acceso' : 'spento');
      A(q(r, 'btn'), { fill: on ? P : K });
      A(q(r, 'bt'), { fill: on ? K : P });
    }
  };
  OVR['12d'] = { k: '12d', t: 'Button, *EventSystem*, Raycast', sim: 'raycast',
    p: ['L\'**EventSystem** legge mouse, tastiera e gamepad. Il **Graphic Raycaster**, sul Canvas, trova cosa c\'è sotto il mouse.'],
    caps: ['**Raycast Target** acceso: il raggio si ferma sul pannello e il Button non riceve il clic.',
      '**Raycast Target** spento: il clic attraversa il pannello e arriva al Button.'],
    warn: 'Un pannello trasparente sopra un pulsante con Raycast Target acceso blocca il clic.' };

  /* ---------- 13b Spatial Blend ---------- */
  SIM.spatial = {
    steps: 3,
    html: H() +
      '<g data-k="rings" style="transition:opacity .3s"><circle cx="200" cy="80" r="70" fill="none" stroke="' + G2 + '" stroke-width="2" stroke-dasharray="6 6"/>' +
      '<circle cx="200" cy="80" r="140" fill="none" stroke="' + G2 + '" stroke-width="2" stroke-dasharray="6 6"/>' +
      '<circle cx="200" cy="80" r="210" fill="none" stroke="' + G2 + '" stroke-width="2" stroke-dasharray="6 6"/></g>' +
      '<circle cx="200" cy="80" r="14" fill="' + K + '"/>' + T(200, 46, 'Audio Source', 'text-anchor="middle"') +
      '<g data-k="lis" style="transition:transform .5s ease">' +
      '<rect x="-20" y="-7" width="7" height="16" fill="' + K + '"/><rect x="13" y="-7" width="7" height="16" fill="' + K + '"/>' +
      '<circle r="12" fill="' + P + '" stroke="' + K + '" stroke-width="2"/>' +
      T(-28, 5, 'L', 'text-anchor="end" font-size="13"') + T(28, 5, 'R', 'font-size="13"') +
      T(0, 34, 'Listener', 'text-anchor="middle" font-size="13"') + '</g>' +
      '<rect x="440" y="100" width="36" height="200" fill="none" stroke="' + K + '" stroke-width="2"/>' +
      '<rect x="504" y="100" width="36" height="200" fill="none" stroke="' + K + '" stroke-width="2"/>' +
      '<rect data-k="bl" x="440" y="100" width="36" height="200" style="transform-origin:0 300px;transition:transform .4s ease"/>' +
      '<rect data-k="br" x="504" y="100" width="36" height="200" style="transform-origin:0 300px;transition:transform .4s ease"/>' +
      T(458, 326, 'L', 'text-anchor="middle"') + T(522, 326, 'R', 'text-anchor="middle"') + '</svg>' +
      seg(['3D · vicino', '3D · lontano', '3D · a destra', '2D']),
    set: function (r, s) {
      var pos = [[110, 175], [200, 290], [290, 175], [200, 290]][s];
      q(r, 'lis').style.transform = 'translate(' + pos[0] + 'px,' + pos[1] + 'px)';
      var L = 1, Rr = 1, two = s === 3;
      if (!two) {
        var dx = 200 - pos[0], dy = 80 - pos[1], d = Math.sqrt(dx * dx + dy * dy), g = clamp(1 - d / 300, .1, 1), pan = dx / d;
        L = clamp(g * (1 - .5 * pan), 0, 1); Rr = clamp(g * (1 + .5 * pan), 0, 1);
      }
      q(r, 'rings').style.opacity = two ? 0 : 1;
      var col = two ? R : K;
      A(q(r, 'bl'), { fill: col }); A(q(r, 'br'), { fill: col });
      q(r, 'bl').style.transform = 'scaleY(' + L + ')';
      q(r, 'br').style.transform = 'scaleY(' + Rr + ')';
    }
  };
  OVR['13b'] = { k: '13b', t: '*Spatial Blend*', sim: 'spatial',
    p: ['Si regola con **Spatial Blend** nell\'Audio Source.'],
    caps: ['**3D**: vicino al braciere si sente forte, e più dal lato del braciere.',
      '**3D**: lontano si sente piano.',
      '**3D**: dall\'altra parte il suono arriva dall\'altro orecchio.',
      '**2D**: uguale ovunque, come musica e interfaccia.'] };

  /* ---------- 14a keyframes ---------- */
  var POSES = [[70, -20], [-60, 70], [70, -20]];
  function poseAt(t) {
    var i = t < .5 ? 0 : 1, u = (t < .5 ? t : t - .5) * 2, e = u * u * (3 - 2 * u);
    return [POSES[i][0] + (POSES[i + 1][0] - POSES[i][0]) * e, POSES[i][1] + (POSES[i + 1][1] - POSES[i][1]) * e];
  }
  function keysFrame(r, t) {
    var p = poseAt(t);
    armSet(r, 'live', 280, 40, p[0], p[1], 66, 56);
    var x = 110 + 340 * t;
    A(q(r, 'ph'), { x1: x, x2: x });
  }
  var DIAMONDS = [110, 280, 450];
  SIM.keys = {
    steps: 1,
    html: H() +
      '<g data-k="liveg" style="transition:opacity .4s">' + armHTML('live', 10, 7) + '</g>' +
      [0, 1, 2].map(function (i) {
        return armHTML('s' + i, 7, 5);
      }).join('') +
      '<line x1="60" y1="290" x2="500" y2="290" stroke="' + G3 + '" stroke-width="2"/>' +
      DIAMONDS.map(function (x) {
        return '<polygon points="' + x + ',276 ' + (x + 14) + ',290 ' + x + ',304 ' + (x - 14) + ',290" fill="' + K + '"/>';
      }).join('') +
      '<line data-k="ph" x1="110" x2="110" y1="262" y2="318" stroke="' + R + '" stroke-width="3" style="transition:opacity .3s"/>' +
      T(110, 332, 'keyframe', 'text-anchor="middle" font-size="13"') + T(280, 332, 'keyframe', 'text-anchor="middle" font-size="13"') + T(450, 332, 'keyframe', 'text-anchor="middle" font-size="13"') +
      '</svg>',
    set: function (r, s) {
      r._st = s;
      for (var i = 0; i < 3; i++) armSet(r, 's' + i, DIAMONDS[i] - 18, 178, POSES[i][0], POSES[i][1], 38, 32);
      q(r, 'liveg').style.opacity = s ? 1 : 0;
      q(r, 'ph').style.opacity = s ? 1 : 0;
      keysFrame(r, s ? ((performance.now() - (r._t0 || 0)) / 4000) % 1 || .25 : 0);
    },
    enter: function (r) {
      r._t0 = performance.now();
      cancelAnimationFrame(r._raf);
      (function tick(now) {
        if (r._st === 1) keysFrame(r, (((now || performance.now()) - r._t0) / 4000) % 1);
        r._raf = requestAnimationFrame(tick);
      })();
    },
    leave: function (r) { cancelAnimationFrame(r._raf); }
  };
  OVR['14a'] = { k: '14a', t: 'Animation e *keyframe*', sim: 'keys',
    p: ['Un\'animation è una serie di **pose nel tempo**. Si fissano alcune pose chiave (keyframe) e Unity calcola quelle in mezzo.'],
    caps: ['Tre **keyframe**: pose A, pose B, pose A.', 'Tra un keyframe e l\'altro Unity calcola le pose intermedie.'], simw: 1.2 };

  /* ---------- 14b Skeleton ---------- */
  SIM.bones = {
    steps: 4,
    html: H() +
      '<polyline data-k="o" fill="none" stroke="' + K + '" stroke-width="86"/>' +
      '<polyline data-k="sk" fill="none" stroke="' + G1 + '" stroke-width="82"/>' +
      '<polyline data-k="b" fill="none" stroke="' + K + '" stroke-width="7"/>' +
      '<circle cx="100" cy="170" r="9" fill="' + P + '" stroke="' + K + '" stroke-width="2"/>' +
      '<circle data-k="el" r="11" fill="' + R + '"/>' +
      '<circle data-k="hd" r="8" fill="' + P + '" stroke="' + K + '" stroke-width="2"/>' +
      T(180, 108, 'bone') + T(0, 0, 'joint', 'data-k="jl"') + '</svg>' +
      rng(4) + lbl(),
    set: function (r, s) {
      sync(r, s);
      var e = [0, 30, 60, 90, 120][s], ex = 250, ey = 170, a = e * D;
      var hx = ex + 120 * Math.cos(a), hy = ey + 120 * Math.sin(a);
      var pts = '100,170 ' + ex + ',' + ey + ' ' + hx + ',' + hy;
      A(q(r, 'o'), { points: pts }); A(q(r, 'sk'), { points: pts }); A(q(r, 'b'), { points: pts });
      A(q(r, 'el'), { cx: ex, cy: ey }); A(q(r, 'hd'), { cx: hx, cy: hy });
      A(q(r, 'jl'), { x: ex + 48, y: ey - 22 });
      setLbl(r, 'elbow: ' + e + '°');
    }
  };
  OVR['14b'] = { k: '14b', t: 'Skeleton e *bones*', sim: 'bones',
    p: ['Dentro il modello c\'è uno **skeleton** invisibile. Ogni **bone** muove la parte di pelle vicina.', 'L\'animazione non muove il modello: muove le **bones**.'] };

  /* ---------- 14i Inverse Kinematics ---------- */
  var HIP = [230, 70], L1 = 120, L2 = 120;
  SIM.ik = {
    steps: 1,
    html: H() +
      '<path d="M20 290 L270 290 L270 250 L540 250 L540 330 L20 330 Z" fill="' + G1 + '" stroke="' + K + '" stroke-width="2"/>' +
      '<line x1="230" y1="70" x2="230" y2="20" stroke="' + G3 + '" stroke-width="14"/>' +
      '<line data-k="gap" stroke="' + R + '" stroke-width="2" stroke-dasharray="4 4"/>' +
      '<polyline data-k="leg" fill="none" stroke="' + G4 + '" stroke-width="12"/>' +
      '<circle cx="230" cy="70" r="9" fill="' + P + '" stroke="' + K + '" stroke-width="2"/>' +
      '<circle data-k="kn" r="9" fill="' + P + '" stroke="' + K + '" stroke-width="2"/>' +
      '<circle data-k="ft" r="9" stroke="' + K + '" stroke-width="2"/>' +
      '<g data-k="tg" style="transition:opacity .3s"><circle cx="340" cy="250" r="14" fill="none" stroke="' + R + '" stroke-width="3"/><circle cx="340" cy="250" r="4" fill="' + R + '"/>' + T(362, 236, 'target', 'font-size="13"') + '</g>' +
      T(205, 75, 'hip', 'text-anchor="end" font-size="13"') + T(0, 0, 'knee', 'data-k="kl" font-size="13"') + '</svg>' +
      seg(['Forward Kinematics', 'IK']),
    set: function (r, s) {
      var kx, ky, fx, fy;
      if (s === 0) {
        kx = HIP[0] + L1 * Math.cos(55 * D); ky = HIP[1] + L1 * Math.sin(55 * D);
        fx = kx; fy = ky + L2;
      } else {
        var tx = 340, ty = 250, dx = tx - HIP[0], dy = ty - HIP[1], d = Math.min(Math.sqrt(dx * dx + dy * dy), L1 + L2 - .01);
        var th = Math.atan2(dy, dx), al = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
        kx = HIP[0] + L1 * Math.cos(th - al); ky = HIP[1] + L1 * Math.sin(th - al);
        fx = tx; fy = ty;
      }
      A(q(r, 'leg'), { points: HIP[0] + ',' + HIP[1] + ' ' + kx + ',' + ky + ' ' + fx + ',' + fy });
      A(q(r, 'kn'), { cx: kx, cy: ky }); A(q(r, 'ft'), { cx: fx, cy: fy, fill: s === 0 ? R : K });
      A(q(r, 'kl'), { x: kx + 16, y: ky + 5 });
      A(q(r, 'gap'), { x1: fx, y1: fy, x2: fx, y2: 250, opacity: s === 0 ? 1 : 0 });
      q(r, 'tg').style.opacity = s === 0 ? 0 : 1;
    }
  };
  OVR['14i'] = { k: '14i', t: '*Inverse Kinematics*', sim: 'ik',
    p: ['Normalmente l\'animazione muove anca, ginocchio e piede, in quest\'ordine. Con l\'**IK** (inverse kinematics) si parte dal piede: "deve stare qui", e Unity piega il resto.',
      'Serve per appoggiare i piedi sui gradini. Con le animazioni di Mixamo fa solo danni.'],
    caps: ['**Forward Kinematics**: la posa viene dalle rotazioni. Il piede finisce dove capita.', '**IK**: il piede ha un target sul gradino, la gamba si piega per raggiungerlo.'],
    warn: 'Foot IK spento sullo stato, nell\'Animator. IK Pass spento nel layer.' };

  /* ---------- 14l Blend Tree ---------- */
  var SPEEDS = [0, .5, 1, 1.6, 2, 2.5, 3, 3.5, 4, 4.5];
  function bw(v) {
    if (v <= 1.6) return [(1.6 - v) / 1.6, v / 1.6, 0];
    return [0, (4.5 - v) / 2.9, (v - 1.6) / 2.9];
  }
  var BX = [30, 210, 390], BN = ['Idle · 0', 'Walk · 1.6', 'Run · 4.5'];
  SIM.blendtree = {
    steps: 9,
    html: H() +
      [0, 1, 2].map(function (i) {
        return '<rect x="' + BX[i] + '" y="40" width="140" height="110" fill="' + P + '" stroke="' + K + '" stroke-width="2"/>' +
          T(BX[i] + 70, 70, BN[i], 'text-anchor="middle"') +
          T(BX[i] + 70, 125, '', 'text-anchor="middle" font-size="30" data-k="pc' + i + '"') +
          '<rect x="' + BX[i] + '" y="166" width="140" height="20" fill="none" stroke="' + K + '" stroke-width="2"/>' +
          '<rect data-k="wb' + i + '" x="' + BX[i] + '" y="166" width="140" height="20" fill="' + K + '" style="transform-origin:' + BX[i] + 'px 0;transition:transform .3s ease"/>';
      }).join('') +
      '<line x1="40" y1="266" x2="520" y2="266" stroke="' + G3 + '" stroke-width="2"/>' +
      [[0, '0'], [1.6, '1.6'], [4.5, '4.5']].map(function (a) {
        var x = 40 + a[0] / 4.5 * 480;
        return '<line x1="' + x + '" y1="256" x2="' + x + '" y2="276" stroke="' + K + '" stroke-width="2"/>' + T(x, 300, a[1], 'text-anchor="middle" font-size="13"');
      }).join('') +
      '<circle data-k="mk" cy="266" r="10" fill="' + R + '" style="transition:transform .3s ease"/>' +
      T(40, 240, 'Speed', 'font-size="13"') + '</svg>' + rng(9) + lbl(),
    set: function (r, s) {
      sync(r, s);
      var v = SPEEDS[s], w = bw(v), parts = [];
      for (var i = 0; i < 3; i++) {
        q(r, 'wb' + i).style.transform = 'scaleX(' + w[i] + ')';
        var pc = Math.round(w[i] * 100);
        q(r, 'pc' + i).textContent = pc + '%';
        if (pc > 0 && i > 0) parts.push(['', 'Walk', 'Run'][i] + ' ' + pc + '%');
        if (pc > 0 && i === 0) parts.push('Idle ' + pc + '%');
      }
      A(q(r, 'mk'), { cx: 0 });
      q(r, 'mk').style.transform = 'translateX(' + (40 + v / 4.5 * 480) + 'px)';
      setLbl(r, 'Speed = ' + v + ' · ' + parts.join(' · '));
    }
  };
  OVR['14l'] = { k: '14l', t: 'Il *Blend Tree*', sim: 'blendtree',
    p: ['Invece di saltare da camminata a corsa, le mescola in base alla velocità.'],
    n: 'Speed è in metri al secondo: nel PlayerController walkSpeed vale 1.6 e runSpeed 4.5, per questo le soglie sono quelle. Il kit ha già AC_Legionario con questo schema: aprilo e confronta. Passi: 1) Tasto destro: Create State > From New Blend Tree. 2) Dentro: Blend Type 1D, parametro Speed. 3) Tre motion: Idle a 0, Walk a 1.6, Run a 4.5.' };

  /* ---------- 15c Sky ---------- */
  function camIcon(k, extra) {
    return '<g data-k="' + k + '" style="transition:transform .6s ease" ' + (extra || '') + '><rect x="-14" y="-9" width="22" height="18" fill="' + P + '" stroke="' + K + '" stroke-width="2"/>' +
      '<polygon points="8,-5 18,-10 18,10 8,5" fill="' + K + '"/></g>';
  }
  SIM.sky = {
    steps: 1,
    html: H() +
      '<polygon data-k="c0" points="170,64 540,20 540,250 300,288" fill="' + G1 + '" stroke="' + G3 + '" stroke-width="2" stroke-dasharray="6 5" style="transition:opacity .4s"/>' +
      '<polygon data-k="c1" points="190,172 420,134 420,276" fill="' + G1 + '" stroke="' + G3 + '" stroke-width="2" stroke-dasharray="6 5" style="transition:opacity .4s"/>' +
      '<line x1="40" y1="290" x2="520" y2="290" stroke="' + K + '" stroke-width="2"/>' +
      '<line x1="140" y1="290" x2="140" y2="110" stroke="' + K + '" stroke-width="4"/>' +
      '<line x1="420" y1="290" x2="420" y2="110" stroke="' + K + '" stroke-width="4"/>' +
      '<g data-k="ceil" style="transition:opacity .4s"><line x1="140" y1="110" x2="420" y2="110" stroke="' + K + '" stroke-width="6"/>' + T(280, 98, 'collider', 'text-anchor="middle" fill="' + R + '"') + '</g>' +
      '<circle cx="260" cy="262" r="9" fill="' + P + '" stroke="' + K + '" stroke-width="2"/><line x1="260" y1="271" x2="260" y2="290" stroke="' + K + '" stroke-width="3"/>' +
      '<line x1="260" y1="276" x2="248" y2="268" stroke="' + K + '" stroke-width="2"/><line x1="260" y1="276" x2="272" y2="268" stroke="' + K + '" stroke-width="2"/>' +
      T(260, 318, 'Player', 'text-anchor="middle" font-size="13"') +
      camIcon('cam') +
      T(440, 92, 'cielo', 'data-k="sk" fill="' + R + '" font-size="20" style="transition:opacity .4s"') + '</svg>',
    set: function (r, s) {
      q(r, 'cam').style.transform = s ? 'translate(190px,172px)' : 'translate(170px,64px)';
      q(r, 'c0').style.opacity = s ? 0 : 1;
      q(r, 'c1').style.opacity = s ? 1 : 0;
      q(r, 'ceil').style.opacity = s ? 1 : 0;
      q(r, 'sk').style.opacity = s ? 0 : 1;
    }
  };
  OVR['15c'] = { k: '15c', t: 'Il cielo *dentro il tempio*', sim: 'sky',
    p: ['La camera del kit si avvicina quando incontra un collider, per non entrare nei muri.'],
    caps: ['Dove manca un soffitto, la camera non trova niente e mostra il cielo. **Chiudi le stanze**: un soffitto, anche semplice.',
      '**Un collider sopra**: la camera resta dentro. Se non vuoi il soffitto visibile, basta il collider.'] };

  /* ---------- 16b Particles ---------- */
  var NP = 60;
  SIM.particles = {
    steps: 2,
    html: H() +
      '<g data-k="sh0" style="transition:opacity .3s"><line x1="280" y1="290" x2="' + (280 - 200 * Math.tan(25 * D)) + '" y2="90" stroke="' + G4 + '" stroke-width="2" stroke-dasharray="7 6"/><line x1="280" y1="290" x2="' + (280 + 200 * Math.tan(25 * D)) + '" y2="90" stroke="' + G4 + '" stroke-width="2" stroke-dasharray="7 6"/><circle cx="280" cy="290" r="7" fill="' + R + '"/></g>' +
      '<g data-k="sh1" style="transition:opacity .3s"><circle cx="280" cy="180" r="60" fill="none" stroke="' + G4 + '" stroke-width="2" stroke-dasharray="7 6"/><circle cx="280" cy="180" r="7" fill="' + R + '"/></g>' +
      '<g data-k="sh2" style="transition:opacity .3s"><ellipse cx="280" cy="270" rx="70" ry="20" fill="none" stroke="' + G4 + '" stroke-width="2" stroke-dasharray="7 6"/><circle cx="280" cy="270" r="7" fill="' + R + '"/></g>' +
      '<g>' + new Array(NP + 1).join('<circle data-k="pt" r="5" fill="' + K + '" opacity="0"/>') + '</g></svg>' +
      seg(['Cone', 'Sphere', 'Circle']),
    set: function (r, s) {
      r._st = s; r._parts = [];
      for (var i = 0; i < 3; i++) q(r, 'sh' + i).style.opacity = i === s ? 1 : 0;
      qa(r, 'pt').forEach(function (c) { c.setAttribute('opacity', 0); });
    },
    enter: function (r) {
      r._last = 0; r._acc = 0; r._parts = r._parts || [];
      var pts = qa(r, 'pt');
      cancelAnimationFrame(r._raf);
      function spawn(s) {
        var p = { age: 0 }, a, sp;
        if (s === 0) { a = (-90 + (Math.random() * 50 - 25)) * D; sp = 90 + Math.random() * 60; p.x = 280; p.y = 290; p.vx = Math.cos(a) * sp; p.vy = Math.sin(a) * sp; p.life = 1.6 + Math.random() * .8; }
        else if (s === 1) { a = Math.random() * 6.2832; sp = 50 + Math.random() * 40; p.x = 280 + 60 * Math.cos(a); p.y = 180 + 60 * Math.sin(a); p.vx = Math.cos(a) * sp; p.vy = Math.sin(a) * sp; p.life = 1.2 + Math.random() * .6; }
        else { a = Math.random() * 6.2832; p.x = 280 + 70 * Math.cos(a); p.y = 270 + 20 * Math.sin(a); p.vx = Math.cos(a) * 10; p.vy = -(90 + Math.random() * 50); p.life = 1.4 + Math.random() * .6; }
        return p;
      }
      function tick(now) {
        var dt = r._last ? Math.min((now - r._last) / 1000, .05) : 0; r._last = now;
        r._acc += dt * 26;
        while (r._acc >= 1) { r._acc -= 1; if (r._parts.length < NP) r._parts.push(spawn(r._st)); }
        r._parts = r._parts.filter(function (p) { p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt; return p.age < p.life; });
        for (var i = 0; i < NP; i++) {
          var p = r._parts[i], c = pts[i];
          if (p) { c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('opacity', (1 - p.age / p.life).toFixed(2)); }
          else c.setAttribute('opacity', 0);
        }
        r._raf = requestAnimationFrame(tick);
      }
      r._raf = requestAnimationFrame(tick);
    },
    leave: function (r) { cancelAnimationFrame(r._raf); }
  };
  OVR['16b'] = { k: '16b', t: 'Emitter, Shape, *particles*', sim: 'particles',
    p: ['L\'**Emitter** è il punto da cui nascono le particles. Una **Particle** è un\'immagine che vive pochi secondi.'],
    caps: ['**Shape** Cone: escono da un punto e si allargano.', '**Shape** Sphere: escono in tutte le direzioni.', '**Shape** Circle: escono da un cerchio, verso l\'alto.'] };

  /* ---------- 17c Door ---------- */
  var SPARK = [[-120, -80], [-60, -130], [0, -150], [60, -130], [120, -80], [-130, 10], [130, 10], [0, 100]];
  SIM.door = {
    steps: 4,
    html: H() +
      '<defs><clipPath id="c17clip"><rect x="204" y="84" width="152" height="202"/></clipPath></defs>' +
      '<g data-k="halo" style="opacity:0"><circle cx="280" cy="185" r="150" fill="' + G1 + '"/><circle cx="280" cy="185" r="120" fill="' + G2 + '"/></g>' +
      '<rect x="200" y="80" width="160" height="210" fill="' + K + '"/>' +
      '<g clip-path="url(#c17clip)"><rect data-k="leaf" x="204" y="84" width="152" height="202" fill="' + G2 + '" stroke="' + K + '" stroke-width="2"/></g>' +
      '<rect x="200" y="80" width="160" height="210" fill="none" stroke="' + K + '" stroke-width="4"/>' +
      '<line x1="40" y1="290" x2="520" y2="290" stroke="' + K + '" stroke-width="2"/>' +
      '<rect x="82" y="262" width="48" height="28" fill="' + G1 + '" stroke="' + K + '" stroke-width="2"/><circle cx="106" cy="250" r="12" fill="' + K + '"/>' +
      '<g data-k="snd" style="opacity:0" fill="none" stroke="' + K + '" stroke-width="3"><path d="M392 150 Q412 185 392 220"/><path d="M412 135 Q444 185 412 235"/><path d="M432 120 Q476 185 432 250"/></g>' +
      [0, 1, 2, 3, 4, 5, 6, 7].map(function () { return '<circle data-k="sp" cx="280" cy="185" r="6" fill="' + K + '" opacity="0"/>'; }).join('') +
      '</svg>',
    set: function (r, s) {
      (r._tm || []).forEach(clearTimeout); r._tm = [];
      var leaf = q(r, 'leaf'), halo = q(r, 'halo'), snd = q(r, 'snd'), sp = qa(r, 'sp');
      [leaf, halo, snd].forEach(function (e) { e.style.transition = 'none'; });
      leaf.style.transform = 'translateY(0)'; halo.style.opacity = 0; snd.style.opacity = 0;
      sp.forEach(function (c) { c.style.transition = 'none'; c.style.transform = 'translate(0,0)'; c.style.opacity = 0; });
      void leaf.getBoundingClientRect();
      r._tm.push(setTimeout(function () {
        leaf.style.transition = s >= 4 ? 'transform .9s ease-in-out' : 'none';
        leaf.style.transform = 'translateY(-206px)';
        if (s >= 1) { snd.style.transition = 'opacity .3s'; snd.style.opacity = 1; }
        if (s >= 2) { halo.style.transition = 'opacity .5s'; halo.style.opacity = 1; }
        if (s >= 3) {
          sp.forEach(function (c, i) {
            c.style.transition = 'transform .7s ease-out, opacity .7s ease-in';
            c.style.transform = 'translate(' + SPARK[i][0] + 'px,' + SPARK[i][1] + 'px)';
            c.style.opacity = 1;
          });
          r._tm.push(setTimeout(function () { sp.forEach(function (c) { c.style.opacity = 0; }); }, 800));
        }
      }, 450));
    },
    leave: function (r) { (r._tm || []).forEach(clearTimeout); r._tm = []; }
  };
  OVR['17c'] = { k: '17c', t: 'Insieme è *più forte*', sim: 'door', p: [],
    caps: ['Solo la porta: si apre di colpo e nessuno se ne accorge.',
      '**Sound.** Conferma subito.',
      '+ **Light.** Guida lo sguardo.',
      '+ **Particles.** Rendono l\'evento visibile da lontano.',
      '+ **Animation.** Mostra che qualcosa si muove. Un solo segnale si perde. Due o tre insieme si ricordano.'] };

  /* ---------- 18b Player scale ---------- */
  var WL = [40, 205, 255], WR = [520, 355, 305], WN = ['Troppo largo · 9,6 m', 'Giusto · 3 m', 'Troppo stretto · 1 m'], WT = ['9,6 m', '3 m', '1 m'];
  SIM.scale = {
    steps: 2,
    html: H() +
      '<rect data-k="wl" x="0" y="60" height="240" fill="' + G1 + '" stroke="' + K + '" stroke-width="2"/>' +
      '<rect data-k="wr" y="60" height="240" fill="' + G1 + '" stroke="' + K + '" stroke-width="2"/>' +
      '<line x1="0" y1="300" x2="560" y2="300" stroke="' + K + '" stroke-width="3"/>' +
      '<circle cx="280" cy="219" r="9" fill="' + P + '" stroke="' + K + '" stroke-width="2"/>' +
      '<g stroke="' + K + '" stroke-width="3" fill="none"><line x1="280" y1="228" x2="280" y2="264"/><line x1="280" y1="264" x2="272" y2="300"/><line x1="280" y1="264" x2="288" y2="300"/><line x1="280" y1="238" x2="268" y2="258"/><line x1="280" y1="238" x2="292" y2="258"/></g>' +
      T(280, 196, '1,8 m', 'text-anchor="middle" font-size="13"') +
      '<g data-k="cam" style="transition:opacity .3s"><rect data-k="cr" y="141" width="24" height="18" fill="' + P + '" stroke="' + R + '" stroke-width="3"/>' +
      '<g stroke="' + R + '" stroke-width="3"><line data-k="b1" y1="136" y2="128"/><line data-k="b2" y1="150" y2="150"/><line data-k="b3" y1="164" y2="172"/></g>' +
      T(0, 0, 'camera', 'data-k="ct" text-anchor="middle" fill="' + R + '" font-size="13"') + '</g>' +
      T(280, 330, '', 'text-anchor="middle" data-k="wt"') + '</svg>' + rng(2) + lbl(),
    set: function (r, s) {
      sync(r, s);
      A(q(r, 'wl'), { width: WL[s] }); A(q(r, 'wr'), { x: WR[s], width: 560 - WR[s] });
      var xr = WR[s];
      A(q(r, 'cr'), { x: xr - 20 });
      A(q(r, 'b1'), { x1: xr + 10, x2: xr + 18 }); A(q(r, 'b2'), { x1: xr + 12, x2: xr + 24 }); A(q(r, 'b3'), { x1: xr + 10, x2: xr + 18 });
      A(q(r, 'ct'), { x: xr - 8, y: 130 });
      q(r, 'cam').style.opacity = s === 2 ? 1 : 0;
      q(r, 'wt').textContent = WT[s];
      setLbl(r, WN[s]);
    }
  };
  OVR['18b'] = { k: '18b', t: 'La scala *del giocatore*', sim: 'scale',
    p: ['Porte, gradini e corridoi si misurano sul giocatore, alto circa 1,8 metri.'],
    caps: ['Un corridoio largo come un\'autostrada sembra vuoto.', 'Giusto: spazio per camminare e per la camera.', 'Troppo stretto: la camera sbatte sul muro.'],
    warn: 'Mettete il giocatore in scena prima di costruire.' };

  /* ---------- 18f Rhythm ---------- */
  var SP = [[20, 100, 180, 160, 'cortile', 110], [200, 155, 120, 30, 'cancello', 260], [320, 70, 200, 200, 'santuario', 430]];
  SIM.rhythm = {
    steps: 2,
    html: H() +
      SP.map(function (b, i) {
        return '<rect data-k="sp' + i + '" x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '" stroke-width="2"/>' + T(b[5], 300, b[4], 'text-anchor="middle" font-size="14"');
      }).join('') +
      '<g data-k="dot" style="transition:transform .6s ease"><circle cy="170" r="10" fill="' + K + '"/></g></svg>',
    set: function (r, s) {
      for (var i = 0; i < 3; i++) {
        A(q(r, 'sp' + i), { fill: i === s ? G2 : P, stroke: i === s ? (s === 1 ? R : K) : G3 });
      }
      q(r, 'dot').style.transform = 'translateX(' + SP[s][5] + 'px)';
    }
  };
  OVR['18f'] = { k: '18f', t: 'Il *ritmo*', sim: 'rhythm', p: ['Aperto, stretto, aperto.'],
    caps: ['Aperto: il cortile fa respirare.', 'Stretto: il cancello stringe.', 'Aperto: il santuario si apre e premia.'],
    warn: 'Un passaggio stretto prima della meta la rende più grande quando arrivi.' };

  /* ---------- 22 Le 24 ore ---------- */
  SIM.ore24 = {
    steps: 8,
    html: H() +
      '<line x1="40" y1="170" x2="520" y2="170" stroke="' + G2 + '" stroke-width="3"/>' +
      '<line data-k="prog" x1="40" y1="170" x2="40" y2="170" stroke="' + K + '" stroke-width="3"/>' +
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
        return '<g data-s="' + i + '" style="cursor:pointer"><circle cx="' + (40 + i * 60) + '" cy="170" r="24" fill="' + P + '" fill-opacity="0.01"/><circle data-k="d' + i + '" cx="' + (40 + i * 60) + '" cy="170" r="9" stroke-width="2"/></g>';
      }).join('') + '</svg>',
    set: function (r, s) {
      A(q(r, 'prog'), { x2: 40 + s * 60 });
      for (var i = 0; i < 9; i++) {
        var d = q(r, 'd' + i);
        if (i < s) A(d, { r: 9, fill: K, stroke: K });
        else if (i === s) A(d, { r: 17, fill: P, stroke: K, 'stroke-width': 5 });
        else A(d, { r: 9, fill: P, stroke: G3, 'stroke-width': 2 });
      }
    }
  };
  OVR['22a'] = { k: '22a', t: 'Le 24 ore, *un passo alla volta*', sim: 'ore24', wide: 1, p: [],
    caps: [
      '**Validare l\'idea.** Si riesce a fare in 24 ore? Si racconta in una frase? C\'entra il patrimonio? Se la risposta è no, si cambia idea SUBITO, non il giorno seguente.',
      '**Immaginare come sarà.** Cosa vede il giocatore entrando? Dove deve arrivare? Cosa scopre lungo la strada?',
      '**Disegnarlo a mano.** Una pianta su carta: stanze, percorso, punto focale, dove stanno gli oggetti. Dieci minuti di disegno salvano ore di Unity.',
      '**Il disegno sotto i piedi.** Fotografate il disegno, mettetelo su un Plane e costruite sopra.',
      '**Prima il gameplay grezzo.** Cubi grigi, il giocatore, le interazioni base. Si gioca subito per capire se gli spazi funzionano.',
      '**Poi tutto il resto.** Solo quando lo spazio funziona: modelli veri, interazioni complete, animazioni, luci, effetti, suoni, schede storiche.',
      '**Una build a metà.** A metà maratona fate una build e provatela. La prima build trova sempre problemi: meglio scoprirli subito che all\'ultimo minuto.',
      '**Provare e tagliare.** Fate giocare chi non ha costruito. Quello che non funziona entro una certa ora, si taglia. Un gioco piccolo e finito batte un gioco grande a metà.',
      '**Chi tocca la scena.** Se due persone modificano la stessa scena, una cancella il lavoro dell\'altra. **Una persona** tiene la scena, gli altri preparano prefab, schede e suoni.'] };
  ['22b', '22c', '22e', '22f', '22g', '22h', '22i'].forEach(function (k) { OVR[k] = null; });
})();

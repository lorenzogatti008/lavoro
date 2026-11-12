/* Interactive drawings, set B: slides 6b 6c 6d 7a 8a 8c 10b 10c 10d 10e 11b 11h */
(function () {
  var SIM = window.SIM, OVR = window.OVR;
  var INK = '#1b1b1b', PA = '#f4f4f1', G1 = '#e9e9e5', G2 = '#d2d2cc', G3 = '#8c8c8c', G4 = '#585858', RED = '#1b1b1b';
  var STYLE = '<style>.bt{transition:transform .6s ease,opacity .5s ease,fill .5s ease,stroke .5s ease}' +
    '.bt-o{transform-box:fill-box;transform-origin:50% 100%}.bt-c{transform-box:fill-box;transform-origin:50% 50%}' +
    '.bt-l{transform-box:fill-box;transform-origin:0 50%}</style>';

  /* ---------- helpers ---------- */
  function el(tag, a, c) {
    var d = tag === 'g' ? {} : { fill: tag === 'text' ? INK : 'none', stroke: 'none', 'stroke-width': 2 };
    var k, s = '';
    for (k in a) d[k] = a[k];
    for (k in d) s += ' ' + k + '="' + d[k] + '"';
    return c != null ? '<' + tag + s + '>' + c + '</' + tag + '>' : '<' + tag + s + '/>';
  }
  function svg(inner) {
    return STYLE + '<svg viewBox="0 0 560 340" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block">' + inner + '</svg>';
  }
  function seg(labels) {
    return '<div class="seg">' + labels.map(function (l, i) { return '<button data-s="' + i + '">' + l + '</button>'; }).join('') + '</div>';
  }
  function $(r, i) { return r.querySelector('#' + i); }
  function st(e, o) { if (e) for (var k in o) e.style[k] = o[k]; }
  function tx(r, i, s) { var e = $(r, i); if (e) e.textContent = s; }
  function at(e, k, v) { if (e) e.setAttribute(k, v); }
  function lbl(r, s) { var e = r.querySelector('.lbl'); if (e) e.textContent = s; }
  function T(x, y, s, o) {
    var a = { x: x, y: y, 'text-anchor': 'middle' };
    for (var k in (o || {})) a[k] = o[k];
    return el('text', a, s);
  }
  function stopAnims(e) { if (e && e.getAnimations) e.getAnimations().forEach(function (a) { a.cancel(); }); }

  /* ================= 6b Quale collider ================= */
  var STAT_BODY = '252,290 308,290 308,264 298,264 302,162 258,162 262,264 252,264';
  var DASH = { stroke: INK, 'stroke-width': 3, 'stroke-dasharray': '9 6', class: 'bt' };
  function dash(tag, a, c) { var o = {}, k; for (k in DASH) o[k] = DASH[k]; for (k in a) o[k] = a[k]; return el(tag, o, c); }
  var N6B = ['Box Collider', 'Sphere Collider', 'Capsule Collider', 'Mesh Collider'];
  SIM.collider = {
    steps: 3,
    html: svg(
      el('line', { x1: 80, y1: 290, x2: 480, y2: 290, stroke: G3 }) +
      el('circle', { cx: 280, cy: 112, r: 22, fill: G2 }) +
      el('polygon', { points: STAT_BODY, fill: G2 }) +
      dash('rect', { id: 'b6c0', x: 236, y: 80, width: 88, height: 214 }) +
      dash('circle', { id: 'b6c1', cx: 280, cy: 190, r: 114 }) +
      dash('rect', { id: 'b6c2', x: 234, y: 78, width: 92, height: 218, rx: 46 }) +
      el('g', { id: 'b6c3', class: 'bt' },
        el('circle', { cx: 280, cy: 112, r: 22, stroke: INK, 'stroke-width': 3, 'stroke-dasharray': '9 6' }) +
        el('polygon', { points: STAT_BODY, stroke: INK, 'stroke-width': 3, 'stroke-dasharray': '9 6' })) +
      T(280, 328, '', { id: 'b6l' })
    ) + seg(['Box', 'Sphere', 'Capsule', 'Mesh']),
    set: function (r, s) {
      for (var i = 0; i < 4; i++) st($(r, 'b6c' + i), { opacity: i === s ? 1 : 0 });
      tx(r, 'b6l', N6B[s]);
    }
  };
  OVR['6b'] = {
    k: '6b', t: 'Quale *collider*', sim: 'collider', p: [],
    caps: ['**Box.** Muri, gradini, casse: il più usato.', '**Sphere.** Palle, oggetti tondi.', '**Capsule.** Personaggi, colonne.', '**Mesh.** Forme complicate: preciso ma costoso.'],
    warn: 'Un Box Collider è quasi sempre meglio di un Mesh Collider: più leggero e più affidabile.', simw: 1.2
  };

  /* ================= 6c Rigidbody e gravity ================= */
  var N6C = ['Box Collider', 'Box Collider + Rigidbody', 'Rigidbody (Is Kinematic)'];
  SIM.rigidbody = {
    steps: 2,
    html: svg(
      el('rect', { x: 30, y: 270, width: 500, height: 50, fill: G1 }) +
      el('line', { x1: 30, y1: 270, x2: 530, y2: 270, stroke: INK }) +
      el('g', { id: 'b6cube' }, el('rect', { x: 245, y: 60, width: 70, height: 70, fill: G2, stroke: INK })) +
      T(280, 306, '', { id: 'b6cl' })
    ) + seg(['Solo Collider', 'Rigidbody', 'Is Kinematic']),
    set: function (r, s) {
      var c = $(r, 'b6cube');
      stopAnims(c);
      c.style.transform = '';
      if (s === 1 && c.animate) {
        c.animate([
          { transform: 'translateY(0px)', offset: 0, easing: 'ease-in' },
          { transform: 'translateY(140px)', offset: 0.5, easing: 'ease-out' },
          { transform: 'translateY(112px)', offset: 0.68, easing: 'ease-in' },
          { transform: 'translateY(140px)', offset: 0.84 },
          { transform: 'translateY(140px)', offset: 1 }
        ], { duration: 1500, fill: 'forwards' });
      }
      tx(r, 'b6cl', N6C[s]);
    }
  };
  OVR['6c'] = {
    k: '6c', t: 'Rigidbody e *gravity*', sim: 'rigidbody', p: [],
    caps: ['Il collider da solo sta fermo.', 'Con un **Rigidbody** l\'oggetto cade, rimbalza, viene spinto.', 'Se è **Is Kinematic**, lo muovono un\'animazione o uno script, non la fisica.'],
    n: 'Dal vivo: un Cube in aria, aggiungi Rigidbody, Play.', simw: 1.2
  };

  /* ================= 6d Collider o trigger? ================= */
  SIM.trigger = {
    steps: 1,
    html: svg(
      el('line', { x1: 20, y1: 270, x2: 540, y2: 270, stroke: G3 }) +
      el('rect', { id: 'b6z', x: 300, y: 150, width: 90, height: 120, fill: G3, stroke: INK }) +
      T(345, 304, '', { id: 'b6zl' }) +
      T(345, 132, 'OnTriggerEnter', { id: 'b6ot', fill: RED, style: 'opacity:0' }) +
      el('g', { id: 'b6p' },
        el('circle', { cx: 60, cy: 242, r: 28, fill: PA, stroke: INK }) +
        T(60, 196, 'Player', { 'font-size': 13 }))
    ) + seg(['Collider', 'Is Trigger']),
    set: function (r, s) {
      var p = $(r, 'b6p'), z = $(r, 'b6z'), ot = $(r, 'b6ot');
      clearTimeout(r._t6); clearTimeout(r._t6b); clearTimeout(r._t6c);
      ot.textContent = 'OnTriggerEnter';
      stopAnims(p);
      p.style.transform = '';
      at(z, 'fill', s ? 'none' : G3);
      at(z, 'stroke', INK);
      at(z, 'stroke-dasharray', s ? '9 6' : 'none');
      ot.style.opacity = 0;
      tx(r, 'b6zl', s ? 'Is Trigger' : 'Collider');
      if (p.animate) {
        if (s) {
          p.animate([{ transform: 'translateX(0px)' }, { transform: 'translateX(420px)' }], { duration: 2600, easing: 'linear', fill: 'forwards' });
          r._t6 = setTimeout(function () { at(z, 'stroke', RED); at(z, 'fill', G2); ot.textContent = 'OnTriggerEnter'; ot.style.opacity = 1; }, 1486);
          r._t6b = setTimeout(function () { at(z, 'fill', 'none'); ot.textContent = 'OnTriggerExit'; }, 2043);
          r._t6c = setTimeout(function () { at(z, 'stroke', INK); ot.style.opacity = 0; }, 2843);
        } else {
          p.animate([{ transform: 'translateX(0px)' }, { transform: 'translateX(212px)' }], { duration: 1500, easing: 'ease-out', fill: 'forwards' });
        }
      }
    },
    leave: function (r) { clearTimeout(r._t6); clearTimeout(r._t6b); clearTimeout(r._t6c); }
  };
  OVR['6d'] = {
    k: '6d', t: 'Collider o *trigger*?', sim: 'trigger', p: [],
    caps: ['**Collider.** Un corpo solido: muri, colonne. Il player si ferma.', '**Trigger.** Is Trigger attivo: una zona che segnala chi entra.'],
    warn: 'Un trigger sente qualcosa solo se uno dei due ha un Rigidbody o un Character Controller.', simw: 1.2
  };

  /* ================= 7a Prefab e instance ================= */
  function brazier(id, cx, cy) {
    return el('g', { id: id },
      el('path', { d: 'M' + (cx - 34) + ',' + cy + ' Q' + cx + ',' + (cy + 60) + ' ' + (cx + 34) + ',' + cy + ' Z', fill: G2, stroke: INK }) +
      el('line', { x1: cx, y1: cy + 30, x2: cx, y2: cy + 70, stroke: INK }) +
      el('line', { x1: cx - 22, y1: cy + 70, x2: cx + 22, y2: cy + 70, stroke: INK }) +
      el('path', { id: id + 'f', class: 'bt bt-o', fill: G4,
        d: 'M' + (cx - 14) + ',' + (cy - 2) + ' C' + (cx - 18) + ',' + (cy - 22) + ' ' + (cx - 4) + ',' + (cy - 28) + ' ' + cx + ',' + (cy - 48) +
          ' C' + (cx + 6) + ',' + (cy - 30) + ' ' + (cx + 18) + ',' + (cy - 22) + ' ' + (cx + 14) + ',' + (cy - 2) + ' Z' }));
  }
  var P7 = [
    { s: [1, 1, 1, 1], f: [G4, G4, G4, G4], t: '' },
    { s: [1, 1, 1.7, 1], f: [G4, G4, RED, G4], t: 'Override' },
    { s: [1.7, 1.7, 1.7, 1.7], f: [G4, G4, G4, G4], t: 'Apply' },
    { s: [1, 1, 1, 1], f: [G4, G4, G4, G4], t: 'Revert' }
  ];
  SIM.prefab = {
    steps: 3,
    html: svg(
      el('rect', { x: 20, y: 100, width: 170, height: 200, stroke: INK, 'stroke-dasharray': '9 6' }) +
      el('rect', { x: 250, y: 100, width: 290, height: 200, stroke: G3 }) +
      T(105, 80, 'nel Project') + T(395, 80, 'nella scena') +
      T(105, 288, 'Prefab') +
      brazier('b7a0', 105, 190) + brazier('b7a1', 300, 190) + brazier('b7a2', 395, 190) + brazier('b7a3', 490, 190) +
      T(395, 328, '', { id: 'b7t', fill: RED })
    ) + seg(['Start', 'Override', 'Apply', 'Revert']),
    set: function (r, s) {
      var d = P7[s];
      for (var i = 0; i < 4; i++) {
        var f = $(r, 'b7a' + i + 'f');
        f.classList.add('bt');
        st(f, { transform: 'scale(' + d.s[i] + ')' });
        at(f, 'fill', d.f[i]);
      }
      tx(r, 'b7t', d.t);
    }
  };
  OVR['7a'] = {
    k: '7a', t: 'Prefab e *instance*', sim: 'prefab', p: [],
    caps: ['**Prefab** è lo stampo, nel Project. **Instance** è una copia nella scena, con l\'icona blu.',
      '**Override**: una modifica solo su quella copia, in grassetto.',
      '**Apply**: porti la modifica nello stampo, e cambiano tutte le copie.',
      '**Revert**: butti la modifica, e la copia torna come lo stampo.'],
    wide: 1, simw: 1.2
  };

  /* ================= 8a La regola del kit ================= */
  SIM.rule = {
    steps: 2,
    html: svg(
      el('rect', { id: 'b8l', x: 20, y: 80, width: 240, height: 170, fill: 'none', stroke: G3, 'stroke-dasharray': '9 6' }) +
      el('rect', { id: 'b8r', x: 300, y: 80, width: 240, height: 170, fill: 'none', stroke: G3, 'stroke-dasharray': '9 6' }) +
      T(140, 114, 'Quando succede', { id: 'b8lh' }) + T(420, 114, 'fai', { id: 'b8rh' }) +
      T(140, 176, 'X', { id: 'b8l1', 'font-size': 28 }) + T(140, 212, '', { id: 'b8l2', 'font-size': 28 }) +
      T(420, 176, 'Y', { id: 'b8r1', 'font-size': 28 }) + T(420, 212, '', { id: 'b8r2', 'font-size': 28 }) +
      el('line', { id: 'b8ar', x1: 266, y1: 165, x2: 292, y2: 165, stroke: G3, 'stroke-width': 3 }) +
      el('polyline', { id: 'b8ah', points: '284,155 294,165 284,175', stroke: G3, 'stroke-width': 3 })
    ) + '<div class="lbl"></div>',
    set: function (r, s) {
      var a = s >= 1, b = s >= 2;
      function blk(box, h, l1, l2, on, t1, t2) {
        at($(r, box), 'stroke', on ? INK : G3);
        at($(r, box), 'stroke-dasharray', on ? 'none' : '9 6');
        at($(r, h), 'fill', on ? INK : G3);
        at($(r, l1), 'fill', on ? INK : G3);
        tx(r, l1, t1); tx(r, l2, t2);
      }
      blk('b8l', 'b8lh', 'b8l1', 'b8l2', a, a ? 'Premi E' : 'X', a ? 'sull\'altare' : '');
      blk('b8r', 'b8rh', 'b8r1', 'b8r2', b, b ? 'la porta' : 'Y', b ? 'si apre' : '');
      at($(r, 'b8ar'), 'stroke', b ? RED : G3);
      at($(r, 'b8ah'), 'stroke', b ? RED : G3);
      lbl(r, ['evento → azione', 'evento: Premi E sull\'altare', 'azione: la porta si apre'][s]);
    }
  };
  OVR['8a'] = {
    k: '8a', t: 'La regola *del kit*', sim: 'rule', wide: 1,
    p: ['Tutto il kit funziona così, senza codice: ogni oggetto ha degli **eventi**, e tu dici cosa deve succedere quando scattano.'],
    caps: ['Un **evento** e una **azione**: niente codice.', '**Quando** succede: premi E sull\'altare.', '**Fai**: la porta si apre.'],
    n: 'Se resta solo questa regola, la lezione è riuscita.', simw: 1.2
  };

  /* ================= 8c L'altare apre la porta ================= */
  SIM.altar = {
    steps: 4,
    html: svg(
      /* inspector */
      el('g', { id: 'b8pn', class: 'bt' },
        el('rect', { x: 20, y: 20, width: 290, height: 300, fill: PA, stroke: INK }) +
        T(36, 52, 'Altar', { 'text-anchor': 'start' }) +
        el('line', { x1: 20, y1: 64, x2: 310, y2: 64, stroke: G2 }) +
        T(36, 92, 'On Placed ()', { 'text-anchor': 'start' }) +
        el('rect', { x: 36, y: 104, width: 258, height: 96, fill: G1, stroke: G3 }) +
        T(165, 158, 'List is Empty', { id: 'b8em', fill: G3, class: 'bt' }) +
        el('g', { id: 'b8row', class: 'bt' },
          el('rect', { x: 40, y: 110, width: 250, height: 32, fill: PA, stroke: G3 }) +
          T(48, 131, 'None (Object)', { id: 'b8o', 'text-anchor': 'start', 'font-size': 14 }) +
          T(176, 131, 'No Function', { id: 'b8f', 'text-anchor': 'start', 'font-size': 14 })) +
        el('rect', { x: 260, y: 206, width: 34, height: 28, fill: PA, stroke: INK }) +
        T(277, 227, '+', { 'font-size': 20 })
      ) +
      el('rect', { id: 'b8h2', x: 256, y: 202, width: 42, height: 36, stroke: RED, class: 'bt' }) +
      el('rect', { id: 'b8h3', x: 42, y: 112, width: 124, height: 28, stroke: RED, class: 'bt' }) +
      el('rect', { id: 'b8h4', x: 170, y: 112, width: 116, height: 28, stroke: RED, class: 'bt' }) +
      /* scene */
      el('line', { x1: 330, y1: 290, x2: 545, y2: 290, stroke: INK }) +
      el('rect', { x: 450, y: 160, width: 70, height: 130, fill: PA }) +
      el('rect', { id: 'b8door', class: 'bt', x: 450, y: 160, width: 70, height: 130, fill: G3, stroke: INK }) +
      el('rect', { x: 430, y: 20, width: 110, height: 140, fill: G1, stroke: INK }) +
      el('rect', { x: 430, y: 160, width: 20, height: 130, fill: G1, stroke: INK }) +
      el('rect', { x: 520, y: 160, width: 20, height: 130, fill: G1, stroke: INK }) +
      el('rect', { x: 350, y: 250, width: 56, height: 40, fill: G2, stroke: INK }) +
      el('rect', { x: 344, y: 236, width: 68, height: 14, fill: G3, stroke: INK }) +
      el('rect', { id: 'b8h1', x: 338, y: 230, width: 80, height: 64, stroke: RED, class: 'bt' }) +
      el('rect', { id: 'b8h5', x: 446, y: 156, width: 78, height: 138, stroke: RED, class: 'bt' }) +
      T(378, 318, 'Altare', { 'font-size': 14 }) + T(485, 318, 'Porta', { 'font-size': 14 })
    ),
    set: function (r, s) {
      st($(r, 'b8pn'), { opacity: s >= 1 ? 1 : 0.35 });
      st($(r, 'b8em'), { opacity: s === 1 || s === 0 ? 1 : 0 });
      st($(r, 'b8row'), { opacity: s >= 2 ? 1 : 0 });
      tx(r, 'b8o', s >= 3 ? 'Porta' : 'None (Object)');
      tx(r, 'b8f', s >= 4 ? 'Door.Open' : 'No Function');
      st($(r, 'b8h1'), { opacity: s === 1 ? 1 : 0 });
      st($(r, 'b8h2'), { opacity: s === 2 ? 1 : 0 });
      st($(r, 'b8h3'), { opacity: s === 3 ? 1 : 0 });
      st($(r, 'b8h5'), { opacity: s === 3 ? 1 : 0 });
      st($(r, 'b8h4'), { opacity: s === 4 ? 1 : 0 });
      st($(r, 'b8door'), { transform: s >= 4 ? 'translateY(-134px)' : 'translateY(0px)' });
    }
  };
  OVR['8c'] = {
    k: '8c', t: 'L\'altare *apre* la porta', sim: 'altar', p: [],
    caps: ['**Altare e porta.** Nella scena non sono ancora collegati.',
      '**Seleziona l\'altare.** Nell\'Inspector trovi On Placed.',
      '**Premi +.** Si aggiunge una riga vuota.',
      '**Trascina la porta.** Dalla Hierarchy nel campo dell\'oggetto.',
      '**Scegli la funzione.** Door > Open, poi Play.'],
    n: 'RALLENTA QUI. La porta non sa niente dell\'altare: glielo dici tu.', simw: 1.3
  };

  /* ================= 10b Muri single-sided ================= */
  SIM.leak = {
    steps: 1,
    html: svg(
      el('rect', { x: 20, y: 270, width: 236, height: 20, fill: G1, stroke: INK }) +
      el('rect', { id: 'b10f', class: 'bt', x: 264, y: 270, width: 276, height: 20, fill: G1, stroke: INK }) +
      el('line', { x1: 70, y1: 70, x2: 256, y2: 235, stroke: INK }) +
      el('line', { x1: 70, y1: 70, x2: 256, y2: 185, stroke: INK }) +
      el('line', { id: 'b10a', class: 'bt', x1: 264, y1: 242, x2: 295, y2: 270, stroke: INK }) +
      el('line', { id: 'b10b', class: 'bt', x1: 264, y1: 190, x2: 394, y2: 270, stroke: INK }) +
      el('rect', { x: 256, y: 90, width: 8, height: 180, fill: INK }) +
      el('circle', { cx: 60, cy: 60, r: 16, fill: PA, stroke: INK }) +
      T(60, 104, 'Light') + T(260, 76, 'piano') +
      T(440, 256, 'light leak', { id: 'b10l', fill: RED })
    ) + seg(['Cast Shadows: On', 'Two Sided']),
    set: function (r, s) {
      st($(r, 'b10a'), { opacity: s ? 0 : 1 });
      st($(r, 'b10b'), { opacity: s ? 0 : 1 });
      at($(r, 'b10f'), 'fill', s ? G4 : G1);
      at($(r, 'b10l'), 'fill', s ? INK : RED);
      tx(r, 'b10l', s ? 'ombra' : 'light leak');
    }
  };
  OVR['10b'] = {
    k: '10b', t: 'Muri *single-sided*', sim: 'leak',
    p: ['Un muro fatto con un piano ha una faccia sola. Visto dal lato della luce, per le ombre è come se non ci fosse.'],
    caps: ['Il raggio attraversa il piano: dietro il muro entra la luce.', 'Il muro ferma il raggio: dietro c\'è ombra.'],
    warn: 'Nel Mesh Renderer, Cast Shadows su **Two Sided** fa fare ombra da entrambi i lati.', simw: 1.2
  };

  /* ================= 10c Shadow bias ================= */
  var acne = '';
  (function () {
    var j, k;
    for (j = 0; j < 5; j++) acne += el('line', { x1: 232, y1: 176 + 16 * j, x2: 318, y2: 176 + 16 * j, stroke: INK, 'stroke-dasharray': '4 8' });
    for (k = 0; k < 3; k++) acne += el('line', { x1: 50, y1: 262 + 16 * k, x2: 222, y2: 262 + 16 * k, stroke: INK, 'stroke-dasharray': '4 8' });
  })();
  var N10C = ['Bias troppo basso', 'Bias giusto', 'Bias troppo alto'];
  SIM.bias = {
    steps: 2,
    html: svg(
      el('rect', { x: 30, y: 250, width: 500, height: 76, fill: G1 }) +
      el('line', { x1: 30, y1: 250, x2: 530, y2: 250, stroke: INK }) +
      el('polygon', { id: 'b10s', class: 'bt', points: '230,250 320,250 404,300 314,300', fill: G4 }) +
      el('rect', { x: 230, y: 160, width: 90, height: 90, fill: G2, stroke: INK }) +
      el('rect', { id: 'b10gap', class: 'bt', x: 230, y: 252, width: 90, height: 24, stroke: RED, 'stroke-dasharray': '6 5' }) +
      el('g', { id: 'b10acne', class: 'bt' }, acne) +
      el('circle', { cx: 70, cy: 60, r: 14, fill: PA, stroke: INK }) +
      el('line', { x1: 84, y1: 70, x2: 224, y2: 156, stroke: G3, 'stroke-dasharray': '6 5' })
    ) + '<input type="range" class="rng" min="0" max="2" step="1" value="1"><div class="lbl"></div>',
    set: function (r, s) {
      st($(r, 'b10acne'), { opacity: s === 0 ? 1 : 0 });
      st($(r, 'b10s'), { transform: s === 2 ? 'translateY(26px)' : 'translateY(0px)' });
      st($(r, 'b10gap'), { opacity: s === 2 ? 1 : 0 });
      var i = r.querySelector('input.rng'); if (i) i.value = s;
      lbl(r, N10C[s]);
    }
  };
  OVR['10c'] = {
    k: '10c', t: 'Shadow *bias*', sim: 'bias',
    p: ['Le ombre in tempo reale vengono spostate un poco per evitare righe e puntini (il **bias**). Se il muro è più sottile di quello spostamento, la luce passa.'],
    caps: ['**Bias troppo basso:** righe e puntini sulle superfici. Il bias è nella luce, sezione Shadows.',
      '**Bias giusto:** l\'ombra parte dalla base dell\'oggetto. Abbassalo con prudenza.',
      '**Bias troppo alto:** l\'ombra si stacca. Meglio muri di qualche decina di centimetri (**Thickness**), non piani.'],
    simw: 1.2
  };

  /* ================= 10d Gap e snapping ================= */
  var ticks = '';
  (function () { for (var k = 2; k <= 19; k++) ticks += el('line', { x1: 24 * k, y1: 296, x2: 24 * k, y2: 308, stroke: G3 }); })();
  var G10 = [10, 14, 0];
  SIM.snap = {
    steps: 2,
    html: svg(
      el('rect', { id: 'b10g', class: 'bt bt-l', x: 250, y: 80, width: 20, height: 200, fill: RED }) +
      el('rect', { x: 40, y: 80, width: 210, height: 200, fill: G2, stroke: INK }) +
      el('g', { id: 'b10p', class: 'bt' }, el('rect', { x: 250, y: 80, width: 210, height: 200, fill: G2, stroke: INK })) +
      el('g', { id: 'b10t', class: 'bt' }, ticks) +
      el('g', { id: 'b10v', class: 'bt' },
        el('circle', { cx: 250, cy: 80, r: 7, fill: RED }) + el('circle', { cx: 250, cy: 280, r: 7, fill: RED })) +
      T(255, 66, 'luce', { id: 'b10lt', fill: RED, class: 'bt' }) +
      el('g', { id: 'b10k', class: 'bt' },
        el('rect', { x: 400, y: 306, width: 120, height: 28, fill: PA, stroke: INK }) +
        T(460, 326, '', { id: 'b10kt' }))
    ) + seg(['A occhio', 'Ctrl o Cmd', 'V: vertex snapping']),
    set: function (r, s) {
      var g = G10[s];
      st($(r, 'b10p'), { transform: 'translateX(' + g + 'px)' });
      st($(r, 'b10g'), { transform: 'scaleX(' + (g / 20) + ')' });
      st($(r, 'b10t'), { opacity: s === 1 ? 1 : 0 });
      st($(r, 'b10v'), { opacity: s === 2 ? 1 : 0 });
      st($(r, 'b10lt'), { opacity: s === 2 ? 0 : 1 });
      st($(r, 'b10k'), { opacity: s === 0 ? 0 : 1 });
      tx(r, 'b10kt', s === 1 ? 'Ctrl / Cmd' : 'V');
    }
  };
  OVR['10d'] = {
    k: '10d', t: 'Gap e *snapping*', sim: 'snap',
    p: ['Due pezzi modulari messi a occhio lasciano fessure di pochi millimetri. Dall\'interno diventano righe di luce.'],
    caps: ['Messi a occhio: resta una fessura, e da dentro è una riga di luce.',
      'Con Ctrl o Cmd il pezzo scatta sulla griglia, ma la fessura resta.',
      'Con V il vertex si aggancia all\'altro: nessuna fessura.'],
    warn: 'Ctrl (Cmd su Mac) sposta a scatti regolari. Per far combaciare due pezzi: tieni premuto V e trascina un vertex sopra l\'altro.', simw: 1.2
  };
  OVR['10e'] = {
    k: '10e', t: 'Il *metodo giusto*',
    steps: [['Muri con spessore', 'Usa i pezzi modulari del kit, non piani'],
      ['Pezzi sovrapposti', 'Meglio che si incastrino un poco che lasciare uno spazio'],
      ['Vertex snapping', 'Tieni V e trascina un vertex sopra l\'altro'],
      ['Controlla da dentro', 'Con la camera del giocatore, non dall\'alto']]
  };

  /* ================= 11b Realtime, baked, mixed ================= */
  var N11 = ['Colonna: realtime · Personaggio: realtime', 'Colonna: baked · Personaggio: nessuna ombra', 'Colonna: baked · Personaggio: realtime'];
  function walk11(r, t) {
    var x = 300 + 190 * Math.sin(t / 2400);
    var c = $(r, 'b11ch'), s = $(r, 'b11s');
    if (c) { c.style.transition = 'none'; c.style.transform = 'translateX(' + x + 'px)'; }
    if (s) s.style.transition = 'none';
    if (s) s.style.transform = 'translateX(' + x + 'px)';
  }
  SIM.bake = {
    steps: 2,
    html: svg(
      el('rect', { x: 30, y: 280, width: 500, height: 46, fill: G1 }) +
      el('line', { x1: 30, y1: 280, x2: 530, y2: 280, stroke: INK }) +
      el('circle', { cx: 70, cy: 60, r: 16, fill: PA, stroke: INK }) + T(70, 104, 'Light') +
      el('polygon', { id: 'b11c', points: '300,280 340,280 430,316 390,316', fill: G4 }) +
      el('g', { id: 'b11s' }, el('polygon', { points: '-11,280 11,280 56,314 34,314', fill: G4 })) +
      el('rect', { x: 300, y: 140, width: 40, height: 140, fill: G2, stroke: INK }) +
      el('g', { id: 'b11ch' },
        el('circle', { cx: 0, cy: 228, r: 11, fill: PA, stroke: INK }) +
        el('rect', { x: -11, y: 241, width: 22, height: 39, fill: G3, stroke: INK })) +
      T(410, 336, '', { id: 'b11t', 'font-size': 13 })
    ) + seg(['Realtime', 'Baked', 'Mixed']) + '<div class="lbl"></div>',
    set: function (r, s) {
      st($(r, 'b11s'), { opacity: s === 1 ? 0 : 1 });
      tx(r, 'b11t', s === 0 ? 'Realtime' : 'Baked');
      lbl(r, N11[s]);
      if (!r._raf) walk11(r, 2400 * 0.4);
    },
    enter: function (r) {
      cancelAnimationFrame(r._raf);
      var t0 = performance.now();
      (function loop(now) { walk11(r, now - t0); r._raf = requestAnimationFrame(loop); })(t0);
    },
    leave: function (r) { cancelAnimationFrame(r._raf); r._raf = 0; }
  };
  OVR['11b'] = {
    k: '11b', t: 'Realtime, *baked*, mixed', sim: 'bake',
    p: ['Il bake è come una foto della luce: bellissima e leggera, ma non si muove.'],
    caps: ['**Realtime:** calcolata a ogni fotogramma, può muoversi. Costo alto.',
      '**Baked:** calcolata una volta e salvata in immagini. Costo quasi zero.',
      '**Mixed:** luce cotta, ombre degli oggetti in movimento in tempo reale. Costo medio.'],
    simw: 1.2
  };

  /* ================= 11h Shadows e costo ================= */
  var torches = '', passes = '';
  (function () {
    var i, x, y;
    for (i = 0; i < 10; i++) {
      x = 90 + 95 * (i % 5); y = 100 + 90 * Math.floor(i / 5);
      torches += el('g', { id: 'b11h' + i, class: 'bt bt-c' },
        el('line', { x1: x, y1: y, x2: x, y2: y + 40, stroke: INK }) +
        el('path', { d: 'M' + (x - 9) + ',' + y + ' C' + (x - 11) + ',' + (y - 12) + ' ' + (x - 2) + ',' + (y - 16) + ' ' + x + ',' + (y - 30) +
          ' C' + (x + 4) + ',' + (y - 18) + ' ' + (x + 11) + ',' + (y - 12) + ' ' + (x + 9) + ',' + y + ' Z', fill: G4 }));
    }
    for (i = 0; i < 11; i++) {
      passes += el('rect', { id: 'b11q' + i, class: 'bt', x: 27 + 46 * i, y: 262, width: 36, height: 36, fill: i === 0 ? INK : G2, stroke: INK });
    }
  })();
  SIM.shadowcost = {
    steps: 9,
    html: svg(torches + passes + T(45, 322, 'camera', { 'font-size': 13 })) +
      '<input type="range" class="rng" min="0" max="9" step="1" value="0"><div class="lbl"></div>',
    set: function (r, s) {
      var n = s + 1, i;
      for (i = 0; i < 10; i++) st($(r, 'b11h' + i), { opacity: i < n ? 1 : 0, transform: i < n ? 'scale(1)' : 'scale(0.6)' });
      for (i = 1; i < 11; i++) st($(r, 'b11q' + i), { opacity: i <= n ? 1 : 0 });
      var inp = r.querySelector('input.rng'); if (inp) inp.value = s;
      lbl(r, n + (n === 1 ? ' luce' : ' luci') + ' con ombre: la scena viene disegnata ' + (n + 1) + ' volte');
    }
  };
  OVR['11h'] = {
    k: '11h', t: '*Shadows* e costo', sim: 'shadowcost',
    p: ['Ogni luce realtime che fa ombra ridisegna la scena dal suo punto di vista. Dieci torce con ombre sono dieci volte il lavoro.'],
    caps: (function () { var a = [], i; for (i = 1; i <= 10; i++) a.push('**' + i + '** ' + (i === 1 ? 'luce' : 'luci') + ' con ombre, più la camera.'); return a; })(),
    warn: 'Ombre realtime solo dove servono. Le torce decorative: niente ombre, o luce cotta.', simw: 1.2
  };
})();

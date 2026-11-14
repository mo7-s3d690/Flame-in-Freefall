// Fire dashboard: data-matched flammability indicator + 3D flame.
// The score is a transparent heuristic over PSI investigation ranges, NOT a physics simulation.
// Swap matchAll()/risk() for POST /api/risk once the FastAPI backend is ready.
(() => {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

  // Adjustable heuristic weights (edit here, everything on the page follows)
  const H = {
    material: { fabric: 1, paper: 1, plastic: 0.9, liquid: 0.9, gas: 1 },
    diluent: { none: 1, co2: 0.75, helium: 0.85 },
    match: { o2: 0.35, fuel: 0.25, flow: 0.2, pressure: 0.1, gravity: 0.1 }
  };
  const LEVELS = [[20, "Low", "var(--green)"], [45, "Moderate", "var(--ember-hot)"], [70, "High", "var(--ember)"], [101, "Severe", "#ff4d3a"]];
  const MOON = { o2: 30, pressure: 10.2, flow: 20, gravity: "microgravity", material: "fabric", diluent: "none" };
  const MAT = { fabric: "Fabric", plastic: "Plastic", paper: "Paper", gas: "Gas", liquid: "Liquid droplet" };
  const DIL = { none: "No diluent", co2: "CO₂ diluent", helium: "Helium diluent" };

  // ---------- environment (from the setup page, else Moon preset) ----------
  let stored = null;
  try { stored = JSON.parse(sessionStorage.getItem("ignite.env")); } catch {}
  const normMat = m => { const s = String(m || "").toLowerCase();
    return /gas/.test(s) ? "gas" : /liquid|droplet/.test(s) ? "liquid" : /fabric|cloth|textile|cotton/.test(s) ? "fabric" : /paper/.test(s) ? "paper" : "plastic"; };
  const normDil = d => { const s = String(d || "").toLowerCase(); return /co2|co₂|carbon/.test(s) ? "co2" : /he/.test(s) ? "helium" : "none"; };
  const norm = e => ({ o2: +e.o2, pressure: +e.pressure, flow: +e.flow, gravity: /normal|earth/i.test(e.gravity || "") ? "normal" : "micro",
                       material: normMat(e.material), diluent: normDil(e.diluent) });
  const base = norm(stored || MOON);
  let env = { ...base };
  $("notice").hidden = !!stored;

  // ---------- PSI data ----------
  let DATA = [];
  const flowRange = s => {
    s = String(s || ""); let m;
    if (/quiescent|no forced flow/i.test(s)) return [0, 0];
    if ((m = s.match(/(\d+(?:\.\d+)?)\s*cm\/s\s*to\s*(\d+(?:\.\d+)?)\s*cm\/s/i))) return [+m[1], +m[2]];
    if ((m = s.match(/(\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(\d+(?:\.\d+)?)\s*cm\/s/i))) return [+m[1], +m[2]];
    if ((m = s.match(/up to\s*(\d+(?:\.\d+)?)\s*cm\/s/i))) return [0, +m[1]];
    if ((m = s.match(/(\d+(?:\.\d+)?)\s*(?:or\s*\d+\s*)?cm\/s/i))) return [+m[1], +m[1]];
    return null;
  };
  const prep = inv => {
    const lo = inv.o2_min ?? inv.o2_max, hi = inv.o2_max ?? inv.o2_min;
    return { ...inv, _o2: lo == null ? null : [lo, hi], _flow: flowRange(inv.flow_speed),
             _p: typeof inv.pressure_psi === "number" ? inv.pressure_psi : null,
             _fuel: String(inv.fuel_type || "").toLowerCase(), _micro: /micro/i.test(inv.gravity_level || ""), _ground: /ground|normal/i.test(inv.gravity_level || "") };
  };
  const fuelKey = m => m === "gas" ? "gas" : m === "liquid" ? "liquid" : "solid";
  const dist = (v, [lo, hi]) => v < lo ? lo - v : v > hi ? v - hi : 0;

  function matchAll(e) {
    const total = Object.values(H.match).reduce((a, b) => a + b, 0);
    return DATA.map(inv => {
      const p = {};
      if (inv._o2) { const d = dist(e.o2, inv._o2); p.o2 = { s: Math.max(0, 1 - d / 20), d }; }
      if (inv._flow) { const d = dist(e.flow, inv._flow); p.flow = { s: Math.max(0, 1 - d / 20), d }; }
      if (inv._p != null) { const d = Math.abs(e.pressure - inv._p); p.pressure = { s: Math.max(0, 1 - d / 8), d }; }
      p.fuel = { s: inv._fuel.includes(fuelKey(e.material)) ? 1 : 0.25 };
      p.gravity = { s: e.gravity === "micro" ? (inv._micro ? 1 : 0.4) : (inv._ground ? 1 : 0.5) };
      let sw = 0, w = 0;
      for (const k in p) { sw += H.match[k] * p[k].s; w += H.match[k]; }
      return { inv, p, score: (sw / w) * (0.5 + 0.5 * w / total) }; // fewer known fields => lower score
    }).sort((a, b) => b.score - a.score);
  }

  function risk(e) {
    const fO2 = clamp((e.o2 - 14) / 26);
    const fF = e.flow <= 10 ? 0.3 + 0.07 * e.flow : e.flow <= 30 ? 1 : Math.max(0.7, 1 - (e.flow - 30) / 100); // mid-flow "Goldilocks" zone
    const fP = clamp((e.pressure - 3) / 11.7);
    const m = H.material[e.material] ?? 1, d = H.diluent[e.diluent] ?? 1;
    return { score: clamp(fO2 * (0.55 + 0.25 * fF + 0.2 * fP) * m * d), fO2, fF, fP, m, d };
  }

  // ---------- rendering ----------
  let shown = 0, raf = 0;
  const tween = to => { cancelAnimationFrame(raf); const from = shown, t0 = performance.now();
    const step = t => { const k = clamp((t - t0) / 600); shown = from + (to - from) * (1 - Math.pow(1 - k, 3)); $("g-num").textContent = Math.round(shown); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); };

  function render() {
    const r = risk(env), pct = Math.round(r.score * 100), ms = matchAll(env);
    const lv = LEVELS.find(l => pct < l[0]);
    $("env-line").textContent = `${env.o2}% O₂ · ${env.pressure.toFixed(1)} psi · ${env.flow} cm/s · ${MAT[env.material]} · ${DIL[env.diluent]}`;
    $("o-o2").textContent = `${env.o2}%`; $("o-p").textContent = `${env.pressure.toFixed(1)} psi`; $("o-f").textContent = `${env.flow} cm/s`;
    const C = 2 * Math.PI * 58, arc = $("g-arc");
    arc.style.strokeDasharray = `${C * r.score} ${C}`; arc.style.stroke = lv[2]; arc.style.color = lv[2];
    $("g-level").textContent = lv[1]; $("g-level").style.color = lv[2]; tween(pct);

    const f = (n, v, mult) => `<div class="factor${mult ? " mult" : ""}"><span>${n}</span><i style="--v:${Math.round(v * 100)}%"></i><u>${mult ? "×" + v.toFixed(2) : Math.round(v * 100) + "%"}</u></div>`;
    $("factors").innerHTML = f("O₂", r.fO2) + f("Airflow", r.fF) + f("Pressure", r.fP) + f("Material", r.m, 1) + f("Diluent", r.d, 1);

    // confidence + matches
    const withO2 = ms.filter(m => m.p.o2), top = ms.slice(0, 3);
    const avg = top.length ? top.reduce((a, m) => a + m.score, 0) / top.length : 0;
    const near = withO2.length ? Math.min(...withO2.map(m => m.p.o2.d)) : null;
    const conf = !DATA.length ? "–" : avg >= 0.75 && withO2.length >= 2 ? "High" : avg >= 0.55 ? "Medium" : "Low";
    $("conf").innerHTML = DATA.length ? `<b>${conf} confidence</b>${withO2.length} of ${DATA.length} investigations report O₂; nearest differs by ${near == null ? "n/a" : near.toFixed(1) + " pts O₂"}` : "";
    const chip = (label, x) => `<span class="chip ${x ? (x.s >= 0.7 ? "ok" : x.s >= 0.3 ? "near" : "far") : ""}">${label}${x ? "" : " n/a"}</span>`;
    $("match-list").innerHTML = DATA.length ? ms.slice(0, 5).map((m, i) => `
      <li class="match"><span class="rk">${i + 1}</span>
        <a class="nm" href="research.html#${esc(m.inv.id)}">${esc(m.inv.name)}</a><span class="sc">${Math.round(m.score * 100)}</span>
        <div class="chips">${chip("O₂", m.p.o2)}${chip("FLOW", m.p.flow)}${chip("PSI", m.p.pressure)}${chip("FUEL", m.p.fuel)}${chip("g", m.p.gravity)}
        <a class="chip src" href="${esc(m.inv.source_url)}" target="_blank" rel="noopener">PSI ↗</a></div></li>`).join("") : '<li class="empty">Could not load PSI-merged.json. Serve the folder over http (not file://).</li>';

    // warnings (computed from the data where possible)
    const W = [], rng = DATA.filter(d => d._o2), maxO2 = rng.length ? Math.max(...rng.map(d => d._o2[1])) : null;
    const covering = rng.filter(d => dist(env.o2, d._o2) === 0).length;
    if (env.o2 >= 30) W.push(["hot", `O₂ at ${env.o2}% is in the range expected for Moon/Mars habitats (≥30% O₂, ≤10.2 psi); materials become more flammable than in 21% air.`]);
    if (rng.length && covering === 0) W.push(["hot", `No PSI investigation with a reported O₂ range covers ${env.o2}%${maxO2 != null && env.o2 > maxO2 ? ` (highest tested: ${maxO2}%)` : ""}. Treat this estimate as an extrapolation.`]);
    else if (rng.length) W.push(["", `${covering} of ${rng.length} investigations with an O₂ range cover your value.`]);
    if (withO2[0]) W.push(["", `Closest tested O₂ conditions: ${withO2.sort((a, b) => a.p.o2.d - b.p.o2.d)[0].inv.name}.`]);
    if (env.diluent === "none" && env.o2 >= 30) W.push(["", "ACME (PSI-10) tested CO₂ and N₂ dilution of flames. Try a diluent in the what-if panel."]);
    W.push(["", "No partial-gravity (Moon 1/6 g, Mars 0.38 g) data exists in PSI yet. Microgravity and normal-gravity results bound the intermediate case."]);
    W.push(["", "Rocket and propellant combustion is out of scope. The score is an adjustable heuristic, not a validated model."]);
    $("warn-list").innerHTML = W.map(([c, t]) => `<li class="${c}">${esc(t)}</li>`).join("");

    document.querySelectorAll(".scene-toggle button").forEach(b => b.classList.toggle("on", b.dataset.g === env.gravity));
    scene && scene.set(r.score, env.gravity === "micro");
  }

  function sync() {
    $("c-o2").value = env.o2; $("c-p").value = env.pressure; $("c-f").value = env.flow; $("c-m").value = env.material; $("c-d").value = env.diluent;
  }
  [["c-o2", "o2"], ["c-p", "pressure"], ["c-f", "flow"]].forEach(([id, k]) => $(id).addEventListener("input", e => { env[k] = +e.target.value; render(); }));
  [["c-m", "material"], ["c-d", "diluent"]].forEach(([id, k]) => $(id).addEventListener("change", e => { env[k] = e.target.value; render(); }));
  document.querySelectorAll(".scene-toggle button").forEach(b => b.addEventListener("click", () => { env.gravity = b.dataset.g; render(); }));
  $("reset").addEventListener("click", () => { env = { ...base }; sync(); render(); });

  // ---------- 3D scene (Three.js r128): habitat + flame whose shape follows gravity ----------
  function makeScene(el) {
    if (!window.THREE) { el.insertAdjacentHTML("beforeend", '<p class="scene-fail">3D library did not load (check your connection).</p>'); return null; }
    const T = THREE, scene = new T.Scene(), cam = new T.PerspectiveCamera(40, 1, 0.1, 100);
    cam.position.set(0, 1.2, 8.5); cam.lookAt(0, -0.3, 0);
    const ren = new T.WebGLRenderer({ antialias: true, alpha: true });
    ren.setPixelRatio(Math.min(devicePixelRatio, 2)); el.appendChild(ren.domElement);
    const root = new T.Group(); root.rotation.x = 0.18; scene.add(root);
    const mat = (c, o, x = {}) => new T.MeshBasicMaterial({ color: c, transparent: true, opacity: o, ...x });
    const plate = new T.Mesh(new T.BoxGeometry(2.4, 0.1, 1.5), mat(0x172536, 1)); plate.position.y = -1.5; root.add(plate);
    const sample = new T.Mesh(new T.BoxGeometry(1.2, 0.05, 0.8), mat(0x3a4a5c, 1)); sample.position.y = -1.42; root.add(sample);

    const flame = new T.Group(); flame.position.y = -1.4; root.add(flame);
    const glow = [], gm = (c, o) => { const m = mat(c, o, { blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }); glow.push({ m, o }); return m; };
    const sph = new T.Group();   // microgravity: round, blue
    sph.add(new T.Mesh(new T.SphereGeometry(1, 32, 24), gm(0x67c8ed, 0.3)), new T.Mesh(new T.SphereGeometry(0.62, 32, 24), gm(0xd9f4ff, 0.55)));
    const pts = []; for (let i = 0; i <= 24; i++) { const t = i / 24; pts.push(new T.Vector2(Math.sin(Math.PI * Math.pow(t, 0.7)) * 0.55 * (1 - 0.5 * t), t * 2)); }
    const tear = new T.Group();  // normal gravity: teardrop, orange
    const inner = new T.Mesh(new T.LatheGeometry(pts, 28), gm(0xffd29a, 0.6)); inner.scale.set(0.55, 0.7, 0.55);
    tear.add(new T.Mesh(new T.LatheGeometry(pts, 28), gm(0xff7938, 0.38)), inner);
    flame.add(sph, tear);

    let tgt = 0.8, cur = 0.8, micro = true, drag = null;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cv = ren.domElement;
    cv.addEventListener("pointerdown", e => { drag = { x: e.clientX, y: e.clientY }; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", e => { if (!drag) return; root.rotation.y += (e.clientX - drag.x) * 0.008; root.rotation.x = clamp(root.rotation.x + (e.clientY - drag.y) * 0.005, -0.5, 0.9); drag = { x: e.clientX, y: e.clientY }; });
    ["pointerup", "pointercancel"].forEach(n => cv.addEventListener(n, () => { drag = null; }));
    const fit = () => { const w = el.clientWidth || 1, h = el.clientHeight || 1; ren.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
    new ResizeObserver(fit).observe(el); fit();
    (function tick(now) {
      requestAnimationFrame(tick);
      const t = now / 1000, fl = still ? 0 : Math.sin(t * 9) * 0.04 + Math.sin(t * 5.3) * 0.03;
      cur += (tgt - cur) * 0.08;
      if (micro) { const s = cur * (1 + fl * 0.5); sph.scale.setScalar(s); sph.position.y = s; }
      else tear.scale.set(cur * (1 - fl * 0.4), cur * (1 + fl), cur * (1 - fl * 0.4));
      if (!drag && !still) root.rotation.y += 0.0035;
      ren.render(scene, cam);
    })(0);
    return { set(r, isMicro) {
      tgt = 0.3 + 1.1 * r; micro = isMicro; sph.visible = isMicro; tear.visible = !isMicro;
      glow.forEach(g => { g.m.opacity = Math.min(1, g.o * (0.5 + 0.7 * r)); });
    } };
  }
  const scene = makeScene($("scene"));

  // ---------- boot ----------
  sync(); render();
  fetch("PSI-merged.json").then(r => r.json()).then(d => { DATA = d.map(prep); render(); }).catch(() => render());
})();

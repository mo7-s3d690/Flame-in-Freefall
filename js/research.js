// Research explorer page logic
// Research explorer: connected "spider web" of PSI investigations, filters, detail card, compare table.
(() => {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const NS = "http://www.w3.org/2000/svg", W = 800, Hh = 580;
  const COLORS = { Gas: "#67c8ed", Solid: "#ff7938", Liquid: "#91d6b4", Aerosol: "#c4a6ff" };
  const GOALS = ["prevention", "detection", "suppression", "fundamental"];

  const fuelGroup = t => { const s = String(t || "").toLowerCase(); return /liquid/.test(s) ? "Liquid" : /dust|aerosol/.test(s) ? "Aerosol" : /gas/.test(s) ? "Gas" : "Solid"; };
  const platform = h => { const s = String(h || ""); return /Combustion Integrated Rack|CIR/.test(s) ? "CIR" : /Glovebox|MSG/.test(s) ? "MSG" : /Cygnus|Saffire/i.test(s) ? "Cygnus" : /CFD|Model|DNS|OpenFOAM|Simulation/i.test(s) ? "Model" : "Other"; };
  const short = inv => { const n = (inv.name.match(/\((.*)\)/) || [])[1] || inv.id; return n.length > 15 ? n.slice(0, 14) + "…" : n; };

  let nodes = [], edges = [], byId = {}, sel = null, cmp = [];
  const f = { fuel: null, goal: null, gravity: null };
  const svg = $("web");

  function build(data) {
    nodes = data.map((d, i) => ({ d, id: d.id, fuel: fuelGroup(d.fuel_type), plat: platform(d.hardware), ground: /^ground/i.test(d.gravity_level || ""),
      x: W / 2 + 230 * Math.cos(i / data.length * 6.283), y: Hh / 2 + 190 * Math.sin(i / data.length * 6.283), vx: 0, vy: 0, deg: 0 }));
    byId = Object.fromEntries(nodes.map(n => [n.id, n]));
    const seen = new Set(), add = (a, b, dep) => { const k = [a.id, b.id].sort().join(); if (a === b || seen.has(k)) return; seen.add(k); edges.push({ a, b, dep }); a.deg++; b.deg++; };
    nodes.forEach(n => (n.d.depends_on || []).forEach(id => byId[id] && add(n, byId[id], true)));
    nodes.forEach((a, i) => nodes.slice(i + 1).forEach(b => { if (a.plat === b.plat && a.plat !== "Other" && a.fuel === b.fuel) add(a, b, false); }));
    nodes.forEach(n => n.r = 9 + Math.min(n.deg, 8) * 1.4);
    // force layout (runs once, synchronously)
    for (let it = 0; it < 400; it++) {
      const cool = 1 - it / 400;
      nodes.forEach(a => { a.vx = (W / 2 - a.x) * 0.004; a.vy = (Hh / 2 - a.y) * 0.004; });
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j]; let dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy + 1, d = Math.sqrt(d2), k = 2600 / d2;
        a.vx += dx / d * k; a.vy += dy / d * k; b.vx -= dx / d * k; b.vy -= dy / d * k;
      }
      edges.forEach(e => { const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, d = Math.sqrt(dx * dx + dy * dy) + 0.01, k = (d - (e.dep ? 85 : 120)) * 0.02;
        e.a.vx += dx / d * k; e.a.vy += dy / d * k; e.b.vx -= dx / d * k; e.b.vy -= dy / d * k; });
      nodes.forEach(n => { n.x = Math.min(W - 50, Math.max(50, n.x + n.vx * 6 * cool)); n.y = Math.min(Hh - 40, Math.max(40, n.y + n.vy * 6 * cool)); });
    }
  }

  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };

  function draw() {
    svg.innerHTML = ""; svg.classList.add("web");
    const eg = el("g", {}, svg), ng = el("g", {}, svg);
    edges.forEach(e => { e.el = el("line", { class: "edge" + (e.dep ? " dep" : ""), x1: e.a.x, y1: e.a.y, x2: e.b.x, y2: e.b.y }, eg); });
    nodes.forEach(n => {
      const g = el("g", { class: "node", tabindex: 0, role: "button", "aria-label": n.d.name, transform: `translate(${n.x} ${n.y})`, style: `color:${COLORS[n.fuel]}` }, ng);
      el("circle", { r: n.r, fill: COLORS[n.fuel], "fill-opacity": ".85" }, g);
      el("text", { y: n.r + 12 }, g).textContent = short(n.d);
      g.onclick = () => select(n.id);
      g.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(n.id); } };
      const trace = on => { svg.classList.toggle("hov", on); nodes.forEach(m => m.el.classList.remove("nb")); edges.forEach(e => e.el.classList.remove("on"));
        if (on) { n.el.classList.add("nb"); edges.forEach(e => { if (e.a === n || e.b === n) { e.el.classList.add("on"); e.a.el.classList.add("nb"); e.b.el.classList.add("nb"); } }); } };
      g.onmouseenter = g.onfocus = () => trace(true); g.onmouseleave = g.onblur = () => trace(false);
      n.el = g;
    });
    paint();
  }

  const visible = n => (!f.fuel || n.fuel === f.fuel) && (!f.goal || n.d.category === f.goal) && (!f.gravity || (f.gravity === "Ground") === n.ground);
  function paint() {
    let shown = 0;
    nodes.forEach(n => { const v = visible(n); shown += v; n.el.classList.toggle("dim", !v); n.el.classList.toggle("sel", n.id === sel); n.el.classList.toggle("cmp", cmp.includes(n.id)); });
    edges.forEach(e => e.el.style.display = visible(e.a) && visible(e.b) ? "" : "none");
    $("count").textContent = `${shown} of ${nodes.length} investigations`;
  }

  // filters
  const groups = { fuel: Object.keys(COLORS), goal: GOALS, gravity: ["Microgravity", "Ground"] };
  const gravKey = v => v === "Microgravity" ? "Micro" : v;
  Object.entries(groups).forEach(([key, vals]) => { const box = document.querySelector(`.fgroup[data-key=${key}]`);
    vals.forEach(v => { const b = document.createElement("button"); b.type = "button"; b.textContent = v[0].toUpperCase() + v.slice(1);
      b.onclick = () => { const val = key === "gravity" ? gravKey(v) : v; f[key] = f[key] === val ? null : val; box.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b && f[key])); paint(); };
      box.appendChild(b); }); });
  $("clear").onclick = () => { f.fuel = f.goal = f.gravity = null; document.querySelectorAll(".fgroup button").forEach(b => b.classList.remove("on")); paint(); };
  $("legend").innerHTML = Object.entries(COLORS).map(([k, c]) => `<span><i style="background:${c}"></i>${k}</span>`).join("");

  // detail
  const range = d => d.o2_min == null && d.o2_max == null ? "not reported" : d.o2_min == null ? `≤ ${d.o2_max}%` : d.o2_max == null || d.o2_max === d.o2_min ? `${d.o2_min}%` : `${d.o2_min}–${d.o2_max}%`;
  const ins = { habitable_environments: "Crew habitats", predictive_modeling: "Predictive modeling", earth_benefits: "Earth applications" };
  function select(id, scroll) {
    sel = id; const n = byId[id]; if (!n) return; const d = n.d; history.replaceState(null, "", "#" + id); paint();
    $("detail").innerHTML = `<h2>${esc(short(d))}</h2><p class="full">${esc(d.full_name)}</p>
      <div class="pills"><span class="pill">${esc(n.fuel)}</span><span class="pill">${esc(d.category)}</span><span class="pill">${esc(n.plat)}</span></div>
      <dl class="dl"><dt>O₂</dt><dd>${range(d)}</dd><dt>Pressure</dt><dd>${d.pressure_psi == null ? "not reported" : esc(d.pressure_psi) + " psi"}</dd>
        <dt>Flow</dt><dd>${esc(d.flow_speed)}</dd><dt>Gravity</dt><dd>${esc(d.gravity_level)}</dd><dt>Hardware</dt><dd>${esc(d.hardware)}</dd></dl>
      <h5>Objective</h5><p>${esc(d.objective)}</p><h5>Varied</h5><p>${esc(d.variables)}</p><h5>Sensors</h5><p>${esc(d.sensors)}</p>
      ${Object.entries(ins).map(([k, t]) => d.insights && d.insights[k] ? `<h5>${t}</h5><p>${esc(d.insights[k])}</p>` : "").join("")}
      <div class="btns"><button class="btn pri" id="add-cmp">${cmp.includes(id) ? "Remove from compare" : "Add to compare"}</button><a class="btn" href="${esc(d.source_url)}" target="_blank" rel="noopener">PSI source ↗</a></div>`;
    $("add-cmp").onclick = () => { cmp = cmp.includes(id) ? cmp.filter(x => x !== id) : [...cmp, id].slice(-3); select(id); renderCmp(); };
    if (scroll) $("detail").scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function renderCmp() {
    $("compare-panel").hidden = cmp.length < 1; paint();
    const rows = [["Fuel", n => n.fuel], ["Goal", n => n.d.category], ["O₂", n => range(n.d)], ["Pressure", n => n.d.pressure_psi == null ? "not reported" : n.d.pressure_psi + " psi"],
      ["Flow", n => n.d.flow_speed], ["Gravity", n => n.d.gravity_level], ["Hardware", n => n.d.hardware]];
    const ns = cmp.map(id => byId[id]);
    $("cmp").innerHTML = `<thead><tr><th></th>${ns.map(n => `<td>${esc(short(n.d))}</td>`).join("")}</tr></thead><tbody>${rows.map(([l, fn]) => `<tr><th>${l}</th>${ns.map(n => `<td>${esc(fn(n))}</td>`).join("")}</tr>`).join("")}</tbody>`;
  }
  $("cmp-clear").onclick = () => { cmp = []; renderCmp(); if (sel) select(sel); };

  fetch("PSI-merged.json").then(r => r.json()).then(d => { build(d); draw();
    const h = decodeURIComponent(location.hash.slice(1)); if (byId[h]) select(h, true); })
    .catch(() => { svg.outerHTML = '<p class="empty" style="padding:24px">Could not load PSI-merged.json. Serve the folder over http (not file://).</p>'; });
})();

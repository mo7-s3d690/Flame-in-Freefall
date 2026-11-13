// Builds the shared shell (sidebar, top bar, chat slot) around <main id="page-content">.
(() => {
  const I = window.IGNITE, page = document.body.dataset.page, title = document.body.dataset.title || "Ignite";
  const P = {
    setup: '<path d="M4 6h9M19 6h1M4 12h3M13 12h7M4 18h11M21 18h-1"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    dashboard: '<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
    research: '<circle cx="6" cy="7" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M8 7l8-1M7 9l4 7M17 8l-4 8"/>',
    safety: '<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    collapse: '<path d="M15 6l-6 6 6 6"/>',
  };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${P[k]}</svg>`;
  const links = I.PAGES.map(p =>
    `<a href="${p.href}" title="${p.label}" class="${p.id === page ? "active" : ""}"${p.id === page ? ' aria-current="page"' : ""}>${svg(p.id)}<span class="label">${p.label}</span></a>`).join("");

  const app = document.createElement("div");
  app.className = "app";
  app.innerHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="brand-row">
        <a class="brand" href="index.html" aria-label="Home"><img src="assets/logo.webp" alt=""></a>
        <button class="icon-btn sidebar-collapse" id="sidebar-toggle" title="Collapse sidebar" aria-label="Collapse sidebar">${svg("collapse")}</button>
        <button class="sidebar-logo-toggle" id="sidebar-logo-toggle" title="Open sidebar" aria-label="Open sidebar"><img src="assets/logo.webp" alt="Flame in Freefall"></button>
      </div>
      <nav class="nav" aria-label="Main">${links}</nav>
      <div class="sidebar-foot">NASA PSI / RESEARCH INTERFACE<br>MISSION SYSTEMS · 2026</div>
    </aside>
    <div class="app-main">
      <header class="topbar">
        <h1>${title}</h1>
        <div class="env-chip" id="env-chip"></div>
        <button class="chat-btn" id="chat-toggle" aria-controls="chat-panel">${svg("chat")}Assistant</button>
      </header>
      <div class="app-body">
        <div class="app-content" id="app-content"></div>
        <aside class="chat" id="chat-panel" aria-label="Fire safety assistant"></aside>
      </div>
    </div>`;
  app.querySelector("#app-content").appendChild(document.getElementById("page-content"));
  document.body.prepend(app);

  const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } },
                  set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  const narrow = innerWidth < 900;

  // sidebar
  const side = app.querySelector("#sidebar");
  const sMin = store.get("ignite.sidebarMin");
  side.classList.toggle("min", sMin === null ? narrow : sMin === "1");
  const setSidebarMin = minimized => {
    side.classList.toggle("min", minimized);
    store.set("ignite.sidebarMin", minimized ? "1" : "0");
    app.querySelector("#sidebar-toggle").setAttribute("aria-label", minimized ? "Sidebar collapsed" : "Collapse sidebar");
    app.querySelector("#sidebar-logo-toggle").setAttribute("aria-expanded", String(!minimized));
  };
  app.querySelector("#sidebar-toggle").onclick = () => setSidebarMin(true);
  app.querySelector("#sidebar-logo-toggle").onclick = () => setSidebarMin(false);

  // chat panel
  const chat = app.querySelector("#chat-panel");
  const cOpen = store.get("ignite.chatOpen");
  chat.classList.toggle("closed", cOpen === null ? innerWidth < 1100 : cOpen === "0");
  app.querySelector("#chat-toggle").onclick = () =>
    store.set("ignite.chatOpen", chat.classList.toggle("closed") ? "0" : "1");

  // environment chip (filled by the setup page via sessionStorage "ignite.env")
  const chip = app.querySelector("#env-chip");
  const renderEnv = () => {
    let env = null;
    try { env = JSON.parse(sessionStorage.getItem("ignite.env")); } catch {}
    chip.classList.toggle("set", !!env);
    chip.textContent = env ? `O₂ ${env.o2}% · ${env.pressure} psi` : "No environment set";
  };
  renderEnv();
  addEventListener("ignite:env", renderEnv);
})();

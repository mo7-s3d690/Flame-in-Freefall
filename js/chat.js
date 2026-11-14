// Persistent RAG chat panel. Talks to FastAPI: POST {API_BASE}/api/v1/chat -> { answer, sources, used_rag, conversation_id }
(() => {
  const panel = document.getElementById("chat-panel");
  if (!panel) return;
  const KEY = "ignite.chat", CONV_KEY = "ignite.conv", API = window.IGNITE.API_BASE;
  const CHIPS = ["Why is 30% O₂ risky?", "Which tests used CO₂ suppression?", "What am I looking at on this page?"];
  let history = [];
  try { history = JSON.parse(sessionStorage.getItem(KEY)) || []; } catch {}
  let convId = null;
  try { convId = sessionStorage.getItem(CONV_KEY); } catch {}
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(history.slice(-50))); } catch {} };
  const saveConv = () => { try { if (convId) sessionStorage.setItem(CONV_KEY, convId); else sessionStorage.removeItem(CONV_KEY); } catch {} };

  panel.innerHTML = `
    <div class="chat-head">
      <div><strong>Ignite AI assistant</strong><br><small>Answers from the Ignite research data</small></div>
      <div style="display:flex;gap:8px;align-items:center">
        <button type="button" id="chat-clear">Clear</button>
        <button type="button" id="chat-close" class="chat-close-btn" aria-label="Close">&times;</button>
      </div>
    </div>
    <div class="chat-log" id="chat-log" aria-live="polite"></div>
    <div class="chat-chips" id="chat-chips"></div>
    <form class="chat-form" id="chat-form">
      <textarea id="chat-input" rows="1" placeholder="Ask about the research or your setup" aria-label="Message"></textarea>
      <button type="submit">Send</button>
    </form>`;
  const log = panel.querySelector("#chat-log"), chips = panel.querySelector("#chat-chips"),
        form = panel.querySelector("#chat-form"), input = panel.querySelector("#chat-input"),
        sendBtn = form.querySelector("button");

  function sourceLabel(s) {
    return s.research_id || (s.source ? s.source.replace(/\.md$/i, "") : "source");
  }
  function appendRichText(container, text) {
    const parts = String(text).split(/(\\*\\*[^*]+\\*\\*)/g);
    parts.forEach(part => {
      const m = part.match(/^\\*\\*([^*]+)\\*\\*$/);
      if (m) {
        const strong = document.createElement("strong");
        strong.textContent = m[1];
        container.appendChild(strong);
      } else if (part) {
        container.appendChild(document.createTextNode(part));
      }
    });
  }
  function thinkingBubble() {
    const d = document.createElement("div");
    d.className = "msg bot thinking";
    const flame = document.createElement("span");
    flame.className = "flame";
    const text = document.createElement("span");
    text.textContent = "Thinking…";
    d.appendChild(flame);
    d.appendChild(text);
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }
  function bubble(role, text, sources, usedRag) {
    const d = document.createElement("div");
    d.className = "msg " + role;
    appendRichText(d, text);
    const seen = new Set();
    const labels = [];
    (sources || []).forEach(s => {
      const label = sourceLabel(s);
      if (seen.has(label)) return;
      seen.add(label);
      labels.push(label);
    });
    if (labels.length) {
      const head = document.createElement("span");
      head.className = "src";
      head.style.fontWeight = "600";
      head.textContent = "Resources:";
      d.appendChild(head);
      labels.forEach((label, i) => {
        const span = document.createElement("span");
        span.className = "src";
        span.textContent = label;
        d.appendChild(span);
      });
    }
    if (usedRag === false && role === "bot") {
      // no-op; keep minimal
    }
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }
  function render() {
    log.innerHTML = "";
    bubble("bot", "Hi, I'm the Ignite assistant. Ask me about the combustion research, fire safety, or the conditions you set.");
    history.forEach(m => bubble(m.role, m.text, m.sources));
    chips.innerHTML = "";
    if (!history.length) CHIPS.forEach(c => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = c; b.onclick = (e) => { e.stopPropagation(); send(c); };
      chips.appendChild(b);
    });
  }

  async function send(q) {
    q = (q || "").trim();
    if (!q || sendBtn.disabled) return;
    chips.innerHTML = "";
    history.push({ role: "user", text: q }); save();
    bubble("user", q);
    input.value = "";
    sendBtn.disabled = true;
    const wait = thinkingBubble();
    let message = q;
    const page = document.body.dataset.page;
    let env = null;
    try { env = JSON.parse(sessionStorage.getItem("ignite.env")); } catch {}
    if (page || env) {
      const ctx = [];
      if (page) ctx.push(`page=${page}`);
      if (env) ctx.push(`env=O2 ${env.o2}% · ${env.pressure} psi · flow ${env.flow} cm/s · ${env.gravity} · ${env.material} · diluent ${env.diluent}`);
      message = `[Context: ${ctx.join("; ")}]\n${q}`;
    }
    try {
      const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 60000);
      const r = await fetch(API + "/api/v1/chat", {
        method: "POST", signal: ctl.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, conversation_id: convId })
      });
      clearTimeout(t);
      if (!r.ok) throw new Error("HTTP " + r.status);
      const data = await r.json();
      wait.remove();
      convId = data.conversation_id || convId;
      saveConv();
      const sources = Array.isArray(data.sources) ? data.sources : [];
      history.push({ role: "bot", text: data.answer, sources });
      bubble("bot", data.answer, sources, data.used_rag);
    } catch (err) {
      wait.remove();
      const msg = (err && err.name === "AbortError")
        ? "The assistant took too long to respond. Please try again."
        : "I can't reach the assistant right now. Check that the API is running at " + API + ".";
      bubble("bot", msg);
    }
    save();
    sendBtn.disabled = false;
    input.focus();
  }

  form.onsubmit = e => { e.preventDefault(); send(input.value); };
  input.onkeydown = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input.value); } };
  panel.querySelector("#chat-clear").onclick = (e) => { if (e) e.stopPropagation(); history = []; convId = null; save(); saveConv(); render(); };
  const closeBtn = panel.querySelector("#chat-close");
  if (closeBtn) closeBtn.onclick = () => { if (typeof window.igniteToggleChat === "function") window.igniteToggleChat(); };
  render();
})();

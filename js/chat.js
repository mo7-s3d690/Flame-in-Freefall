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
  // Minimal markdown renderer for bot answers. Builds DOM nodes only (never innerHTML), so
  // model output cannot inject markup. Supports headings, **bold**, *italic*, `code`,
  // fenced code, [text](http(s) url), bullet/numbered lists (nested), pipe tables, rules.
  function appendInline(container, text) {
    const re = /\*\*[^*\n]+?\*\*|`[^`\n]+`|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\)|\*[^*\s][^*\n]*?\*/g;
    let last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) container.appendChild(document.createTextNode(text.slice(last, m.index)));
      const tok = m[0];
      let el;
      if (tok.startsWith("**")) {
        el = document.createElement("strong");
        appendInline(el, tok.slice(2, -2));
      } else if (tok[0] === "`") {
        el = document.createElement("code");
        el.textContent = tok.slice(1, -1);
      } else if (tok[0] === "[") {
        const lm = tok.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
        el = document.createElement("a");
        el.href = lm[2];
        el.target = "_blank";
        el.rel = "noopener";
        el.textContent = lm[1];
      } else {
        el = document.createElement("em");
        el.textContent = tok.slice(1, -1);
      }
      container.appendChild(el);
      last = m.index + tok.length;
    }
    if (last < text.length) container.appendChild(document.createTextNode(text.slice(last)));
  }

  const LIST_ITEM = /^(\s*)([-*•]|\d+[.)])\s+(.*)$/;
  const HEADING = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/;
  const isFence = s => /^\s*```/.test(s);
  const isRule = s => /^\s*([-*_])(\s*\1){2,}\s*$/.test(s);
  const isTableSep = s => s.includes("|") && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(s);
  const isTableStart = (lines, i) => lines[i].includes("|") && i + 1 < lines.length && isTableSep(lines[i + 1]);
  const splitRow = s => s.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim());
  const isBlockStart = (lines, i) =>
    isFence(lines[i]) || HEADING.test(lines[i]) || isRule(lines[i]) || LIST_ITEM.test(lines[i]) || isTableStart(lines, i);

  function renderList(lines, i, container) {
    const stack = [];
    while (i < lines.length) {
      if (!lines[i].trim()) {
        // A blank line only ends the list if no further item follows (keeps "1." "2." numbering intact).
        let j = i + 1;
        while (j < lines.length && !lines[j].trim()) j++;
        if (j < lines.length && LIST_ITEM.test(lines[j])) { i = j; continue; }
        break;
      }
      const m = lines[i].match(LIST_ITEM);
      if (!m) break;
      const indent = m[1].replace(/\t/g, "    ").length;
      const ordered = /\d/.test(m[2]);
      while (stack.length && indent < stack[stack.length - 1].indent) stack.pop();
      let top = stack[stack.length - 1];
      if (!top || indent > top.indent) {
        const list = document.createElement(ordered ? "ol" : "ul");
        if (ordered) { const n = parseInt(m[2], 10); if (n > 1) list.start = n; }
        (top ? (top.el.lastElementChild || top.el) : container).appendChild(list);
        top = { indent, el: list };
        stack.push(top);
      }
      const li = document.createElement("li");
      appendInline(li, m[3]);
      top.el.appendChild(li);
      i++;
    }
    return i;
  }

  function renderMarkdown(container, text) {
    const lines = String(text == null ? "" : text).replace(/\r\n?/g, "\n").split("\n");
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      if (isFence(line)) {
        const buf = [];
        i++;
        while (i < lines.length && !isFence(lines[i])) buf.push(lines[i++]);
        i++;
        const pre = document.createElement("pre"), code = document.createElement("code");
        code.textContent = buf.join("\n");
        pre.appendChild(code);
        container.appendChild(pre);
        continue;
      }
      const h = line.match(HEADING);
      if (h) {
        const el = document.createElement("div");
        el.className = "md-h md-h" + Math.min(h[1].length, 3);
        appendInline(el, h[2]);
        container.appendChild(el);
        i++;
        continue;
      }
      if (isRule(line)) { container.appendChild(document.createElement("hr")); i++; continue; }
      if (isTableStart(lines, i)) {
        const head = splitRow(line);
        i += 2;
        const rows = [];
        while (i < lines.length && lines[i].trim() && lines[i].includes("|")) rows.push(splitRow(lines[i++]));
        const wrap = document.createElement("div");
        wrap.className = "md-table";
        const table = document.createElement("table");
        const headRow = table.createTHead().insertRow();
        head.forEach(c => { const th = document.createElement("th"); appendInline(th, c); headRow.appendChild(th); });
        const body = table.createTBody();
        rows.forEach(r => {
          const tr = body.insertRow();
          head.forEach((_, k) => appendInline(tr.insertCell(), r[k] || ""));
        });
        wrap.appendChild(table);
        container.appendChild(wrap);
        continue;
      }
      if (LIST_ITEM.test(line)) { i = renderList(lines, i, container); continue; }
      const p = document.createElement("p");
      const buf = [lines[i++]];
      while (i < lines.length && lines[i].trim() && !isBlockStart(lines, i)) buf.push(lines[i++]);
      buf.forEach((l, k) => { if (k) p.appendChild(document.createElement("br")); appendInline(p, l.trim()); });
      container.appendChild(p);
    }
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
    if (role === "bot") { d.classList.add("md"); renderMarkdown(d, text); }
    else d.textContent = text; // user text stays literal
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
        const a = document.createElement("a");
        a.className = "src";
        a.href = "https://psi.nasa.gov/physci/repo/data/investigations/" + encodeURIComponent(label);
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = label;
        d.appendChild(a);
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
      if (!r.ok) { const e = new Error("HTTP " + r.status); e.status = r.status; throw e; }
      const data = await r.json();
      wait.remove();
      convId = data.conversation_id || convId;
      saveConv();
      const sources = Array.isArray(data.sources) ? data.sources : [];
      history.push({ role: "bot", text: data.answer, sources });
      bubble("bot", data.answer, sources, data.used_rag);
    } catch (err) {
      wait.remove();
      // Tell "server unreachable" apart from "server answered with an error"; the old message
      // blamed the connection even when the API was up and the LLM call had failed.
      let msg;
      if (err && err.name === "AbortError") msg = "The assistant took too long to respond. Please try again.";
      else if (err && err.status === 503) msg = "The assistant isn't set up on the server yet (the LLM API key is probably missing).";
      else if (err && err.status) msg = "The assistant hit an error on the server (HTTP " + err.status + "). Please try again in a moment.";
      else msg = "I can't reach the assistant right now. Check that the API is running at " + API + ".";
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
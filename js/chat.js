// Persistent RAG chat panel. Talks to FastAPI: POST {API_BASE}/api/chat -> { answer, sources:[{title,url}] }
(() => {
  const panel = document.getElementById("chat-panel");
  if (!panel) return;
  const KEY = "ignite.chat", API = window.IGNITE.API_BASE;
  const CHIPS = ["Why is 30% O₂ risky?", "Which tests used CO₂ suppression?", "What am I looking at on this page?"];
  let history = [];
  try { history = JSON.parse(sessionStorage.getItem(KEY)) || []; } catch {}
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(history.slice(-50))); } catch {} };

  panel.innerHTML = `
    <div class="chat-head">
      <div><strong>Fire safety assistant</strong><br><small>Answers from the Ignite research data</small></div>
      <button type="button" id="chat-clear">Clear</button>
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

  function bubble(role, text, sources) {
    const d = document.createElement("div");
    d.className = "msg " + role;
    d.textContent = text;
    (sources || []).forEach(s => {
      if (!/^https?:\/\//.test(s.url)) return;
      const a = document.createElement("a");
      a.className = "src"; a.href = s.url; a.target = "_blank"; a.rel = "noopener";
      a.textContent = s.title || s.url;
      d.appendChild(a);
    });
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
      b.type = "button"; b.textContent = c; b.onclick = () => send(c);
      chips.appendChild(b);
    });
  }

  async function send(q) {
    q = q.trim();
    if (!q || sendBtn.disabled) return;
    chips.innerHTML = "";
    history.push({ role: "user", text: q }); save();
    bubble("user", q);
    input.value = "";
    sendBtn.disabled = true;
    const wait = bubble("bot", "Thinking…");
    let env = null;
    try { env = JSON.parse(sessionStorage.getItem("ignite.env")); } catch {}
    try {
      const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 30000);
      const r = await fetch(API + "/api/chat", {
        method: "POST", signal: ctl.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, page: document.body.dataset.page, env, history: history.slice(-7, -1) })
      });
      clearTimeout(t);
      if (!r.ok) throw new Error("HTTP " + r.status);
      const data = await r.json();
      wait.remove();
      history.push({ role: "bot", text: data.answer, sources: data.sources || [] });
      bubble("bot", data.answer, data.sources);
    } catch {
      wait.remove();
      bubble("bot error", "I can't reach the assistant right now. Check that the API is running at " + API + ".");
    }
    save();
    sendBtn.disabled = false;
    input.focus();
  }

  form.onsubmit = e => { e.preventDefault(); send(input.value); };
  input.onkeydown = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input.value); } };
  panel.querySelector("#chat-clear").onclick = () => { history = []; save(); render(); };
  render();
})();

# 🔥 Flame in Freefall — Project Plan

**NASA Space Apps Challenge 2026 · Challenge: "Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data"**

---

## 1. What We Are Building (One Paragraph)

A web app that turns NASA's microgravity combustion research (from the PSI database) into clear fire-safety answers for people planning human space exploration. A user enters the conditions of a crew environment (oxygen level, pressure, airflow, material), and the app (1) shows a 3D visualization of the expected fire behavior and risk level, (2) lets them explore the underlying research as an interactive connected graph, (3) gives safety guidance for prevention, detection and suppression, and (4) lets them ask an AI assistant (RAG + Gemini) anything about the project and its data.

**Tagline:** *Turn complex combustion data into clear answers, so the next giant leap is a safer one.*

---

## 2. The Challenge in Short

| Item | Detail |
|---|---|
| Problem | NASA has decades of microgravity flame data, but it is hard to **find, compare and interpret**. |
| Required output | An interactive, SI-powered web dashboard that **summarizes, ranks and interprets** combustion investigations. |
| Data source | NASA PSI Combustion Science repository (https://psi.nasa.gov/physci/repo/search?q=combustion) |
| Audience | Professors, grad/undergrad students, aerospace researchers and engineers |
| Key science fact | Moon base / rovers will likely run at **≥30% O₂ and ≤10.2 psi**, which makes materials much more flammable than on Earth (21% O₂, 14.7 psi). Spacesuits use 100% O₂ at 4.3 psi. |

**Investigations to cover** (check which are actually in PSI):
- **ACME** (6 gas-flame experiments, incl. **BRE**, **CFI-G**, **E-FIELD Flames**) – hardware: CIR
- **FLEX, FLEX-2, CFI** (liquid droplets) – hardware: MDCA in CIR
- **BASS, BASS-II, SPICE, SLICE** (solid + gas fuels) – hardware: MSG flow duct
- **SAME, SAME-R** (smoke detection), **DAFT, DAFT-2** (dust detection)
- **Saffire-I/II/III** (spacecraft fire demos), if present in PSI

The challenge groups its goals into three themes, which our features must clearly map to:
1. Find investigations relevant to **crew habitats** (spacecraft, stations, Moon/Mars bases, pressurized rovers).
2. Extract data that supports **predictive modeling** of flammability and fire scenarios.
3. Highlight research behind **next-generation fire safety controls and equipment**.

Bonus: show **Earth applications** (water-mist extinguishers, smoke detectors, firefighter gear and air tanks).

---

## 3. Scope Check: Where Our Idea Matches and Where to Adjust

Your idea is **inside** the challenge. Four things need adjusting so judges don't mark it down:

1. **The research is the core, not a side page.** The challenge is about *summarizing, ranking and interpreting the investigations*. The Research Explorer (graph + filters + ranking + summaries) must be the strongest part of the app. The 3D model is the "wow" layer on top of it.
2. **"% of fire" must come from real data, not invented physics.** There is no public partial-gravity data in PSI, and we are not building a CFD simulator. So the dashboard shows a **data-matched risk indicator**: "tests in PSI closest to your conditions, and what happened in them (ignited / spread rate / extinguished)". Label it clearly as *data-based estimate, not a physics simulation*. This is honest and still impressive.
3. **Safety page content must be sourced.** Do not invent emergency procedures. Every recommendation should link to a NASA source or a PSI finding (suppression via CO₂/He dilution in FLEX, detection from SAME, material selection from BASS/Saffire, etc.).
4. **Be honest about gaps.** Say in the app: no partial-gravity (Moon 1/6 g, Mars 0.38 g) data exists yet; microgravity and normal-gravity results *bound* the intermediate case. Rocket/propellant fires are out of scope. Mention E-FIELD Flames mimicking partial gravity via electric fields.

Technical flags:
- The **Gemini API key must live only in FastAPI** (never in frontend JS).
- Vercel hosts the static frontend perfectly. FastAPI can run on Vercel as a Python serverless function, or on Render/Railway if cold starts or limits cause trouble. Decide early.
- "Pure HTML/CSS/JS + Tailwind" is fine; use CDN libraries for 3D and graphs (see section 5).

---

## 4. Target Users and What They Want

| User | Question they ask | Where the app answers it |
|---|---|---|
| Aerospace engineer | "Is 30% O₂ at 10.2 psi safe for fabric X?" | Dashboard (risk + matched tests) |
| Researcher / professor | "Which investigations are related to FLEX-2 and what do they share?" | Research Explorer (graph, compare) |
| Student | "What happened in the Apollo 1 fire and what did we learn?" | Safety page + Chatbot |
| Safety planner | "What suppression method works best in a closed cabin?" | Safety page |

---

## 5. Architecture and Tech Stack

```
 ┌──────────────────────────┐        ┌───────────────────────┐
 │  Frontend (Vercel)       │  HTTPS │  FastAPI backend      │
 │  HTML + CSS + JS         │ ─────► │  - /api/investigations│
 │  Tailwind (CDN/CLI)      │        │  - /api/risk          │
 │  Three.js  (3D)          │        │  - /api/graph         │
 │  D3.js / Cytoscape (graph)│       │  - /api/chat (RAG)    │
 │  Chart.js (charts)       │        └──────────┬────────────┘
 └──────────────────────────┘                   │
                                   ┌────────────┼─────────────┐
                                   ▼                          ▼
                          ┌─────────────────┐       ┌──────────────────┐
                          │ Supabase        │       │ Google Gemini API│
                          │ Postgres        │       │ (generation +    │
                          │ + pgvector      │       │  embeddings)     │
                          └─────────────────┘       └──────────────────┘
```

| Layer | Choice | Why |
|---|---|---|
| UI | HTML, CSS, vanilla JS, Tailwind | Your chosen stack, fast to build |
| 3D | Three.js (CDN, pinned version) | Browser 3D without a framework |
| Graph | D3.js force graph or Cytoscape.js (CDN) | Connected-Papers-style network |
| Charts | Chart.js or Plotly (CDN) | Comparison charts |
| Backend | FastAPI (Python) | Hides keys, runs risk logic and RAG |
| Database | Supabase (Postgres + pgvector) | Research data + embeddings in one place |
| AI | Gemini API | Chat answers + text embeddings |
| Hosting | Vercel (frontend), Vercel Python functions or Render (API) | Simple deploys |

**Shared layout:** every page has the same top nav + a **persistent chat panel on the side** (build it once as a JS component injected on every page; keep chat history in `sessionStorage` so it survives page changes).

---

## 6. Pages in Detail

### Page 1 — Mission Setup (Home / Input)

**Goal:** collect the environment data and launch the dashboard.

**Inputs:**
- Environment preset: *Spacesuit (100% O₂, 4.3 psi)* · *Earth cabin (21%, 14.7 psi)* · *Moon base (30%, 10.2 psi)* · *Custom*
- O₂ concentration (%) slider
- Cabin pressure (psi) slider
- Airflow speed (cm/s) slider (still → ventilated)
- Gravity: Microgravity · Normal gravity (partial gravity shown as "no data yet")
- Material/fuel type: fabric, plastic/polymer, paper, gas, liquid droplet
- Sample thickness/size (optional)
- Diluent / suppression agent: none, CO₂, helium (from FLEX)

**Output:** button "Analyze" → saves inputs in `sessionStorage`/URL params → opens Dashboard.

**Look:** dark space theme, big hero title, animated flame sphere, preset cards, clean form.

---

### Page 2 — Fire Dashboard (3D + Risk)

**Goal:** show what the entered conditions mean.

**Components:**
1. **3D scene (Three.js):** a simplified habitat module/cabin with a sample burning.
   - Flame **shape** switches by gravity: round blue sphere (microgravity) vs teardrop (normal gravity).
   - Flame **size/color/intensity** driven by the risk score.
   - Orbit controls, toggle "microgravity ↔ Earth" to compare.
2. **Risk gauge (0–100%):** the *Data-Matched Flammability Indicator*.
3. **Matched investigations list:** the closest PSI tests to the inputs, ranked by similarity, each with outcome (ignited, spread rate, extinguished) and a link to the Research page.
4. **What-if panel:** change O₂ / flow / diluent and watch the risk change live.
5. **Warnings:** e.g. "O₂ above 30% increases flammability of most materials; closest tested data: BASS-II."

**How the risk is computed (keep it transparent):**
1. Query Supabase for tests near the user's inputs (O₂, pressure, flow, material class).
2. Score by distance in normalized input space; take the K nearest tests.
3. Risk = weighted share of nearby tests where ignition/sustained spread occurred, adjusted by observed spread rates.
4. Show a **confidence note** ("based on N tests; nearest test differs by X% O₂").
5. Always show "Not a physics simulation".

---

### Page 3 — Research Explorer (the Core)

**Goal:** make PSI data easy to find, compare and understand.

**A. Connected graph (Connected-Papers style)**
- Nodes = investigations (ACME, BASS, FLEX, SAME, …). Node size = relevance score to crew safety. Color = type (solid fuel / gas / droplet / detection).
- Edges = shared attributes (same hardware, same fuel type, same variable, same sensor).
- Click a node → side card with summary; double-click → full detail view.

**B. Filters (quick check for scientists)**
- Fuel type, sample shape/size, O₂ range, airflow range, hardware (CIR/MDCA/MSG), goal (prevention / detection / suppression), sensor type, habitat relevance (spacecraft, Moon, Mars, rover).

**C. Ranking**
- Rank investigations for a chosen need ("Moon base materials selection", "smoke detection", "suppression"). Show why each ranks where it does.

**D. Investigation detail view**
- Objectives, fuels, test conditions, what varied vs. what stayed the same across tests, sensors/measurements, key findings, link to the PSI source.
- **AI summary** (generated once, stored in DB, labeled as AI-generated).

**E. Compare view**
- Select 2–3 investigations → side-by-side table + chart of conditions (O₂ ranges, flow speeds, fuels).

**F. Extras**
- "Useful for predictive modeling" tag + data download links.
- "Earth applications" tag (water mist, smoke detectors, firefighter gear).

---

### Page 4 — Safety Center

**Goal:** turn research into practical safety understanding. All items must cite a source.

Sections:
1. **Prevention:** ignition source control, material selection and flammability limits (BASS, BASS-II, Saffire), why higher O₂ matters on the Moon.
2. **Detection:** how smoke behaves in microgravity (SAME, SAME-R), smoke vs. dust discrimination (DAFT, DAFT-2).
3. **Suppression:** CO₂ and helium dilution (FLEX), water mist.
4. **Safety checklist generator:** based on the Page 1 inputs, show a checklist (e.g., "O₂ ≥ 30%: review material list, check flow shutoff, confirm detector coverage").
5. **"What to do in a dangerous situation":** high-level steps drawn from NASA material, with a clear "follow official mission procedures" note.
6. **Lessons learned:** short timeline cards: Apollo 1 (1967), Apollo 13, Mir (1997), Artemis II smoke alarm; links to NASA pages.
7. **Earth impact:** firefighter air tanks, fire detector, firefighter clothing (NASA spinoffs).

---

### Persistent Chat Panel — "Fire Safety Assistant" (all pages)

- Collapsible side panel, same on every page, remembers the conversation.
- **RAG pipeline:**
  1. Ingest: PSI investigation descriptions, NASA pages from the resources list, our own page texts → chunk → embed with Gemini → store in Supabase pgvector.
  2. Query: embed the question → vector search top K chunks → send chunks + question to Gemini.
  3. Answer with **citations** (investigation name / source link).
- **Project-only filter:**
  - System prompt: "Answer only using the provided context about this project. If it isn't covered, say so."
  - Similarity threshold: if the best match is too weak → reply "That's outside this project."
  - Optional context awareness: send the current page + current dashboard inputs so it can explain *what the user is looking at*.
- Suggested starter questions as chips ("Why is 30% O₂ risky?", "Which tests used CO₂ suppression?").

---

## 7. Database Design (Supabase)

| Table | Key columns |
|---|---|
| `investigations` | id, name (ACME, BASS…), full_name, hardware, summary, objectives, relevance_score, categories, psi_url, ai_summary |
| `tests` | id, investigation_id, fuel, fuel_shape, size, o2_percent, pressure_psi, flow_cm_s, diluent, gravity, outcome, spread_rate, notes |
| `sensors` | id, investigation_id, sensor_type, measures |
| `investigation_edges` | source_id, target_id, relation_type, weight |
| `safety_items` | id, category (prevention/detection/suppression), title, text, source_url, applies_when |
| `doc_chunks` | id, source, text, embedding (vector), metadata |

Tip: start with a **hand-curated seed** (CSV/JSON → Supabase) for the 6–8 main investigations rather than trying to scrape all of PSI. Quality over quantity.

---

## 8. API Endpoints (FastAPI)

| Endpoint | Purpose |
|---|---|
| `GET /api/investigations` | List with filters (fuel, o2 range, hardware, goal…) |
| `GET /api/investigations/{id}` | Detail + tests + sensors |
| `GET /api/graph` | Nodes + edges for the explorer |
| `POST /api/risk` | Inputs → risk score, matched tests, confidence |
| `GET /api/safety?o2=..&pressure=..` | Checklist and guidance |
| `POST /api/chat` | RAG question → answer + sources |

Enable CORS for the Vercel domain; keep keys in environment variables.

---

## 9. The Final Look

**Visual style:** dark "mission control" theme (deep navy/black), flame accents (orange → blue), glass-style cards, monospace numbers, subtle star background. Tailwind utility classes throughout; responsive for laptop first, tablet OK.

**Layout (all pages):**

```
┌──────────────────────────────────────────────────────────────┬───────────────┐
│  🔥 Flame in Freefall   Setup | Dashboard | Research | Safety │               │
├──────────────────────────────────────────────────────────────┤  AI Assistant │
│                                                              │  ───────────  │
│                       PAGE CONTENT                           │  chat history │
│                                                              │               │
│                                                              │  [ask here…]  │
└──────────────────────────────────────────────────────────────┴───────────────┘
```

**Dashboard sketch:**

```
┌───────────────────────────────┬─────────────────────┐
│                               │  RISK  ◔ 72%        │
│     3D HABITAT + FLAME        │  O₂ 30% · 10.2 psi  │
│     (orbit, toggle g)         │  Confidence: medium │
│                               ├─────────────────────┤
│                               │  Matched tests      │
├───────────────────────────────┤  1. BASS-II …       │
│  What-if sliders  O₂ ▬▬●▬     │  2. SLICE …         │
│                   Flow ▬●▬▬   │  3. CFI-G …         │
└───────────────────────────────┴─────────────────────┘
```

**Research page sketch:** left filter bar · center network graph · right detail/compare card.

**Demo story (for judges, about 3 minutes):**
1. Pick "Moon base" preset → dashboard shows a high-risk flame.
2. Toggle gravity: flame shape changes (sphere ↔ teardrop).
3. Open matched tests → jump into the graph → compare BASS-II vs. FLEX-2.
4. Open Safety page → generated checklist for 30% O₂.
5. Ask the assistant: "Why does helium suppress fire?" → cited answer.

---

## 10. What To Do (Step-by-Step Plan)

**Phase 0 — Setup (half day)**
- [ ] Create repo, Vercel project, Supabase project, Gemini API key
- [ ] Agree on design tokens (colors, fonts, components)
- [ ] Read PSI repo + the "Researcher's Guide to ISS Combustion Science"

**Phase 1 — Data (day 1–2)**
- [ ] Collect info for the key investigations (see section 2)
- [ ] Build the seed dataset (investigations, tests, sensors, edges)
- [ ] Load into Supabase; write `safety_items`

**Phase 2 — Backend (day 2–3)**
- [ ] FastAPI skeleton + CORS + env vars
- [ ] `/investigations`, `/graph`, `/risk`, `/safety`
- [ ] RAG ingest script + `/chat`

**Phase 3 — Frontend (day 2–5, in parallel)**
- [ ] Shared layout + nav + chat panel component
- [ ] Page 1 form → Page 2 dashboard (risk first, 3D second)
- [ ] Page 3 explorer (graph → filters → detail → compare)
- [ ] Page 4 safety center

**Phase 4 — Polish and Submission (last 1–2 days)**
- [ ] Mobile/laptop responsiveness, loading and error states
- [ ] Add "data-based estimate" and "AI-generated" labels
- [ ] Add About/Data Sources page with credits to NASA PSI
- [ ] Deploy, test the live URL, record demo video, write submission text

**Suggested team split:** (A) data + Supabase, (B) FastAPI + RAG, (C) dashboard + 3D, (D) explorer + safety pages. Adjust to your team size.

**Priority if time runs short (cut from the bottom):**
1. Research Explorer with filters + detail ← must have
2. Risk indicator + matched tests ← must have
3. Chat assistant with RAG ← must have
4. Safety Center ← must have (can be simpler)
5. 3D scene ← nice to have (a stylized flame is enough)
6. Compare view, AI summaries, downloads ← bonus

---

## 11. Risks and How to Handle Them

| Risk | Mitigation |
|---|---|
| Too little structured data in PSI | Hand-curate a seed dataset; be explicit about its coverage |
| Risk score looks like fake science | Transparent method, confidence note, "not a simulation" label |
| 3D takes too long | Start with a simple flame shape; improve only if time remains |
| Chatbot hallucinates | Strict context-only prompt, similarity threshold, citations |
| API key leak | Keys only in FastAPI env vars, never in frontend |
| FastAPI hosting limits on Vercel | Fall back to Render/Railway |
| Scope creep | Follow the priority list in section 10 |

---

## 12. Definition of Done

- [ ] User can enter environment data and get a dashboard with a 3D flame and a data-backed risk indicator
- [ ] Research Explorer shows a connected graph, filters, ranking, detail and compare
- [ ] Safety page gives sourced guidance and a generated checklist
- [ ] Chat panel appears on every page and answers only project questions with citations
- [ ] All data and text credit NASA PSI and link to sources
- [ ] Live on Vercel, demo video ready, submission written

---

*Data and resources: NASA Physical Sciences Informatics (PSI), NASA Combustion Science, "A Researcher's Guide to International Space Station Combustion Science", and the NASA safety/history links listed in the challenge Resources tab.*

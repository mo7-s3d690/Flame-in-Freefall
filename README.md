# Ignite: Fire Safety Evidence Navigator

An AI-assisted dashboard for the **2026 NASA Space Apps Challenge: "Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data"**.

NASA has run decades of combustion experiments in microgravity (BASS-II, Saffire, SAME, FLEX, ACME, ...). The results are public in the Physical Sciences Informatics (PSI) database, but they are hard to find, compare, and interpret. Ignite turns 24 PSI investigations into a flammability indicator, a connected research map, and an AI assistant that answers with sources.

## What it does

The app has **two pages and an AI assistant**.

1. **Fire dashboard** (`dashboard.html`)
   - A data-matched **flammability indicator** (0-100%) for a crew environment: O₂ %, cabin pressure, airflow, material, diluent (none, CO₂, helium) and gravity.
   - A **What-if panel** to change those conditions live. It starts from the Moon-base preset (30% O₂, 10.2 psi).
   - The **closest PSI investigations** to those conditions, with a score for each.
   - A **3D habitat scene** (Three.js) where the flame shape follows gravity (round in microgravity, teardrop on Earth).
   - **Warnings and data gaps**, for example that PSI has no partial-gravity (Moon/Mars) combustion data.
2. **Research explorer** (`research.html`)
   - A **connected graph** of the investigations. Solid lines mean one study builds on another; faint lines mean shared hardware and fuel.
   - **Filters** by fuel, goal (prevention, detection, suppression, fundamental) and setting.
   - A **detail card** per investigation (objective, conditions, sensors, findings, link to the PSI source).
   - A **compare table** for up to 3 investigations.
3. **Ignite AI assistant** (floating button, bottom right, on every page)
   - Answers questions about the research and cites the PSI report each answer comes from.
   - Stays on topic: it declines unrelated questions and says so when the data does not contain the answer.
   - Understands the current page and the conditions you set.

## Design principle

**Numbers and rankings come from the extracted PSI data. The AI only explains.** The indicator is a transparent, adjustable heuristic (weights are at the top of `js/dashboard.js`). It is **not a physics simulation**, and the page says so. Missing values stay `null`; nothing is guessed.

## Project structure

```
dashboard.html, research.html   The two pages
css/                            shared.css (layout, chat), dashboard.css, research.css
js/
  config.js                     API_BASE and the page list
  layout.js                     Shared shell: sidebar, top bar, chat popup + floating button
  chat.js                       Chat panel: talks to the API, renders markdown answers
  dashboard.js, research.js     Page logic
PSI-merged.json                 The 24 investigations the pages use
assets/                         Logo
nasa-research-agent/            Backend for the AI assistant (see its own README)
```

## Run it locally

You need Python 3.11+ for the assistant. The two pages are plain HTML/CSS/JS.

**1. Start the assistant API**

```bash
cd nasa-research-agent
pip install -r requirements.txt
cp .env.example .env          # then set API_KEY (an OpenRouter key)
python scripts/ingest.py      # builds the search index; only needed once
uvicorn api.main:app --port 8000
```

The index is git-ignored, so every fresh clone runs `ingest.py` once. If it is missing, the assistant still replies but has no research to search.

**2. Serve the pages** (from the repo root, in a second terminal)

```bash
python -m http.server 5500
```

Open http://localhost:5500/dashboard.html. Use a server, not a `file://` URL, because the pages load `PSI-merged.json`.

The pages call the API at `http://localhost:8000`. When you deploy the backend, change `API_BASE` in `js/config.js`.

## Tech

- **Frontend:** plain HTML, CSS and JavaScript, Tailwind (CDN), Three.js r128 (CDN). No build step.
- **Backend:** FastAPI, an MCP server exposing two research tools, BM25 search with query decomposition, and an OpenAI-compatible LLM client (OpenRouter by default).
- **Keys:** the LLM key lives only in `nasa-research-agent/.env` (git-ignored) and is never sent to the browser.

## Investigations covered

BASS-II, Saffire (IV/V/VI), SAME / SAME-R, FLEX, ACME (BRE), SoFIE-MIST and others: 24 PSI investigations in total. Each entry in `PSI-merged.json` links to its PSI source.

## Scope and limits

- Covers crewed-environment fire safety; rocket and propellant combustion is out of scope, as stated in the challenge.
- No partial-gravity data is available in PSI at the time of writing; microgravity and normal-gravity results can bound it.
- The indicator uses an adjustable scoring heuristic, not a validated physical model.
- The assistant can only draw on the 24 indexed documents, not the whole NASA archive.

## Data sources

**Primary data (from the challenge Resources tab)**
- NASA Physical Sciences Informatics (PSI), Combustion Science repository: the source of the data this app is based on. Overview: https://science.nasa.gov/?p=158684
- NASA Combustion Science: basic information about most investigations in PSI: https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science
- *A Researcher's Guide to International Space Station Combustion Science* (2015): review of NASA's ISS combustion research; used to cross-check investigation descriptions.

**Technical reports used for extraction**
- NASA Technical Reports Server (NTRS): https://ntrs.nasa.gov
- NASA-STD-6001 (materials flammability): https://ntrs.nasa.gov/citations/19990036744

**Background and Earth applications (from the challenge Resources tab)**
- Apollo 1, Apollo 13, and the 1997 Mir fire: historical fire and oxygen incidents that motivate this work.
- NASA ScienceCasts, *The Power of Studying Combustion on the ISS* (2018 video).
- Spinoffs for fire safety on Earth: firefighter air tanks (1970s), the shuttle-derived smoke detector that discriminates smoke from dust (1970s), and firefighter protective clothing (1980s).

Per the challenge terms, NASA does not endorse non-U.S. Government websites; each source's own data-use terms apply.

## Team

1. Mohamed Saad
2. Mohamed Shaikhon
3. Omar Mahmoud

## Acknowledgments

Built for the NASA Space Apps Challenge. NASA data is used under NASA's open data terms; all credit for the experiments goes to the investigators and NASA centers cited in the data.

# Fire Safety Evidence Navigator

An AI-assisted dashboard for the **2026 NASA Space Apps Challenge: "Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data"**.

NASA has run decades of combustion experiments in microgravity (BASS-II, Saffire, SAME, FLEX, ACME, ...). The results are public in the Physical Sciences Informatics (PSI) database, but they are hard to find, compare, and interpret. This dashboard summarizes, ranks, and explains those investigations for fire safety in crewed environments.

## What it does

1. **Ranks investigations by environment.** Pick a habitat (spacecraft cabin, lunar base / pressurized rover, spacesuit) and see which experiments are closest to its oxygen, pressure, and airflow conditions, with a transparent score breakdown.
2. **Compares investigations side by side.** Fuel, test conditions, varied vs. constant variables, sensors, and key findings in one view.
3. **Exports modeling-ready data.** A clean table (fuel, O2 %, pressure, flow speed, outcome) as CSV/JSON, plus an oxygen x airflow plot of the real data points.
4. **Links research to safety equipment.** Findings grouped by prevention, detection, and suppression, and tied to detectors, extinguishers, and material standards.
5. **Answers questions with sources.** An AI assistant explains results and cites the report each answer comes from. It declines when the data does not contain the answer.
6. **Shows data gaps.** For example, there is no partial-gravity (Moon/Mars) combustion data in PSI yet.

## Design principle

**Numbers and rankings come from the extracted data. The AI only explains.** Missing values stay `null`; nothing is guessed.

## Project structure

```
.
├── app.py                    # Streamlit dashboard
├── requirements.txt
├── experiment_schema.json    # JSON Schema for one investigation
├── extraction_prompt.md      # System prompt used to extract fields from reports
├── data/
│   ├── experiments.json      # Reviewed, structured investigations
│   └── chunks.json           # Report excerpts used for sourced answers
└── README.md
```

## Data pipeline

1. Download NASA reports (NTRS / PSI) for each investigation.
2. Extract text from the PDFs (PyMuPDF).
3. Send the text to Claude with `extraction_prompt.md`; output must validate against `experiment_schema.json`.
4. Review fields flagged in `needs_human_review` by hand.
5. Save the final result to `data/experiments.json`.

Extraction runs offline, once. The deployed app only reads the reviewed JSON.

## Run locally

```bash
pip install -r requirements.txt
mkdir -p .streamlit
echo 'ANTHROPIC_API_KEY = "your-key"' > .streamlit/secrets.toml
streamlit run app.py
```

Keep `.streamlit/secrets.toml` out of Git (add it to `.gitignore`).

## Deploy

Streamlit Community Cloud: connect this repo, choose `app.py`, and add `ANTHROPIC_API_KEY` under **Secrets**.

## Investigations covered

BASS-II, Saffire (IV/V/VI), SAME / SAME-R, FLEX, ACME (BRE), SoFIE-MIST. Each entry in `data/experiments.json` lists its source reports.

## Scope and limits

- Covers crewed-environment fire safety; rocket and propellant combustion is out of scope, as stated in the challenge.
- No partial-gravity data is available in PSI at the time of writing; microgravity and normal-gravity results can bound it.
- Rankings use an adjustable scoring heuristic, not a validated physical model.

## Data sources

- NASA Physical Sciences Informatics (PSI): https://science.nasa.gov/?p=158684
- NASA Technical Reports Server (NTRS): https://ntrs.nasa.gov
- NASA-STD-6001 (materials flammability): https://ntrs.nasa.gov/citations/19990036744

## Team

_Add team name and members here._

## Acknowledgments

Built for the NASA Space Apps Challenge. NASA data is used under NASA's open data terms; all credit for the experiments goes to the investigators and NASA centers cited in the data.

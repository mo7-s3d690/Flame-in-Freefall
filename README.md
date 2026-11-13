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


## Data pipeline


## Deploy

Streamlit Community Cloud: connect this repo, choose `app.py`, and add `ANTHROPIC_API_KEY` under **Secrets**.

## Investigations covered

BASS-II, Saffire (IV/V/VI), SAME / SAME-R, FLEX, ACME (BRE), SoFIE-MIST. Each entry in `data/experiments.json` lists its source reports.

## Scope and limits

- Covers crewed-environment fire safety; rocket and propellant combustion is out of scope, as stated in the challenge.
- No partial-gravity data is available in PSI at the time of writing; microgravity and normal-gravity results can bound it.
- Rankings use an adjustable scoring heuristic, not a validated physical model.


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

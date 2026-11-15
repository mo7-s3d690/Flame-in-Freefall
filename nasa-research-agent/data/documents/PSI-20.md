# Burning Without a Breeze: The ACME Burning Rate Emulator (PSI-20)

Solid materials in a spacecraft cannot be burned safely on demand, so the ACME Burning Rate Emulator (BRE) uses a gas-fed porous burner to mimic how a condensed fuel burns. Operated on the International Space Station, it asks whether a flame sustained by a solid-like fuel can persist in still air under microgravity, and under what material and atmosphere conditions. The question matters because spacecraft fire response assumes that shutting off ventilation will starve a fire.

## 1. Project Overview

| Item | Detail |
|---|---|
| PSI ID | PSI-20 (Version 4) |
| Research name | ACME BRE |
| Full name | Advanced Combustion via Microgravity Experiments – Burning Rate Emulator |
| Proposal title | Experimental Investigation of Emulated Burning Rate at Various Gravity Levels |
| Research area | Combustion Science, sub-area Flames of Gaseous Fuels |
| Project type | Microgravity investigation |
| Category | suppression  |
| Investigation period | 01-01-2010 to 02-08-2025 (end date format ambiguous in source; read here as 8 Feb 2025) |
| Sponsor / center | NASA / Glenn Research Center (GRC) |
| Platform | International Space Station; hardware: Combustion Integrated Rack (CIR) and ACME |
| Contacts | James G. Quintiere, John L. de Ris, Peter Sunderland, Dennis Stocker |
| DOI | 10.60555/vb93-3y72 |
| Related investigations | None named in the supplied text (the metadata file name mentions "PSI-96", unexplained) |

## 2. Research Objectives

The program aims to define burning conditions in a quiescent microgravity ambient in terms of material properties. The flight objectives are:

1. Observe long-duration burning of CH4/N2 and C2H4/N2 mixtures on porous circular burners of 25 and 50 mm diameter, in O2/N2 atmospheres. Target atmospheres are those considered for crewed missions: 14.7 psia with 21% O2, 10.2 psia with 26.5% O2, and 8.2 psia with 34% O2. Fuel conditions should relate to a broad range of condensed fuels.
2. Repeat Objective 1 in O2/CO2 ambients (desired, not required).
3. Extend Objectives 1–2 to extinction limits.

## 3. Experimental Approach

**Physical experiments.** A porous circular burner is fed with gaseous fuel. For each test the chamber diluent, oxygen concentration, and pressure are set; fuel flow starts, then ignition. Fuel flow is initially held constant. Because burner surface temperature and heat flux drift as the flame burns, a single test sweeps through a wide range of conditions, producing continuous data for a flammability map.

A test ends when one of the following occurs: the flame extinguishes, the burner surface temperature equilibrates, or the heat flux sensor approaches its temperature limit. Once temperature has steadied, fuel flow can be lowered in small steps until extinction, which yields extinction-limit data.

**Ground work.** Ignition-limit tests are not planned in microgravity; they are explored in normal gravity, where ignition control is judged better and results are expected to carry over. Normal-gravity tests with gaseous, liquid, and solid fuels validate the BRE for 1-g use. Drop-facility tests, as available, refine procedures, instrumentation, and flow conditions. Preliminary flight tests compare operation against ground tests.

**Computational work.** A CFD model of quiescent microgravity burning is pursued to guide flight tests and possibly provide a predictive method.

**Variables.** Independent: burner size, fuel mixture, diluent, O2 concentration, chamber pressure, fuel flow rate. Observed: flame behavior, burner surface temperature, heat flux, ignition and extinction. The supplied text gives no further sensor specifications beyond a heat flux sensor with a temperature limit.

**Flight test record.** The supplied excerpt of the experimental table (5 of 19 rows) covers February–March 2019 runs on the 25 mm burner with 100% and 50% C2H4 fuel bottles, O2 from 21% to 40% (diluted with nitrogen by volume), and 6–10 flames ignited per day. Chamber pressures were varied but are not listed in the summary. One row lists an oxygen value of "3400%", which is evidently a data entry error and is not interpreted here.

## 4. Research Hypothesis

The stated hypothesis is that a regime of quasi-steady burning exists in microgravity as a function of material properties. Truly steady burning may never occur, with only slowly changing flames possible. The ISS tests are designed to probe this by mapping quasi-steady conditions for condensed fuels as functions of heat of gasification, reradiation heat flux, applied radiant heat flux, heat of combustion, and smoke point.

A key premise is that the heat of combustion, smoke point, and heat of gasification of the gas mixture can stand in for a real solid fuel (or a liquid absorbed in an inert matrix), so steady burning of the emulator implies possible steady burning of real solids. The source notes this has not been shown before except for a candle flame. If true, the cone calorimeter (NASA Test 2) could provide the basis for flammability maps of real materials.

## 5. Findings and Scientific Contributions

The source describes results as preliminary.

**Experimentally observed (ISS):**
- Quasi-steady burning corresponding to condensed-phase materials, with PMMA and Nylon named as examples, was observed in microgravity without air flow.
- Burning without flow persisted in elevated-oxygen atmospheres of the kind being considered for future spacecraft.
- Flames at 21% oxygen self-extinguished within a short time.

**Interpretation / suggestion by investigators:** NASA may wish to make more use of alternative flammability Test 2 (cone calorimeter), since it can measure the material properties corresponding to the flames seen with the BRE.

**Computational:** Several theoretical and CFD-based publications are listed (radiative extinction, transient ellipsoidal combustion model, theoretical predictions of burning), but the supplied text does not summarize their numerical results.

No quantitative flammability map, burning rate, or extinction limit values are given in the supplied material.

## 6. Fire Safety Relevance

- **Fire suppression:** Halting ventilation is an established step for putting out a spacecraft fire. The observation that flames can continue without flow in oxygen-enriched air questions how reliable that step is in such atmospheres.
- **Material flammability:** Linking flame behavior to heat of gasification, heat of combustion, and smoke point gives a route to ranking real materials.
- **Ignition and extinction:** Extinction limits are measured directly in flight, while ignition limits are studied on Earth.
- **Atmosphere selection:** Results across 21%, 26.5%, and 34% oxygen (and up to 40% in the table) bear on choosing habitat atmospheres.

## 7. Key Scientific Insights

1. **Emulation as a safe stand-in.** A controllable gas burner reproduces key energy-balance features of condensed fuel burning, allowing repeated, adjustable flames. Supported as the design premise; its fidelity to real solids is the hypothesis under test.
2. **Quasi-steady rather than steady burning.** The framing allows for slowly evolving flames. Observed quasi-steady flames support this for the tested conditions.
3. **Oxygen level controls persistence.** Sustained burning without flow in enriched oxygen versus short-lived burning at 21% is directly reported, though qualitatively.
4. **Link to standard testing.** The cone calorimeter connection is a proposed implication, not a validated procedure.

## 8. Applications in Space Exploration

The tested atmospheres (14.7 psia/21% O2, 10.2 psia/26.5%, 8.2 psia/34%) are those considered for human missions, so results are directly framed for future spacecraft and habitats. The practical implication is that fire response plans for enriched-oxygen vehicles should not rely on ventilation shutdown alone, and that material screening via cone calorimetry could be used. These are potential applications; the source does not state that any policy or procedure has been changed. Lunar and Mars habitats are not mentioned specifically in the supplied text.

## 9. Earth Benefits

The BRE is intended to be validated for normal-gravity use, and the source says it can establish 1-g ignition and extinction limits using gaseous, liquid, and solid fuels. Earth-side publications on ignition and extinction in small-scale fires and on flat wick burning are listed. Beyond this, the supplied material states no specific terrestrial applications.

## 10. Limitations and Open Questions

- Results are described as preliminary; no quantitative values are provided.
- Only 5 of 19 experimental table rows are shown; chamber pressures are omitted.
- The "3400%" value is an apparent error.
- The investigation end date is ambiguous (02 Aug 2025 or 8 Feb 2025).
- Whether O2/CO2 ambients and the 50 mm burner were tested in flight is not stated.
- How closely emulated flames match real solid-fuel flames, and whether truly steady burning is attainable, remain open.
- No modeling table or read-me file is associated.

## 11. Research Metadata

| Field | Value |
|---|---|
| Primary focus | Quasi-steady burning and extinction of emulated condensed-fuel flames in quiescent microgravity |
| Combustion domain | Gaseous-fuel diffusion flames on a porous burner emulating condensed fuels |
| Fuel | Gas (CH4/N2, C2H4/N2); fuel bottles of 100% and 50% C2H4 in the table |
| Gravity | Microgravity (ISS), with normal-gravity and drop-facility support tests |
| Main safety relevance | Flame persistence without ventilation; atmosphere and material selection |
| Evidence | Flight experiments (partial table), preliminary results summary, 14 publications |
| Completeness | Moderate: objectives, approach, and hypothesis are full; quantitative results are absent |

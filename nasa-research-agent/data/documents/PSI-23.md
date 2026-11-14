# ACME s-Flame: Structure and Response of Spherical Diffusion Flames

When a gaseous fuel burns without buoyancy pulling hot gas upward, the flame can settle into a near-perfect sphere around its source. That geometry turns a messy, gravity-distorted problem into a one-dimensional one, and it is the premise of PSI-23. Aboard the International Space Station, fuel/diluent mixtures were to be pushed through a spherical porous burner and ignited, so that flame structure, extinction and instability could be measured cleanly and set against detailed numerical simulations. The study is less about any single fuel than about using the flames as a precision test of how well we understand combustion chemistry, molecular transport and radiation.

## 1. Project Overview

| Item | Detail |
|---|---|
| PSI ID | PSI-23 (Version 4) |
| Research name | ACME s-Flame |
| Full investigation name | Advanced Combustion via Microgravity Experiments - Structure and Response of Spherical Diffusion Flames |
| Proposal title | Structure and Response of Spherical Diffusion Flames |
| Research category | fundamental  |
| Project type | Microgravity investigation |
| Investigation period | 2015-02-05 to 2019-11-24 (about 57 months) |
| Sponsoring agency | NASA |
| NASA center | Glenn Research Center (GRC) |
| Platform | International Space Station (ISS), Combustion Integrated Rack (CIR) with ACME hardware |
| Contacts | Chung K. Law, Stephen Tse, Dennis Stocker |
| Related investigations | None formally stated; a metadata archive in the version history is labeled "PSI-99_ACME s-Flame" |
| DOI / license | 10.60555/k57n-p030 / CC0-1.0 |

## 2. Research Objectives

The team set out three linked goals, each pursued for soot-free flames (H2/CH4/diluent) and sooty flames (C2H4/diluent), and each meant to be compared with detailed simulation:

- **Transient structure.** Measure how temperature and species distributions evolve in diffusion flames that start from an initially non-steady spherical configuration, across different fuel/diluent ratios and flow rates.
- **Extinction limits.** Find the quasi-steady limits at which a flame is lost, distinguishing convective/chemical-kinetic extinction (low system Damköhler number) from radiative/chemical-kinetic extinction (high Damköhler number).
- **Pulsating instabilities.** Establish whether the pulsations predicted by theory for transient spherical diffusion flames actually occur (as a function of Zeldovich number), at what Damköhler number they begin, and what their mode, frequency and amplitude are. The prediction applies to mixtures above a critical Lewis number.

Taken together, these should tell researchers how reliable current transport properties and reaction kinetics (including chemiluminescence) really are.

## 3. Experimental Approach

**Setup.** Gaseous fuel and diluent mixtures are released through a spherical porous burner into an oxidizing atmosphere and ignited, aiming for a nominally spherical, one-dimensional stabilized flame. The hardware is the ACME module operating in the CIR on the ISS.

**Fuels and diluents.**

- Hydrogen: the simplest fuel, with a reasonably well-established reaction mechanism.
- Methane: the simplest hydrocarbon, with extensively studied chemistry.
- Ethylene: a representative sooty fuel and an important intermediate in the oxidation of heavier hydrocarbons.
- Nitrogen and helium are added to tune mixture diffusivity; carbon dioxide is added to change the flame's radiative behavior.

**Variables.** Fuel type and fuel/diluent ratio, diluent identity, reactant flow rate, and ambient temperature and pressure are controlled or logged, along with acceleration levels. The governing parameters of interest are the Damköhler, Zeldovich and Lewis numbers.

**Measurements.** Synchronized records include spectrally resolved images, flame and burner temperatures, radiative flux, and system operating conditions. Specific instrument models, ranges and sampling rates are not given in the supplied material.

**Modeling.** A transient numerical simulation with detailed chemistry, transport and radiation models runs alongside the experiment, both to interpret results and to shape the test matrix.

## 4. Research Hypothesis

No formal hypothesis statement is provided, so none is invented here. The underlying rationale is one of model validation: each experimental observation (flame structure, growth or front velocity, conditions that give steady flames, extinction, front instabilities or soot suppression) is treated as a demanding test of the simulation, and together they indicate how comprehensive the kinetic and transport models are. A practical motivation is also stated: time limits and g-jitter on the ground prevent adequate exploration of most of the planned test matrix, so flight experiment definition relies heavily on the modeling.

## 5. Findings and Scientific Contributions

**Experimentally observed findings.** None are included in the supplied material. The record lists objectives and approach only, along with a large archive of data files (the version history reports thousands of files added and removed, including raw data and presentations) that was not part of the provided text.

**Computational or modeled findings.** No quantitative simulation results are provided. The simulation is described as a tool for defining science requirements and the test conditions.

**Scientific interpretation.** The extensive publication list (Law, Tse, Yoo and colleagues, among others) shows the program rests on a long line of work on spherical flames, rotation effects, Soret diffusion, radiation-affected oscillations and reaction mechanisms. The titles alone, however, do not allow results to be attributed to this ISS investigation, and none are summarized here.

**Potential applications.** Covered in sections 6, 8 and 9.

## 6. Fire Safety Relevance

The source does not frame the work around fire safety; its stated emphasis is combustion fundamentals and engine-type devices. The links below are therefore interpretive and kept modest:

- **Extinction behavior.** Knowing what drives flame extinction in a gas-fueled diffusion flame, whether weak reaction rates under strong convection or heat loss by radiation, is relevant to understanding when a fire sustains itself or dies.
- **Radiation and diluents.** The use of CO2 to alter radiative loss, and of nitrogen and helium to alter diffusion, probes how environmental composition changes flame stability.
- **Soot.** Sooty ethylene flames and soot suppression limits touch on smoke production, a factor in detection and hazard.
- **Modeling.** Validated kinetics and transport models would support better combustion prediction, a prerequisite for fire-risk simulation.

None of these connections has been demonstrated by the supplied material.

## 7. Key Scientific Insights

- **Spherical symmetry as an analytical lever.** Without buoyancy, the flow field is simple enough to extract fundamental chemical and transport parameters. This is directly stated by the source as the prospect of the approach.
- **Two routes to extinction.** The distinction between convective/chemical-kinetic and radiative/chemical-kinetic limits, tied to low and high Damköhler numbers, structures the whole test plan. Whether and where each limit appears is an open experimental outcome in the supplied record.
- **Oscillatory flames.** Pulsating instabilities are theoretically predicted above a critical Lewis number; the investigation is designed to confirm their existence and characterize them. Confirmation is not documented in the supplied material.
- **Model as a test target.** Many aspects of flame behavior serve to judge the simulation, so disagreements would be as informative as agreement.

## 8. Applications in Space Exploration

The investigation ran on the ISS CIR, so it contributes baseline data on gas-fueled flames in a real microgravity environment, not a ground analog. Possible value for future vehicles and habitats includes better-grounded models of how flames behave, persist or extinguish when buoyant convection is absent. This is a potential contribution only; the supplied material does not claim any implementation in spacecraft fire safety systems, lunar or Mars habitats, or exploration vehicles.

## 9. Earth Benefits

The source names practical benefits: because diffusion flame burning is the basis of many combustion engines and devices, deeper understanding of its dynamics and chemistry can improve power, efficiency, pollutant emissions and reliability. On the fundamental side, high-fidelity data from simple flow fields can help quantify thermochemical processes and their physico-chemical parameters. No fire-safety-specific terrestrial benefit is stated.

## 10. Limitations and Open Questions

- No results, measured values, or quantitative extinction limits are included in the supplied material.
- Oxygen concentration, pressure, flow rate values, fuel/diluent ratios and sensor specifications are not given.
- The test matrix is acknowledged to be largely unexplorable on the ground, so ground comparisons are limited.
- It is unclear whether predicted pulsating instabilities were observed.
- Dependencies on other investigations are not explicitly stated (only a PSI-99 reference in an archive name).
- The data archive is large and was not supplied, so conclusions must wait for its analysis.
- Direct relevance to fire safety is inferential.

## 11. Research Metadata

| Field | Value |
|---|---|
| Primary research focus | Structure, extinction and instability of spherical diffusion flames; validation of chemistry/transport/radiation models |
| Combustion domain | Gaseous diffusion flames, soot-free and sooty |
| Fuel type and form | Gas; hydrogen/methane/diluent and ethylene/diluent mixtures through a spherical porous burner |
| Gravity environment | Microgravity (ISS) |
| Main fire safety relevance | Extinction mechanisms and radiative effects (interpretive) |
| Evidence available | Objectives, approach, rationale and publication list; no results |
| Completeness of supplied information | Moderate: good on design, absent on outcomes and numerical conditions |

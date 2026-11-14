# FLEX-2: Flame Extinguishment Experiment-2

FLEX-2 put burning fuel droplets inside a sealed chamber aboard the International Space Station to watch how flames behave once buoyancy is removed. Without gravity, a droplet burns as a nearly spherical flame, which strips the problem down to its fundamentals: fuel vaporization, chemistry, radiation, and the conditions under which the flame dies. The experiment extends the earlier FLEX-1 work toward fuels and ambient conditions closer to those in real combustors, and it was designed to generate benchmark data that numerical models can be tested against.

## 1. Project Overview

| Item | Detail |
|---|---|
| PSI ID | PSI-68 (Version 6) |
| Research name | FLEX-2 |
| Full investigation name | Flame Extinguishment Experiment-2 (FLEX-2) |
| Proposal title | The Fundamental Studies in Droplet Combustion and Flame Extinguishment in Microgravity |
| Research area | Combustion Science / Spacecraft Fire Safety |
| Project type | Microgravity investigation |
| Research category | suppression |
| Investigation period | 2016-08-12 to 2019-09-30 (about 37 months) |
| Sponsoring agency | NASA |
| NASA center | Glenn Research Center (GRC) |
| Flight platform | International Space Station |
| Hardware | Combustion Integrated Rack (CIR); Multi-user Droplet Combustion Apparatus (MDCA) |
| Related investigations | FLEX-1 (results are extended by FLEX-2); no other PSI IDs named in the supplied material |
| DOI / license | 10.60555/byp8-h018 / CC0-1.0 |
| Record history | Submitted 2019-09-30; Version 6 metadata update 2025-11-25 |

The listed investigators are Forman A. Williams, Frederick Dryer, Benjamin D. Shaw, Mun Choi, Vedha Nayagam, Thomas Avedisian, Daniel Dietrich, and Michael Hicks.

## 2. Research Objectives

The central aim is to push beyond FLEX-1 and examine droplet burning under fuels and atmospheres that resemble practical combustor environments, while building a trustworthy body of experimental data on bi-component droplets (two-fuel mixtures) over a broad range of starting conditions. That data is meant to check existing simulations and support new theory.

The source lists six specific goals:

1. How mixing inside the liquid phase affects the burning of bi-component droplets.
2. Steady and unsteady liquid- and gas-phase behavior during burning of single-component fuels.
3. The mechanisms of flame extinction and where their boundaries lie.
4. Soot formation, including soot volume fraction and the dynamics of the soot shell.
5. How neighboring droplets alter flammability limits and extinction in droplet arrays.
6. Validation of theoretical droplet-combustion models against comprehensive microgravity data.

## 3. Experimental Approach

**Procedure.** The chamber was charged with a chosen atmosphere, then left for roughly 2 minutes so gas temperature and pressure could settle. A pre-set quantity of fuel, matched to the target droplet size, was dispensed onto a support fiber (for tests where the droplet was not freely deployed). Once dispensing was complete, the needles were retracted and at least 10 seconds were allowed for fluid motion inside the droplet, caused by deployment, to die down. The ignitor was then powered for 1 to 5 seconds (selectable) and withdrawn from the field of view. When a forced flow was wanted, the droplet was translated at the moment the ignitor retracted.

**Conditions stated in the approach text.** Chamber pressure ranged from 0.5 to 3.0 atm; oxygen mole fraction ranged from 0.1 to 0.4, with a diluent making up the balance.

**Independent variables.** Fuel type; ambient gas composition; ambient pressure; initial droplet diameter; droplet translation velocity (and acceleration); and, for binary linear arrays, droplet spacing and initial size.

**Experimental table (only 5 of 9 entries were visible in the supplied page).** The visible entries are pure iso-octane, n-octane, heptane, decane, and ethanol. For these: initial droplet diameter 1.5 to 5 mm; O2/N2 or O2/He atmospheres; oxygen mole fractions of 0.17, 0.21, 0.25, and 0.30; pressures of 0.5, 1.0, 1.5, 2.0, or 3.0 atm; ambient temperature 25 °C; flow velocity 0.1 to 5 cm/s. The other four entries are not visible, so the full fuel list is incomplete here.

**Measurements.** A color camera supplied near-real-time video downlinks used to confirm deployment, ignition, and overall progress. Chamber pressure and temperature were also recorded in near real time. The workflow description mentions high-speed photography for tracking flame evolution. No further instrument specifications (resolution, frame rate, spectral channels) were supplied.

**Overall workflow in the source:** set test parameters (pressure, temperature, fuel mixture, humidity), fill the chamber, deploy droplets with controlled diameter, let them settle, ignite uniformly, monitor and image the burn, adjust conditions as needed, and analyze the data.

## 4. Research Hypothesis

The source does not state a formal, testable hypothesis, so what follows is the underlying motivation. Over the past decade or so, convective droplet-combustion simulations have grown sophisticated, notably by including the full Navier-Stokes equations for the gas flow. Even so, the treatment of chemistry, radiation, and gas-liquid coupling involves varying degrees of approximation, and the validity of those assumptions has not been confirmed against benchmark data. Removing buoyancy lets the droplet be characterized by thermocapillary or solutal-capillary stresses alone, which gives a cleaner view of the basic processes. Microgravity also permits study of transitions between radiative and diffusive extinction of the flame.

## 5. Findings and Scientific Contributions

**The supplied material contains no results.** The page describes objectives, procedure, conditions, and expected benefits, but reports no measured burning rates, extinction diameters, soot data, or model comparisons.

- *Experimentally observed findings:* none provided.
- *Computational findings:* none provided.
- *Interpretations:* none provided.
- *Publication list:* about 50 associated publications are listed by title (including work on cool-flame extinction of n-alkane droplets, radiative extinction of large n-alkane droplets, soot-free spherical flames, fiber effects, and surrogate fuels). Only titles were supplied, so their conclusions cannot be reported here without going beyond the source.
- *Intended contribution:* a benchmark dataset for bi-component droplet combustion and for validating numerical models and theory.

## 6. Fire Safety Relevance

The investigation is framed under Spacecraft Fire Safety, and its most direct link is through extinction: understanding what makes a flame go out, and what range of oxygen, pressure, diluent, and flow conditions allow it to persist, bears on suppression and on flammability assessment. Studying the radiative-versus-diffusive extinction transition and how droplet interactions shift flammability limits are both relevant to ignition and extinction behavior. The oxygen and pressure ranges tested (down to 0.5 atm and 10% O2, up to 3 atm and 40% O2) overlap with the kinds of altered atmospheres considered for exploration habitats, though the source does not say this explicitly. Direct relevance to fire detection or material flammability is not claimed; the fuels are liquids.

## 7. Key Scientific Insights

- **Benchmarking is the main deliverable.** The central argument is that existing simulations rely on unverified approximations; this is a motivation, not a finding. Its value lies in giving modelers data to test chemistry, radiation, and coupling assumptions.
- **Microgravity isolates the physics.** Minimizing buoyancy lets surface-tension-driven (thermocapillary or solutal) effects be observed without buoyant convection masking them. This is a stated rationale for the design.
- **Extinction boundaries are a first-class target.** Extinction mechanisms and their limits are an explicit objective, not a by-product.
- **Soot and multi-droplet interactions are included.** Soot volume fraction, soot-shell dynamics, and droplet-array flammability limits widen the scope beyond isolated clean burning. Outcomes are not reported in the supplied text.

## 8. Applications in Space Exploration

The experiments ran on the ISS in CIR hardware, so they represent actual flight microgravity. Their relevance to future missions is as a source of validated extinction and flammability knowledge for liquid-fuel fires in low gravity, which could inform fire-safety analysis for spacecraft and habitats. The source does not describe any spacecraft design change or procedure that has resulted from this work, and none should be assumed. Lunar and Mars habitats are not mentioned in the supplied material; any link there would be an extrapolation.

## 9. Earth Benefits

The source highlights liquid fuels as the dominant energy source in transportation. Stated potential benefits are: more efficient and cleaner combustion technologies with lower pollution and greenhouse gas emissions; combustor designs with minimal carbon footprint and emissions; quantitative evaluation of future fuels through surrogates (mixtures of pure fuels that mimic real fuels); and validation of jet engine models by manufacturers, supported by prior droplet results. These are expected benefits, not demonstrated outcomes in the supplied text.

## 10. Limitations and Open Questions

- No results or quantitative findings were supplied.
- Four of nine experimental table entries were not visible, so the complete fuel, mixture, and condition matrix is unknown (including exact bi-component compositions).
- The approach text gives an oxygen range of 0.1 to 0.4, while the visible table rows span 0.17 to 0.30; which range applied to which tests is unclear.
- Instrument specifications are minimal (no camera resolution, frame rate, or temperature and pressure sensor details).
- No modeling table or read-me file is attached.
- Which fiber-supported versus free-deployed tests were run, and how many, is not stated.

## 11. Research Metadata

| Field | Value |
|---|---|
| Primary research focus | Droplet combustion and flame extinction |
| Combustion domain | Liquid-fuel droplet combustion (single droplets and binary arrays) |
| Fuel type / form | Liquid; droplets, pure and bi-component, fiber-supported or freely deployed |
| Gravity environment | Microgravity (ISS) |
| Main fire safety relevance | Extinction mechanisms, flammability limits, benchmark data for model validation |
| Evidence available | Objectives, procedure, test envelope, partial experimental table, publication titles; no results |
| Completeness of supplied information | Partial: strong on design, absent on outcomes |

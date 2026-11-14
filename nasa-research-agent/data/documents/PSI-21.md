# ACME CLD Flame: Fuel Dilution in Coflow Laminar Diffusion Flames Aboard the ISS

PSI-21 is a long-running ISS combustion investigation that burned nitrogen-diluted methane and ethylene as gentle, laminar jet flames in a coflowing oxidizer stream, with buoyancy largely removed. Its main purpose was to produce clean benchmark measurements at the two ends of the dilution range: weak, near-extinction flames and heavily sooting, fuel-rich flames. These data were meant for testing detailed flame models, not just for describing the flames.

## 1. Project Overview

| Field | Value |
|---|---|
| PSI ID | PSI-21 (Version 4, updated 22-Jan-2025) |
| Research name | ACME CLD Flame |
| Full name | Advanced Combustion via Microgravity Experiments / Coflow Laminar Diffusion Flame |
| Proposal title | Fuel Dilution Studies of Coflow Laminar Diffusion Flames in a Microgravity Environment |
| Category | suppression  |
| Investigation period | 2006-10-01 to 2022-05-31 |
| Sponsoring agency | NASA |
| NASA center | Glenn Research Center (GRC) |
| Platform / hardware | International Space Station; Combustion Integrated Rack (CIR) with the ACME hardware |
| Contacts | Marshall B. Long, Mitchell Smooke, Dennis Stocker |
| DOI | 10.60555/23e1-9950 |
| Related investigations | None named in the supplied text (see Section 10) |

## 2. Research Objectives

Computational flame models are rarely tested at their limits. Two limits matter here: very dilute flames close to blow-off, and sooty flames with long residence times. The investigation had two stated aims.

- **Weak flames (methane and ethylene).** Characterize how flame shape, lift-off height, temperature and extinction limits change with coflow velocity and fuel dilution.
- **Sooting flames.** Characterize how soot formation changes with velocity and dilution, through flame shape, gas temperature in the soot-free part of the flame, soot luminosity, soot temperature and soot volume fraction.

The longer time and length scales in microgravity are what make both aims reachable in a single apparatus.

## 3. Experimental Approach

**Configuration.** Coflow laminar diffusion flames of methane and ethylene, run in the ACME hardware inside the CIR on the ISS. Fuel was diluted with nitrogen on a volume basis, and dilution was sometimes changed within a test.

**Measurements planned for each regime:**

- *Dilute flames:* chemiluminescence of OH* and CH* to track lift-off height and flame shape as extinction limits are approached.
- *Fuel-rich flames:* soot luminosity plus laser extinction to obtain soot temperatures and soot volume fractions.
- *Non-sooting regions:* flame temperature by thin-filament pyrometry.

**Variables.** Independent: fuel type, nitrogen dilution (fuel concentration), and flow velocity. Dependent: flame shape, lift-off height, temperature, extinction limits, soot luminosity, soot temperature and soot volume fraction.

**Experimental table (first 5 of 33 rows were visible).** All five are methane tests with fuel and N2 mass flow controllers rated at 0.1 slpm maximum (nitrogen basis):

| Test day | Fuel bottle | Fuel conc. range | Flames ignited |
|---|---|---|---|
| 17319 | 40% CH4 | 30%-40% | 10 |
| 17324 | 40% CH5 | 30%-40% | 5 |
| 17342 | 40% CH6 | 40% | 8 |
| 17356 | 40% CH7 | 30%-40% | 3 |
| 18003 | 40% CH8 | 25%-40% | 9 |

Test day encodes the year (first two digits) and day of year (last three). The bottle labels CH5 to CH8 are reproduced as supplied. The remaining 28 rows were not included.

**Modeling loop.** Where models and measurements disagree, the kinetics and soot sub-models are adjusted. If agreement is then good, the simulations can be examined for species that the available diagnostics cannot measure directly.

## 4. Research Hypothesis

The source gives no conventional, testable hypothesis. Instead, it states that the investigation was meant to collect benchmark data against which computational models can be validated, with the models described in four cited earlier papers (Smooke et al. 2004; Luque et al. 2000; Walsh et al. 2000; Walsh et al. 1998). The underlying motivation is that buoyancy complicates interpretation of both experiments and simulations in normal gravity, and that removing it gives a cleaner test of coupled transport and chemistry.

## 5. Findings and Scientific Contributions

**Supplied material contains no quantitative results.** The page lists objectives, approach and an experimental table, but no measured lift-off heights, temperatures, extinction limits or soot values.

- *Experimentally observed findings:* not included in the supplied material.
- *Computational findings:* not included.
- *Documented output:* a publication list of 17 entries (some duplicated) covering CH* and heat release rate, soot formation in normal and microgravity, fuel dilution, inlet velocity and gravity effects, pressure effects, color-ratio pyrometry, and diagnostic calibration. Only titles and DOIs were supplied, so their conclusions are not summarized here.
- *Potential applications:* see Sections 6 to 9.

## 6. Fire Safety Relevance

- **Extinction limits.** Measuring how dilution pushes flames toward extinction speaks directly to suppression, since the source states that extinction behavior in diffusion flames is important for fire suppression.
- **Flame behavior.** Lift-off height and flame shape near blow-off describe how a weak flame stabilizes or fails.
- **Soot and radiation.** Soot formation and radiative transfer influence flame heat loss and the hazards of sooting fires; the project aims to improve soot sub-models for this.
- **Modeling.** Validated models make fire behavior predictable without testing every condition.

The page does not address ignition, detection or material flammability, so no claims are made on those.

## 7. Key Scientific Insights

The following are design intentions and rationale from the source, not demonstrated results.

- **Buoyancy removal as a model test.** Without buoyancy, momentum-dominated conditions typical of real burners can be isolated, giving a cleaner view of convection, diffusion and chemistry interaction (stated rationale).
- **Two-ended validation.** Testing at both extremes of dilution stresses the models where they are most likely to fail.
- **Long residence times for soot.** Microgravity lengthens residence time, which helps study soot growth (stated rationale).
- **Model "mining."** Once a model matches measurements, it can estimate species concentrations that were not measured (a planned use, contingent on good agreement).

## 8. Applications in Space Exploration

The source does not discuss spacecraft fire safety explicitly. The connection is indirect: extinction-limit and flame-shape data from an actual microgravity environment can inform models used for fire behavior in ISS-type or future habitat atmospheres. Nothing in the supplied material states that such use has occurred.

## 9. Earth Benefits

The source states that diffusion flames are the flame type in most practical combustion devices. Its stated benefits are better modeling of turbulent reacting flows, better understanding of soot formation and radiative transfer, and insight into extinction relevant to fire suppression and engine efficiency.

## 10. Limitations and Open Questions

- No results or numerical data in the supplied material.
- Only 5 of 33 experimental-table rows were visible; ethylene test conditions were not shown.
- Oxidizer composition, pressure and coflow velocities are not given.
- The metadata file name refers to "PSI-97", but the relationship is unexplained, so no dependency is asserted.
- The extent of ground comparison (normal gravity) is not specified, although publication titles mention it.
- Mapping of the 17 listed publications to specific findings was not possible from titles alone.

## 11. Research Metadata

| Attribute | Value |
|---|---|
| Primary focus | Model validation data for diffusion flames across the fuel-dilution range |
| Combustion domain | Gaseous-fuel coflow laminar diffusion flames; lift-off, extinction, soot |
| Fuel | Methane and ethylene, nitrogen-diluted; gaseous |
| Gravity | Microgravity (ISS) |
| Fire safety relevance | Extinction limits, soot, flame modeling |
| Evidence available | Objectives, approach, partial experimental table, publication list |
| Completeness | Partial; no results, missing conditions |

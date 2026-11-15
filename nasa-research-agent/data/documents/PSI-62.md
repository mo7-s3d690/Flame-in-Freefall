# Concurrent Flame Spread Modeling using Flamelet Generated Manifolds in Microgravity with Comparison to BASS Experiments using Two-Color Tomography

Predicting whether a flame will creep along a solid material in orbit is harder than it sounds. The flame, the heated surface, and the surrounding gas flow all feed back on each other within a space of a few millimeters, and every one of those couplings has to be right. This project tried to tame that problem with a reduced-order technique called the unsteady flamelet generated manifold (UFGM), then tested it against images from NASA's Burning and Suppression of Solids (BASS) experiments.

## 1. Project Overview

| Field | Detail |
|---|---|
| PSI ID | PSI-62 (Version 1) |
| Research name | Concurrent Flame Spread Modeling using Flamelet Generated Manifolds in Microgravity with Comparison to BASS Experiments using Two-Color Tomography |
| Research category | prevention  |
| Research area | Combustion Science, sub-area Spacecraft Fire Safety |
| Investigation period | 05-01-2019 to 04-30-2021 |
| Project type | Ground investigation (computational, validated against archived flight imagery) |
| Sponsoring agency | NASA, PSI grant |
| NASA center | Glenn Research Center (GRC) |
| Submitted / initial release | 30-Apr-2021 / 14-Nov-2025 |
| Related investigations | PSI-25, PSI-26 |
| DOI | 10.60555/e9xp-ex83 |
| License | CC0-1.0 |
| Contacts | Paul DesJardin, David Urban |

## 2. Research Objectives

The goal was to develop and validate new flamelet generated manifold (FGM) modeling techniques for concurrent flame spread in microgravity, meaning flame spreading in the same direction as the oxidizer flow. The source calls this one of the toughest modeling problems in combustion science because heat transfer, mass transport, and chemical kinetics are tightly coupled at the solid-vapor interface. It notes that earlier strategies often mixed turbulence and chemistry models that were not fully consistent and missed important intermediate reaction pathways.

To address this, the grant pushed the UFGM framework, which simplifies reacting systems by mapping them onto lower-dimensional manifolds. The model was to simulate solid fuel burning at high fidelity, with the BASS and BASS-II experiments as benchmarks. The longer-term hope was accurate prediction of flammability limits for spacecraft materials, and a tool usable as a subgrid-scale model in large-eddy simulations of fires.

## 3. Experimental Approach

This was a computational study with validation against existing experimental images, so no new experiments were run. A previously developed framework was used for fully coupled fluid-solid simulations, concentrating on materials that char and ablate. The UFGM method was implemented in it and tested on several BASS geometries: flat sheets, spheres, rods of polymethyl methacrylate (PMMA), and wax cylinders.

Images from BASS and BASS-II already stored in PSI were post-processed with newly developed two-color tomography using DSLR cameras. This gave 3D reconstructions of soot and temperature fields to compare with model predictions. Evaluation metrics were flame geometry, temperature distribution, soot volume fraction, and flame spread rate, with particular attention to reproducing the "Goldilocks" flammability zone reported by Olson and Ferkul. Results were also compared with a parallel NSF-supported terrestrial flame spread project, so the model could be assessed in both microgravity and normal gravity.

Grid sizes, chemical mechanisms, and numerical settings are not given in the supplied text.

## 4. Research Hypothesis

The UFGM approach was expected to reproduce concurrent flame spread in microgravity accurately, including the Goldilocks flammability zone, by linking near-wall thermal, mass transport, and chemical processes with far-field flow dynamics.

## 5. Findings and Scientific Contributions

**Experimentally observed findings.** None are reported in the supplied material, and no new experiments were part of the work. The BASS imagery being compared against is existing data.

**Computational findings.** The supplied text states objectives and methods but gives no quantitative or qualitative outcome of the simulations. It does not say whether the model reproduced the Goldilocks zone or how closely it matched measured flame spread rates.

**Scientific interpretation.** The publication list includes two 2023 papers on radiative flamelet generated manifolds and on theoretical flammability bounds for thin condensed fuels, plus a two-color pyrometry diagnostic paper. They indicate where the work was published, but their conclusions are not part of the supplied text.

**Potential applications.** The source expects predictive tools for screening material flammability limits and subgrid models for large-eddy simulation. These are stated expectations.

## 6. Fire Safety Relevance

The project is about material flammability and flame spread. A model that can predict flammability limits would let designers screen candidate spacecraft materials before testing them, which is why this profile is classed under prevention. Flame behavior is addressed through the coupled thermal, chemical, and flow processes near the burning surface, and the emphasis on soot volume fraction and temperature fields ties into radiation from the flame.

Oxygen concentration and environmental conditions are implied by the flammability limit framing but are not detailed. Detection and suppression are not discussed, although the BASS name refers to suppression.

## 7. Key Scientific Insights

**Reduced-order models may preserve key physics.** Mapping the reacting system onto lower-dimensional manifolds is intended to keep intermediate reaction pathways that hybrid models miss. Whether it succeeded is not stated in the supplied text.

**Validation now includes 3D soot and temperature fields.** The two-color tomography method turns ordinary camera images into reconstructed fields, which allows much more direct comparison than flame length or spread rate alone. This is a methodological contribution described by the source.

**The Goldilocks zone is the test case.** A flammability regime that exists only at intermediate conditions is a demanding target, and reproducing it would be a strong check on the model.

**Shape matters.** Testing on sheets, spheres, rods, and cylinders probes whether the approach holds beyond a single geometry.

## 8. Applications in Space Exploration

The source ties the work to designing safer spacecraft, hazard assessment for long-duration missions, and fire risk management in confined habitats. The benchmark data come from BASS experiments, which were flown, but the model itself has not been reported as implemented in any spacecraft program. Lunar and Mars habitats are not named.

## 9. Earth Benefits

The source says the methods could improve combustion modeling by deepening understanding of coupled thermal, chemical, and flow processes, support better fire safety standards, enable more effective prevention and mitigation strategies, and encourage new diagnostics and simulation techniques across combustion scenarios. No specific industries are listed.

## 10. Limitations and Open Questions

No results are included, so the hypothesis cannot be assessed. Numerical details, materials beyond PMMA and wax, and quantitative validation metrics are missing. The experimental table, modeling table, and hardware fields are empty. The long-term goals of predicting flammability limits for spacecraft materials and serving as a large-eddy simulation subgrid model are stated as aims, and the supplied text does not show whether they were reached. The listed publications fall partly after the investigation end date, so some work may extend beyond the grant period.

## 11. Research Metadata

| Item | Detail |
|---|---|
| Primary research focus | Modeling concurrent flame spread over solids in microgravity with UFGM, validated with two-color tomography |
| Combustion domain | Solid fuel flame spread, including charring and ablating materials |
| Fuel type and form | PMMA (sheets, spheres, rods) and wax cylinders |
| Gravity environment | Microgravity (benchmark data from BASS and BASS-II), with comparison to normal gravity |
| Main fire safety relevance | Material flammability limits and flame spread prediction |
| Evidence available | Objectives, approach, hypothesis, expected impacts, publication list |
| Completeness of supplied information | Limited: no results, no tables, no hardware or numerical specifications |

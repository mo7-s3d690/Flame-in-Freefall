# BASS-II: How Solid Materials Burn When Gravity Is Taken Out of the Equation

BASS-II (Burning and Suppression of Solids – II) put small samples of solid fuel in a miniature wind tunnel inside the Microgravity Science Glovebox on the International Space Station and set them alight. With buoyancy removed, flames are no longer pulled into the familiar upward teardrop; they sit as rounded, near-spherical forms controlled by the imposed airflow and oxygen supply. That simplification is what makes the data valuable: it gives modelers a clean test case for combustion codes and tests whether Earth-based flammability screening is truly conservative for spacecraft.

## 1. Project Overview

| Item | Detail |
|---|---|
| PSI ID | PSI-25 (Version 4) |
| Research name | BASS-II |
| Full name | Burning and Suppression of Solids – II |
| Research area | Combustion Science / Spacecraft Fire Safety |
| Project type | Microgravity investigation |
| Investigation period | 2010-01-01 to 2022-12-31 |
| Sponsor | NASA |
| NASA center | Glenn Research Center (GRC) |
| Platform | International Space Station, Microgravity Science Glovebox (MSG) |
| Related investigation | PSI-26 |
| Principal investigators / contacts | Paul Ferkul, Carlos Fernandez-Pello, Fletcher J. Miller, James T'ien, Subrata Bhattacharjee |
| License / DOI | CC0-1.0 / 10.60555/4qc4-de67 |

## 2. Research Objectives

The team set out to:

1. Characterize ignition, flame growth, flame spread and extinction limits of solid fuels burning in low-velocity forced flow in microgravity.
2. Connect three things that have so far been separate: the normal-gravity NASA-STD-6001 Test #1 method, ground-based microgravity tests (e.g., drop towers), and real material flammability in orbit.
3. Give the SoFIE principal investigators preliminary data to refine their science requirements.
4. Examine thicker, more realistic fuels in practical geometries — slabs, cylinders and spherical sections — rather than only thin laboratory samples.

The results feed the computational combustion models used to design fire detection and suppression systems, for space and for Earth.

## 3. Experimental Approach

- **Setup:** Fuel samples were mounted in a small wind tunnel installed in the MSG, which supplied power, imaging and a level of containment. Astronaut crew acted as real-time "lab partners."
- **Flow:** Airflow up to 40 cm/s, with both opposed-flow and concurrent-flow configurations.
- **Oxygen:** Ambient O2 varied below 21% by diluting the working volume with nitrogen.
- **Sample geometry:** Rods, spherical sections, slabs, films and fabric sheets.
- **Primary variables:** Flow speed and direction, oxygen concentration, sample geometry.
- **Recorded quantities (experimental table, 130 tests):** fuel sample material, flow restrictor, fan and air display settings, radiometer gain (1000/250/50/10), total frames shot, calibrated initial and final O2 (% by volume), initial and final CO2 (% by volume), and initial and final CO (ppm). Flame appearance, growth and spread rates were derived from imaging.
- **Illustrative entries:** The first tests (B1–B5, 19 Feb 2014, Bhattacharjee) used PMMA film samples 2 cm wide at 100, 200 and 300 µm thickness, with initial O2 of 22.2% by volume.
- **Additional sensors:** The publication list refers to on-board CSA-CP and CDM sensor readings, indicating combustion-product monitoring during the tests.

## 4. Research Hypothesis

The investigation tests whether materials in microgravity, given adequate ventilation, burn as well as — or better than — the same material in normal gravity at identical pressure, O2 concentration and temperature. The motivation: NASA qualifies materials with an upward-burning test in normal gravity, regarded as the worst-case geometry on Earth, but that may not be conservative in space. Running at constant O2 mole fractions allows flame spread and extinction to be studied at both low and high flow speed, aiming at the fundamental flammability limit of each material.

## 5. Findings and Scientific Contributions

The supplied material does not state quantitative conclusions from the 130 tests, so none are asserted here.

- **Experimentally recorded (from the supplied table excerpt):** Only five rows are visible. They show initial O2 of 22.2% and small changes in CO2 and CO between start and end of burn (e.g., CO rising from 0 to 6 ppm in B1). One row (B2) lists a final O2 of 1.6%, which looks anomalous and is not interpreted here.
- **Publication topics (titles only, outcomes not supplied):** radiative extinction and the critical flow velocity in opposed-flow spread; thermal, radiative and kinetic regimes of flame spread; PMMA rod flammability boundaries in axial stagnation and concurrent flow; concurrent flame growth and quenching on composite fabric; modeling of intermediate-thickness PMMA sheets; narrow-channel apparatus as a ground analogue of microgravity; and correlation of normal-gravity mixed-convection blowoff with microgravity forced-flow blowoff.
- **Interpretation:** The breadth of materials, geometries and flow regimes suggests the dataset is intended for validating models across flame-spread regimes, but the specific findings should be read from the cited papers.

## 6. Fire Safety Relevance

- **Flammability testing:** Directly questions whether the NASA-STD-6001 Test #1 is a conservative screen for spacecraft materials.
- **Ignition and extinction limits:** Mapping how O2 and flow speed set extinction boundaries bears on material selection and on suppression strategy (e.g., lowering O2 or flow).
- **Flame behavior:** Without buoyancy, flames are simpler and more easily compared with computed solutions.
- **Detection:** CO and CO2 records and sensor readings during burns relate to combustion-product detection.
- **Modeling:** Data support validation of computational combustion models used for detection and suppression design.

## 7. Key Scientific Insights

- **Gravity may not make a material safer.** The central premise is that microgravity burning can equal or exceed normal-gravity burning with adequate ventilation (a hypothesis under test, not a stated result).
- **Flow speed and O2 are the controlling knobs.** Both direction (opposed/concurrent) and magnitude of flow are varied systematically, allowing regime mapping.
- **Thickness and geometry matter.** Including thick slabs, rods and spherical sections moves beyond thin-fuel idealizations toward realistic hardware.
- **Ground-to-space bridging.** Comparing against normal-gravity and narrow-channel analogues aims to calibrate cheaper ground methods against orbital truth.

## 8. Applications in Space Exploration

The data aim to help engineers choose safer materials and refine firefighting approaches for ISS-class spacecraft and, by extension, future crewed vehicles and habitats where ventilation is low and escape options are limited. Data from BASS-II were intended as preliminary input for SoFIE. The supplied material does not claim any of this has been implemented in design standards.

## 9. Earth Benefits

Validated combustion models can be reused for terrestrial problems the source names: wildfires, building fires, energy recapture from waste recycling and other combustion problems.

## 10. Limitations and Open Questions

- Only 5 of 130 experimental table rows and no modeling table or Read Me were supplied.
- No quantitative results, flame-spread rates or extinction limits are given in the supplied text.
- Pressure is not stated; the lowest O2 level tested is not stated.
- The B2 final O2 value (1.6%) and several blank cells need checking against the full dataset.
- Gaps between hypothesis and conclusions must be resolved from the publications and the 694 added data files.

## 11. Research Metadata

- **Primary focus:** Flame spread, ignition and extinction of solid fuels in microgravity
- **Combustion domain:** Solid-fuel (PMMA, cellulose, composite fabric) flame spread, opposed and concurrent flow
- **Fuel form:** Films, fabric sheets, rods, slabs, spherical sections
- **Gravity environment:** Microgravity (ISS)
- **Main fire safety relevance:** Material flammability screening, extinction limits, detection and suppression modeling
- **Evidence available:** Experimental table (130 tests), video/engineering files, 15+ publications
- **Completeness of supplied information:** Moderate for design and method; low for results

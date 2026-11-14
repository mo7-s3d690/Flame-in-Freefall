# Flame Extinguishment Experiment (FLEX)

Burning a droplet of fuel in the absence of gravity sounds deceptively simple, yet it opens a window onto combustion physics that Earth-bound experiments cannot fully access. The FLEX investigation exploited the microgravity environment aboard the International Space Station to study how liquid fuel droplets ignite, burn, and go out when buoyant convection — the gentle stirring that hot combustion gases normally experience on Earth — is effectively removed. Without that stirring, flames adopt near-perfect spherical symmetry, making it possible to isolate the chemical and physical factors that govern flammability in a way no ground laboratory can replicate.

---

## 1. Project Overview

| Field | Details |
|---|---|
| **PSI ID** | PSI-69 |
| **Short Name** | FLEX |
| **Full Investigation Name** | Flame Extinguishment Experiment |
| **Research Category** | suppression  |
| **Research Area** | Combustion Science — Spacecraft Fire Safety |
| **Investigation Period** | 01 August 2007 – 31 July 2016 |
| **Sponsoring Agency** | National Aeronautics and Space Administration (NASA) |
| **NASA Center** | Glenn Research Center (GRC) |
| **Flight Platform** | International Space Station (ISS) |
| **Experimental Hardware** | Combustion Integrated Rack (CIR) – Fluids and Combustion Facility (FCF); Multi-user Droplet Combustion Apparatus (MDCA) |
| **DOI** | 10.60555/mbq8-0451 |
| **License** | CC0-1.0 |

The investigation ran for nearly a decade, combining extensive ISS experiments with parallel ground-based studies and computational modelling to build a comprehensive picture of microgravity droplet combustion.

---

## 2. Research Objectives

The central motivation behind FLEX was to map the **Limiting Oxygen Index (LOI)** — the minimum ambient oxygen concentration at which a liquid fuel droplet can sustain combustion — across a range of ambient pressures in microgravity. On Earth, buoyancy continuously refreshes the oxygen supply around a flame and carries away heat; in orbit, neither process operates in the same way, and the flammability boundaries shift in ways that existing models had not been validated against.

Specifically, the investigation sought to:

- Determine how the LOI changes as a function of ambient pressure (0.5–1.5 atm) in microgravity.
- Quantify how gaseous fire suppressants — carbon dioxide (CO₂), helium (He), and sulfur hexafluoride (SF₆) — affect the LOI and the overall extinction behaviour of burning droplets.
- Obtain high-fidelity measurements of droplet burning rates, flame extinction diameters, radiant heat output, soot concentration, and temperature profiles under systematically varied ambient conditions.
- Validate and refine simplified combustion models by comparing their predictions against flight data, with the longer-term goal of embedding detailed chemical kinetics and heat-transfer physics into those models.
- Investigate the role of small, sub-buoyant convective flows on burning and extinction behaviour, bridging the pure-microgravity case and the low-flow conditions that may arise in real spacecraft.

---

## 3. Experimental Approach

### Droplet Generation and Combustion Hardware

Experiments were conducted aboard the ISS using the Multi-user Droplet Combustion Apparatus installed inside the Combustion Integrated Rack. The apparatus could produce and ignite both **fiber-supported droplets** (held in place by a thin tethering fiber) and **free-floating droplets** that drift slowly through the combustion chamber, the latter being the physically cleaner configuration for studying spherically symmetric burning.

### Determination of the Limiting Oxygen Index

The core experimental procedure for constructing the LOI diagram followed a structured iterative approach:

1. Set the test chamber pressure within the 0.5–1.5 atm range.
2. Start with a relatively small droplet (~3 mm initial diameter).
3. Select an initial ambient oxygen mole fraction expected, based on ground tests, to allow complete burn-out.
4. Ignite the droplet and observe the outcome.
5. If finite-diameter extinction is seen (the flame dies before the droplet is fully consumed), increase the droplet size and repeat.
6. Continue increasing droplet size until radiative extinction occurs very shortly after ignition, marking the onset of marginal combustion.
7. Progressively lower the oxygen mole fraction and repeat the sequence until ignition fails entirely.
8. When extinction events produced droplets too small to observe with available diagnostics, the LOI was bracketed by an iterative pair of tests (burn-to-completion vs. no-ignition) with successively finer oxygen increments.

### Slow-Flow Experiments

For tests examining the effect of weak convection, the flight hardware geometry precluded full diagnostic coverage of a droplet moving through a steady uniform flow. Instead, near the end of a burn — close to the extinction point — the droplet was translated at a slow, sub-buoyant speed, introducing a small convective perturbation. The response of the flame and extinction process to this perturbation was then recorded.

### Fuels and Ambient Conditions

The experimental table covers **275 documented tests** spanning a range of fuels and conditions. The portion of the dataset visible in the PSI record includes methanol as the fuel at ambient pressures near 760 mmHg and standard oxygen/nitrogen atmospheres, with initial droplet diameters roughly between 1.6 and 2.1 mm. Burn times and extinction diameters were recorded for each test, along with the observed test-end category (extinction, burn-to-completion, disruption, etc.).

### Measurements and Diagnostics

Recorded quantities included:
- Visible flame extinction diameter (mm)
- Burning rate constant (mm²/s, implicitly from diameter-squared regression)
- Burn time (s)
- Ambient pressure (mmHg)
- Initial oxygen, nitrogen, CO₂, and He mole fractions
- Initial droplet diameter (mm)
- Test outcome classification

Companion publications document the use of backlit droplet imaging, laser-induced fluorescence, fiber-optic spectroscopy, and infrared diagnostics for temperature and composition measurements during related ground and flight experiments.

---

## 4. Research Hypothesis

The FLEX team hypothesised that **removing buoyant convection fundamentally alters both the flammability limits and the suppression efficacy of fire extinguishing agents** for liquid fuel droplets. On Earth, buoyancy-driven flows continuously mix reactants and carry combustion products away from the flame zone, maintaining conditions that favor sustained burning. In microgravity, those flows are absent, and the flame must rely entirely on diffusive transport of oxygen inward and of combustion products outward.

Under these conditions, radiative heat loss — which scales with flame volume — was expected to become the dominant extinction mechanism at low oxygen concentrations, producing a regime of **radiative extinction** not easily accessible in ground experiments. Additionally, the team expected that suppressants acting primarily through thermal dilution (such as CO₂ and He) or through chemical inhibition (SF₆) would display different suppression efficiencies in microgravity compared with normal gravity, because the balance between heat release and heat loss changes when convection is absent. These expectations drove both the design of the LOI mapping procedure and the selection of suppressant gases for systematic testing.

---

## 5. Findings and Scientific Contributions

> **Note:** The PSI record supplied for this analysis does not include a results summary or compiled dataset outputs. The 275-test experimental table is partially displayed, and results are distributed across the associated publications. The findings described here are drawn from information within those cited publications, as listed in the PSI record. Numerical values refer to conditions or measurements documented in source publications rather than to independently verified extracted results.

### Experimentally Observed Phenomena

A particularly notable discovery emerging from the FLEX experiments was the observation of **"cool flames"** in isolated n-heptane droplets. After the visible hot flame extinguished, combustion continued through low-temperature oxidation chemistry, producing a faint, cooler secondary flame that sustained quasi-steady burning of the droplet below the threshold conditions for conventional hot-flame combustion. This two-stage combustion behavior — hot-flame ignition followed by cool-flame quasi-steady burning — had not been directly observed in isolated droplet experiments before FLEX.

For methanol, the experiments documented burning behavior in oxygen-inert environments and in mixtures containing CO₂ as a combined diluent and suppressant. Water absorption during methanol droplet combustion was identified as a process that dynamically altered the droplet composition during the burn.

### Computational and Modelling Contributions

Parallel numerical studies investigated the role of support fibers on droplet evaporation and micro-convection in the flame zone, quantifying artifacts introduced by fiber tethering. These computational analyses supported more accurate interpretation of fiber-supported flight data. Detailed kinetic mechanisms were also developed and tested against FLEX data, including reduced mechanisms for low-temperature n-heptane ignition at high pressures and cool-flame-supporting chemistry.

### Scientific Interpretations

The collective body of FLEX research supports the conclusion that microgravity combustion is not simply a slowed-down or enlarged version of normal-gravity combustion, but represents a qualitatively different physical regime — particularly at near-limit conditions where radiative losses, cool-flame chemistry, and diffusive transport interact in ways that existing simplified models did not adequately capture.

---

## 6. Fire Safety Relevance

**Category: suppression**

FLEX is directly relevant to fire suppression and to the fundamental characterisation of flammability limits, both of which are prerequisites for designing safe spacecraft atmospheres and effective fire suppression systems.

- **Suppressant effectiveness in altered environments:** The comparative testing of CO₂, He, and SF₆ as suppressants under reduced gravity provides data that cannot be obtained from standard ground-based suppression tests, where buoyancy masks differences in suppressant performance.
- **Flammability boundary mapping:** The LOI as a function of pressure and suppressant concentration provides the quantitative boundaries needed to define safe oxygen levels and fire-suppression agent concentrations for pressurised spacecraft and habitat atmospheres.
- **Extinction mechanisms:** Understanding radiative versus convective extinction pathways is essential for predicting whether a given suppressant concentration will be sufficient to extinguish a fire in a low-gravity environment, or whether the fire may persist through cool-flame chemistry at conditions nominally below the hot-flame extinction limit.
- **Fire modeling:** The validated chemical kinetic mechanisms and heat-transfer models derived from FLEX provide the physics foundation for computational fire safety tools applicable to spacecraft design.

---

## 7. Key Scientific Insights

### Cool Flames Are Physically Real and Self-Sustaining
The existence of a stable cool-flame regime for n-heptane droplets in microgravity — after hot-flame extinction — demonstrates that low-temperature oxidation pathways can sustain combustion in a regime that would not be identified as "fire" by most conventional detection methods. This is not merely a theoretical curiosity; it represents a real gap in fire detection and suppression protocols.

### Radiative Extinction Dominates Near the Flammability Limit
In the absence of convection, the primary extinction mechanism for near-limit droplet flames is radiative heat loss. This contrasts with normal gravity, where convective heat loss and reactant dilution interact to produce extinction. The result is that microgravity LOI values and extinction droplet sizes differ meaningfully from normal-gravity equivalents, and cannot be reliably extrapolated from ground data alone.

### Suppressant Performance Is Gravity-Dependent
CO₂, He, and SF₆ each have different mechanisms of action — thermal dilution, reduced flame temperature through high heat capacity, and chemical inhibition respectively. FLEX data supports the view that the relative effectiveness of these mechanisms changes in microgravity because the dominant heat loss pathway changes, making gravity-dependent testing essential for accurate suppression system design.

### Fiber Tethering Introduces Measurable Artifacts
Computational studies conducted alongside FLEX showed that the tethering fibers used to hold free droplets in position introduce non-negligible micro-convection and modify evaporation rates. Quantifying these artifacts allows more accurate interpretation of fiber-supported experiments on the ISS and in ground drop towers.

### Cool-Flame Chemistry Is Relevant to Alkane Fuel Extinction
Both numerical and experimental results indicate that cool-flame chemistry plays a role not just in ignition but in the late-stage extinction behaviour of n-alkane droplets. This insight has implications for the design of chemical kinetic models used in combustion simulation.

---

## 8. Applications in Space Exploration

### Spacecraft Fire Suppression System Design
The FLEX LOI mapping data provides the empirical foundation for determining what suppressant concentrations are necessary to prevent or extinguish liquid fuel fires in reduced-gravity environments. For spacecraft with ethanol, methanol, or hydrocarbon-based fuels or coolants, knowing the pressure- and atmosphere-dependent flammability limits is a prerequisite for certifying fire suppression system adequacy.

### Habitat Atmosphere Management
Future long-duration habitats — lunar outposts, Mars surface bases, or deep-space transit vehicles — will operate at potentially non-standard atmospheric pressures and oxygen concentrations to reduce structural mass or improve suit interface compatibility. FLEX data directly informs how those atmosphere choices affect fire risk, particularly at the low-oxygen, reduced-pressure end of the design space.

### Cool-Flame Detection Gap
The discovery that cool flames can sustain combustion below hot-flame extinction limits in microgravity suggests that spacecraft fire detection systems tuned to detect hot flames may miss slow-burning cool-flame events. This is a specific, actionable concern for future spacecraft fire detection architecture.

### Validation of Spacecraft Fire Simulation Tools
The extensive experimental dataset from FLEX — 275 tests with well-documented conditions — provides a benchmark for validating computational fire models intended for spacecraft design. Models that can reproduce FLEX results with appropriate fidelity can be more confidently applied to design scenarios not tested in flight.

---

## 9. Earth Benefits

### Advanced Engine Combustion Design
The cool-flame chemistry elucidated through FLEX experiments is directly relevant to low-temperature combustion strategies in advanced automotive engines, particularly Homogeneous Charge Compression Ignition (HCCI) and other partially premixed combustion concepts, where fuel autoignition through cool-flame pathways is a key design consideration.

### Improved Fire Suppressant Formulations
Quantitative data on suppressant performance at the flammability limit — particularly the differential effectiveness of CO₂, He, and SF₆ — can inform the design of fire suppression systems for confined environments with limited ventilation, such as submarines, aircraft cargo holds, and enclosed industrial facilities, where suppression agent concentration management matters for both effectiveness and occupant safety.

### Fuel Surrogate Development for Industrial Combustion
The droplet combustion data for n-heptane, n-octane, n-decane, methanol, n-butanol, Jet-A, and biofuels (camelina, tallow) in well-controlled spherically symmetric conditions provides reference data for validating surrogate fuel models used in industrial burner and gas turbine design. The absence of convective asymmetry makes the data especially clean for this purpose.

### Combustion Model Validation
The reduced kinetic mechanisms and detailed heat-transfer models validated against FLEX data are applicable to Earth-based combustion modelling in scenarios where diffusive transport dominates, such as small-scale combustors, droplet spray systems, and candle-like combustion in enclosed spaces.

---

## 10. Limitations and Open Questions

- **No compiled results summary is included in the PSI record.** The experimental table shows 5 of 275 tests; the full dataset and derived LOI diagrams are distributed across external publications rather than consolidated in the PSI entry itself.
- **LOI diagrams are not directly available** from the PSI metadata provided, so the quantitative flammability boundaries as a function of pressure and suppressant concentration cannot be reported here without accessing the individual publications.
- **Free-droplet diagnostics:** Several free-droplet tests involved droplets with slow drift velocities. The influence of this drift on measured burning rates and extinction diameters introduces uncertainty not fully characterized in the publicly available dataset summary.
- **SF₆ suppression data:** While SF₆ is listed as a tested suppressant agent, the partial experimental table provided shows only oxygen/nitrogen atmospheres and CO₂/He conditions. The completeness of SF₆ testing in the full 275-test record is not visible from the supplied material.
- **Cool-flame regime boundaries:** The conditions under which cool flames form, persist, and extinguish — and how these boundaries depend on pressure, droplet size, and fuel type — remain an area of ongoing investigation. FLEX provided initial observations, but the question of whether cool flames can grow to pose a practical fire hazard in a spacecraft environment has not been definitively resolved.
- **Scale-up to real fuel spills:** Droplet combustion experiments use isolated millimeter-scale droplets under controlled atmospheric conditions. How the LOI and suppressant efficacy translate to spill fires, pool fires, or mist fires in real spacecraft geometries is not directly addressed by the FLEX dataset.

---

## 11. Research Metadata

| Attribute | Value |
|---|---|
| **Primary Research Focus** | Microgravity droplet combustion; flammability limit mapping; suppressant efficacy |
| **Fire Safety Category** | suppression  |
| **Combustion Domain** | Liquid fuel droplet combustion; diffusion flames; near-limit and cool-flame combustion |
| **Fuel Types** | Methanol, n-heptane, n-octane, n-decane, n-butanol, ethanol, propanol, Jet-A, biofuels (camelina, tallow), multi-component surrogates |
| **Fuel Form** | Liquid droplets (fiber-supported and free-floating) |
| **Gravity Environment** | Microgravity (ISS flight experiments); normal gravity (ground-based companion tests) |
| **Suppressants Tested** | CO₂, He, SF₆ |
| **Pressure Range** | 0.5 – 1.5 atm |
| **Main Fire Safety Relevance** | Limiting Oxygen Index; suppression agent effectiveness; extinction mechanisms; cool-flame detection gap |
| **Number of Flight Tests** | 275 |
| **Publications Cited** | 46 |
| **Evidence Available** | Partial experimental table (5 of 275 entries visible); full results in associated publications |
| **Information Completeness** | Partial — PSI metadata and objectives are complete; compiled quantitative results not included in the PSI record |
| **Investigation Duration** | ~9 years (2007–2016) |

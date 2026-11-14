# Dust and Aerosol Measurement Feasibility Test (DAFT / DAFT-2)

Before you can fight a fire in space, you have to know one is happening. That seemingly obvious requirement runs into a surprisingly subtle problem: the instruments designed to detect smoke particles on Earth depend on gravity in ways that are rarely documented in their user manuals. The DAFT and DAFT-2 investigations confronted this problem head-on — not by developing an entirely new sensor, but by figuring out whether an off-the-shelf commercial particle counter could be modified to work reliably aboard the ISS. It is a quieter kind of space research than combustion experiments, but its implications are direct: without validated aerosol measurement in microgravity, there is no trustworthy smoke detection, and without smoke detection, every fire safety protocol downstream becomes uncertain.

---

## 1. Project Overview

| Field | Details |
|---|---|
| **PSI ID** | PSI-47 |
| **Short Name** | DAFT / DAFT-2 |
| **Full Investigation Name** | Dust and Aerosol Measurement Feasibility Test / Dust and Aerosol Measurement Feasibility Test-2 |
| **Research Category** | detection  |
| **Research Area** | Combustion Science — Spacecraft Fire Safety |
| **Investigation Period** | 01 March 2003 – 01 June 2009 |
| **Sponsoring Agency** | National Aeronautics and Space Administration (NASA) |
| **NASA Center** | Glenn Research Center (GRC) |
| **Flight Platform** | International Space Station (ISS) |
| **Experimental Hardware** | TSI P-Trak (modified for microgravity) |
| **Related Investigation** | PSI-102 (Smoke Aerosol Measurement Experiment — SAME) |
| **DOI** | 10.60555/ztgj-d202 |
| **License** | CC0-1.0 |

DAFT and DAFT-2 were conceived specifically as risk-mitigation precursors to the SAME investigation (PSI-102), which required a functioning condensation nuclei counter in microgravity. The two DAFT sessions established whether that requirement could be satisfied with a modified commercial instrument before SAME was committed to flight.

---

## 2. Research Objectives

The immediate driver for DAFT was a practical concern about an instrument that SAME depended upon. SAME needed to quantify smoke aerosols aboard the ISS, and the most accessible tool for that measurement was the **TSI P-Trak** — a commercially available condensation nuclei counter (CNC) widely used in occupational hygiene and air quality monitoring on the ground. The P-Trak works by condensing isopropyl alcohol vapor onto aerosol particles, growing them into droplets large enough to be counted by a laser detector. The recycling of that isopropyl alcohol within the instrument relies on gravity to drain liquid back through the system. In microgravity, that drainage mechanism fails, raising the possibility that the instrument would clog, generate false readings, or stop functioning altogether before it could measure anything useful.

DAFT was designed to answer four specific questions:

1. Can a modified version of the TSI P-Trak, redesigned to function without gravitational liquid drainage, operate correctly in microgravity?
2. How does its performance compare against the **DustTrak** — a condensation nuclei counter independently designed and validated for microgravity use — when both measure the same aerosol sample?
3. Can aerosol reference standards be reliably created and maintained in microgravity using the chosen materials and containment approach?
4. Do the results provide sufficient confidence to proceed with the SAME investigation, which would use the modified P-Trak for actual smoke characterization experiments?

---

## 3. Experimental Approach

### Instrument Modification

The core engineering challenge was adapting the P-Trak for a gravity-free environment. Two specific modifications were made:

- The **condenser tube was redesigned** to exploit capillary forces rather than gravity for recycling isopropyl alcohol back through the measurement system. Capillary action — the tendency of liquids to move through narrow channels driven by surface tension — does not require gravity and operates reliably in microgravity when channel geometry is appropriately designed.
- The **mercury switch** normally used to detect instrument orientation (and trigger gravity-dependent safety behaviors) was removed, as it was unnecessary and potentially problematic in microgravity where the instrument has no preferred orientation.

### Aerosol Generation

**Arizona Red Dust (ARD Fine)** was selected as the aerosol test standard. ARD is a well-characterized mineral dust with a defined particle size distribution, commonly used as a reference material in filter and instrument testing. Its selection was driven by predictable dispersal behavior and established characterization data, making it suitable as a benchmark for comparing instrument performance.

The ARD was aerosolized using **gaseous nitrogen (GN₂)** from the ISS supply, dispersed into **15-liter Mylar bags** that served as sealed aerosol containment volumes. This approach kept the test particles enclosed within a defined volume, preventing contamination of the station atmosphere while providing a stable aerosol cloud for measurement.

### On-Orbit Test Sessions

The experimental record covers **three test sessions** across two days:

- **Session D1 (GMT Day 54, 2005):** Operated the modified P-Trak (with alcohol wick and batteries) measuring ARD aerosol in GN₂. Sampling location: air near Express Rack 4.
- **Session D2 (GMT Day 63, 2005):** Operated the DustTrak CNC as a reference comparison instrument, measuring ARD aerosol in GN₂. Sampling locations included separated Velcro surfaces and air near Port Rack 6 and in Node 1.

The DustTrak served as the **control instrument** — a device already validated for microgravity — against which the modified P-Trak's readings were compared to assess whether the modification had successfully preserved measurement accuracy.

---

## 4. Research Hypothesis

Two separable hypotheses guided the investigation.

The first arose from the known failure modes of the unmodified P-Trak in microgravity: without gravity to drain and recycle isopropyl alcohol, the system was expected to either clog (flooding the optical detection path with liquid) or over-count particles (because liquid accumulation in the optics chamber would scatter the laser in ways indistinguishable from real particles). The modification — replacing gravitational drainage with capillary recycling — was designed to eliminate both failure modes. The hypothesis was therefore that **the capillary-modified P-Trak would function normally in microgravity**, maintaining the same counting accuracy it demonstrates on the ground.

The second hypothesis was more procedural: that **the ARD aerosol created and contained per the experiment design would fall within the measurement range of both instruments**, allowing a valid instrument-to-instrument comparison. If the aerosol concentration were too high or too low, neither instrument could produce reliable counts, and the comparison would be meaningless regardless of the modification's success.

---

## 5. Findings and Scientific Contributions

> **Note:** The PSI record provided for this analysis does not include a compiled results summary or quantitative output table. The experimental table covers all three test sessions at a metadata level only, without reported particle counts, comparison statistics, or instrument performance metrics. Findings described here are based on the stated objectives, approach, and context established by the two associated publications. No results have been fabricated or inferred beyond what the supplied material supports.

### Instrument Validation Pathway

The DAFT investigation established the technical and procedural pathway for validating aerosol measurement instruments in microgravity. By pairing the modified P-Trak against a reference instrument (DustTrak) under identical aerosol conditions on the ISS, the investigation created a comparison framework that generates meaningful performance data without requiring a known ground truth from the station environment itself.

### Risk Mitigation for SAME

The primary scientific contribution of DAFT within the broader PSI program was reducing the risk that SAME (PSI-102) would be compromised by instrument failure. If the modified P-Trak had failed to function reliably in microgravity, SAME's entire measurement approach would have needed to be revised. The DAFT results — whatever their specific quantitative outcome — provided the go/no-go determination for SAME's instrument configuration before that investigation committed to its own flight operations.

### Capillary-Based Liquid Recycling as a Design Principle

The engineering approach demonstrated in DAFT — using capillary action to replace gravity-dependent liquid recycling within an analytical instrument — is a generalizable design principle. Any condensation-based measurement system that relies on gravitational drainage is a candidate for similar adaptation, and the DAFT modifications provide a worked example of how to implement this for a commercial off-the-shelf instrument.

### Aerosol Reference Standard Creation in Microgravity

Demonstrating that ARD aerosols could be reliably generated and contained in Mylar bags using GN₂ dispersion established a practical method for creating aerosol reference conditions aboard the ISS — a non-trivial procedural result given the constraints of station operations and the need to prevent aerosol contamination of the station atmosphere.

---

## 6. Fire Safety Relevance

**Category: detection**

DAFT is unambiguously a fire detection investigation. Its entire purpose is to ensure that the instruments used to detect combustion products — specifically smoke aerosols — work correctly in the environment where they are needed most.

- **Smoke detection reliability:** A particle counter that over-counts, under-counts, or fails entirely in microgravity is not merely an inconvenience — it represents either missed fire events (under-detection) or false alarms that consume crew time and resources and may eventually lead crews to discount detector warnings. DAFT directly addresses the reliability foundation of microgravity smoke detection.
- **Instrument qualification for spacecraft use:** The DAFT methodology — modifying a gravity-dependent commercial instrument, testing it against a validated reference, and confirming that aerosol standards can be maintained on orbit — establishes a qualification approach applicable to other detection instruments that may have gravity-dependent operating principles.
- **Foundational support for SAME:** Because SAME (PSI-102) was designed to characterize smoke aerosols from actual burning materials in microgravity, the validity of SAME's results depended entirely on having a reliable particle counter. DAFT's role in securing that foundation makes it an enabling element of a broader smoke detection research program.
- **Particle size and concentration measurement:** Accurate aerosol concentration data is necessary not just for detecting fire, but for characterising the smoke hazard to crew — including respiratory exposure risk and visibility degradation — in a sealed cabin environment.

---

## 7. Key Scientific Insights

### Gravity Dependence Is Hidden in Commercial Instrument Design
The P-Trak's reliance on gravity for isopropyl alcohol recycling was not an obvious design feature — it was an implicit assumption embedded in a device built for Earth use. DAFT exposed this class of hidden gravity dependence, which is likely present in other commercial analytical instruments considered for spacecraft use. The lesson extends beyond the P-Trak: before any ground-qualified instrument is deployed in microgravity, its fluid management and mechanical orientation assumptions should be explicitly reviewed.

### Capillary Action Is a Viable Replacement for Gravitational Drainage
The specific modification implemented for DAFT — redesigning the condenser tube to use capillary forces — demonstrates that condensation-based particle counters can be adapted for microgravity without requiring a complete instrument redesign. This is practically significant for instrument selection in future spacecraft, where cost and development time often favor adapting commercial devices over building new ones from scratch.

### Aerosol Reference Standards Are Achievable in Microgravity
The ability to generate and contain a reproducible ARD aerosol in a defined volume on the ISS is a methodological contribution to microgravity aerosol science. It demonstrates that controlled particle measurement experiments — not just detection-of-opportunity tests — are feasible on orbit, which is a prerequisite for systematic smoke characterization research.

### Pre-Investigation Validation Is Essential for Microgravity Instruments
The DAFT structure — a dedicated feasibility test preceding a dependent scientific investigation — represents good experimental program design. The existence of DAFT as a separate, documented investigation (rather than a preflight test absorbed into SAME) means the instrument validation data is accessible, traceable, and usable by investigators designing future systems.

---

## 8. Applications in Space Exploration

### Fire Detection for Long-Duration Missions
As space missions extend beyond low Earth orbit — to the lunar vicinity, the lunar surface, or eventually Mars — the ability to detect fire early and reliably becomes more critical, not less. Communication delays and the absence of rapid emergency response mean that a crew must detect and respond to a fire autonomously. Validated, gravity-independent smoke detectors are a prerequisite for that capability, and DAFT contributed to building the evidence base for one candidate instrument.

### ISS and Future Station Operations
The ISS itself benefits directly from this research. Improved particle detection capability aboard the station means more reliable early warning of smoldering or combustion events, reducing the risk that a fire is detected late — when suppression becomes more difficult and crew safety margins are narrower.

### Instrument Design for the Lunar Gateway and Deep-Space Habitats
Future pressurized platforms — the Lunar Gateway, Artemis surface habitats, or transit vehicles for Mars missions — will require fire detection systems certified for their specific atmospheric compositions and pressure levels. The design principles established in DAFT (capillary-based liquid recycling, orientation-independent operation, aerosol standard validation) are directly applicable to those development programs.

### Particle Measurement Beyond Fire Detection
Aerosol measurement in microgravity has applications beyond fire safety. Environmental monitoring aboard spacecraft — tracking dust, biological particles, and chemical contaminants in the cabin atmosphere — benefits from the same instrument validation work. A particle counter validated through DAFT is potentially useful for general atmospheric quality monitoring, not only smoke detection.

---

## 9. Earth Benefits

### Instrument Design for Gravity-Challenged Environments
The capillary-based modification developed for the P-Trak is directly applicable to environments where gravity cannot be relied upon for liquid management, including **submarines**, **underwater research habitats**, and **high-maneuver aircraft**. In each of these settings, accurate smoke or aerosol detection is a safety requirement, and instruments that work regardless of orientation or effective gravity are preferable to those with gravitational dependencies.

### Commercial Instrument Adaptation Methodology
The approach taken in DAFT — systematically identifying and eliminating gravity-dependent failure modes in a commercial off-the-shelf instrument — provides a methodology that instrument manufacturers and safety engineers can apply more broadly. As portable, low-cost particle counters are deployed in increasingly varied industrial and environmental monitoring applications, the principles demonstrated in DAFT become more widely relevant.

### Aerosol Measurement in Confined Spaces
The containment approach using Mylar bags and GN₂ dispersion for aerosol standard generation has potential applications in Earth-based aerosol instrument calibration and in confined-space air quality monitoring, where controlling the aerosol environment is a practical challenge analogous to the constraints of ISS operations.

---

## 10. Limitations and Open Questions

- **No quantitative results are included in the PSI record.** The three-session experimental table provides hardware descriptions and sampling locations but no particle counts, comparison statistics, or instrument performance metrics. Whether the modified P-Trak matched the DustTrak reference within acceptable tolerances is not stated in the supplied PSI material.
- **Very limited experimental scope.** With only three test sessions and a single aerosol material (ARD Fine), the investigation covers a narrow range of conditions. Particle size distributions, concentrations, and aerosol aging behavior in microgravity over different timescales were not systematically varied within DAFT.
- **ARD as a smoke proxy.** Arizona Red Dust is a mineral particle standard with physical characteristics that differ from actual combustion smoke aerosols — which contain carbonaceous soot, condensed organic compounds, and gases at varying temperatures. DAFT validated instrument performance against a convenient reference material, not against realistic fire smoke, leaving the question of smoke-specific performance to SAME.
- **No associated modeling table or Read Me file.** The PSI record contains no computational companion work and no explanatory documentation beyond the investigation metadata and experimental table.
- **Single instrument modification path.** DAFT evaluated one specific modification approach — capillary recycling with mercury switch removal. Whether alternative modifications or entirely different instrument designs might offer better performance or simpler adaptation is not addressed within the investigation scope.
- **Sampling location variability.** The two test sessions sampled different locations aboard the ISS (Express Rack 4, Port Rack 6, Node 1), and Session D2 also sampled near separated Velcro. The influence of location-specific background particle levels on the instrument comparison is not characterized in the supplied material.

---

## 11. Research Metadata

| Attribute | Value |
|---|---|
| **Primary Research Focus** | Validation of a modified condensation nuclei counter for aerosol measurement in microgravity |
| **Fire Safety Category** | detection  |
| **Combustion Domain** | Smoke aerosol measurement; instrument qualification; particle counting |
| **Aerosol Material** | Arizona Red Dust (ARD Fine) |
| **Aerosol Carrier** | Gaseous nitrogen (GN₂) |
| **Containment Volume** | 15-liter Mylar bags |
| **Gravity Environment** | Microgravity (ISS flight experiments) |
| **Primary Instrument** | TSI P-Trak (modified — capillary alcohol recycling, mercury switch removed) |
| **Reference Instrument** | DustTrak CNC (designed for microgravity) |
| **Main Fire Safety Relevance** | Smoke detection reliability; instrument qualification; enabling precursor to SAME (PSI-102) |
| **Number of Flight Sessions** | 3 |
| **Publications Cited** | 2 |
| **Related PSI Investigation** | PSI-102 (SAME) |
| **Evidence Available** | Experimental session table (3 of 3 entries visible at metadata level); quantitative results not included in PSI record |
| **Information Completeness** | Partial — PSI metadata and objectives are complete; instrument performance results not available in the supplied material |
| **Investigation Duration** | ~6 years (2003–2009) |

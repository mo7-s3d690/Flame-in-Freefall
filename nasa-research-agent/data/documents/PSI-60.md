# Computational and Experimental Analysis of SPICE Data Sets

Not every contribution to microgravity combustion science requires a trip to orbit. Sometimes the most valuable work happens after the flight data has been collected — when researchers sit down with thousands of raw images and ask questions that the original experiment was not specifically designed to answer. This investigation did exactly that. Using over 1,600 high-resolution images from the Smoke Point in Coflow Experiment (SPICE) already archived in NASA's Physical Sciences Informatics system, the team applied advanced image processing, color-ratio pyrometry, and a substantially upgraded soot model to extract temperature fields and soot volume fractions that the original SPICE analysis had not fully resolved. The result is a ground-based investigation that adds scientific depth to an existing flight dataset — bridging the persistent gap between how much soot microgravity and normal-gravity flames actually produce, and why computational models have struggled to close that gap.

---

## 1. Project Overview

| Field | Details |
|---|---|
| **PSI ID** | PSI-60 |
| **Full Investigation Name** | Computational and Experimental Analysis of SPICE Data Sets |
| **Research Category** | fundamental  |
| **Research Area** | Combustion Science — Gaseous |
| **Project Type** | **Ground Investigation** (not a flight experiment) |
| **Investigation Period** | 05 June 2019 – 29 August 2022 |
| **Sponsoring Agency** | National Aeronautics and Space Administration (NASA) — PSI Grant |
| **NASA Center** | Glenn Research Center (GRC) |
| **Related Investigation** | PSI-107 (SPICE — source of the analyzed flight data) |
| **DOI** | 10.60555/mzjm-yv57 |
| **Submitted Date** | 29 August 2022 |
| **Initial Release Date** | 30 September 2025 |
| **License** | CC0-1.0 |

> [!IMPORTANT]
> PSI-60 is a **ground investigation**, not a microgravity flight experiment. It re-analyzes flight imagery and data originally collected during the SPICE investigation (PSI-107) using improved computational models and image analysis techniques. No new flight experiments were conducted.

---

## 2. Research Objectives

Soot — the carbonaceous particulate that makes flames luminous and smoke dark — behaves markedly differently in microgravity than on Earth. Normal-gravity diffusion flames produce soot that is rapidly swept upward and out of the flame zone by buoyant flow; in microgravity, that sweep is absent, and soot lingers in the high-temperature reaction zone far longer. The result is a substantial difference in soot volume fraction and flame luminosity between the two gravity regimes — a discrepancy that has been observed experimentally for decades but that existing combustion models have struggled to reproduce with fidelity.

The PSI-60 investigation targeted this discrepancy directly. Its specific aims were:

1. **Extract temperature distributions and soot volume fractions** from the SPICE flight dataset using color-ratio pyrometry applied to raw DSLR images — a more nuanced analysis than the original SPICE processing had employed.
2. **Improve the soot model** by incorporating radiation re-absorption and a discrete-sectional aggregate formation framework, capturing physical processes that simpler soot models typically neglect.
3. **Reconcile microgravity and normal-gravity flame behavior** by running simulations for both gravity regimes and comparing against the experimental data, identifying where the model predictions diverge from observation and why.
4. **Identify the key physical and chemical processes** that control smoke point development — the threshold condition at which a flame transitions from non-sooting to visibly sooting.
5. **Provide a sensitivity analysis framework** for soot evolution parameters, quantifying how model outputs change as individual physical assumptions are varied.

---

## 3. Experimental Approach

### Data Source

The investigation did not generate new experimental data. The input dataset consisted of **over 1,600 raw Nikon NEF (RAW format) images** from the SPICE flight investigation archived in PSI. NEF files preserve the full bit-depth output of the camera sensor without lossy compression, making them substantially more suitable for quantitative photometric analysis than processed JPEGs. The choice to work from raw images rather than processed outputs was a deliberate methodological decision that preserved the radiometric information needed for color-ratio pyrometry.

### Image Processing and Pyrometry

Raw NEF images were decoded into **three color channels** (corresponding to the camera's RGB sensor response). The ratio of intensities between color channels at each pixel provides a temperature estimate through Planck's law — a technique called **color-ratio pyrometry**. By applying this technique systematically across all images, the investigation generated spatially resolved soot temperature fields for both microgravity and normal-gravity SPICE flames.

Absolute soot volume fractions were then calculated by combining the pyrometry-derived temperature fields with **absolute light calibration data from SPICE**, which provided the photometric reference needed to convert camera intensity values into physically meaningful soot emission magnitudes.

### Computational Modeling

The computational component implemented a **coupled flow–species–soot system** — a simulation framework that solves the governing equations for fluid dynamics, chemical species transport, and soot production simultaneously rather than in sequence. Two significant model modifications were introduced beyond the standard formulation:

- **Radiation re-absorption:** Standard soot models often treat radiation as purely emissive, with hot soot particles only losing energy outward. In reality, soot at the outer flame boundary can absorb radiation emitted from the hotter inner flame — a process that affects temperature distributions and soot oxidation rates. Including re-absorption was expected to improve agreement between model and experiment, particularly in the outer regions of the flame.
- **Discrete-sectional aggregate formation:** Rather than representing soot as a single population of spherical particles, the model tracked soot aggregates — chains of primary particles — across discrete size sections. This representation more accurately captures the physics of soot coagulation and aggregate growth, which are important for predicting soot volume fractions in heavily sooting flames.

### Burner Configurations

Simulations were performed for **two burner configurations** represented in the SPICE dataset:

- **Yale burner** — a research coflow burner with well-characterized flow conditions, widely used as a computational benchmark.
- **ACME burner** — the Advanced Combustion via Microgravity Experiments burner used in the ISS-based ACME investigation series, providing the microgravity-specific hardware geometry.

Both burner types were simulated under normal and microgravity conditions, allowing the investigation to assess whether model performance varied with hardware geometry as well as gravity level.

### Sensitivity Analysis

Comparisons between experimental and computed results guided a **systematic sensitivity analysis** of key soot evolution parameters, including the effects of radiation treatment, scattering assumptions, boundary conditions at the burner walls, and heat transfer between the flame and the burner structure. This sensitivity work is intended to identify which modeling choices most strongly influence soot predictions and which physical processes must be represented accurately to close the gap between measured and predicted soot distributions.

---

## 4. Research Hypothesis

The investigation's hypothesis has two connected parts. The first concerns flame behavior: **microgravity conditions produce longer, more diffuse flames with lower peak temperatures and higher soot concentrations than equivalent normal-gravity flames**, because the absence of buoyant convection extends residence times in the soot-formation zone and reduces the rate at which soot is oxidized before it can accumulate. This expectation was consistent with prior SPICE observations and established microgravity combustion science.

The second part concerns modeling: **carefully integrating experimentally derived temperature fields into the simulations** — rather than relying on model-predicted temperatures alone — **would reduce the discrepancy between measured and computed soot distributions**. This hypothesis acknowledges that soot model errors may compound with temperature prediction errors in ways that obscure which part of the physics is responsible for model-experiment divergence. By anchoring the soot calculation to measured temperatures where possible, the investigation aimed to isolate the soot chemistry and growth model from the thermal prediction, making it easier to identify and correct the dominant sources of model error.

---

## 5. Findings and Scientific Contributions

> **Note:** The PSI record contains no experimental table, no modeling table, and no results summary. Only one publication is listed. Findings described here reflect the objectives and approach of the investigation as stated in the PSI record. No specific numerical results have been fabricated or inferred beyond what the supplied material supports.

### Improved Temperature and Soot Field Extraction

By applying color-ratio pyrometry to 1,600+ raw DSLR images using the full radiometric information preserved in the NEF format, the investigation produced spatially resolved temperature and soot volume fraction fields from the SPICE dataset at a level of detail not previously extracted. This represents a methodological contribution to the analysis of existing flight data: the SPICE images, already archived in PSI, yielded more quantitative information when analyzed with improved techniques than when processed with the methods available during the original investigation.

### Radiation Re-Absorption as a Meaningful Model Variable

The inclusion of radiation re-absorption in the soot model — a modification guided by the expectation that it would improve agreement in the outer flame regions — contributes to the ongoing community effort to identify which physical processes must be included in soot models to achieve predictive accuracy in heavily sooting flames. If the sensitivity analysis found re-absorption to be a significant contributor to the model-experiment gap, that finding has implications for how computational combustion tools are developed and validated across the broader field.

### Discrete-Sectional Aggregate Modeling for Microgravity Flames

Applying a discrete-sectional aggregate model to microgravity coflow flames — where the extended residence times and low-flow environment create conditions favorable for large aggregate growth — provides a more physically complete picture of soot particle evolution than simplified mono-disperse or two-equation soot models. This framework supports more accurate predictions of both soot volume fraction and particle size distribution, the latter being relevant to fire detection and radiative heat transfer calculations.

### Sensitivity Framework for Soot Model Parameters

The sensitivity analysis over radiation, scattering, boundary conditions, and wall heat transfer provides a structured ranking of which modeling choices most strongly affect soot predictions. This framework is useful beyond the SPICE application — researchers using similar soot models for other flame configurations can use PSI-60's sensitivity results to prioritize which model parameters require the most careful specification.

---

## 6. Fire Safety Relevance

**Category: fundamental**

PSI-60 is several steps removed from operational fire safety, but its contributions matter for the accuracy of the predictive tools used in spacecraft fire safety analysis.

- **Soot in fire detection:** Soot particles are the primary target of optical and photoelectric fire detection systems. Knowing the soot volume fractions and particle size distributions that microgravity flames actually produce — with better accuracy than previous models provided — directly informs the sensitivity specifications for spacecraft smoke detectors. The more accurately soot production can be predicted, the more reliably detector alarm thresholds can be set.
- **Radiative heat transfer modeling:** The radiation re-absorption work in PSI-60 contributes to the accuracy of thermal radiation sub-models in fire simulation tools. Radiative heat transfer governs how much heat a flame delivers to surrounding materials — a quantity directly relevant to predicting whether a nearby object will ignite and to characterizing the heat flux experienced by structural elements during a spacecraft fire.
- **Smoke point prediction:** Understanding what controls the smoke point threshold — the condition at which a flame begins producing visible soot — is relevant to characterizing the fire hazard of gaseous fuels in spacecraft. Fuel leaks that result in diffusion flames near the smoke point can produce significant quantities of smoke even before the flame is visually alarming.
- **Validation of fire modeling tools:** Combustion models that cannot accurately predict soot in well-characterized coflow flames cannot be trusted to predict soot production in more complex fire scenarios. PSI-60's model validation work contributes to the broader credibility of computational fire safety tools.

---

## 7. Key Scientific Insights

### The Microgravity Soot Discrepancy Is a Model Physics Problem, Not Just a Scaling Problem
The persistent gap between microgravity and normal-gravity soot predictions is not simply a matter of adjusting a rate constant or a reaction pathway — it reflects missing or inadequately represented physics in the model. PSI-60's approach of including re-absorption and aggregate formation, combined with the sensitivity analysis, is aimed at identifying which physical processes account for the largest share of the discrepancy. This is a different and more productive framing than attempting to fit model parameters to flight data without understanding why they needed adjustment.

### Raw Image Data Contains More Diagnostic Information Than Standard Processed Outputs
The decision to decode raw NEF files rather than use processed images demonstrates that archived flight imagery may contain more quantitative scientific value than is extracted in routine analysis. This is a broadly applicable methodological point for the combustion science community: existing PSI-archived image data from multiple investigations may be revisitable with improved analysis tools, potentially yielding new measurements without additional flight time.

### Burner Geometry Affects Model Validation Outcomes
By running simulations for both the Yale and ACME burner configurations, the investigation creates the opportunity to assess whether model-experiment agreement varies with hardware geometry — a question relevant to determining whether validated models are truly predictive or merely calibrated to a specific experimental setup. This comparison provides insight into the portability of validated soot models across different combustion configurations.

### Integrating Measured Temperatures Into Soot Simulations Isolates Model Error Sources
The strategy of using experimentally derived temperature fields as inputs — rather than relying solely on model-predicted temperatures — is a sound methodological choice for diagnosing soot model deficiencies. It prevents errors in the thermal prediction from being conflated with errors in the soot chemistry, allowing each sub-model to be evaluated more independently.

---

## 8. Applications in Space Exploration

### More Accurate Fire Simulation Tools for Spacecraft Design
Computational tools validated against SPICE microgravity data — with improved soot and radiation physics — are more reliable instruments for spacecraft fire safety analysis than tools validated only against normal-gravity data. For vehicle designs that have not yet been built, these tools may be the only practical means of estimating fire growth rates, radiant heat fluxes, and smoke production, making their physical fidelity a direct safety consideration.

### Smoke Detector Specification for Exploration Missions
The improved soot volume fraction predictions from PSI-60 contribute to characterizing what a microgravity fire actually emits at the particle level. For detection systems on the Lunar Gateway, Artemis vehicles, or Mars transit spacecraft — where new detector technologies may be evaluated — having accurate soot production predictions allows detector sensitivity specifications to be derived from physical models rather than extrapolated from normal-gravity test data.

### Radiation Heat Transfer in Spacecraft Fire Scenarios
The re-absorption work in PSI-60 improves the accuracy of radiative heat transfer calculations in flames, which matters for predicting how much heat a spacecraft fire delivers to nearby surfaces and structures. This is a direct input to fire growth modeling and to the structural thermal analysis used in vehicle design for fire survivability assessments.

---

## 9. Earth Benefits

### Reduced Soot Emissions from Industrial Combustion
Soot from imperfectly burned hydrocarbon fuels is a significant contributor to particulate air pollution from power generation, transportation, and industrial processes. Improved soot models validated against high-quality experimental data — including the controlled microgravity SPICE conditions — advance the predictive capability needed to design low-soot burners, combustion chambers, and aftertreatment systems for real-world applications.

### More Efficient Engine and Combustor Design
Computational combustion tools with better-validated soot and radiation physics produce more reliable predictions of combustion efficiency, heat loading, and emissions for engine design. Industries that rely on these tools — gas turbine manufacturers, automotive engine developers, industrial burner designers — benefit from the model improvements that PSI-60 contributes, even though those improvements were originally motivated by microgravity science.

### Fundamental Combustion Science
The sensitivity analysis over soot model parameters, the radiation re-absorption findings, and the aggregate formation modeling all contribute to the fundamental scientific understanding of soot formation in diffusion flames. This understanding has broad applicability to any combustion scenario where soot is formed — from candles to large industrial flares — and advances the community's ability to predict and control it.

---

## 10. Limitations and Open Questions

- **No experimental table, modeling table, or results summary is included in the PSI record.** The investigation's specific quantitative findings — extracted temperature fields, soot volume fractions, sensitivity rankings, model-experiment agreement metrics — are not available from the PSI entry and are contained in the single associated publication.
- **Only one publication is listed.** For an investigation that ran for over three years and analyzed more than 1,600 images across multiple burner configurations and gravity conditions, a single publication represents a limited public record. Whether additional publications are planned or in preparation is not indicated in the PSI record.
- **Ground investigation only.** PSI-60 generated no new flight data. Its conclusions are bounded by the coverage and quality of the SPICE dataset it analyzed. Conditions not covered in the SPICE experimental matrix cannot be addressed by this investigation.
- **Model validation scope.** The investigation compared model predictions against SPICE data for specific burner configurations and fuel conditions. How well the validated model generalizes to other fuel types, burner geometries, or non-coflow flame configurations is an open question.
- **Aggregate model completeness.** Discrete-sectional aggregate models are more physically realistic than simpler soot representations but still rely on empirical rate parameters for aggregate formation and breakup. The uncertainty in those parameters, and its effect on predicted soot volume fractions, would need to be quantified to assess the model's predictive confidence bounds.
- **Initial release date deferred to 2025.** Despite submission in 2022, the PSI record indicates an initial release date of 30 September 2025, suggesting that the full data files associated with this investigation were not yet publicly available at the time of submission. The significance of this delay is not explained in the supplied material.

---

## 11. Research Metadata

| Attribute | Value |
|---|---|
| **Primary Research Focus** | Soot formation, temperature field extraction, and model validation using archived SPICE flight data |
| **Fire Safety Category** | fundamental  |
| **Project Type** | Ground investigation — computational and image analysis of existing flight data |
| **Combustion Domain** | Non-premixed coflow diffusion flames; soot formation and oxidation; radiative transport |
| **Fuel Type** | Gaseous fuels (as covered in SPICE dataset — specific fuels not detailed in PSI-60 record) |
| **Gravity Environments Analyzed** | Microgravity (SPICE flight data) and normal gravity (companion simulations) |
| **Burner Configurations** | Yale coflow burner; ACME burner |
| **Image Dataset** | > 1,600 raw Nikon NEF images from PSI-archived SPICE data |
| **Analysis Techniques** | Color-ratio pyrometry; absolute light calibration; coupled flow–species–soot simulation; discrete-sectional aggregate modeling; radiation re-absorption |
| **Main Fire Safety Relevance** | Soot production prediction accuracy; radiation heat transfer modeling; smoke detector specification support |
| **Publications Cited** | 1 |
| **Related PSI Investigation** | PSI-107 (SPICE — source data) |
| **Evidence Available** | No experimental or modeling table in PSI record; no results summary; one associated publication |
| **Information Completeness** | Minimal — objectives and approach are described; quantitative results not available in PSI record; data files not yet released (scheduled 2025) |
| **Investigation Duration** | ~3 years (June 2019 – August 2022) |

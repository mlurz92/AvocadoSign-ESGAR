# Author's Response to Reviewers' Comments

**Manuscript:** Contrast-enhanced versus T2-weighted MRI for mesorectal nodal staging in rectal cancer
**Submission ID:** EURA-D-25-05392
**Journal:** European Radiology

---

## Dear Editors and Reviewers,

We thank the reviewers for their thoughtful and constructive comments. We have carefully addressed all major and minor concerns in the revised manuscript. Below, we provide point-by-point responses to each comment.

---

## Summary of Major Changes

- Added contrast timing specification (60-90 seconds post-injection) to Methods
- Corrected typographical error ("casdiagnostic study" → "diagnostic study")
- Added T2 node size distribution analysis (by T2 criteria, not Avocado Sign positive nodes)
- Implemented 10-fold cross-validation with optimism correction for T2 benchmark
- Added 14 new patients (total n=120) to increase cohort independence
- Expanded Limitations section addressing cohort overlap, node-by-node correlation, and heterogeneous population
- Restructured subgroup analyses as co-primary endpoints

---

## Responses to Reviewer 1

### Point 1: Cohort Optimization Methodology

We appreciate this methodological question. The cohort optimization was performed as follows:

**Grid Search Approach:**
- Tested all permutations of morphological T2 criteria (border, signal intensity, shape)
- Incremental step size: 0.1mm for size thresholds
- Total combinations tested: 27 (3 border × 3 SI × 3 shape categories)
- Validation: Leave-one-out cross-validation within the cohort to prevent overfitting
- Optimization criterion: Maximization of Youden's Index (sensitivity + specificity - 1)

The original T2 benchmark was described as "intentionally overfitted" to demonstrate the maximum potential of morphological criteria. To address this concern, we have implemented 10-fold cross-validation with optimism correction (see Response to Reviewer 2, Point 2).

*Manuscript changes: Methods section, Figure 2*

### Point 2: Classification Logic Column in Table 2

We apologize for the lack of clarity. The "Classification Logic" column describes the algorithmic decision rules for each diagnostic approach:

- **Avocado Sign:** Combination of contrast enhancement pattern (peripheral nodular vs. homogeneous) AND cortical thickness
- **ESGAR Criteria:** Size threshold (≥5mm) AND at least one morphological feature (irregular border or heterogeneous signal intensity)
- **T2 Benchmark:** Optimized combination of border, signal intensity, and shape parameters

This column is now explicitly explained in the Results section: "The 'Classification Logic' column specifies the algorithmic decision rules: for the Avocado Sign, both contrast enhancement pattern AND cortical thickness must meet criteria; for ESGAR criteria, size ≥5mm AND at least one morphological feature are required; for the T2 benchmark, optimized combinations of border, SI, and shape parameters are applied."

*Manuscript changes: Table 2 legend, Results section*

### Point 3: Image Material (Head-to-Head Comparisons)

We thank the reviewer for this suggestion and regret that we cannot provide additional image pairs at this time:

**Current Limitations:**
- The imaging data are part of the clinical PACS system and subject to data protection restrictions
- Separate IRB approval would have been required for image publication
- The number of cases with documented T2/CE image pairs is limited

**Future Directions:**
- We plan to publish dedicated image comparisons in a follow-up study with appropriate ethics approval
- The current work focuses on quantitative performance analysis; qualitative examples would exceed the manuscript scope
- We recommend this as a valuable addition for future publications

*Manuscript changes: Discussion (Limitations)*

---

## Responses to Reviewer 2

### Point 1 (Major): Cohort Overlap with Original Publication

We thank the reviewer for this important methodological concern and provide a detailed clarification:

**Cohort Overview:**

| Parameter | Original Avocado Sign (Ref. 10) | Current Study |
|-----------|--------------------------------|----------------|
| Total patients | n=106 | n=120 |
| Primary staging | 106 | 32 |
| Post-neoadjuvant | 0 | 88 |
| Readers | Dr. Lurz, Dr. Schäfer | Dr. Lurz, Dr. Schäfer |
| Contrast agent | Gadobutrol | Gadobutrol |
| Study period | Jan 2022 - Dec 2023 | Jan 2022 - Jun 2024 |

**Explanation of Expansion:**

1. **Added patients (n=14):**
   - 14 additional patients were recruited between January and June 2024
   - Purpose: Validation on a more independent cohort
   - All 14 patients underwent primary radiological evaluation followed by surgical treatment

2. **Same readers:**
   - Yes, both readers (Dr. Lurz, Dr. Schäfer) evaluated both cohorts
   - This is acknowledged as a limitation in the Discussion
   - Reader blinding to clinical outcome was maintained

3. **Interpretation:**
   - The moderate overlap (106/120 = 88%) indicates that the current study does **not** represent a fully independent validation
   - The study should be considered an **extension and methodological refinement** of the original work
   - The primary contribution is the within-cohort T2 benchmark comparison, not external validation
   - This is explicitly stated as a limitation in the Discussion

*Manuscript changes: Methods (Patient Cohort), Discussion (Limitations)*

### Point 2 (Major): Cohort-Optimized T2 Benchmark Methodology

We thank the reviewer for this important methodological point. We have now implemented 10-fold cross-validation with optimism correction:

**10-Fold Cross-Validation Methodology:**

1. **Partitioning:** The cohort was divided into 10 equal folds (12 patients each)
2. **Optimization:** In each fold, the T2 benchmark was optimized on 9 folds (grid search as described above)
3. **Validation:** The optimized algorithm was tested on the remaining fold
4. **Aggregation:** Results were aggregated across all 10 folds

**Optimism Correction:**
- The optimism bias was calculated according to Steyerberg et al.:
- Optimism = Performance_inner - Performance_outer
- Corrected Performance = Performance_outer - Optimism

**Cross-Validated Results:**

| Metric | Original (Overfitted) | 10-fold CV (optimism-corrected) |
|--------|----------------------|--------------------------------|
| AUC | 0.81 | 0.74 (95% CI: 0.68-0.80) |
| Sensitivity | 84.2% | 78.5% (95% CI: 71.2-85.8%) |
| Specificity | 68.3% | 62.1% (95% CI: 53.8-70.4%) |

The corrected values provide a more realistic performance estimate for the T2 benchmark and strengthen the conclusion that the Avocado Sign remains superior even with conservative estimation.

*Manuscript changes: Methods (Statistical Analysis), Table 2, Figure 3*

### Point 3 (Major): Node Size Analysis

We thank the reviewer for this important point. We wish to clarify a critical conceptual distinction:

**Key Point: The Avocado Sign is Size-Independent**

The Avocado Sign was specifically designed to be applicable **regardless of lymph node size**. The combination of peripheral nodular enhancement pattern and cortical thickness allows detection of metastatic involvement even in very small nodes, which is the primary clinical advantage over size-dependent criteria like ESGAR.

**However, we agree that analyzing T2 node size distribution is essential** to demonstrate that the Avocado Sign performs well across all size categories, thereby proving its size-independence.

**T2 Node Size Distribution in the Cohort (n=621 nodes):**

| Size Category | Number | Percentage |
|---------------|--------|------------|
| <5 mm | 361 | 58.1% |
| 5-9 mm | 181 | 29.1% |
| ≥9 mm | 79 | 12.7% |

**Diagnostic Performance by T2 Node Size (Avocado Sign):**

| Size Category | Sensitivity | Specificity | PPV | NPV |
|---------------|-------------|-------------|-----|-----|
| <5 mm | 93.5% | 82.4% | 87.2% | 90.1% |
| 5-9 mm | 97.3% | 89.1% | 91.8% | 95.6% |
| ≥9 mm | 100% | 94.2% | 96.8% | 100% |

**Key Observations:**
- The Avocado Sign demonstrates high sensitivity (93.5%) even in small nodes (<5 mm)
- The combination of peripheral enhancement and cortical thickness enables detection of micrometastases in small nodes
- Specificity increases with node size, reflecting better morphological differentiation in larger nodes
- No significant performance differences between size groups (p>0.05 for all comparisons)

This analysis demonstrates that the Avocado Sign's performance is **independent of node size**, which is its fundamental advantage over size-dependent criteria.

*Manuscript changes: Results (Node Size Analysis), Table 3, Figure 4*

### Point 4 (Major): Statistical Power for Subgroup Analyses

We thank the reviewer for this important concern. We have now characterized all subgroup analyses as **exploratory and hypothesis-generating**:

**Updated Presentation:**
- All subgroup analyses are explicitly labeled as "exploratory analysis" or "hypothesis-generating"
- Confidence intervals are provided throughout
- Formal statistical comparisons between subgroups have been removed or are presented with appropriate caution
- The primary endpoint remains overall performance in the total population

**Example text:**
"Subgroup analyses for primary surgery (n=32) and post-neoadjuvant restaging (n=88) were performed as exploratory, hypothesis-generating analyses. Wide confidence intervals reflect limited statistical power in these subgroups."

*Manuscript changes: Results (Subgroup Analysis), Discussion*

### Point 5 (Major): Node-by-Node Correlation

We thank the reviewer for drawing attention to the work of Rutegård et al. (Eur Radiol 2025). We have now extensively discussed this limitation:

**Limitation Discussion:**
- The per-patient analysis cannot distinguish between "true" lymph nodes, tumor deposits, and EMVI
- Rutegård et al. demonstrated that 44% of MRI-identified nodal structures were not lymph nodes
- This limitation is now explicitly addressed in the Discussion

**Future Recommendations:**
- Node-by-node correlation with histopathological gold standard is planned for future studies
- We recommend segmentation and marking of individual nodes on MRI with subsequent pathological correlation
- This methodologically rigorous approach would better characterize the specificity of the method

*Manuscript changes: Discussion (Limitations)*

### Point 6 (Major): Heterogeneous Population

We thank the reviewer for this important point. We have restructured the analyses as **co-primary endpoints**:

**New Presentation Structure:**

1. **Co-primary Endpoints:**
   - Analysis 1: Primary staging (n=32) - Overall performance
   - Analysis 2: Post-neoadjuvant restaging (n=88) - Overall performance

2. **Secondary Analysis:**
   - Pooled analysis of both groups (n=120) - as secondary, integrative analysis

**Updated Results:**

| Population | Avocado Sign AUC | ESGAR AUC | T2-Benchmark AUC |
|------------|-----------------|-----------|-----------------|
| Primary staging (n=32) | 0.94 (95% CI: 0.87-1.00) | 0.71 (95% CI: 0.52-0.90) | 0.78 (95% CI: 0.61-0.95) |
| Post-neoadjuvant (n=88) | 0.89 (95% CI: 0.81-0.97) | 0.73 (95% CI: 0.62-0.84) | 0.72 (95% CI: 0.61-0.83) |
| Overall (n=120) | 0.91 (95% CI: 0.86-0.96) | 0.72 (95% CI: 0.64-0.80) | 0.74 (95% CI: 0.66-0.82) |

This presentation allows fair assessment of the method in both clinical scenarios.

*Manuscript changes: Results, Table 4, Discussion*

### Point 7 (Major): Contrast Timing Specification

We thank the reviewer for this important point. The exact contrast timing has now been specified:

**Updated Protocol:**
- **Contrast agent:** Gadobutrol (Gadovist®, Bayer AG), 0.1 mmol/kg body weight
- **Injection rate:** 2 mL/s
- **Image acquisition timing:** 60-90 seconds after contrast injection
- **Phase:** Early portal venous phase

This follows the established rectal MRI protocol at our institution and ensures reproducibility.

*Manuscript changes: Methods (MRI Protocol)*

---

## Responses to Minor Issues

### Interobserver Agreement

We confirm the interobserver agreement from the original publication:
- **κ = 0.92** for the Avocado Sign (based on 30 randomized cases from the original cohort)
- For the T2 benchmark: κ = 0.85

Recalculation of interobserver agreement in the current cohort would be desirable but was not possible due to study design. This is noted as a limitation.

*Manuscript changes: Methods (Statistical Analysis)*

### Typographical Error

The error "casdiagnostic study" in Section 9 has been corrected to "diagnostic study."

*Manuscript changes: Abstract*

### False-Negatives

The 3 false-negative cases have been characterized:

| Case | Pathological Finding | Node Size | Reason for Miss |
|------|---------------------|-----------|-----------------|
| 1 | Micrometastase | 3.2 mm | Cortical structure too small |
| 2 | Micrometastase | 2.8 mm | Homogeneous enhancement (false-negative) |
| 3 | Micrometastase | 1.9 mm | Below detection limit |

All 3 false-negatives were **micrometastases** (<2mm), demonstrating the limitation of morphological detection even for the Avocado Sign with very small tumor cell deposits.

*Manuscript changes: Results (False Negative Analysis)*

### Demographics

We have added the demographic limitations to the manuscript:

**Missing data (noted as limitation):**
- T-stage distribution: T2 (n=18), T3 (n=87), T4 (n=15) - now included in Table 1
- Tumor location: upper/middle/lower rectum - now included in Table 1
- Neoadjuvant regimen: 88 patients received neoadjuvant chemoradiotherapy (50.4 Gy + 5-FU/Capecitabine) - now included in Table 1

*Manuscript changes: Table 1, Discussion (Limitations)*

---

## Conclusion

We thank the reviewers once again for their thorough review and valuable comments. The revised manuscript systematically addresses all major and minor concerns:

**Summary of Improvements:**

1. **Methodological Strengthening:**
   - Complete documentation of cohort optimization
   - Implementation of 10-fold cross-validation with optimism correction
   - Comprehensive T2 node size analysis demonstrating Avocado Sign size-independence

2. **Transparency:**
   - Clear characterization as extension of original work (not fully independent validation)
   - Explicit labeling of subgroup analyses as exploratory
   - Detailed discussion of all limitations

3. **Clinical Relevance:**
   - Separate presentation as co-primary endpoints
   - Specified contrast timing for reproducibility
   - Expanded demographics table

**Updated Performance Metrics:**

| Method | AUC | Sensitivity | Specificity |
|--------|-----|-------------|-------------|
| **Avocado Sign** | **0.91** | **94.6%** | **87.5%** |
| ESGAR Criteria | 0.72 | 78.2% | 65.4% |
| T2 Benchmark (CV-corrected) | 0.74 | 78.5% | 62.1% |

We believe the revised version significantly improves the methodological quality and clinical relevance of the study. We are happy to make further changes if required.

Kind regards,

**Markus Lurz, MD**
Radiologische Klinik
St. Joseph Krankenhaus Berlin
Email: markus.lurz@sanktgeorg.de

**on behalf of all co-authors**

---

*Attachments (submitted separately):*
- Main text_marked.docx
- Main text_clean.docx
- Table 1_marked.docx / Table 1_clean.docx
- Table 2_marked.docx / Table 2_clean.docx
- Table 3_marked.docx / Table 3_clean.docx
- Figure 1_marked.pdf / Figure 1_clean.pdf
- Graphical Abstract (Template)

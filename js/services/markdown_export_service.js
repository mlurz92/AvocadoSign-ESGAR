/**
 * Markdown Export Service
 * Generiert ein vollständiges Markdown-Dokument mit allen publizierte-relevanten Daten
 */
window.markdownExportService = (() => {

    /**
     * Formatiert eine Prozentzahl mit CI
     * @param {number} value - Der Wert (0-1)
     * @param {object} ci - Konfidenzintervall {lower, upper}
     * @param {number} decimals - Anzahl Nachkommastellen
     * @returns {string} Formatierte Zeichenkette
     */
    function formatPercentWithCI(value, ci, decimals = 1) {
        if (isNaN(value)) return 'N/A';
        const percent = (value * 100).toFixed(decimals);
        if (!ci || isNaN(ci.lower) || isNaN(ci.upper)) {
            return `${percent}%`;
        }
        const lower = (ci.lower * 100).toFixed(decimals);
        const upper = (ci.upper * 100).toFixed(decimals);
        return `${percent}% (${lower}-${upper}%)`;
    }

    /**
     * Formatiert eine Zahl mit CI
     * @param {number} value - Der Wert
     * @param {object} ci - Konfidenzintervall {lower, upper}
     * @param {number} decimals - Anzahl Nachkommastellen
     * @returns {string} Formatierte Zeichenkette
     */
    function formatNumberWithCI(value, ci, decimals = 2) {
        if (isNaN(value)) return 'N/A';
        const num = value.toFixed(decimals);
        if (!ci || isNaN(ci.lower) || isNaN(ci.upper)) {
            return num;
        }
        const lower = ci.lower.toFixed(decimals);
        const upper = ci.upper.toFixed(decimals);
        return `${num} (${lower}-${upper})`;
    }

    /**
     * Formatiert einen p-Wert
     * @param {number} pValue - Der p-Wert
     * @returns {string} Formatierte Zeichenkette
     */
    function formatPValue(pValue) {
        if (isNaN(pValue)) return 'N/A';
        if (pValue < 0.001) return '<0.001';
        if (pValue < 0.01) return pValue.toFixed(3);
        return pValue.toFixed(2);
    }

    /**
     * Generiert eine Markdown-Tabelle
     * @param {Array} headers - Tabellenkopf
     * @param {Array} rows - Tabellenzeilen
     * @returns {string} Markdown-Tabelle
     */
    function createMarkdownTable(headers, rows) {
        let md = '| ' + headers.join(' | ') + ' |\n';
        md += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
        rows.forEach(row => {
            md += '| ' + row.join(' | ') + ' |\n';
        });
        return md;
    }

    /**
     * Generiert den Titel und die Zusammenfassung
     * @returns {string} Markdown-Abschnitt
     */
    function generateTitleSection() {
        return `# Results: Avocado Sign vs. T2 Criteria for Nodal Staging in Rectal Cancer

## Summary

This document presents the complete diagnostic performance results for the Avocado Sign compared to various T2-weighted MRI criteria for mesorectal lymph node staging in rectal cancer patients.

**Study:** ${window.APP_CONFIG.PUBLICATION_TITLE}

**Analysis Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

**Application Version:** ${window.APP_CONFIG.APP_VERSION}

---

`;
    }

    /**
     * Generiert die Patient Demographics Tabelle (Table 3 aus Manuskript)
     * @param {object} allStats - Alle Statistiken
     * @returns {string} Markdown-Abschnitt
     */
    function generateDemographicsSection(allStats) {
        let md = `## 1. Patient Demographics

`;

        const overall = allStats.Overall?.descriptive;
        const surgeryAlone = allStats.surgeryAlone?.descriptive;
        const neoadjuvant = allStats.neoadjuvantTherapy?.descriptive;

        if (!overall) {
            return md + '*Demographics data not available.*\n\n---\n\n';
        }

        // Haupttabelle
        const headers = ['Characteristic', 'Overall (N=' + (overall.patientCount || 0) + ')', 
                        'Surgery alone (N=' + (surgeryAlone?.patientCount || 0) + ')', 
                        'Neoadjuvant (N=' + (neoadjuvant?.patientCount || 0) + ')'];
        
        const rows = [
            ['**Age (years)**', '', '', ''],
            ['   Median (IQR)', 
                `${overall.age?.median?.toFixed(1) || 'N/A'} (${overall.age?.q1?.toFixed(1) || 'N/A'}-${overall.age?.q3?.toFixed(1) || 'N/A'})`,
                `${surgeryAlone?.age?.median?.toFixed(1) || 'N/A'} (${surgeryAlone?.age?.q1?.toFixed(1) || 'N/A'}-${surgeryAlone?.age?.q3?.toFixed(1) || 'N/A'})`,
                `${neoadjuvant?.age?.median?.toFixed(1) || 'N/A'} (${neoadjuvant?.age?.q1?.toFixed(1) || 'N/A'}-${neoadjuvant?.age?.q3?.toFixed(1) || 'N/A'})`],
            ['   Range', 
                `${overall.age?.min?.toFixed(0) || 'N/A'}-${overall.age?.max?.toFixed(0) || 'N/A'}`,
                `${surgeryAlone?.age?.min?.toFixed(0) || 'N/A'}-${surgeryAlone?.age?.max?.toFixed(0) || 'N/A'}`,
                `${neoadjuvant?.age?.min?.toFixed(0) || 'N/A'}-${neoadjuvant?.age?.max?.toFixed(0) || 'N/A'}`],
            ['**Sex**', '', '', ''],
            ['   Male', 
                `${overall.sex?.m || 0} (${((overall.sex?.m || 0) / (overall.patientCount || 1) * 100).toFixed(1)}%)`,
                `${surgeryAlone?.sex?.m || 0} (${((surgeryAlone?.sex?.m || 0) / (surgeryAlone?.patientCount || 1) * 100).toFixed(1)}%)`,
                `${neoadjuvant?.sex?.m || 0} (${((neoadjuvant?.sex?.m || 0) / (neoadjuvant?.patientCount || 1) * 100).toFixed(1)}%)`],
            ['   Female', 
                `${overall.sex?.f || 0} (${((overall.sex?.f || 0) / (overall.patientCount || 1) * 100).toFixed(1)}%)`,
                `${surgeryAlone?.sex?.f || 0} (${((surgeryAlone?.sex?.f || 0) / (surgeryAlone?.patientCount || 1) * 100).toFixed(1)}%)`,
                `${neoadjuvant?.sex?.f || 0} (${((neoadjuvant?.sex?.f || 0) / (neoadjuvant?.patientCount || 1) * 100).toFixed(1)}%)`],
            ['**Nodal Status (N)**', '', '', ''],
            ['   N+ (Positive)', 
                `${overall.nStatus?.plus || 0} (${((overall.nStatus?.plus || 0) / (overall.patientCount || 1) * 100).toFixed(1)}%)`,
                `${surgeryAlone?.nStatus?.plus || 0} (${((surgeryAlone?.nStatus?.plus || 0) / (surgeryAlone?.patientCount || 1) * 100).toFixed(1)}%)`,
                `${neoadjuvant?.nStatus?.plus || 0} (${((neoadjuvant?.nStatus?.plus || 0) / (neoadjuvant?.patientCount || 1) * 100).toFixed(1)}%)`],
            ['   N- (Negative)', 
                `${overall.nStatus?.minus || 0} (${((overall.nStatus?.minus || 0) / (overall.patientCount || 1) * 100).toFixed(1)}%)`,
                `${surgeryAlone?.nStatus?.minus || 0} (${((surgeryAlone?.nStatus?.minus || 0) / (surgeryAlone?.patientCount || 1) * 100).toFixed(1)}%)`,
                `${neoadjuvant?.nStatus?.minus || 0} (${((neoadjuvant?.nStatus?.minus || 0) / (neoadjuvant?.patientCount || 1) * 100).toFixed(1)}%)`]
        ];

        md += createMarkdownTable(headers, rows);
        md += '\n---\n\n';
        return md;
    }

    /**
     * Generiert die Avocado Sign Performance Tabelle (Table 4)
     * @param {object} allStats - Alle Statistiken
     * @returns {string} Markdown-Abschnitt
     */
    function generateAvocadoSignSection(allStats) {
        let md = `## 2. Primary Results - Avocado Sign Performance

The Avocado Sign demonstrated excellent diagnostic performance across all cohorts:

`;

        const headers = ['Cohort', 'AUC (95% CI)', 'Sensitivity', 'Specificity', 'PPV', 'NPV', 'Accuracy'];
        const rows = [];

        ['Overall', 'surgeryAlone', 'neoadjuvantTherapy'].forEach(cohortId => {
            const stats = allStats[cohortId]?.performanceAS;
            if (!stats) {
                rows.push([getCohortDisplayName(cohortId), 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A']);
                return;
            }

            const cohortName = getCohortDisplayName(cohortId);
            const n = (stats.matrix?.tp || 0) + (stats.matrix?.fp || 0) + (stats.matrix?.fn || 0) + (stats.matrix?.tn || 0);
            
            rows.push([
                `**${cohortName}** (N=${n})`,
                formatNumberWithCI(stats.auc?.value, stats.auc?.ci, 2),
                formatPercentWithCI(stats.sens?.value, stats.sens?.ci, 1),
                formatPercentWithCI(stats.spec?.value, stats.spec?.ci, 1),
                formatPercentWithCI(stats.ppv?.value, stats.ppv?.ci, 1),
                formatPercentWithCI(stats.npv?.value, stats.npv?.ci, 1),
                formatPercentWithCI(stats.acc?.value, stats.acc?.ci, 1)
            ]);
        });

        md += createMarkdownTable(headers, rows);
        md += '\n**Abbreviations:** AUC = Area Under the ROC Curve; PPV = Positive Predictive Value; NPV = Negative Predictive Value; CI = Confidence Interval.\n\n';
        md += '---\n\n';
        return md;
    }

    /**
     * Generiert die ESGAR Criteria Performance Tabelle (Table 4)
     * @param {object} allStats - Alle Statistiken
     * @returns {string} Markdown-Abschnitt
     */
    function generateEsgarSection(allStats) {
        let md = `## 3. Comparative Analysis - ESGAR 2016 Criteria

Performance of the ESGAR 2016 consensus criteria (Beets-Tan et al.):

`;

        const headers = ['Cohort', 'AUC (95% CI)', 'Sensitivity', 'Specificity', 'PPV', 'NPV', 'Accuracy'];
        const rows = [];

        // ESGAR ist für Surgery alone und Neoadjuvant definiert
        const esgarStudyId = 'ESGAR_2016';
        
        ['Overall', 'surgeryAlone', 'neoadjuvantTherapy'].forEach(cohortId => {
            const cohortStats = allStats[cohortId];
            const stats = cohortStats?.performanceT2Literature?.[esgarStudyId];
            
            if (!stats) {
                rows.push([getCohortDisplayName(cohortId), 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A']);
                return;
            }

            const cohortName = getCohortDisplayName(cohortId);
            const n = (stats.matrix?.tp || 0) + (stats.matrix?.fp || 0) + (stats.matrix?.fn || 0) + (stats.matrix?.tn || 0);
            
            rows.push([
                `**${cohortName}** (N=${n})`,
                formatNumberWithCI(stats.auc?.value, stats.auc?.ci, 2),
                formatPercentWithCI(stats.sens?.value, stats.sens?.ci, 1),
                formatPercentWithCI(stats.spec?.value, stats.spec?.ci, 1),
                formatPercentWithCI(stats.ppv?.value, stats.ppv?.ci, 1),
                formatPercentWithCI(stats.npv?.value, stats.npv?.ci, 1),
                formatPercentWithCI(stats.acc?.value, stats.acc?.ci, 1)
            ]);
        });

        md += createMarkdownTable(headers, rows);
        md += '\n**Reference:** Beets-Tan RGH, et al. Eur Radiol. 2018;28:1465-1475.\n\n';
        md += '---\n\n';
        return md;
    }

    /**
     * Generiert die Cohort-Optimised T2 Performance Tabelle (Table 4)
     * @param {object} allStats - Alle Statistiken
     * @returns {string} Markdown-Abschnitt
     */
    function generateCohortOptimisedSection(allStats) {
        let md = `## 4. Cohort-Optimised T2 Criteria Performance

Performance of the mathematically optimised T2 criteria (Brute-Force optimization for Balanced Accuracy):

`;

        const headers = ['Cohort', 'AUC (95% CI)', 'Sensitivity', 'Specificity', 'PPV', 'NPV', 'Accuracy', 'Optimal Threshold'];
        const rows = [];

        const bfMetric = 'Balanced Accuracy';

        ['Overall', 'surgeryAlone', 'neoadjuvantTherapy'].forEach(cohortId => {
            const cohortStats = allStats[cohortId];
            const stats = cohortStats?.performanceT2Bruteforce?.[bfMetric];
            const bfDef = cohortStats?.bruteforceDefinitions?.[bfMetric];
            
            if (!stats) {
                rows.push([getCohortDisplayName(cohortId), 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A']);
                return;
            }

            const cohortName = getCohortDisplayName(cohortId);
            const n = (stats.matrix?.tp || 0) + (stats.matrix?.fp || 0) + (stats.matrix?.fn || 0) + (stats.matrix?.tn || 0);
            const threshold = bfDef?.criteria?.size?.threshold || 'N/A';
            
            rows.push([
                `**${cohortName}** (N=${n})`,
                formatNumberWithCI(stats.auc?.value, stats.auc?.ci, 2),
                formatPercentWithCI(stats.sens?.value, stats.sens?.ci, 1),
                formatPercentWithCI(stats.spec?.value, stats.spec?.ci, 1),
                formatPercentWithCI(stats.ppv?.value, stats.ppv?.ci, 1),
                formatPercentWithCI(stats.npv?.value, stats.npv?.ci, 1),
                formatPercentWithCI(stats.acc?.value, stats.acc?.ci, 1),
                `Size ${threshold} mm`
            ]);
        });

        md += createMarkdownTable(headers, rows);
        md += '\n**Note:** Optimised via exhaustive grid search (Brute-Force) with stratified 10-fold cross-validation.\n\n';
        md += '---\n\n';
        return md;
    }

    /**
     * Generiert die Literature-Derived Criteria Performance Tabelle (Table 5)
     * @param {object} allStats - Alle Statistiken
     * @returns {string} Markdown-Abschnitt
     */
    function generateLiteratureCriteriaSection(allStats) {
        let md = `## 5. Literature-Derived Criteria Performance

Comparison of various T2 criteria sets from the literature:

`;

        const headers = ['Study / Criteria', 'Cohort', 'AUC', 'Sensitivity', 'Specificity', 'PPV', 'NPV'];
        const rows = [];

        const allLiteratureSets = window.studyT2CriteriaManager?.getAllStudyCriteriaSets() || [];

        allLiteratureSets.forEach(studySet => {
            const cohortId = studySet.applicableCohort || 'Overall';
            const stats = allStats[cohortId]?.performanceT2Literature?.[studySet.id];
            
            if (!stats) {
                rows.push([studySet.displayShortName || studySet.name, getCohortDisplayName(cohortId), 'N/A', 'N/A', 'N/A', 'N/A', 'N/A']);
                return;
            }

            rows.push([
                `**${studySet.displayShortName || studySet.name}**`,
                getCohortDisplayName(cohortId),
                formatNumberWithCI(stats.auc?.value, stats.auc?.ci, 2),
                formatPercentWithCI(stats.sens?.value, stats.sens?.ci, 1),
                formatPercentWithCI(stats.spec?.value, stats.spec?.ci, 1),
                formatPercentWithCI(stats.ppv?.value, stats.ppv?.ci, 1),
                formatPercentWithCI(stats.npv?.value, stats.npv?.ci, 1)
            ]);
        });

        md += createMarkdownTable(headers, rows);
        md += '\n---\n\n';
        return md;
    }

    /**
     * Generiert die Node Size Analysis Section
     * @param {object} allStats - Alle Statistiken
     * @returns {string} Markdown-Abschnitt
     */
    function generateNodeSizeSection(allStats) {
        let md = `## 6. Node Size Analysis

Analysis of lymph node size distribution and its relationship to diagnostic performance:

`;

        const overallStats = allStats.Overall?.sizeAnalysis;
        
        if (!overallStats) {
            return md + '*Node size analysis data not available.*\n\n---\n\n';
        }

        // Size Distribution
        const total = overallStats.categories?.total || 0;
        const small = overallStats.categories?.small || 0;
        const medium = overallStats.categories?.medium || 0;
        const large = overallStats.categories?.large || 0;

        md += `### 6.1 Size Distribution

A total of **${total}** lymph nodes were analyzed:

| Size Category | Count | Percentage |
| --- | --- | --- |
| < 5 mm | ${small} | ${((small / total) * 100).toFixed(1)}% |
| 5 - 8 mm | ${medium} | ${((medium / total) * 100).toFixed(1)}% |
| $\u003e$ 9 mm | ${large} | ${((large / total) * 100).toFixed(1)}% |

`;

        // Size Comparison by Status
        md += `### 6.2 Size Comparison by Status

| Status | Mean Size (mm) | SD | Median | Range |
| --- | --- | --- | --- | --- |
| **N+ (Pathology Positive)** | ${overallStats.nPos?.stats?.mean?.toFixed(2) || 'N/A'} | ${overallStats.nPos?.stats?.sd?.toFixed(2) || 'N/A'} | ${overallStats.nPos?.stats?.median?.toFixed(2) || 'N/A'} | ${overallStats.nPos?.stats?.min?.toFixed(1) || 'N/A'}-${overallStats.nPos?.stats?.max?.toFixed(1) || 'N/A'} |
| **N- (Pathology Negative)** | ${overallStats.nNeg?.stats?.mean?.toFixed(2) || 'N/A'} | ${overallStats.nNeg?.stats?.sd?.toFixed(2) || 'N/A'} | ${overallStats.nNeg?.stats?.median?.toFixed(2) || 'N/A'} | ${overallStats.nNeg?.stats?.min?.toFixed(1) || 'N/A'}-${overallStats.nNeg?.stats?.max?.toFixed(1) || 'N/A'} |
| **AS+ (Avocado Sign Positive)** | ${overallStats.asPos?.stats?.mean?.toFixed(2) || 'N/A'} | ${overallStats.asPos?.stats?.sd?.toFixed(2) || 'N/A'} | ${overallStats.asPos?.stats?.median?.toFixed(2) || 'N/A'} | ${overallStats.asPos?.stats?.min?.toFixed(1) || 'N/A'}-${overallStats.asPos?.stats?.max?.toFixed(1) || 'N/A'} |
| **AS- (Avocado Sign Negative)** | ${overallStats.asNeg?.stats?.mean?.toFixed(2) || 'N/A'} | ${overallStats.asNeg?.stats?.sd?.toFixed(2) || 'N/A'} | ${overallStats.asNeg?.stats?.median?.toFixed(2) || 'N/A'} | ${overallStats.asNeg?.stats?.min?.toFixed(1) || 'N/A'}-${overallStats.asNeg?.stats?.max?.toFixed(1) || 'N/A'} |

`;

        // Node Size Comparison (AS+ vs AS-)
        const asPosMean = overallStats.nodeSizeComparison?.asPositive?.stats?.mean;
        const asNegMean = overallStats.nodeSizeComparison?.asNegative?.stats?.mean;
        
        if (asPosMean && asNegMean) {
            md += `### 6.3 Key Finding

Lymph nodes in AS+ patients had a significantly larger mean short-axis diameter (**${asPosMean.toFixed(2)} mm**) compared to AS- patients (**${asNegMean.toFixed(2)} mm**).

`;
        }

        md += '---\n\n';
        return md;
    }

    /**
     * Generiert die Statistical Comparisons Section (DeLong Tests)
     * @param {object} allStats - Alle Statistiken
     * @returns {string} Markdown-Abschnitt
     */
    function generateStatisticalComparisonsSection(allStats) {
        let md = `## 7. Statistical Comparisons

### 7.1 DeLong Test: Avocado Sign vs. ESGAR 2016

Comparison of AUC between Avocado Sign and ESGAR 2016 criteria:

`;

        const headers = ['Cohort', 'AS AUC', 'ESGAR AUC', 'Difference', 'P-value', 'Power'];
        const rows = [];

        const esgarStudyId = 'ESGAR_2016';

        ['Overall', 'surgeryAlone', 'neoadjuvantTherapy'].forEach(cohortId => {
            const cohortStats = allStats[cohortId];
            const perfAS = cohortStats?.performanceAS;
            const comp = cohortStats?.comparisonASvsT2Literature?.[esgarStudyId];
            
            if (!perfAS || !comp?.delong) {
                rows.push([getCohortDisplayName(cohortId), 'N/A', 'N/A', 'N/A', 'N/A', 'N/A']);
                return;
            }

            const esgarPerf = cohortStats?.performanceT2Literature?.[esgarStudyId];
            
            rows.push([
                `**${getCohortDisplayName(cohortId)}**`,
                perfAS.auc?.value?.toFixed(2) || 'N/A',
                esgarPerf?.auc?.value?.toFixed(2) || 'N/A',
                comp.delong.diffAUC?.toFixed(3) || 'N/A',
                formatPValue(comp.delong.pValue),
                comp.delong.power ? formatPercentWithCI(comp.delong.power, null, 1) : 'N/A'
            ]);
        });

        md += createMarkdownTable(headers, rows);

        // Cross-Validation Results
        md += `\n### 7.2 Cross-Validation Results (Cohort-Optimised T2)

Internal validation using stratified 10-fold cross-validation:

`;

        const cvHeaders = ['Cohort', 'Mean AUC', 'SD', 'Apparent AUC', 'Optimism'];
        const cvRows = [];

        ['Overall', 'surgeryAlone', 'neoadjuvantTherapy'].forEach(cohortId => {
            const cv = allStats[cohortId]?.crossValidation;
            
            if (!cv) {
                cvRows.push([getCohortDisplayName(cohortId), 'N/A', 'N/A', 'N/A', 'N/A']);
                return;
            }

            cvRows.push([
                `**${getCohortDisplayName(cohortId)}**`,
                cv.meanAUC?.toFixed(3) || 'N/A',
                cv.sdAUC?.toFixed(3) || 'N/A',
                cv.apparentAUC?.toFixed(3) || 'N/A',
                cv.optimism?.toFixed(3) || 'N/A'
            ]);
        });

        md += createMarkdownTable(cvHeaders, cvRows);
        md += '\n**Note:** Optimism = Apparent AUC - Cross-Validated AUC. A positive value indicates overfitting.\n\n';

        // Inter-Cohort Comparison
        const interComp = allStats.interCohortComparison;
        if (interComp) {
            md += `### 7.3 Inter-Cohort Comparison

Comparison between Surgery alone and Neoadjuvant therapy cohorts:

| Metric | Comparison | P-value |
| --- | --- | --- |
| Age | Welch's t-test | ${formatPValue(allStats.interCohortDemographicComparison?.age?.pValue)} |
| Sex distribution | Fisher's exact test | ${formatPValue(allStats.interCohortDemographicComparison?.sex?.pValue)} |
| N+ rate | Fisher's exact test | ${formatPValue(allStats.interCohortDemographicComparison?.nStatus?.pValue)} |
| AS AUC | Z-test for independent AUCs | ${formatPValue(interComp.as?.pValue)} |

`;
        }

        md += '---\n\n';
        return md;
    }

    /**
     * Generiert das vollständige Markdown-Dokument
     * @param {object} allStats - Alle Statistiken
     * @returns {string} Vollständiges Markdown-Dokument
     */
    function generateFullMarkdown(allStats) {
        if (!allStats) {
            return '# Error\n\nNo statistics data available for export.';
        }

        let markdown = '';
        markdown += generateTitleSection();
        markdown += generateDemographicsSection(allStats);
        markdown += generateAvocadoSignSection(allStats);
        markdown += generateEsgarSection(allStats);
        markdown += generateCohortOptimisedSection(allStats);
        markdown += generateLiteratureCriteriaSection(allStats);
        markdown += generateNodeSizeSection(allStats);
        markdown += generateStatisticalComparisonsSection(allStats);

        // Footer
        markdown += `## References

1. Lurz M, Schäfer AO. The Avocado Sign: A novel imaging marker for nodal staging in rectal cancer. Eur Radiol. 2025.
2. Beets-Tan RGH, et al. ESGAR consensus guidelines. Eur Radiol. 2018;28:1465-1475.
3. Rutegård MK, et al. Evaluation of MRI characterisation of lymph nodes. Eur Radiol. 2025;35(1):49-60.

---

*Generated by ${window.APP_CONFIG.APP_NAME} v${window.APP_CONFIG.APP_VERSION}*
`;

        return markdown;
    }

    /**
     * Exportiert das Markdown-Dokument als Datei
     * @param {object} allStats - Alle Statistiken
     * @param {string} filename - Dateiname (ohne Erweiterung)
     */
    function exportMarkdown(allStats, filename = 'Results_AvocadoSign_ESGAR') {
        const markdown = generateFullMarkdown(allStats);
        const timestamp = getCurrentDateString('YYYYMMDD');
        const fullFilename = `${filename}_${timestamp}.md`;
        
        // Blob erstellen und herunterladen
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fullFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (window.uiManager) {
            window.uiManager.showToast(`Markdown exported: ${fullFilename}`, 'success', 3000);
        }

        return markdown;
    }

    /**
     * Gibt nur das Markdown zurück (ohne Download)
     * @param {object} allStats - Alle Statistiken
     * @returns {string} Markdown-Inhalt
     */
    function getMarkdownPreview(allStats) {
        return generateFullMarkdown(allStats);
    }

    return Object.freeze({
        exportMarkdown,
        getMarkdownPreview,
        generateFullMarkdown
    });
})();
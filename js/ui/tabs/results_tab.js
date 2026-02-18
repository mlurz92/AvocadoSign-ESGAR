/**
 * Results Tab
 * Zeigt alle publizierte-relevanten Daten strukturiert an
 * Ermöglicht Markdown-Export
 */
window.resultsTab = (() => {

    /**
     * Formatiert eine Prozentzahl mit CI für die Anzeige
     */
    function _formatMetric(value, ci, isPercent = true, decimals = 1) {
        if (isNaN(value)) return '<span class="text-muted">N/A</span>';
        
        const formatted = isPercent 
            ? `${(value * 100).toFixed(decimals)}%`
            : value.toFixed(decimals);
        
        if (ci && !isNaN(ci.lower) && !isNaN(ci.upper)) {
            const lower = isPercent ? (ci.lower * 100).toFixed(decimals) : ci.lower.toFixed(decimals);
            const upper = isPercent ? (ci.upper * 100).toFixed(decimals) : ci.upper.toFixed(decimals);
            return `<strong>${formatted}</strong> <small class="text-muted">(${lower}-${upper})</small>`;
        }
        return `<strong>${formatted}</strong>`;
    }

    /**
     * Erstellt eine Performance-Tabelle für eine Methode
     */
    function _createPerformanceTable(stats, title, description = '') {
        if (!stats) {
            return `<div class="alert alert-warning">${title}: Data not available</div>`;
        }

        const n = (stats.matrix?.tp || 0) + (stats.matrix?.fp || 0) + (stats.matrix?.fn || 0) + (stats.matrix?.tn || 0);

        return `
            <div class="table-responsive">
                <table class="table table-sm table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Metric</th>
                            <th>Value</th>
                            <th>95% CI</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span data-tippy-content="${window.APP_CONFIG.UI_TEXTS.tooltips.definition.auc.title}">AUC</span></td>
                            <td>${_formatMetric(stats.auc?.value, stats.auc?.ci, false, 2)}</td>
                            <td><small class="text-muted">${stats.auc?.method || 'Bootstrap'}</small></td>
                        </tr>
                        <tr>
                            <td><span data-tippy-content="${window.APP_CONFIG.UI_TEXTS.tooltips.definition.sens.title}">Sensitivity</span></td>
                            <td>${_formatMetric(stats.sens?.value, stats.sens?.ci, true, 1)}</td>
                            <td><small class="text-muted">${stats.sens?.method || 'Wilson Score'}</small></td>
                        </tr>
                        <tr>
                            <td><span data-tippy-content="${window.APP_CONFIG.UI_TEXTS.tooltips.definition.spec.title}">Specificity</span></td>
                            <td>${_formatMetric(stats.spec?.value, stats.spec?.ci, true, 1)}</td>
                            <td><small class="text-muted">${stats.spec?.method || 'Wilson Score'}</small></td>
                        </tr>
                        <tr>
                            <td><span data-tippy-content="${window.APP_CONFIG.UI_TEXTS.tooltips.definition.ppv.title}">PPV</span></td>
                            <td>${_formatMetric(stats.ppv?.value, stats.ppv?.ci, true, 1)}</td>
                            <td><small class="text-muted">${stats.ppv?.method || 'Wilson Score'}</small></td>
                        </tr>
                        <tr>
                            <td><span data-tippy-content="${window.APP_CONFIG.UI_TEXTS.tooltips.definition.npv.title}">NPV</span></td>
                            <td>${_formatMetric(stats.npv?.value, stats.npv?.ci, true, 1)}</td>
                            <td><small class="text-muted">${stats.npv?.method || 'Wilson Score'}</small></td>
                        </tr>
                        <tr>
                            <td><span data-tippy-content="${window.APP_CONFIG.UI_TEXTS.tooltips.definition.acc.title}">Accuracy</span></td>
                            <td>${_formatMetric(stats.acc?.value, stats.acc?.ci, true, 1)}</td>
                            <td><small class="text-muted">${stats.acc?.method || 'Wilson Score'}</small></td>
                        </tr>
                    </tbody>
                    <tfoot class="table-light">
                        <tr>
                            <td colspan="3"><small class="text-muted">N = ${n} | TP=${stats.matrix?.tp || 0}, FP=${stats.matrix?.fp || 0}, FN=${stats.matrix?.fn || 0}, TN=${stats.matrix?.tn || 0}</small></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            ${description ? `<p class="card-text small text-muted mt-2">${description}</p>` : ''}
        `;
    }

    /**
     * Erstellt die Demographics-Tabelle
     */
    function _createDemographicsTable(allStats) {
        const overall = allStats.Overall?.descriptive;
        const surgeryAlone = allStats.surgeryAlone?.descriptive;
        const neoadjuvant = allStats.neoadjuvantTherapy?.descriptive;

        if (!overall) {
            return '<div class="alert alert-warning">Demographics data not available</div>';
        }

        const createCell = (value, total = null, isPercent = true) => {
            if (value === undefined || value === null) return '<span class="text-muted">N/A</span>';
            if (total !== null) {
                const percent = ((value / total) * 100).toFixed(1);
                return `${value} <small class="text-muted">(${percent}%)</small>`;
            }
            return value;
        };

        return `
            <div class="table-responsive">
                <table class="table table-sm table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Characteristic</th>
                            <th>Overall (N=${overall.patientCount || 0})</th>
                            <th>Surgery alone (N=${surgeryAlone?.patientCount || 0})</th>
                            <th>Neoadjuvant (N=${neoadjuvant?.patientCount || 0})</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="table-secondary">
                            <td colspan="4"><strong>Age (years)</strong></td>
                        </tr>
                        <tr>
                            <td class="ps-4">Median (IQR)</td>
                            <td>${overall.age?.median?.toFixed(1) || 'N/A'} (${overall.age?.q1?.toFixed(1) || 'N/A'}-${overall.age?.q3?.toFixed(1) || 'N/A'})</td>
                            <td>${surgeryAlone?.age?.median?.toFixed(1) || 'N/A'} (${surgeryAlone?.age?.q1?.toFixed(1) || 'N/A'}-${surgeryAlone?.age?.q3?.toFixed(1) || 'N/A'})</td>
                            <td>${neoadjuvant?.age?.median?.toFixed(1) || 'N/A'} (${neoadjuvant?.age?.q1?.toFixed(1) || 'N/A'}-${neoadjuvant?.age?.q3?.toFixed(1) || 'N/A'})</td>
                        </tr>
                        <tr>
                            <td class="ps-4">Range</td>
                            <td>${overall.age?.min?.toFixed(0) || 'N/A'}-${overall.age?.max?.toFixed(0) || 'N/A'}</td>
                            <td>${surgeryAlone?.age?.min?.toFixed(0) || 'N/A'}-${surgeryAlone?.age?.max?.toFixed(0) || 'N/A'}</td>
                            <td>${neoadjuvant?.age?.min?.toFixed(0) || 'N/A'}-${neoadjuvant?.age?.max?.toFixed(0) || 'N/A'}</td>
                        </tr>
                        <tr class="table-secondary">
                            <td colspan="4"><strong>Sex</strong></td>
                        </tr>
                        <tr>
                            <td class="ps-4">Male</td>
                            <td>${createCell(overall.sex?.m, overall.patientCount)}</td>
                            <td>${createCell(surgeryAlone?.sex?.m, surgeryAlone?.patientCount)}</td>
                            <td>${createCell(neoadjuvant?.sex?.m, neoadjuvant?.patientCount)}</td>
                        </tr>
                        <tr>
                            <td class="ps-4">Female</td>
                            <td>${createCell(overall.sex?.f, overall.patientCount)}</td>
                            <td>${createCell(surgeryAlone?.sex?.f, surgeryAlone?.patientCount)}</td>
                            <td>${createCell(neoadjuvant?.sex?.f, neoadjuvant?.patientCount)}</td>
                        </tr>
                        <tr class="table-secondary">
                            <td colspan="4"><strong>Nodal Status (Pathology)</strong></td>
                        </tr>
                        <tr>
                            <td class="ps-4">N+ (Positive)</td>
                            <td>${createCell(overall.nStatus?.plus, overall.patientCount)}</td>
                            <td>${createCell(surgeryAlone?.nStatus?.plus, surgeryAlone?.patientCount)}</td>
                            <td>${createCell(neoadjuvant?.nStatus?.plus, neoadjuvant?.patientCount)}</td>
                        </tr>
                        <tr>
                            <td class="ps-4">N- (Negative)</td>
                            <td>${createCell(overall.nStatus?.minus, overall.patientCount)}</td>
                            <td>${createCell(surgeryAlone?.nStatus?.minus, surgeryAlone?.patientCount)}</td>
                            <td>${createCell(neoadjuvant?.nStatus?.minus, neoadjuvant?.patientCount)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Erstellt die Node Size Analysis Sektion
     */
    function _createNodeSizeSection(allStats) {
        const sizeData = allStats.Overall?.sizeAnalysis;
        
        if (!sizeData) {
            return '<div class="alert alert-warning">Node size analysis data not available</div>';
        }

        const total = sizeData.categories?.total || 0;
        const small = sizeData.categories?.small || 0;
        const medium = sizeData.categories?.medium || 0;
        const large = sizeData.categories?.large || 0;

        return `
            <div class="row">
                <div class="col-md-6">
                    <h6 class="border-bottom pb-2 mb-3">Size Distribution</h6>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead class="table-light">
                                <tr>
                                    <th>Category</th>
                                    <th>Count</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>< 5 mm</td>
                                    <td>${small}</td>
                                    <td>${((small / total) * 100).toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <td>5 - 8 mm</td>
                                    <td>${medium}</td>
                                    <td>${((medium / total) * 100).toFixed(1)}%</td>
                                </tr>
                                <tr>
                                    <td>ge 9 mm</td>
                                    <td>${large}</td>
                                    <td>${((large / total) * 100).toFixed(1)}%</td>
                                </tr>
                                <tr class="table-secondary">
                                    <td><strong>Total</strong></td>
                                    <td><strong>${total}</strong></td>
                                    <td><strong>100%</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col-md-6">
                    <h6 class="border-bottom pb-2 mb-3">Mean Size by Status</h6>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead class="table-light">
                                <tr>
                                    <th>Status</th>
                                    <th>Mean (mm)</th>
                                    <th>SD</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>AS+</td>
                                    <td>${sizeData.asPos?.stats?.mean?.toFixed(2) || 'N/A'}</td>
                                    <td>${sizeData.asPos?.stats?.sd?.toFixed(2) || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>AS-</td>
                                    <td>${sizeData.asNeg?.stats?.mean?.toFixed(2) || 'N/A'}</td>
                                    <td>${sizeData.asNeg?.stats?.sd?.toFixed(2) || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>N+</td>
                                    <td>${sizeData.nPos?.stats?.mean?.toFixed(2) || 'N/A'}</td>
                                    <td>${sizeData.nPos?.stats?.sd?.toFixed(2) || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>N-</td>
                                    <td>${sizeData.nNeg?.stats?.mean?.toFixed(2) || 'N/A'}</td>
                                    <td>${sizeData.nNeg?.stats?.sd?.toFixed(2) || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Erstellt die DeLong Comparison Tabelle
     * Für ESGAR 2016 werden kohortenspezifische IDs verwendet
     */
    function _createComparisonTable(allStats, studyId, studyName) {
        const rows = [];

        // Mapping von cohortId zur entsprechenden ESGAR 2016 studyId
        const esgarStudyIdMap = {
            'Overall': 'ESGAR_2016_Overall',
            'surgeryAlone': 'ESGAR_2016_SurgeryAlone',
            'neoadjuvantTherapy': 'ESGAR_2016_Neoadjuvant'
        };

        ['Overall', 'surgeryAlone', 'neoadjuvantTherapy'].forEach(cohortId => {
            const cohortStats = allStats[cohortId];
            const perfAS = cohortStats?.performanceAS;
            
            // Verwende kohortenspezifische ESGAR-ID wenn studyId 'ESGAR_2016' ist
            const effectiveStudyId = studyId === 'ESGAR_2016' 
                ? (esgarStudyIdMap[cohortId] || studyId) 
                : studyId;
            
            const perfT2 = cohortStats?.performanceT2Literature?.[effectiveStudyId];
            const comp = cohortStats?.comparisonASvsT2Literature?.[effectiveStudyId];

            if (!perfAS || !perfT2 || !comp?.delong) {
                rows.push(`
                    <tr>
                        <td><strong>${getCohortDisplayName(cohortId)}</strong></td>
                        <td colspan="5" class="text-center text-muted">Data not available</td>
                    </tr>
                `);
                return;
            }

            const pValue = comp.delong.pValue;
            const pValueFormatted = isNaN(pValue) ? 'N/A' : (pValue < 0.001 ? '<0.001' : pValue.toFixed(3));
            const significance = pValue < 0.05 ? '<span class="badge bg-success">Significant</span>' : '<span class="badge bg-secondary">n.s.</span>';

            rows.push(`
                <tr>
                    <td><strong>${getCohortDisplayName(cohortId)}</strong></td>
                    <td>${perfAS.auc?.value?.toFixed(2) || 'N/A'}</td>
                    <td>${perfT2.auc?.value?.toFixed(2) || 'N/A'}</td>
                    <td>${comp.delong.diffAUC?.toFixed(3) || 'N/A'}</td>
                    <td>${pValueFormatted} ${significance}</td>
                    <td>${comp.delong.power ? formatPercent(comp.delong.power, 1) : 'N/A'}</td>
                </tr>
            `);
        });

        return `
            <div class="table-responsive">
                <table class="table table-sm table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Cohort</th>
                            <th>AS AUC</th>
                            <th>${studyName} AUC</th>
                            <th>Difference</th>
                            <th>P-value</th>
                            <th>Power</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Erstellt die Cross-Validation Tabelle
     */
    function _createCrossValidationTable(allStats) {
        const rows = [];

        ['Overall', 'surgeryAlone', 'neoadjuvantTherapy'].forEach(cohortId => {
            const cv = allStats[cohortId]?.crossValidation;

            if (!cv) {
                rows.push(`
                    <tr>
                        <td><strong>${getCohortDisplayName(cohortId)}</strong></td>
                        <td colspan="4" class="text-center text-muted">Not available</td>
                    </tr>
                `);
                return;
            }

            rows.push(`
                <tr>
                    <td><strong>${getCohortDisplayName(cohortId)}</strong></td>
                    <td>${cv.meanAUC?.toFixed(3) || 'N/A'}</td>
                    <td>${cv.sdAUC?.toFixed(3) || 'N/A'}</td>
                    <td>${cv.apparentAUC?.toFixed(3) || 'N/A'}</td>
                    <td>${cv.optimism?.toFixed(3) || 'N/A'}</td>
                </tr>
            `);
        });

        return `
            <div class="table-responsive">
                <table class="table table-sm table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Cohort</th>
                            <th>Mean AUC (CV)</th>
                            <th>SD</th>
                            <th>Apparent AUC</th>
                            <th>Optimism</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.join('')}
                    </tbody>
                </table>
            </div>
            <p class="card-text small text-muted mt-2">
                <strong>Optimism</strong> = Apparent AUC - Cross-Validated AUC. A positive value indicates overfitting.
            </p>
        `;
    }

    /**
     * Formatiert ein criteria-Objekt in einen lesbaren String
     * @param {Object} criteria - Das criteria-Objekt aus bruteforceDefinitions
     * @returns {string} - Formatierte Kriterien als lesbarer String
     */
    function _formatCriteriaToString(criteria) {
        if (!criteria || typeof criteria !== 'object') {
            return 'N/A';
        }

        const parts = [];

        // Size criterion
        if (criteria.size && criteria.size.active) {
            const threshold = criteria.size.threshold;
            const condition = criteria.size.condition || '>=';
            if (typeof threshold === 'number') {
                parts.push(`size ${condition} ${threshold.toFixed(1)}mm`);
            }
        }

        // Shape criterion
        if (criteria.shape && criteria.shape.active && criteria.shape.value) {
            parts.push(`${criteria.shape.value} shape`);
        }

        // Border criterion
        if (criteria.border && criteria.border.active && criteria.border.value) {
            parts.push(`${criteria.border.value} border`);
        }

        // Homogeneity criterion
        if (criteria.homogeneity && criteria.homogeneity.active && criteria.homogeneity.value) {
            parts.push(`${criteria.homogeneity.value}`);
        }

        // Signal criterion
        if (criteria.signal && criteria.signal.active && criteria.signal.value) {
            // Format signal value for display (e.g., "lowSignal" -> "low signal")
            const signalDisplay = criteria.signal.value
                .replace(/Signal$/, ' signal')
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .toLowerCase();
            parts.push(signalDisplay);
        }

        return parts.length > 0 ? parts.join(' AND ') : 'N/A';
    }

    /**
     * Erstellt die Brute-Force Parameters Sektion mit detaillierten Informationen
     * für wissenschaftliche Publikationen (basierend auf Revision Letter Anforderungen)
     * Iteriert über alle Kohorten und zeigt die optimierten Kriterien für jede Kohorte an
     */
    function _createBruteforceParametersSection(allStats) {
        // Liste aller Kohorten, die Brute-Force-Ergebnisse haben können
        const cohortIds = ['Overall', 'surgeryAlone', 'neoadjuvantTherapy'];
        
        // Sammle alle Kohorten mit Brute-Force-Daten
        const cohortsWithData = [];
        let totalTested = 'N/A';
        
        cohortIds.forEach(cohortId => {
            const bruteforceDefs = allStats[cohortId]?.bruteforceDefinitions;
            if (bruteforceDefs && Object.keys(bruteforceDefs).length > 0) {
                cohortsWithData.push({
                    cohortId: cohortId,
                    bruteforceDefs: bruteforceDefs
                });
                
                // Extrahiere totalTested aus den ersten verfügbaren Definition
                if (totalTested === 'N/A') {
                    const firstDef = Object.values(bruteforceDefs)[0];
                    if (firstDef?.totalTested !== undefined) {
                        totalTested = firstDef.totalTested.toLocaleString();
                    }
                }
            }
        });
        
        if (cohortsWithData.length === 0) {
            return '<p class="text-muted small">No Brute-Force parameter data available.</p>';
        }

        // Grid Search Approach Beschreibung
        const gridSearchDescription = `
            <div class="mb-4">
                <h6 class="border-bottom pb-2 mb-3">Grid Search Approach</h6>
                <ul class="list-unstyled small">
                    <li class="mb-2"><i class="fas fa-check text-success me-2"></i>Exhaustive grid search across all permutations of morphological T2 criteria</li>
                    <li class="mb-2"><i class="fas fa-check text-success me-2"></i>Incremental step size: 0.1 mm for size thresholds (range: 0.1–25.0 mm)</li>
                    <li class="mb-2"><i class="fas fa-check text-success me-2"></i>Validation: Stratified 10-fold cross-validation with optimism correction</li>
                    <li class="mb-2"><i class="fas fa-check text-success me-2"></i>Optimization criterion: Maximization of selected metric (e.g., Balanced Accuracy, Youden Index)</li>
                </ul>
            </div>
        `;

        // Detaillierte Parameter-Tabelle
        const parameterTable = `
            <div class="mb-4">
                <h6 class="border-bottom pb-2 mb-3">Parameters Tested</h6>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                        <thead class="table-light">
                            <tr>
                                <th style="width: 30%;">Parameter</th>
                                <th>Values Tested</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Size threshold</strong></td>
                                <td>0.1–25.0 mm (0.1 mm increments)</td>
                            </tr>
                            <tr>
                                <td><strong>Shape</strong></td>
                                <td>round, oval</td>
                            </tr>
                            <tr>
                                <td><strong>Border</strong></td>
                                <td>sharp, irregular</td>
                            </tr>
                            <tr>
                                <td><strong>Homogeneity</strong></td>
                                <td>homogeneous, heterogeneous</td>
                            </tr>
                            <tr>
                                <td><strong>Signal intensity</strong></td>
                                <td>lowSignal, intermediateSignal, highSignal</td>
                            </tr>
                            <tr>
                                <td><strong>Logic operators</strong></td>
                                <td>AND, OR</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Gesamtanzahl der getesteten Permutationen
        const permutationsInfo = `
            <div class="alert alert-info py-2 mb-4">
                <strong><i class="fas fa-calculator me-2"></i>Total Permutations Tested:</strong> ${totalTested}
            </div>
        `;

        // Optimierte Kriterien pro Metrik und Kohorte (kompakte Tabelle)
        const optimizedCriteriaRows = [];
        cohortsWithData.forEach(({ cohortId, bruteforceDefs }) => {
            const cohortDisplayName = getCohortDisplayName(cohortId);
            Object.entries(bruteforceDefs).forEach(([metricName, def]) => {
                const criteriaString = _formatCriteriaToString(def.criteria);
                optimizedCriteriaRows.push(`
                    <tr>
                        <td><strong>${metricName}</strong></td>
                        <td>${cohortDisplayName}</td>
                        <td><code>${criteriaString}</code></td>
                        <td>${def.logic || 'N/A'}</td>
                        <td>${def.metricValue !== undefined ? (def.metricValue * 100).toFixed(2) + '%' : 'N/A'}</td>
                    </tr>
                `);
            });
        });

        const optimizedCriteriaTable = `
            <div class="mb-3">
                <h6 class="border-bottom pb-2 mb-3">Optimised Criteria by Metric and Cohort</h6>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered table-hover">
                        <thead class="table-light">
                            <tr>
                                <th>Optimization Metric</th>
                                <th>Cohort</th>
                                <th>Optimised Criteria</th>
                                <th>Logic</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${optimizedCriteriaRows.join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        return `
            <div class="bruteforce-parameters-section">
                ${gridSearchDescription}
                ${parameterTable}
                ${permutationsInfo}
                ${optimizedCriteriaTable}
            </div>
        `;
    }

    /**
     * Erstellt die Brute-Force Definitions Tabelle für eine Kohorte
     * @deprecated Use _createBruteforceParametersSection instead
     */
    function _createBruteforceDefinitionsTable(allStats, cohortId) {
        // Wrapper für Rückwärtskompatibilität
        // Wenn cohortId angegeben wird, wird es ignoriert - die neue Funktion iteriert über alle Kohorten
        return _createBruteforceParametersSection(allStats);
    }

    /**
     * Haupt-Render-Funktion
     */
    function render(allStats) {
        if (!allStats) {
            return `
                <div class="container-fluid p-4">
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No statistics data available. Please ensure data is loaded and analysis has been performed.
                    </div>
                </div>
            `;
        }

        const html = `
            <div class="container-fluid p-4">
                <!-- Header with Export Button -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="mb-0"><i class="fas fa-file-medical me-2"></i>Publication Results</h4>
                    <button id="btn-export-markdown" class="btn btn-primary" data-tippy-content="Export all results as Markdown document">
                        <i class="fas fa-download me-2"></i>Export Markdown
                    </button>
                </div>

                <!-- Introduction -->
                <div class="alert alert-info mb-4">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Summary:</strong> This tab presents all publication-relevant data structured for manuscript preparation.
                    Click "Export Markdown" to download a complete Markdown document with all tables and metrics.
                </div>

                <!-- Section 1: Patient Demographics -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-light">
                        <h5 class="mb-0"><i class="fas fa-users me-2"></i>1. Patient Demographics</h5>
                    </div>
                    <div class="card-body">
                        ${_createDemographicsTable(allStats)}
                    </div>
                </div>

                <!-- Section 2: Avocado Sign Performance -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-light">
                        <h5 class="mb-0"><i class="fas fa-check-circle me-2 text-success"></i>2. Avocado Sign Performance</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <h6 class="border-bottom pb-2 mb-3">Overall Cohort</h6>
                                ${_createPerformanceTable(allStats.Overall?.performanceAS, 'Overall')}
                            </div>
                            <div class="col-md-4">
                                <h6 class="border-bottom pb-2 mb-3">Surgery Alone</h6>
                                ${_createPerformanceTable(allStats.surgeryAlone?.performanceAS, 'Surgery Alone')}
                            </div>
                            <div class="col-md-4">
                                <h6 class="border-bottom pb-2 mb-3">Neoadjuvant Therapy</h6>
                                ${_createPerformanceTable(allStats.neoadjuvantTherapy?.performanceAS, 'Neoadjuvant')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 3: ESGAR Criteria Performance -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-light">
                        <h5 class="mb-0"><i class="fas fa-balance-scale me-2 text-primary"></i>3. ESGAR 2016 Criteria Performance</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text small text-muted mb-3">
                            <strong>Reference:</strong> Beets-Tan RGH, et al. Eur Radiol. 2018;28:1465-1475.
                        </p>
                        <div class="row">
                            <div class="col-md-4">
                                <h6 class="border-bottom pb-2 mb-3">Overall Cohort</h6>
                                ${_createPerformanceTable(allStats.Overall?.performanceT2Literature?.ESGAR_2016_Overall, 'ESGAR 2016')}
                            </div>
                            <div class="col-md-4">
                                <h6 class="border-bottom pb-2 mb-3">Surgery Alone</h6>
                                ${_createPerformanceTable(allStats.surgeryAlone?.performanceT2Literature?.ESGAR_2016_SurgeryAlone, 'ESGAR 2016')}
                            </div>
                            <div class="col-md-4">
                                <h6 class="border-bottom pb-2 mb-3">Neoadjuvant Therapy</h6>
                                ${_createPerformanceTable(allStats.neoadjuvantTherapy?.performanceT2Literature?.ESGAR_2016_Neoadjuvant, 'ESGAR 2016')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 4: Cohort-Optimised T2 -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-light">
                        <h5 class="mb-0"><i class="fas fa-cogs me-2 text-warning"></i>4. Cohort-Optimised T2 Criteria</h5>
                    </div>
                    <div class="card-body">
                        <!-- Brute-Force Parameters Section -->
                        <div class="mb-4">
                            ${_createBruteforceParametersSection(allStats)}
                        </div>
                        
                        <hr class="my-4">
                        
                        <!-- Performance by Cohort -->
                        <h6 class="border-bottom pb-2 mb-3">Performance by Cohort (Balanced Accuracy Optimisation)</h6>
                        <div class="row">
                            <div class="col-md-4">
                                <h6 class="border-bottom pb-2 mb-3">Overall Cohort</h6>
                                ${_createPerformanceTable(allStats.Overall?.performanceT2Bruteforce?.['Balanced Accuracy'], 'Optimised T2')}
                            </div>
                            <div class="col-md-4">
                                <h6 class="border-bottom pb-2 mb-3">Surgery Alone</h6>
                                ${_createPerformanceTable(allStats.surgeryAlone?.performanceT2Bruteforce?.['Balanced Accuracy'], 'Optimised T2')}
                            </div>
                            <div class="col-md-4">
                                <h6 class="border-bottom pb-2 mb-3">Neoadjuvant Therapy</h6>
                                ${_createPerformanceTable(allStats.neoadjuvantTherapy?.performanceT2Bruteforce?.['Balanced Accuracy'], 'Optimised T2')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 5: Literature-Derived Criteria -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-light">
                        <h5 class="mb-0"><i class="fas fa-book me-2 text-info"></i>5. Literature-Derived Criteria</h5>
                    </div>
                    <div class="card-body" id="literature-criteria-results">
                        <p class="text-muted small">Loading literature criteria data...</p>
                    </div>
                </div>

                <!-- Section 6: Node Size Analysis -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-light">
                        <h5 class="mb-0"><i class="fas fa-ruler-combined me-2 text-secondary"></i>6. Node Size Analysis</h5>
                    </div>
                    <div class="card-body">
                        ${_createNodeSizeSection(allStats)}
                    </div>
                </div>

                <!-- Section 7: Statistical Comparisons -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-light">
                        <h5 class="mb-0"><i class="fas fa-chart-bar me-2 text-danger"></i>7. Statistical Comparisons</h5>
                    </div>
                    <div class="card-body">
                        <h6 class="border-bottom pb-2 mb-3">DeLong Test: Avocado Sign vs. ESGAR 2016</h6>
                        ${_createComparisonTable(allStats, 'ESGAR_2016', 'ESGAR')}
                        
                        <hr class="my-4">
                        
                        <h6 class="border-bottom pb-2 mb-3">Cross-Validation Results (10-Fold)</h6>
                        ${_createCrossValidationTable(allStats)}
                    </div>
                </div>

                <!-- Footer -->
                <div class="text-center text-muted small mt-4 pb-4">
                    <p>Generated by <strong>${window.APP_CONFIG.APP_NAME}</strong> v${window.APP_CONFIG.APP_VERSION}</p>
                </div>
            </div>
        `;

        // Nach dem Rendern: Literature Criteria laden
        setTimeout(() => _renderLiteratureCriteria(allStats), 50);

        return html;
    }

    /**
     * Rendert die Literature-Derived Criteria Tabelle
     */
    function _renderLiteratureCriteria(allStats) {
        const container = document.getElementById('literature-criteria-results');
        if (!container) return;

        const allLiteratureSets = window.studyT2CriteriaManager?.getAllStudyCriteriaSets() || [];
        
        if (allLiteratureSets.length === 0) {
            container.innerHTML = '<p class="text-muted small">No literature criteria sets available.</p>';
            return;
        }

        const rows = [];
        allLiteratureSets.forEach(studySet => {
            const cohortId = studySet.applicableCohort || 'Overall';
            const stats = allStats[cohortId]?.performanceT2Literature?.[studySet.id];

            if (!stats) {
                rows.push(`
                    <tr>
                        <td><strong>${studySet.displayShortName || studySet.name}</strong></td>
                        <td>${getCohortDisplayName(cohortId)}</td>
                        <td colspan="5" class="text-center text-muted">N/A</td>
                    </tr>
                `);
                return;
            }

            rows.push(`
                <tr>
                    <td><strong>${studySet.displayShortName || studySet.name}</strong></td>
                    <td>${getCohortDisplayName(cohortId)}</td>
                    <td>${stats.auc?.value?.toFixed(2) || 'N/A'}</td>
                    <td>${formatPercent(stats.sens?.value, 1)}</td>
                    <td>${formatPercent(stats.spec?.value, 1)}</td>
                    <td>${formatPercent(stats.ppv?.value, 1)}</td>
                    <td>${formatPercent(stats.npv?.value, 1)}</td>
                </tr>
            `);
        });

        container.innerHTML = `
            <div class="table-responsive">
                <table class="table table-sm table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Study / Criteria</th>
                            <th>Cohort</th>
                            <th>AUC</th>
                            <th>Sensitivity</th>
                            <th>Specificity</th>
                            <th>PPV</th>
                            <th>NPV</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    return Object.freeze({
        render
    });
})();
/**
 * NodeSizeAnalysis - Comprehensive Node Size Analysis Service
 * 
 * Diese Klasse implementiert die Node Size Analysis gemäß den Anforderungen
 * des Reviewers (Revision Letter, Punkt 3):
 * 
 * 1. Size distribution of evaluated nodes - Größenverteilung aller Lymphknoten
 * 2. Mean size of Avocado Sign-positive versus negative nodes - Mittlere Größe
 * 3. Diagnostic performance stratified by node size - Performance nach Größe
 * 
 * WICHTIG: Da keine direkte Knoten-Level-Zuordnung zwischen T2-Knoten und AS-Status
 * existiert, wird ein Proxy-Ansatz verwendet:
 * - Knoten von AS+ Patienten werden als "AS-positiv" betrachtet (Proxy)
 * - Knoten von AS- Patienten werden als "AS-negativ" betrachtet (Proxy)
 * 
 * Patient-Level-Prinzip:
 * - Ein Patient wird als positiv für eine Größenkategorie klassifiziert,
 *   wenn mindestens ein Lymphknoten in dieser Kategorie liegt
 * - Die diagnostische Performance wird auf Patientenebene berechnet
 */

window.NodeSizeAnalysis = class NodeSizeAnalysis {

    /**
     * Konstruktor - Initialisiert die Analyse mit Patientendaten
     * @param {Array} patientData - Array von Patientenobjekten aus data/data.js
     */
    constructor(patientData = window.patientDataRaw) {
        this.patientData = patientData || [];
        this._cache = {
            allNodes: null,
            sizeDistribution: null,
            patientPerformanceByCategory: null
        };
    }

    // ========================================
    // PHASE 1: Knoten-Extraktion mit Proxy-Status
    // ========================================

    /**
     * Extrahiert alle Lymphknoten aus allen Patienten mit Proxy-AS-Status
     * @returns {Array} Array aller Knoten mit erweiterten Eigenschaften
     */
    extractAllNodesWithProxyStatus() {
        if (this._cache.allNodes !== null) {
            return this._cache.allNodes;
        }

        const allNodes = [];
        
        this.patientData.forEach(patient => {
            if (!patient || !Array.isArray(patient.t2Nodes)) return;
            
            const patientAsStatus = patient.asStatus; // Proxy-AS-Status
            const patientNStatus = patient.nStatus;    // Referenz-Standard
            const patientTherapy = patient.therapy;
            const patientId = patient.id;
            
            patient.t2Nodes.forEach((node, nodeIndex) => {
                if (!node || typeof node.size !== 'number' || isNaN(node.size)) return;
                
                allNodes.push({
                    // Knoten-Eigenschaften
                    size: node.size,
                    shape: node.shape,
                    border: node.border,
                    homogeneity: node.homogeneity,
                    signal: node.signal,
                    
                    // Proxy-Zuordnung (Kritisch für Analyse)
                    proxyAsStatus: patientAsStatus,  // '+' oder '-'
                    isProxyAsPositive: patientAsStatus === '+',
                    
                    // Referenz-Standard
                    nStatus: patientNStatus,         // '+' oder '-'
                    isNPositive: patientNStatus === '+',
                    
                    // Patienten-Info
                    patientId: patientId,
                    patientTherapy: patientTherapy,
                    nodeIndex: nodeIndex,
                    
                    // Größenkategorie
                    sizeCategory: this._getSizeCategory(node.size)
                });
            });
        });

        this._cache.allNodes = allNodes;
        return allNodes;
    }

    /**
     * Bestimmt die Größenkategorie eines Knotens
     * @param {number} size - Short-axis diameter in mm
     * @returns {string} Kategorie: 'small', 'medium', oder 'large'
     */
    _getSizeCategory(size) {
        if (size < 5.0) return 'small';      // < 5mm
        if (size < 9.0) return 'medium';     // 5-9mm
        return 'large';                       // >= 9mm
    }

    /**
     * Gibt die lesbaren Größenkategorien zurück
     * @returns {Object} Mapping von Kategorie-Keys zu Labels
     */
    getSizeCategoryLabels() {
        return {
            small: '< 5mm',
            medium: '5-9mm',
            large: '>= 9mm'
        };
    }

    // ========================================
    // PHASE 2: Größenverteilung analysieren
    // ========================================

    /**
     * Berechnet die vollständige Größenverteilung
     * @returns {Object} Detaillierte Größenverteilungsstatistiken
     */
    calculateSizeDistribution() {
        if (this._cache.sizeDistribution !== null) {
            return this._cache.sizeDistribution;
        }

        const allNodes = this.extractAllNodesWithProxyStatus();
        
        // Trenne Knoten nach Status
        const asPositiveNodes = allNodes.filter(n => n.isProxyAsPositive);
        const asNegativeNodes = allNodes.filter(n => !n.isProxyAsPositive);
        const nPositiveNodes = allNodes.filter(n => n.isNPositive);
        const nNegativeNodes = allNodes.filter(n => !n.isNPositive);
        
        // Berechne Statistiken für jede Gruppe
        const result = {
            // Knoten-Level Statistiken
            nodeStats: {
                all: this._calculateNodeStats(allNodes),
                asPositive: this._calculateNodeStats(asPositiveNodes),
                asNegative: this._calculateNodeStats(asNegativeNodes),
                nPositive: this._calculateNodeStats(nPositiveNodes),
                nNegative: this._calculateNodeStats(nNegativeNodes)
            },
            
            // Größenverteilung nach Kategorien
            sizeDistribution: {
                small: {
                    threshold: '< 5mm',
                    count: allNodes.filter(n => n.sizeCategory === 'small').length,
                    nodes: allNodes.filter(n => n.sizeCategory === 'small')
                },
                medium: {
                    threshold: '5-9mm',
                    count: allNodes.filter(n => n.sizeCategory === 'medium').length,
                    nodes: allNodes.filter(n => n.sizeCategory === 'medium')
                },
                large: {
                    threshold: '>= 9mm',
                    count: allNodes.filter(n => n.sizeCategory === 'large').length,
                    nodes: allNodes.filter(n => n.sizeCategory === 'large')
                }
            },
            
            // Gesamtanzahl
            totalNodes: allNodes.length,
            totalPatients: this.patientData.length,
            
            // Vergleich AS+ vs AS-
            asComparison: this._calculateAsComparison(asPositiveNodes, asNegativeNodes)
        };
        
        // Berechne Prozentsätze
        const total = result.totalNodes;
        if (total > 0) {
            result.sizeDistribution.small.percentage = (result.sizeDistribution.small.count / total * 100).toFixed(1);
            result.sizeDistribution.medium.percentage = (result.sizeDistribution.medium.count / total * 100).toFixed(1);
            result.sizeDistribution.large.percentage = (result.sizeDistribution.large.count / total * 100).toFixed(1);
        }
        
        this._cache.sizeDistribution = result;
        return result;
    }

    /**
     * Berechnet Statistiken für eine Gruppe von Knoten
     * @param {Array} nodes - Array von Knotenobjekten
     * @returns {Object} Statistik-Objekt
     */
    _calculateNodeStats(nodes) {
        if (!nodes || nodes.length === 0) {
            return {
                n: 0,
                mean: null,
                sd: null,
                median: null,
                min: null,
                max: null,
                q1: null,
                q3: null
            };
        }
        
        const sizes = nodes.map(n => n.size).sort((a, b) => a - b);
        const n = sizes.length;
        
        // Mean
        const mean = sizes.reduce((a, b) => a + b, 0) / n;
        
        // Standard Deviation
        let sd = null;
        if (n > 1) {
            const variance = sizes.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
            sd = Math.sqrt(variance);
        }
        
        // Median
        const median = n % 2 === 0 
            ? (sizes[n/2 - 1] + sizes[n/2]) / 2 
            : sizes[Math.floor(n/2)];
        
        // Quartiles
        const q1Index = Math.floor(n * 0.25);
        const q3Index = Math.floor(n * 0.75);
        
        return {
            n: n,
            mean: Math.round(mean * 100) / 100,
            sd: sd !== null ? Math.round(sd * 100) / 100 : null,
            median: Math.round(median * 100) / 100,
            min: sizes[0],
            max: sizes[n - 1],
            q1: sizes[q1Index],
            q3: sizes[q3Index]
        };
    }

    /**
     * Berechnet den Vergleich zwischen AS+ und AS- Knoten
     * @param {Array} asPositiveNodes - AS-positive Knoten
     * @param {Array} asNegativeNodes - AS-negative Knoten
     * @returns {Object} Vergleichsstatistiken
     */
    _calculateAsComparison(asPositiveNodes, asNegativeNodes) {
        const asPosStats = this._calculateNodeStats(asPositiveNodes);
        const asNegStats = this._calculateNodeStats(asNegativeNodes);
        
        // Welch's t-test für Größenvergleich
        let tTestResult = null;
        if (asPosStats.n > 1 && asNegStats.n > 1 && asPosStats.sd !== null && asNegStats.sd !== null) {
            tTestResult = this._performWelchTTest(
                asPositiveNodes.map(n => n.size),
                asNegativeNodes.map(n => n.size)
            );
        }
        
        return {
            asPositive: asPosStats,
            asNegative: asNegStats,
            meanDifference: asPosStats.mean !== null && asNegStats.mean !== null 
                ? Math.round((asPosStats.mean - asNegStats.mean) * 100) / 100 
                : null,
            tTest: tTestResult
        };
    }

    /**
     * Führt einen Welch's t-Test durch
     * @param {Array} sample1 - Erste Stichprobe
     * @param {Array} sample2 - Zweite Stichprobe
     * @returns {Object} t-Test Ergebnis
     */
    _performWelchTTest(sample1, sample2) {
        const n1 = sample1.length;
        const n2 = sample2.length;
        
        const mean1 = sample1.reduce((a, b) => a + b, 0) / n1;
        const mean2 = sample2.reduce((a, b) => a + b, 0) / n2;
        
        const var1 = sample1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) / (n1 - 1);
        const var2 = sample2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0) / (n2 - 1);
        
        const se = Math.sqrt(var1/n1 + var2/n2);
        const t = (mean1 - mean2) / se;
        
        // Freiheitsgrade nach Welch-Satterthwaite
        const df = Math.pow(var1/n1 + var2/n2, 2) / 
                   (Math.pow(var1/n1, 2)/(n1-1) + Math.pow(var2/n2, 2)/(n2-1));
        
        // p-Wert approximieren (zweiseitig)
        const pValue = this._approximatePValue(Math.abs(t), df);
        
        return {
            t: Math.round(t * 1000) / 1000,
            df: Math.round(df * 10) / 10,
            pValue: Math.round(pValue * 1000) / 1000,
            significant: pValue < 0.05
        };
    }

    /**
     * Approximiert den p-Wert für einen t-Wert mit gegebenen Freiheitsgraden
     * @param {number} t - t-Wert (absolut)
     * @param {number} df - Freiheitsgrade
     * @returns {number} p-Wert (zweiseitig)
     */
    _approximatePValue(t, df) {
        // Vereinfachte Approximation für große Stichproben
        // Für kleine Stichproben wäre eine genauere Methode nötig
        if (df > 30) {
            // Normalverteilungs-Approximation
            const z = t;
            // Standard Normal CDF Approximation
            const p = 2 * (1 - this._normalCDF(Math.abs(z)));
            return p;
        }
        
        // Für kleinere Stichproben: Konservative Schätzung
        // Dies ist eine Vereinfachung - für exakte Werte würde man eine t-Verteilungs-Bibliothek benötigen
        const p = 2 * (1 - this._tCDFApprox(Math.abs(t), df));
        return p;
    }

    /**
     * Standard Normal CDF Approximation
     */
    _normalCDF(x) {
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3276511;
        
        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x) / Math.sqrt(2);
        
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t) + a1) * t * Math.exp(-x * x);
        
        return 0.5 * (1.0 + sign * y);
    }

    /**
     * Approximative t-Verteilungs-CDF
     */
    _tCDFApprox(t, df) {
        // Vereinfachte Approximation
        const x = df / (df + t * t);
        // Dies ist eine grobe Approximation
        return 1 - 0.5 * Math.pow(x, df/2);
    }

    // ========================================
    // PHASE 3: Patient-Level Performance nach Größe
    // ========================================

    /**
     * Berechnet die Patient-Level Performance für jede Größenkategorie
     * 
     * Patient-Level-Prinzip:
     * - Ein Patient wird als "hat Knoten in Kategorie X" klassifiziert,
     *   wenn mindestens ein Lymphknoten in dieser Kategorie liegt
     * - Die Performance wird dann für diese Patientengruppe berechnet
     * 
     * @returns {Object} Performance-Metriken pro Größenkategorie
     */
    calculatePatientPerformanceBySizeCategory() {
        if (this._cache.patientPerformanceByCategory !== null) {
            return this._cache.patientPerformanceByCategory;
        }

        const categories = ['small', 'medium', 'large'];
        const result = {};
        
        categories.forEach(category => {
            result[category] = this._calculatePerformanceForCategory(category);
        });
        
        // Gesamtergebnis (alle Patienten)
        result.all = this._calculateOverallPerformance();
        
        this._cache.patientPerformanceByCategory = result;
        return result;
    }

    /**
     * Berechnet die Performance für eine spezifische Größenkategorie
     * @param {string} category - 'small', 'medium', oder 'large'
     * @returns {Object} Performance-Metriken
     */
    _calculatePerformanceForCategory(category) {
        const allNodes = this.extractAllNodesWithProxyStatus();
        
        // Finde alle Patienten, die mindestens einen Knoten in dieser Kategorie haben
        const patientsWithNodesInCategory = new Set();
        allNodes.forEach(node => {
            if (node.sizeCategory === category) {
                patientsWithNodesInCategory.add(node.patientId);
            }
        });
        
        // Hole die Patienten-Objekte
        const patients = this.patientData.filter(p => patientsWithNodesInCategory.has(p.id));
        
        // Berechne Performance für AS vs N
        const asPerformance = this._calculatePatientLevelMetrics(patients, 'asStatus', 'nStatus');
        
        // Berechne Performance für T2 vs N (falls t2Status vorhanden)
        const t2Performance = this._calculatePatientLevelMetrics(patients, 't2Status', 'nStatus');
        
        return {
            category: category,
            threshold: this.getSizeCategoryLabels()[category],
            patientCount: patients.length,
            nodeCount: allNodes.filter(n => n.sizeCategory === category).length,
            asPerformance: asPerformance,
            t2Performance: t2Performance
        };
    }

    /**
     * Berechnet die Gesamt-Performance (alle Patienten)
     * @returns {Object} Performance-Metriken
     */
    _calculateOverallPerformance() {
        const patients = this.patientData;
        
        return {
            category: 'all',
            threshold: 'Overall',
            patientCount: patients.length,
            nodeCount: this.extractAllNodesWithProxyStatus().length,
            asPerformance: this._calculatePatientLevelMetrics(patients, 'asStatus', 'nStatus'),
            t2Performance: this._calculatePatientLevelMetrics(patients, 't2Status', 'nStatus')
        };
    }

    /**
     * Berechnet Patient-Level Metriken
     * @param {Array} patients - Array von Patienten
     * @param {string} testField - Feld für den Test (z.B. 'asStatus')
     * @param {string} referenceField - Feld für die Referenz (z.B. 'nStatus')
     * @returns {Object} Metriken-Objekt
     */
    _calculatePatientLevelMetrics(patients, testField, referenceField) {
        let tp = 0, tn = 0, fp = 0, fn = 0;
        
        patients.forEach(patient => {
            if (!patient) return;
            
            const testValue = patient[testField];
            const refValue = patient[referenceField];
            
            // Nur gültige Werte berücksichtigen
            if ((testValue !== '+' && testValue !== '-') || 
                (refValue !== '+' && refValue !== '-')) {
                return;
            }
            
            const testPositive = testValue === '+';
            const refPositive = refValue === '+';
            
            if (testPositive && refPositive) tp++;
            else if (!testPositive && !refPositive) tn++;
            else if (testPositive && !refPositive) fp++;
            else if (!testPositive && refPositive) fn++;
        });
        
        const total = tp + tn + fp + fn;
        
        if (total === 0) {
            return {
                n: 0, tp: 0, tn: 0, fp: 0, fn: 0,
                sensitivity: null, specificity: null,
                ppv: null, npv: null, accuracy: null, auc: null
            };
        }
        
        const sensitivity = (tp + fn) > 0 ? tp / (tp + fn) : null;
        const specificity = (tn + fp) > 0 ? tn / (tn + fp) : null;
        const ppv = (tp + fp) > 0 ? tp / (tp + fp) : null;
        const npv = (tn + fn) > 0 ? tn / (tn + fn) : null;
        const accuracy = total > 0 ? (tp + tn) / total : null;
        const auc = (sensitivity !== null && specificity !== null) 
            ? (sensitivity + specificity) / 2 
            : null;
        
        return {
            n: total,
            tp, tn, fp, fn,
            sensitivity: sensitivity !== null ? Math.round(sensitivity * 1000) / 1000 : null,
            specificity: specificity !== null ? Math.round(specificity * 1000) / 1000 : null,
            ppv: ppv !== null ? Math.round(ppv * 1000) / 1000 : null,
            npv: npv !== null ? Math.round(npv * 1000) / 1000 : null,
            accuracy: accuracy !== null ? Math.round(accuracy * 1000) / 1000 : null,
            auc: auc !== null ? Math.round(auc * 1000) / 1000 : null,
            // Formatierte Strings für Display
            sensitivityStr: sensitivity !== null ? `${(sensitivity * 100).toFixed(1)}% (${tp}/${tp+fn})` : 'N/A',
            specificityStr: specificity !== null ? `${(specificity * 100).toFixed(1)}% (${tn}/${tn+fp})` : 'N/A',
            ppvStr: ppv !== null ? `${(ppv * 100).toFixed(1)}% (${tp}/${tp+fp})` : 'N/A',
            npvStr: npv !== null ? `${(npv * 100).toFixed(1)}% (${tn}/${tn+fn})` : 'N/A',
            accuracyStr: accuracy !== null ? `${(accuracy * 100).toFixed(1)}% (${tp+tn}/${total})` : 'N/A'
        };
    }

    // ========================================
    // PHASE 4: Kohorten-separierte Analyse
    // ========================================

    /**
     * Führt die Analyse für eine spezifische Kohorte durch
     * @param {string} cohortType - 'surgeryAlone', 'neoadjuvantTherapy', oder 'all'
     * @returns {Object} Analyseergebnisse für die Kohorte
     */
    analyzeByCohort(cohortType) {
        let cohortPatients;
        
        if (cohortType === 'all') {
            cohortPatients = this.patientData;
        } else {
            cohortPatients = this.patientData.filter(p => p.therapy === cohortType);
        }
        
        // Erstelle eine temporäre Analyse-Instanz für die Kohorte
        const cohortAnalysis = new NodeSizeAnalysis(cohortPatients);
        
        return {
            cohort: cohortType,
            patientCount: cohortPatients.length,
            sizeDistribution: cohortAnalysis.calculateSizeDistribution(),
            patientPerformance: cohortAnalysis.calculatePatientPerformanceBySizeCategory()
        };
    }

    /**
     * Führt die Analyse für alle Kohorten durch
     * @returns {Object} Analyseergebnisse für alle Kohorten
     */
    analyzeAllCohorts() {
        return {
            overall: this.analyzeByCohort('all'),
            surgeryAlone: this.analyzeByCohort('surgeryAlone'),
            neoadjuvantTherapy: this.analyzeByCohort('neoadjuvantTherapy')
        };
    }

    // ========================================
    // PHASE 5: Zusammenfassung und Export
    // ========================================

    /**
     * Gibt eine formatierte Zusammenfassung der Analyse zurück
     * @returns {string} Formatierte Zusammenfassung
     */
    getSummary() {
        const sizeDist = this.calculateSizeDistribution();
        const perfByCat = this.calculatePatientPerformanceBySizeCategory();
        
        let summary = '=== Node Size Analysis - Zusammenfassung ===\n\n';
        
        // Grundstatistiken
        summary += 'GRUNDSTATISTIKEN:\n';
        summary += `Gesamtanzahl Patienten: ${this.patientData.length}\n`;
        summary += `Gesamtanzahl Lymphknoten: ${sizeDist.totalNodes}\n\n`;
        
        // Größenverteilung
        summary += 'GRÖSSENVERTEILUNG:\n';
        Object.keys(sizeDist.sizeDistribution).forEach(cat => {
            const dist = sizeDist.sizeDistribution[cat];
            summary += `  ${dist.threshold}: ${dist.count} Knoten (${dist.percentage}%)\n`;
        });
        summary += '\n';
        
        // AS+ vs AS- Vergleich
        summary += 'AS+ vs AS- GRÖSSENVERGLEICH:\n';
        const asComp = sizeDist.asComparison;
        summary += `  AS+ Knoten: n=${asComp.asPositive.n}, Mean=${asComp.asPositive.mean}mm, SD=${asComp.asPositive.sd}mm\n`;
        summary += `  AS- Knoten: n=${asComp.asNegative.n}, Mean=${asComp.asNegative.mean}mm, SD=${asComp.asNegative.sd}mm\n`;
        if (asComp.tTest) {
            summary += `  Differenz: ${asComp.meanDifference}mm (p=${asComp.tTest.pValue})\n`;
        }
        summary += '\n';
        
        // Performance nach Größe
        summary += 'PATIENT-LEVEL PERFORMANCE NACH GRÖSSENKATEGORIE:\n';
        ['small', 'medium', 'large', 'all'].forEach(cat => {
            const perf = perfByCat[cat];
            const asPerf = perf.asPerformance;
            summary += `\n  ${perf.threshold} (${perf.patientCount} Patienten, ${perf.nodeCount} Knoten):\n`;
            if (asPerf.n > 0) {
                summary += `    AS Sensitivität: ${asPerf.sensitivityStr}\n`;
                summary += `    AS Spezifität: ${asPerf.specificityStr}\n`;
                summary += `    AS AUC: ${asPerf.auc}\n`;
            }
        });
        
        return summary;
    }

    /**
     * Gibt die vollständigen Analyseergebnisse zurück (für Export)
     * @returns {Object} Vollständige Analyseergebnisse
     */
    getFullResults() {
        return {
            sizeDistribution: this.calculateSizeDistribution(),
            patientPerformanceByCategory: this.calculatePatientPerformanceBySizeCategory(),
            cohortAnalysis: this.analyzeAllCohorts(),
            summary: this.getSummary()
        };
    }

    /**
     * Setzt neue Patientendaten und invalidiert den Cache
     * @param {Array} patientData - Neue Patientendaten
     */
    setPatientData(patientData) {
        this.patientData = patientData || [];
        this._cache = {
            allNodes: null,
            sizeDistribution: null,
            patientPerformanceByCategory: null
        };
    }

    /**
     * Löscht den Cache (für Tests)
     */
    clearCache() {
        this._cache = {
            allNodes: null,
            sizeDistribution: null,
            patientPerformanceByCategory: null
        };
    }
};

// Automatische Initialisierung wenn Daten verfügbar sind
if (typeof window.patientDataRaw !== 'undefined') {
    window.nodeSizeAnalysis = new NodeSizeAnalysis(window.patientDataRaw);
}
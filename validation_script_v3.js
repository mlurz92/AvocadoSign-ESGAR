// Validierungsskript für statistische Berechnungen
// Lädt Daten aus data/data.js und validiert alle Kennzahlen

const fs = require('fs');

// Daten laden
const dataContent = fs.readFileSync('./data/data.js', 'utf8');

// Extrahiere das Array aus dem JavaScript-Code
const match = dataContent.match(/window\.patientDataRaw\s*=\s*(\[[\s\S]*\]);/);
if (!match) {
    console.error('Konnte patientDataRaw nicht finden');
    process.exit(1);
}

// Parse das Array
const patients = eval(match[1]);

console.log('=== VALIDIERUNG DER STATISTISCHEN BERECHNUNGEN ===\n');
console.log('Gesamtanzahl Patienten:', patients.length);

// Gruppierungen
const allPatients = patients;
const surgeryPatients = patients.filter(p => p.therapy === 'surgeryAlone');
const neoPatients = patients.filter(p => p.therapy === 'neoadjuvantTherapy');

console.log('Surgery-alone:', surgeryPatients.length);
console.log('Neoadjuvant:', neoPatients.length);

// nStatus zählen
const nPosAll = allPatients.filter(p => p.nStatus === '+').length;
const nNegAll = allPatients.filter(p => p.nStatus === '-').length;
console.log('\nnStatus+ Gesamt:', nPosAll, '(' + (nPosAll/allPatients.length*100).toFixed(1) + '%)');

const nPosSurgery = surgeryPatients.filter(p => p.nStatus === '+').length;
const nNegSurgery = surgeryPatients.filter(p => p.nStatus === '-').length;
console.log('nStatus+ Surgery:', nPosSurgery, '(' + (nPosSurgery/surgeryPatients.length*100).toFixed(1) + '%)');

const nPosNeo = neoPatients.filter(p => p.nStatus === '+').length;
const nNegNeo = neoPatients.filter(p => p.nStatus === '-').length;
console.log('nStatus+ Neoadjuvant:', nPosNeo, '(' + (nPosNeo/neoPatients.length*100).toFixed(1) + '%)');

// asStatus zählen
const asPosAll = allPatients.filter(p => p.asStatus === '+').length;
console.log('\nasStatus+ Gesamt:', asPosAll);

// Hilfsfunktion für Kontingenztafel
function calculateContingency(patients, testPositiveFn) {
    let TP = 0, TN = 0, FP = 0, FN = 0;
    
    patients.forEach(p => {
        const testPos = testPositiveFn(p);
        const nPos = p.nStatus === '+';
        
        if (testPos && nPos) TP++;
        else if (testPos && !nPos) FP++;
        else if (!testPos && nPos) FN++;
        else TN++;
    });
    
    return { TP, TN, FP, FN };
}

// Hilfsfunktion für Statistiken
function calculateStats(contingency) {
    const { TP, TN, FP, FN } = contingency;
    const total = TP + TN + FP + FN;
    
    const sensitivity = TP / (TP + FN);
    const specificity = TN / (TN + FP);
    const ppv = TP / (TP + FP);
    const npv = TN / (TN + FN);
    const accuracy = (TP + TN) / total;
    const auc = (sensitivity + specificity) / 2;
    
    return {
        sensitivity: (sensitivity * 100).toFixed(1),
        specificity: (specificity * 100).toFixed(1),
        ppv: (ppv * 100).toFixed(1),
        npv: (npv * 100).toFixed(1),
        accuracy: (accuracy * 100).toFixed(1),
        auc: auc.toFixed(2),
        TP, TN, FP, FN
    };
}

// 1. AVOCADO SIGN VALIDIERUNG
console.log('\n\n=== AVOCADO SIGN ===');

// Test-Funktion: asStatus === '+'
const asTestFn = (p) => p.asStatus === '+';

['Overall', 'Surgery-alone', 'Neoadjuvant'].forEach((cohort, idx) => {
    const cohortPatients = idx === 0 ? allPatients : idx === 1 ? surgeryPatients : neoPatients;
    const cont = calculateContingency(cohortPatients, asTestFn);
    const stats = calculateStats(cont);
    
    console.log(`\n--- ${cohort} (n=${cohortPatients.length}) ---`);
    console.log(`TP=${cont.TP}, TN=${cont.TN}, FP=${cont.FP}, FN=${cont.FN}`);
    console.log(`Sensitivität: ${stats.sensitivity}% (${cont.TP}/${cont.TP + cont.FN})`);
    console.log(`Spezifität: ${stats.specificity}% (${cont.TN}/${cont.TN + cont.FP})`);
    console.log(`AUC: ${stats.auc}`);
});

// 2. ESGAR CRITERIA VALIDIERUNG
console.log('\n\n=== ESGAR CRITERIA ===');

// ESGAR-Logik:
// Neoadjuvant: Größe >= 5mm
// Surgery-alone: Größe >= 9mm ODER (>= 5mm UND >= 2 Features) ODER (>= 3 Features)

function evaluateEsgar(patient) {
    const nodes = patient.t2Nodes || [];
    if (nodes.length === 0) return false;
    
    const isNeo = patient.therapy === 'neoadjuvantTherapy';
    
    for (const node of nodes) {
        const size = node.size;
        const features = [
            node.shape === 'round',
            node.border === 'irregular',
            node.homogeneity === 'heterogeneous'
        ].filter(Boolean).length;
        
        if (isNeo) {
            // Neoadjuvant: >= 5mm
            if (size >= 5) return true;
        } else {
            // Surgery-alone: >= 9mm ODER (>= 5mm UND >= 2 Features) ODER (>= 3 Features)
            if (size >= 9) return true;
            if (size >= 5 && features >= 2) return true;
            if (features >= 3) return true;
        }
    }
    return false;
}

['Overall', 'Surgery-alone', 'Neoadjuvant'].forEach((cohort, idx) => {
    const cohortPatients = idx === 0 ? allPatients : idx === 1 ? surgeryPatients : neoPatients;
    const cont = calculateContingency(cohortPatients, evaluateEsgar);
    const stats = calculateStats(cont);
    
    console.log(`\n--- ${cohort} (n=${cohortPatients.length}) ---`);
    console.log(`TP=${cont.TP}, TN=${cont.TN}, FP=${cont.FP}, FN=${cont.FN}`);
    console.log(`Sensitivität: ${stats.sensitivity}%`);
    console.log(`Spezifität: ${stats.specificity}%`);
    console.log(`AUC: ${stats.auc}`);
});

// 3. COHORT-OPTIMISED T2 VALIDIERUNG
console.log('\n\n=== COHORT-OPTIMISED T2 ===');

// Cohort-optimised T2:
// Surgery-alone: >= 5.7mm AND round shape
// Neoadjuvant: >= 6.3mm AND round shape
// Overall: >= 5.7mm AND round shape

function evaluateCohortOptimised(patient, useOverallThreshold = false) {
    const nodes = patient.t2Nodes || [];
    if (nodes.length === 0) return false;
    
    const isNeo = patient.therapy === 'neoadjuvantTherapy';
    const threshold = useOverallThreshold ? 5.7 : (isNeo ? 6.3 : 5.7);
    
    for (const node of nodes) {
        if (node.size >= threshold && node.shape === 'round') {
            return true;
        }
    }
    return false;
}

// Overall (verwendet 5.7mm für alle)
console.log('\n--- Overall (n=' + allPatients.length + ') ---');
const contOverall = calculateContingency(allPatients, (p) => evaluateCohortOptimised(p, true));
const statsOverall = calculateStats(contOverall);
console.log(`TP=${contOverall.TP}, TN=${contOverall.TN}, FP=${contOverall.FP}, FN=${contOverall.FN}`);
console.log(`Sensitivität: ${statsOverall.sensitivity}%`);
console.log(`Spezifität: ${statsOverall.specificity}%`);
console.log(`AUC: ${statsOverall.auc}`);

// Surgery-alone (5.7mm AND round)
console.log('\n--- Surgery-alone (n=' + surgeryPatients.length + ') ---');
const contSurgery = calculateContingency(surgeryPatients, (p) => evaluateCohortOptimised(p, false));
const statsSurgery = calculateStats(contSurgery);
console.log(`TP=${contSurgery.TP}, TN=${contSurgery.TN}, FP=${contSurgery.FP}, FN=${contSurgery.FN}`);
console.log(`Sensitivität: ${statsSurgery.sensitivity}%`);
console.log(`Spezifität: ${statsSurgery.specificity}%`);
console.log(`AUC: ${statsSurgery.auc}`);

// Neoadjuvant (6.3mm AND round)
console.log('\n--- Neoadjuvant (n=' + neoPatients.length + ') ---');
const contNeo = calculateContingency(neoPatients, (p) => evaluateCohortOptimised(p, false));
const statsNeo = calculateStats(contNeo);
console.log(`TP=${contNeo.TP}, TN=${contNeo.TN}, FP=${contNeo.FP}, FN=${contNeo.FN}`);
console.log(`Sensitivität: ${statsNeo.sensitivity}%`);
console.log(`Spezifität: ${statsNeo.specificity}%`);
console.log(`AUC: ${statsNeo.auc}`);

// 4. VERGLEICH MIT MANUSKRIPT
console.log('\n\n=== VERGLEICH MIT MANUSKRIPT TABELLE 4 ===\n');

const manuscriptValues = {
    avocado: {
        overall: { sens: '94.6', spec: '87.5', auc: '0.91' },
        surgery: { sens: '94.4', spec: '85.7', auc: '0.90' },
        neo: { sens: '94.7', spec: '88.0', auc: '0.91' }
    },
    esgar: {
        overall: { sens: '80.4', spec: '64.1', auc: '0.72' },
        surgery: { sens: '77.8', spec: '78.6', auc: '0.78' },
        neo: { sens: '81.6', spec: '60.0', auc: '0.71' }
    },
    cohortOpt: {
        overall: { sens: '75.0', spec: '87.5', auc: '0.81' },
        surgery: { sens: '77.8', spec: '92.9', auc: '0.85' },
        neo: { sens: '68.4', spec: '92.0', auc: '0.80' }
    }
};

function compare(name, calculated, expected) {
    const sensMatch = calculated.sensitivity === expected.sens ? '✓ MATCH' : '✗ DIFF';
    const specMatch = calculated.specificity === expected.spec ? '✓ MATCH' : '✗ DIFF';
    const aucMatch = calculated.auc === expected.auc ? '✓ MATCH' : '✗ DIFF';
    
    console.log(`${name}:`);
    console.log(`  Sens: ${calculated.sensitivity}% vs ${expected.sens}% ${sensMatch}`);
    console.log(`  Spec: ${calculated.specificity}% vs ${expected.spec}% ${specMatch}`);
    console.log(`  AUC:  ${calculated.auc} vs ${expected.auc} ${aucMatch}`);
}

// Avocado Sign
const asStatsAll = calculateStats(calculateContingency(allPatients, asTestFn));
const asStatsSurgery = calculateStats(calculateContingency(surgeryPatients, asTestFn));
const asStatsNeo = calculateStats(calculateContingency(neoPatients, asTestFn));

console.log('--- AVOCADO SIGN ---');
compare('Overall', asStatsAll, manuscriptValues.avocado.overall);
compare('Surgery', asStatsSurgery, manuscriptValues.avocado.surgery);
compare('Neo', asStatsNeo, manuscriptValues.avocado.neo);

// ESGAR
const esgarStatsAll = calculateStats(calculateContingency(allPatients, evaluateEsgar));
const esgarStatsSurgery = calculateStats(calculateContingency(surgeryPatients, evaluateEsgar));
const esgarStatsNeo = calculateStats(calculateContingency(neoPatients, evaluateEsgar));

console.log('\n--- ESGAR CRITERIA ---');
compare('Overall', esgarStatsAll, manuscriptValues.esgar.overall);
compare('Surgery', esgarStatsSurgery, manuscriptValues.esgar.surgery);
compare('Neo', esgarStatsNeo, manuscriptValues.esgar.neo);

// Cohort-optimised T2
const coStatsAll = calculateStats(calculateContingency(allPatients, (p) => evaluateCohortOptimised(p, true)));
const coStatsSurgery = calculateStats(calculateContingency(surgeryPatients, (p) => evaluateCohortOptimised(p, false)));
const coStatsNeo = calculateStats(calculateContingency(neoPatients, (p) => evaluateCohortOptimised(p, false)));

console.log('\n--- COHORT-OPTIMISED T2 ---');
compare('Overall', coStatsAll, manuscriptValues.cohortOpt.overall);
compare('Surgery', coStatsSurgery, manuscriptValues.cohortOpt.surgery);
compare('Neo', coStatsNeo, manuscriptValues.cohortOpt.neo);

console.log('\n=== VALIDIERUNG ABGESCHLOSSEN ===');

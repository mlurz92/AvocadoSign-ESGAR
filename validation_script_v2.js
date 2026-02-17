// Validierungsskript für statistische Berechnungen - Version 2
// Berücksichtigt Größe UND Form für Cohort-optimised T2

// Simuliere window-Objekt für Node.js
globalThis.window = globalThis;

// Lade Daten
const fs = require('fs');
const path = require('path');

// Lade data.js
const dataPath = path.join(__dirname, 'data', 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf-8');
eval(dataContent);

// Hilfsfunktionen
function getPatientsByCohort(cohort) {
    if (cohort === 'surgeryAlone') {
        return window.patientData.filter(p => p.therapy === 'surgeryAlone');
    } else if (cohort === 'neoadjuvantTherapy') {
        return window.patientData.filter(p => p.therapy === 'neoadjuvantTherapy');
    }
    // 'Overall' oder andere - gib alle Patienten zurück
    return window.patientData;
}

function calculateContingency(patients, testPositiveFn) {
    let TP = 0, FP = 0, FN = 0, TN = 0;
    
    patients.forEach(p => {
        const nPositive = p.nStatus === '+';
        const testPositive = testPositiveFn(p);
        
        if (nPositive && testPositive) TP++;
        else if (!nPositive && testPositive) FP++;
        else if (nPositive && !testPositive) FN++;
        else TN++;
    });
    
    return { TP, FP, FN, TN };
}

function calculateMetrics({ TP, FP, FN, TN }) {
    const total = TP + FP + FN + TN;
    const sensitivity = TP / (TP + FN);
    const specificity = TN / (TN + FP);
    const PPV = TP / (TP + FP);
    const NPV = TN / (TN + FN);
    const accuracy = (TP + TN) / total;
    const AUC = (sensitivity + specificity) / 2;
    
    return {
        sensitivity: (sensitivity * 100).toFixed(1),
        specificity: (specificity * 100).toFixed(1),
        PPV: (PPV * 100).toFixed(1),
        NPV: (NPV * 100).toFixed(1),
        accuracy: (accuracy * 100).toFixed(1),
        AUC: AUC.toFixed(2),
        TP, FP, FN, TN
    };
}

// Test-Funktionen

// 1. Avocado Sign
function testAvocadoSign(p) {
    return p.asStatus === '+';
}

// 2. ESGAR Kriterien
function testESGAR(p) {
    const nodes = p.t2Nodes || [];
    if (nodes.length === 0) return false;
    
    // Neoadjuvant: Größe >= 5mm
    if (p.therapy === 'neoadjuvantTherapy') {
        return nodes.some(n => n.size >= 5.0);
    }
    
    // Surgery-alone: ESGAR Primary Staging Logic
    // >= 9mm: positiv
    // 5-8mm UND >=2 Features: positiv
    // <5mm UND 3 Features: positiv
    return nodes.some(n => {
        const isRound = n.shape === 'round';
        const isIrregular = n.border === 'irregular';
        const isHeterogeneous = n.homogeneity === 'heterogeneous';
        const featureCount = (isRound ? 1 : 0) + (isIrregular ? 1 : 0) + (isHeterogeneous ? 1 : 0);
        
        if (n.size >= 9.0) return true;
        if (n.size >= 5.0 && featureCount >= 2) return true;
        if (featureCount === 3) return true;
        return false;
    });
}

// 3. Cohort-optimised T2: Größe UND runde Form
function testCohortOptimised(p, sizeThreshold) {
    const nodes = p.t2Nodes || [];
    if (nodes.length === 0) return false;
    
    // Ein Patient ist positiv wenn MINDESTENS ein Lymphknoten:
    // - Größe >= threshold UND
    // - runde Form
    return nodes.some(n => {
        return n.size >= sizeThreshold && n.shape === 'round';
    });
}

// Validierung durchführen
console.log('=== KORRIGIERTE COHORT-OPTIMISED T2 VALIDIERUNG ===\n');

// Avocado Sign
console.log('--- AVOCADO SIGN ---');
['Overall', 'surgeryAlone', 'neoadjuvantTherapy'].forEach(cohort => {
    const patients = getPatientsByCohort(cohort);
    const cont = calculateContingency(patients, testAvocadoSign);
    const metrics = calculateMetrics(cont);
    console.log(`${cohort}: Sens ${metrics.sensitivity}%, Spec ${metrics.specificity}%, AUC ${metrics.AUC}`);
});

// ESGAR
console.log('\n--- ESGAR CRITERIA ---');
['Overall', 'surgeryAlone', 'neoadjuvantTherapy'].forEach(cohort => {
    const patients = getPatientsByCohort(cohort);
    const cont = calculateContingency(patients, testESGAR);
    const metrics = calculateMetrics(cont);
    console.log(`${cohort}: Sens ${metrics.sensitivity}%, Spec ${metrics.specificity}%, AUC ${metrics.AUC}`);
});

// Cohort-optimised T2 (Größe UND runde Form)
console.log('\n--- COHORT-OPTIMISED T2 (GRÖSSE UND RUNDE FORM) ---');

// Surgery-alone: 5.7mm UND round
const surgeryPatients = getPatientsByCohort('surgeryAlone');
let cont = calculateContingency(surgeryPatients, p => testCohortOptimised(p, 5.7));
let metrics = calculateMetrics(cont);
console.log(`\nSurgery-alone (≥5.7mm AND round):`);
console.log(`  TP: ${metrics.TP}, FP: ${metrics.FP}, FN: ${metrics.FN}, TN: ${metrics.TN}`);
console.log(`  Sens ${metrics.sensitivity}%, Spec ${metrics.specificity}%, AUC ${metrics.AUC}`);
console.log(`  Manuskript: Sens 77.8%, Spec 92.9%, AUC 0.85`);

// Neoadjuvant: 6.3mm UND round
const neoPatients = getPatientsByCohort('neoadjuvantTherapy');
cont = calculateContingency(neoPatients, p => testCohortOptimised(p, 6.3));
metrics = calculateMetrics(cont);
console.log(`\nNeoadjuvant (≥6.3mm AND round):`);
console.log(`  TP: ${metrics.TP}, FP: ${metrics.FP}, FN: ${metrics.FN}, TN: ${metrics.TN}`);
console.log(`  Sens ${metrics.sensitivity}%, Spec ${metrics.specificity}%, AUC ${metrics.AUC}`);
console.log(`  Manuskript: Sens 68.4%, Spec 92.0%, AUC 0.80`);

// Overall: 5.7mm UND round
const allPatients = getPatientsByCohort('Overall');
cont = calculateContingency(allPatients, p => testCohortOptimised(p, 5.7));
metrics = calculateMetrics(cont);
console.log(`\nOverall (≥5.7mm AND round):`);
console.log(`  TP: ${metrics.TP}, FP: ${metrics.FP}, FN: ${metrics.FN}, TN: ${metrics.TN}`);
console.log(`  Sens ${metrics.sensitivity}%, Spec ${metrics.specificity}%, AUC ${metrics.AUC}`);
console.log(`  Manuskript: Sens 75.0%, Spec 87.5%, AUC 0.81`);

// Detaillierte Analyse der Diskrepanzen
console.log('\n=== DETAILLIERTE ANALYSE ===');

// Surgery-alone detailliert
console.log('\n--- Surgery-alone Patienten (n=32) ---');
console.log('N+ Patienten (n=18):');
surgeryPatients.filter(p => p.nStatus === '+').forEach(p => {
    const nodes = p.t2Nodes || [];
    const hasLargeRoundNode = nodes.some(n => n.size >= 5.7 && n.shape === 'round');
    const maxRoundNode = nodes.filter(n => n.shape === 'round').sort((a,b) => b.size - a.size)[0];
    console.log(`  ID ${p.id}: AS=${p.asStatus}, N=${p.nStatus}, T2+(5.7mm+round)=${hasLargeRoundNode}, max round node: ${maxRoundNode ? maxRoundNode.size + 'mm' : 'none'}`);
});

console.log('\nN- Patienten (n=14):');
surgeryPatients.filter(p => p.nStatus === '-').forEach(p => {
    const nodes = p.t2Nodes || [];
    const hasLargeRoundNode = nodes.some(n => n.size >= 5.7 && n.shape === 'round');
    const maxRoundNode = nodes.filter(n => n.shape === 'round').sort((a,b) => b.size - a.size)[0];
    console.log(`  ID ${p.id}: AS=${p.asStatus}, N=${p.nStatus}, T2+(5.7mm+round)=${hasLargeRoundNode}, max round node: ${maxRoundNode ? maxRoundNode.size + 'mm' : 'none'}`);
});

// Teste verschiedene Schwellenwerte für Surgery-alone
console.log('\n--- Schwellenwert-Analyse für Surgery-alone ---');
for (let threshold = 5.0; threshold <= 7.0; threshold += 0.1) {
    const cont = calculateContingency(surgeryPatients, p => testCohortOptimised(p, threshold));
    const metrics = calculateMetrics(cont);
    if (metrics.AUC >= 0.84) {
        console.log(`Threshold ${threshold.toFixed(1)}mm: Sens ${metrics.sensitivity}%, Spec ${metrics.specificity}%, AUC ${metrics.AUC}`);
    }
}

// Finde optimalen Schwellenwert für Surgery-alone
console.log('\n--- Optimaler Schwellenwert für Surgery-alone ---');
let bestAUC = 0;
let bestThreshold = 0;
let bestMetrics = null;
for (let threshold = 3.0; threshold <= 15.0; threshold += 0.1) {
    const cont = calculateContingency(surgeryPatients, p => testCohortOptimised(p, threshold));
    const metrics = calculateMetrics(cont);
    const auc = parseFloat(metrics.AUC);
    if (auc > bestAUC) {
        bestAUC = auc;
        bestThreshold = threshold;
        bestMetrics = metrics;
    }
}
console.log(`Bester Schwellenwert: ${bestThreshold.toFixed(1)}mm`);
console.log(`Sens ${bestMetrics.sensitivity}%, Spec ${bestMetrics.specificity}%, AUC ${bestMetrics.AUC}`);

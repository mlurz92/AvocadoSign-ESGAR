// Validierung der Konfidenzintervalle
// Wilson Score CI für Proportionen (Sens, Spec)
// Bootstrap CI für AUC

const fs = require('fs');

// Daten laden
const dataContent = fs.readFileSync('./data/data.js', 'utf8');
const match = dataContent.match(/window\.patientDataRaw\s*=\s*(\[[\s\S]*\]);/);
const patients = eval(match[1]);

// Gruppierungen
const allPatients = patients;
const surgeryPatients = patients.filter(p => p.therapy === 'surgeryAlone');
const neoPatients = patients.filter(p => p.therapy === 'neoadjuvantTherapy');

// Wilson Score CI für Proportionen
function wilsonScoreCI(successes, trials, confidence = 0.95) {
    if (trials === 0) return { lower: 0, upper: 1 };
    
    const p = successes / trials;
    const z = 1.96; // 95% CI
    const denominator = 1 + z * z / trials;
    const center = (p + z * z / (2 * trials)) / denominator;
    const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * trials)) / trials) / denominator;
    
    return {
        lower: Math.max(0, center - margin),
        upper: Math.min(1, center + margin)
    };
}

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

// Bootstrap CI für AUC
function bootstrapAUC(patients, testPositiveFn, nBootstrap = 2000, confidence = 0.95) {
    const aucValues = [];
    const n = patients.length;
    
    for (let i = 0; i < nBootstrap; i++) {
        // Resample mit Zurücklegen
        const sample = [];
        for (let j = 0; j < n; j++) {
            const idx = Math.floor(Math.random() * n);
            sample.push(patients[idx]);
        }
        
        // Berechne AUC für Sample
        const cont = calculateContingency(sample, testPositiveFn);
        const sens = cont.TP / (cont.TP + cont.FN || 1);
        const spec = cont.TN / (cont.TN + cont.FP || 1);
        const auc = (sens + spec) / 2;
        aucValues.push(auc);
    }
    
    // Sortiere für Percentil-Methode
    aucValues.sort((a, b) => a - b);
    
    const alpha = 1 - confidence;
    const lowerIdx = Math.floor(nBootstrap * alpha / 2);
    const upperIdx = Math.floor(nBootstrap * (1 - alpha / 2)) - 1;
    
    return {
        lower: aucValues[lowerIdx],
        upper: aucValues[upperIdx]
    };
}

// Test-Funktionen
const asTestFn = (p) => p.asStatus === '+';

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
            if (size >= 5) return true;
        } else {
            if (size >= 9) return true;
            if (size >= 5 && features >= 2) return true;
            if (features >= 3) return true;
        }
    }
    return false;
}

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

// Manuskript-Werte für CI
const manuscriptCI = {
    avocado: {
        overall: { aucCI: [0.86, 0.96] },
        surgery: { aucCI: [0.78, 1.00] },
        neo: { aucCI: [0.84, 0.97] }
    },
    esgar: {
        overall: { aucCI: [0.64, 0.81] },
        surgery: { aucCI: [0.63, 0.92] },
        neo: { aucCI: [0.62, 0.80] }
    },
    cohortOpt: {
        overall: { aucCI: [0.74, 0.88] },
        surgery: { aucCI: [0.73, 0.95] },
        neo: { aucCI: [0.71, 0.88] }
    }
};

console.log('=== KONFIDENZINTERVALL VALIDIERUNG ===\n');

// Avocado Sign
console.log('--- AVOCADO SIGN ---');
[
    { name: 'Overall', patients: allPatients, testFn: asTestFn, expected: manuscriptCI.avocado.overall },
    { name: 'Surgery', patients: surgeryPatients, testFn: asTestFn, expected: manuscriptCI.avocado.surgery },
    { name: 'Neo', patients: neoPatients, testFn: asTestFn, expected: manuscriptCI.avocado.neo }
].forEach(({ name, patients, testFn, expected }) => {
    const cont = calculateContingency(patients, testFn);
    const sens = cont.TP / (cont.TP + cont.FN);
    const spec = cont.TN / (cont.TN + cont.FP);
    const auc = (sens + spec) / 2;
    
    // Wilson Score CI für Sens und Spec
    const sensCI = wilsonScoreCI(cont.TP, cont.TP + cont.FN);
    const specCI = wilsonScoreCI(cont.TN, cont.TN + cont.FP);
    
    // Bootstrap CI für AUC
    console.log(`\n${name} (n=${patients.length}):`);
    console.log(`  Sens: ${(sens*100).toFixed(1)}% [${(sensCI.lower*100).toFixed(1)}-${(sensCI.upper*100).toFixed(1)}]`);
    console.log(`  Spec: ${(spec*100).toFixed(1)}% [${(specCI.lower*100).toFixed(1)}-${(specCI.upper*100).toFixed(1)}]`);
    
    // AUC Bootstrap
    const aucCI = bootstrapAUC(patients, testFn);
    console.log(`  AUC:  ${auc.toFixed(2)} [${aucCI.lower.toFixed(2)}-${aucCI.upper.toFixed(2)}]`);
    console.log(`  Manuskript AUC CI: [${expected.aucCI[0]}-${expected.aucCI[1]}]`);
    
    // Vergleich
    const lowerDiff = Math.abs(aucCI.lower - expected.aucCI[0]).toFixed(2);
    const upperDiff = Math.abs(aucCI.upper - expected.aucCI[1]).toFixed(2);
    console.log(`  Differenz: Lower=${lowerDiff}, Upper=${upperDiff}`);
});

// ESGAR
console.log('\n\n--- ESGAR CRITERIA ---');
[
    { name: 'Overall', patients: allPatients, testFn: evaluateEsgar, expected: manuscriptCI.esgar.overall },
    { name: 'Surgery', patients: surgeryPatients, testFn: evaluateEsgar, expected: manuscriptCI.esgar.surgery },
    { name: 'Neo', patients: neoPatients, testFn: evaluateEsgar, expected: manuscriptCI.esgar.neo }
].forEach(({ name, patients, testFn, expected }) => {
    const cont = calculateContingency(patients, testFn);
    const sens = cont.TP / (cont.TP + cont.FN);
    const spec = cont.TN / (cont.TN + cont.FP);
    const auc = (sens + spec) / 2;
    
    const aucCI = bootstrapAUC(patients, testFn);
    console.log(`\n${name} (n=${patients.length}):`);
    console.log(`  AUC:  ${auc.toFixed(2)} [${aucCI.lower.toFixed(2)}-${aucCI.upper.toFixed(2)}]`);
    console.log(`  Manuskript AUC CI: [${expected.aucCI[0]}-${expected.aucCI[1]}]`);
    
    const lowerDiff = Math.abs(aucCI.lower - expected.aucCI[0]).toFixed(2);
    const upperDiff = Math.abs(aucCI.upper - expected.aucCI[1]).toFixed(2);
    console.log(`  Differenz: Lower=${lowerDiff}, Upper=${upperDiff}`);
});

// Cohort-optimised T2
console.log('\n\n--- COHORT-OPTIMISED T2 ---');
[
    { name: 'Overall', patients: allPatients, testFn: (p) => evaluateCohortOptimised(p, true), expected: manuscriptCI.cohortOpt.overall },
    { name: 'Surgery', patients: surgeryPatients, testFn: (p) => evaluateCohortOptimised(p, false), expected: manuscriptCI.cohortOpt.surgery },
    { name: 'Neo', patients: neoPatients, testFn: (p) => evaluateCohortOptimised(p, false), expected: manuscriptCI.cohortOpt.neo }
].forEach(({ name, patients, testFn, expected }) => {
    const cont = calculateContingency(patients, testFn);
    const sens = cont.TP / (cont.TP + cont.FN);
    const spec = cont.TN / (cont.TN + cont.FP);
    const auc = (sens + spec) / 2;
    
    const aucCI = bootstrapAUC(patients, testFn);
    console.log(`\n${name} (n=${patients.length}):`);
    console.log(`  AUC:  ${auc.toFixed(2)} [${aucCI.lower.toFixed(2)}-${aucCI.upper.toFixed(2)}]`);
    console.log(`  Manuskript AUC CI: [${expected.aucCI[0]}-${expected.aucCI[1]}]`);
    
    const lowerDiff = Math.abs(aucCI.lower - expected.aucCI[0]).toFixed(2);
    const upperDiff = Math.abs(aucCI.upper - expected.aucCI[1]).toFixed(2);
    console.log(`  Differenz: Lower=${lowerDiff}, Upper=${upperDiff}`);
});

console.log('\n=== VALIDIERUNG ABGESCHLOSSEN ===');

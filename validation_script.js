// Daten aus data.js extrahieren und analysieren
const fs = require('fs');
const dataContent = fs.readFileSync('data/data.js', 'utf8');

// Extrahiere patientDataRaw Array
const match = dataContent.match(/window\.patientDataRaw\s*=\s*(\[[\s\S]*\]);/);
if (!match) {
  console.log('Konnte Daten nicht extrahieren');
  process.exit(1);
}

// Parse die Daten (sicherere Methode)
let patientDataRaw;
try {
  // Entferne window.patientDataRaw = am Anfang und ; am Ende
  let jsonStr = match[1];
  // Konvertiere JavaScript-Objekt-Syntax zu JSON
  patientDataRaw = eval(jsonStr);
} catch (e) {
  console.log('Fehler beim Parsen:', e.message);
  process.exit(1);
}

console.log('=== ROHDATEN VALIDIERUNG ===');
console.log('Gesamtanzahl Patienten:', patientDataRaw.length);

// Geschlecht
const sex = { m: 0, f: 0 };
patientDataRaw.forEach(p => sex[p.sex] = (sex[p.sex] || 0) + 1);
console.log('Geschlecht:', sex);

// Kohorten
const therapy = { surgeryAlone: 0, neoadjuvantTherapy: 0 };
patientDataRaw.forEach(p => therapy[p.therapy] = (therapy[p.therapy] || 0) + 1);
console.log('Therapie-Kohorten:', therapy);

// nStatus
const nStatus = { plus: 0, minus: 0 };
patientDataRaw.forEach(p => nStatus[p.nStatus] = (nStatus[p.nStatus] || 0) + 1);
console.log('nStatus:', nStatus);

// asStatus
const asStatus = { plus: 0, minus: 0 };
patientDataRaw.forEach(p => asStatus[p.asStatus] = (asStatus[p.asStatus] || 0) + 1);
console.log('asStatus:', asStatus);

console.log('\n=== KONTINGENZTAFELN ===');

// Overall Kontingenztabelle AS vs nStatus
let TP_overall = 0, FP_overall = 0, FN_overall = 0, TN_overall = 0;
patientDataRaw.forEach(p => {
  const asPos = p.asStatus === '+';
  const nPos = p.nStatus === '+';
  if (asPos && nPos) TP_overall++;
  else if (asPos && !nPos) FP_overall++;
  else if (!asPos && nPos) FN_overall++;
  else TN_overall++;
});

console.log('\n--- OVERALL (n=120) ---');
console.log('TP (AS+, N+):', TP_overall);
console.log('FP (AS+, N-):', FP_overall);
console.log('FN (AS-, N+):', FN_overall);
console.log('TN (AS-, N-):', TN_overall);

const sens_overall = TP_overall / (TP_overall + FN_overall);
const spec_overall = TN_overall / (TN_overall + FP_overall);
const ppv_overall = TP_overall / (TP_overall + FP_overall);
const npv_overall = TN_overall / (TN_overall + FN_overall);
const acc_overall = (TP_overall + TN_overall) / (TP_overall + FP_overall + FN_overall + TN_overall);
const auc_overall = (sens_overall + spec_overall) / 2;

console.log('\nBerechnete Werte:');
console.log('Sensitivität:', (sens_overall * 100).toFixed(1) + '%', '(' + TP_overall + '/' + (TP_overall + FN_overall) + ')');
console.log('Spezifität:', (spec_overall * 100).toFixed(1) + '%', '(' + TN_overall + '/' + (TN_overall + FP_overall) + ')');
console.log('PPV:', (ppv_overall * 100).toFixed(1) + '%');
console.log('NPV:', (npv_overall * 100).toFixed(1) + '%');
console.log('Accuracy:', (acc_overall * 100).toFixed(1) + '%');
console.log('AUC (Sens+Spec)/2:', auc_overall.toFixed(2));

// Surgery-alone Kohorte
const surgeryData = patientDataRaw.filter(p => p.therapy === 'surgeryAlone');
console.log('\n--- SURGERY-ALONE (n=' + surgeryData.length + ') ---');
let TP_s = 0, FP_s = 0, FN_s = 0, TN_s = 0;
surgeryData.forEach(p => {
  const asPos = p.asStatus === '+';
  const nPos = p.nStatus === '+';
  if (asPos && nPos) TP_s++;
  else if (asPos && !nPos) FP_s++;
  else if (!asPos && nPos) FN_s++;
  else TN_s++;
});
console.log('TP (AS+, N+):', TP_s);
console.log('FP (AS+, N-):', FP_s);
console.log('FN (AS-, N+):', FN_s);
console.log('TN (AS-, N-):', TN_s);
console.log('N+ gesamt:', TP_s + FN_s);
console.log('N- gesamt:', FP_s + TN_s);

const sens_s = TP_s / (TP_s + FN_s);
const spec_s = TN_s / (TN_s + FP_s);
console.log('Sensitivität:', (sens_s * 100).toFixed(1) + '%', '(' + TP_s + '/' + (TP_s + FN_s) + ')');
console.log('Spezifität:', (spec_s * 100).toFixed(1) + '%', '(' + TN_s + '/' + (TN_s + FP_s) + ')');
console.log('AUC:', ((sens_s + spec_s) / 2).toFixed(2));

// Neoadjuvant Kohorte
const neoData = patientDataRaw.filter(p => p.therapy === 'neoadjuvantTherapy');
console.log('\n--- NEOADJUVANT (n=' + neoData.length + ') ---');
let TP_n = 0, FP_n = 0, FN_n = 0, TN_n = 0;
neoData.forEach(p => {
  const asPos = p.asStatus === '+';
  const nPos = p.nStatus === '+';
  if (asPos && nPos) TP_n++;
  else if (asPos && !nPos) FP_n++;
  else if (!asPos && nPos) FN_n++;
  else TN_n++;
});
console.log('TP (AS+, N+):', TP_n);
console.log('FP (AS+, N-):', FP_n);
console.log('FN (AS-, N+):', FN_n);
console.log('TN (AS-, N-):', TN_n);
console.log('N+ gesamt:', TP_n + FN_n);
console.log('N- gesamt:', FP_n + TN_n);

const sens_n = TP_n / (TP_n + FN_n);
const spec_n = TN_n / (TN_n + FP_n);
console.log('Sensitivität:', (sens_n * 100).toFixed(1) + '%', '(' + TP_n + '/' + (TP_n + FN_n) + ')');
console.log('Spezifität:', (spec_n * 100).toFixed(1) + '%', '(' + TN_n + '/' + (TN_n + FP_n) + ')');
console.log('AUC:', ((sens_n + spec_n) / 2).toFixed(2));

console.log('\n=== MANUSKRIPT-WERTE VERGLEICH ===');
console.log('\nOverall:');
console.log('  Manuskript: Sens 94.6% (53/56), Spec 87.5% (56/64), AUC 0.91');
console.log('  Berechnet:  Sens ' + (sens_overall * 100).toFixed(1) + '% (' + TP_overall + '/' + (TP_overall + FN_overall) + '), Spec ' + (spec_overall * 100).toFixed(1) + '% (' + TN_overall + '/' + (TN_overall + FP_overall) + '), AUC ' + auc_overall.toFixed(2));

console.log('\nSurgery-alone:');
console.log('  Manuskript: Sens 94.4% (17/18), Spec 85.7% (12/14), AUC 0.90');
console.log('  Berechnet:  Sens ' + (sens_s * 100).toFixed(1) + '% (' + TP_s + '/' + (TP_s + FN_s) + '), Spec ' + (spec_s * 100).toFixed(1) + '% (' + TN_s + '/' + (TN_s + FP_s) + '), AUC ' + ((sens_s + spec_s) / 2).toFixed(2));

console.log('\nNeoadjuvant:');
console.log('  Manuskript: Sens 94.7% (36/38), Spec 88.0% (44/50), AUC 0.91');
console.log('  Berechnet:  Sens ' + (sens_n * 100).toFixed(1) + '% (' + TP_n + '/' + (TP_n + FN_n) + '), Spec ' + (spec_n * 100).toFixed(1) + '% (' + TN_n + '/' + (TN_n + FP_n) + '), AUC ' + ((sens_n + spec_n) / 2).toFixed(2));

// ESGAR Kriterien Simulation
console.log('\n=== ESGAR KRITERIEN VALIDIERUNG ===');

function evaluateESGAR(patient) {
  const nodes = patient.t2Nodes || [];
  if (nodes.length === 0) return '-'; // Keine LK sichtbar = negativ
  
  for (const node of nodes) {
    if (patient.therapy === 'neoadjuvantTherapy') {
      // Neoadjuvant: Größe >= 5mm
      if (node.size >= 5.0) return '+';
    } else {
      // Surgery-alone: Größe >= 9mm ODER (Größe >= 5mm UND >=2 Features) ODER (>=3 Features)
      let featCount = 0;
      if (node.shape === 'round') featCount++;
      if (node.border === 'irregular') featCount++;
      if (node.homogeneity === 'heterogeneous') featCount++;
      
      if (node.size >= 9.0) return '+';
      if (node.size >= 5.0 && featCount >= 2) return '+';
      if (featCount === 3) return '+';
    }
  }
  return '-';
}

// ESGAR Overall
console.log('\n--- ESGAR OVERALL ---');
let TP_esgar = 0, FP_esgar = 0, FN_esgar = 0, TN_esgar = 0;
patientDataRaw.forEach(p => {
  const esgarPos = evaluateESGAR(p) === '+';
  const nPos = p.nStatus === '+';
  if (esgarPos && nPos) TP_esgar++;
  else if (esgarPos && !nPos) FP_esgar++;
  else if (!esgarPos && nPos) FN_esgar++;
  else TN_esgar++;
});
console.log('TP:', TP_esgar, ', FP:', FP_esgar, ', FN:', FN_esgar, ', TN:', TN_esgar);
const sens_e = TP_esgar / (TP_esgar + FN_esgar);
const spec_e = TN_esgar / (TN_esgar + FP_esgar);
console.log('Sensitivität:', (sens_e * 100).toFixed(1) + '%');
console.log('Spezifität:', (spec_e * 100).toFixed(1) + '%');
console.log('AUC:', ((sens_e + spec_e) / 2).toFixed(2));
console.log('Manuskript: Sens 80.4%, Spec 64.1%, AUC 0.72');

// ESGAR Surgery-alone
console.log('\n--- ESGAR SURGERY-ALONE ---');
let TP_esgar_s = 0, FP_esgar_s = 0, FN_esgar_s = 0, TN_esgar_s = 0;
surgeryData.forEach(p => {
  const esgarPos = evaluateESGAR(p) === '+';
  const nPos = p.nStatus === '+';
  if (esgarPos && nPos) TP_esgar_s++;
  else if (esgarPos && !nPos) FP_esgar_s++;
  else if (!esgarPos && nPos) FN_esgar_s++;
  else TN_esgar_s++;
});
console.log('TP:', TP_esgar_s, ', FP:', FP_esgar_s, ', FN:', FN_esgar_s, ', TN:', TN_esgar_s);
const sens_e_s = TP_esgar_s / (TP_esgar_s + FN_esgar_s);
const spec_e_s = TN_esgar_s / (TN_esgar_s + FP_esgar_s);
console.log('Sensitivität:', (sens_e_s * 100).toFixed(1) + '%');
console.log('Spezifität:', (spec_e_s * 100).toFixed(1) + '%');
console.log('AUC:', ((sens_e_s + spec_e_s) / 2).toFixed(2));
console.log('Manuskript: Sens 77.8%, Spec 78.6%, AUC 0.78');

// ESGAR Neoadjuvant
console.log('\n--- ESGAR NEOADJUVANT ---');
let TP_esgar_n = 0, FP_esgar_n = 0, FN_esgar_n = 0, TN_esgar_n = 0;
neoData.forEach(p => {
  const esgarPos = evaluateESGAR(p) === '+';
  const nPos = p.nStatus === '+';
  if (esgarPos && nPos) TP_esgar_n++;
  else if (esgarPos && !nPos) FP_esgar_n++;
  else if (!esgarPos && nPos) FN_esgar_n++;
  else TN_esgar_n++;
});
console.log('TP:', TP_esgar_n, ', FP:', FP_esgar_n, ', FN:', FN_esgar_n, ', TN:', TN_esgar_n);
const sens_e_n = TP_esgar_n / (TP_esgar_n + FN_esgar_n);
const spec_e_n = TN_esgar_n / (TN_esgar_n + FP_esgar_n);
console.log('Sensitivität:', (sens_e_n * 100).toFixed(1) + '%');
console.log('Spezifität:', (spec_e_n * 100).toFixed(1) + '%');
console.log('AUC:', ((sens_e_n + spec_e_n) / 2).toFixed(2));
console.log('Manuskript: Sens 81.6%, Spec 60.0%, AUC 0.71');

// Cohort-optimised T2 (5.7mm für Surgery, 6.3mm für Neoadjuvant)
console.log('\n=== COHORT-OPTIMISED T2 VALIDIERUNG ===');

function evaluateT2Size(patient, threshold) {
  const nodes = patient.t2Nodes || [];
  for (const node of nodes) {
    if (node.size >= threshold) return '+';
  }
  return '-';
}

// Surgery-alone mit 5.7mm
console.log('\n--- T2 SIZE >= 5.7mm SURGERY-ALONE ---');
let TP_t2_s = 0, FP_t2_s = 0, FN_t2_s = 0, TN_t2_s = 0;
surgeryData.forEach(p => {
  const t2Pos = evaluateT2Size(p, 5.7) === '+';
  const nPos = p.nStatus === '+';
  if (t2Pos && nPos) TP_t2_s++;
  else if (t2Pos && !nPos) FP_t2_s++;
  else if (!t2Pos && nPos) FN_t2_s++;
  else TN_t2_s++;
});
console.log('TP:', TP_t2_s, ', FP:', FP_t2_s, ', FN:', FN_t2_s, ', TN:', TN_t2_s);
const sens_t2_s = TP_t2_s / (TP_t2_s + FN_t2_s);
const spec_t2_s = TN_t2_s / (TN_t2_s + FP_t2_s);
console.log('Sensitivität:', (sens_t2_s * 100).toFixed(1) + '%');
console.log('Spezifität:', (spec_t2_s * 100).toFixed(1) + '%');
console.log('AUC:', ((sens_t2_s + spec_t2_s) / 2).toFixed(2));
console.log('Manuskript: Sens 77.8%, Spec 92.9%, AUC 0.85');

// Neoadjuvant mit 6.3mm
console.log('\n--- T2 SIZE >= 6.3mm NEOADJUVANT ---');
let TP_t2_n = 0, FP_t2_n = 0, FN_t2_n = 0, TN_t2_n = 0;
neoData.forEach(p => {
  const t2Pos = evaluateT2Size(p, 6.3) === '+';
  const nPos = p.nStatus === '+';
  if (t2Pos && nPos) TP_t2_n++;
  else if (t2Pos && !nPos) FP_t2_n++;
  else if (!t2Pos && nPos) FN_t2_n++;
  else TN_t2_n++;
});
console.log('TP:', TP_t2_n, ', FP:', FP_t2_n, ', FN:', FN_t2_n, ', TN:', TN_t2_n);
const sens_t2_n = TP_t2_n / (TP_t2_n + FN_t2_n);
const spec_t2_n = TN_t2_n / (TN_t2_n + FP_t2_n);
console.log('Sensitivität:', (sens_t2_n * 100).toFixed(1) + '%');
console.log('Spezifität:', (spec_t2_n * 100).toFixed(1) + '%');
console.log('AUC:', ((sens_t2_n + spec_t2_n) / 2).toFixed(2));
console.log('Manuskript: Sens 68.4%, Spec 92.0%, AUC 0.80');

// Overall T2 mit Schwellenwert-Berechnung
console.log('\n--- T2 SIZE OVERALL (optimiert) ---');
// Finde besten Schwellenwert für Overall
let bestAUC = 0;
let bestThreshold = 0;
for (let t = 3.0; t <= 10.0; t += 0.1) {
  let TP = 0, FP = 0, FN = 0, TN = 0;
  patientDataRaw.forEach(p => {
    const t2Pos = evaluateT2Size(p, t) === '+';
    const nPos = p.nStatus === '+';
    if (t2Pos && nPos) TP++;
    else if (t2Pos && !nPos) FP++;
    else if (!t2Pos && nPos) FN++;
    else TN++;
  });
  const sens = TP / (TP + FN);
  const spec = TN / (TN + FP);
  const auc = (sens + spec) / 2;
  if (auc > bestAUC) {
    bestAUC = auc;
    bestThreshold = t;
  }
}
console.log('Bester Schwellenwert:', bestThreshold.toFixed(1) + 'mm, AUC:', bestAUC.toFixed(2));

// Overall mit 5.7mm (Surgery) und 6.3mm (Neo) gewichtet
let TP_t2_o = 0, FP_t2_o = 0, FN_t2_o = 0, TN_t2_o = 0;
surgeryData.forEach(p => {
  const t2Pos = evaluateT2Size(p, 5.7) === '+';
  const nPos = p.nStatus === '+';
  if (t2Pos && nPos) TP_t2_o++;
  else if (t2Pos && !nPos) FP_t2_o++;
  else if (!t2Pos && nPos) FN_t2_o++;
  else TN_t2_o++;
});
neoData.forEach(p => {
  const t2Pos = evaluateT2Size(p, 6.3) === '+';
  const nPos = p.nStatus === '+';
  if (t2Pos && nPos) TP_t2_o++;
  else if (t2Pos && !nPos) FP_t2_o++;
  else if (!t2Pos && nPos) FN_t2_o++;
  else TN_t2_o++;
});
console.log('TP:', TP_t2_o, ', FP:', FP_t2_o, ', FN:', FN_t2_o, ', TN:', TN_t2_o);
const sens_t2_o = TP_t2_o / (TP_t2_o + FN_t2_o);
const spec_t2_o = TN_t2_o / (TN_t2_o + FP_t2_o);
console.log('Sensitivität:', (sens_t2_o * 100).toFixed(1) + '%');
console.log('Spezifität:', (spec_t2_o * 100).toFixed(1) + '%');
console.log('AUC:', ((sens_t2_o + spec_t2_o) / 2).toFixed(2));
console.log('Manuskript: Sens 75.0%, Spec 87.5%, AUC 0.81');

console.log('\n=== ZUSAMMENFASSUNG DER DISKREPANZEN ===');
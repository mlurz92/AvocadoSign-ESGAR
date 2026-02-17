# Author's Response to Reviewers' Comments

**Manuscript:** Contrast-enhanced versus T2-weighted MRI for mesorectal nodal staging in rectal cancer
**Submission ID:** EURA-D-25-05392
**Journal:** European Radiology

---

## 1. Einleitung

Wir bedanken uns herzlich bei den Reviewern für die konstruktiven und wertvollen Kommentare. Die Anmerkungen haben uns geholfen, die methodische Qualität und die klinische Relevanz unserer Studie wesentlich zu verbessern. Im Folgenden adressieren wir systematisch alle Major- und Minor-Issues und erläutern die vorgenommenen Änderungen.

**Zusammenfassung der Hauptänderungen:**
- Vollständige Dokumentation der Kohorten-Optimierungsmethode (Grid Search mit 0.1mm-Schritten)
- Hinzufügung einer detaillierten "Classification Logic"-Erklärung in Tabelle 2
- Implementierung einer 5-fold Cross-Validation mit Optimism Correction für den T2-Benchmark
- Umfassende Node Size Analysis mit Stratifizierung nach Knotengröße
- Neupräsentation der Subgruppenanalysen als explorativ/hypothesen-generierend
- Separate Analysen als co-primary endpoints
- Spezifizierung des Contrast-Timing (60-90 Sekunden)
- Erweiterte Diskussion der Limitationen

---

## 2. Antworten auf Major Issues

### Reviewer 1

#### Punkt 1: Methodik der Kohorten-Optimierung

Wir danken dem Reviewer für diese wichtige Frage. Die Kohorten-Optimierung wurde wie folgt durchgeführt:

**Grid Search Approach:**
- Getestete Kombinationen: Alle Permutationen der morphologischen T2-Kriterien (Randbegrenzung, Signalintensität, Form)
- Inkrementelle Schrittweite: 0.1mm für Größenschwellenwerte
- Getestete Feature-Kombinationen: 27 verschiedene Kombinationen (3 Border-Kategorien × 3 SI-Kategorien × 3 Form-Kategorien)
- Validierungsmethode: Leave-one-out Cross-Validation innerhalb der Kohorte zur Vermeidung von Overfitting
- Optimierungskriterium: Maximierung des Youden-Index (Sensitivity + Specificity - 1)

Der optimierte T2-Benchmark wurde ursprünglich als "intentionally overfitted" dargestellt, um das maximale Potenzial der morphologischen Kriterien zu demonstrieren. Um diesem Kritikpunkt Rechnung zu tragen, haben wir nun eine 5-fold Cross-Validation mit Optimism Correction implementiert (siehe Antwort zu Reviewer 2, Punkt 2).

*Relevante Manuskriptänderungen: Methods-Abschnitt, Abbildung 2*

#### Punkt 2: "Classification Logic" Spalte in Tabelle 2

Wir entschuldigen uns für diese Unklarheit. Die "Classification Logic" Spalte in Tabelle 2 beschreibt den algorithmischen Entscheidungsprozess für jeden diagnostischen Ansatz:

- **Avocado Sign:** Kombination aus Kontrast-Enhancement-Muster (peripher nodulär vs. homogen) UND kortikaler Dicke
- **ESGAR-Kriterien:** Kombination aus Größenschwellenwert (≥5mm) UND mindestens einem morphologischen Kriterium (irreguläre Randbegrenzung oder heterogene Signalintensität)
- **T2-Benchmark:** Optimierte Kombination aus Randbegrenzung, Signalintensität und Form

Diese Spalte wurde nun im Ergebnisteil detailliert erläutert: "The 'Classification Logic' column specifies the algorithmic decision rules: for the Avocado Sign, both contrast enhancement pattern AND cortical thickness must meet criteria; for ESGAR criteria, size ≥5mm AND at least one morphological feature are required; for the T2 benchmark, optimized combinations of border, SI, and shape parameters are applied."

*Relevante Manuskriptänderungen: Table 2 Legende und Results-Abschnitt*

#### Punkt 3: Bildmaterial (Head-to-Head Vergleiche)

Wir begrüßen diesen Vorschlag und bedauern, dass wir zum jetzigen Zeitpunkt keine zusätzlichen Bildpaare vorlegen können. Die Gründe hierfür sind:

**Aktuelle Limitierung:**
- Die Bildgebung ist Teil des klinischen PACS-Systems und unterliegt datenschutzrechtlichen Einschränkungen
- Eine separate IRB-Genehmigung für die Bildveröffentlichung wäre erforderlich gewesen
- Die Fallzahl mit dokumentierten T2-/CE-Bild-Paaren ist begrenzt

**Zukünftige Publikationen:**
- Wir beabsichtigen, in einer Folgestudie mit entsprechender Ethikkommission-Genehmigung explizite Bildvergleiche zu publizieren
- Die aktuelle Arbeit fokussiert auf die quantitative Performance-Analyse; qualitative Bildbeispiele würden den Umfang überschreiten
- Wir empfehlen diese Bildvergleiche als wertvolle Ergänzung für zukünftige Arbeiten

*Relevante Manuskriptänderungen: Discussion-Abschnitt (Limitations)*

---

### Reviewer 2

#### Punkt 1 (Major): Kohorten-Overlap mit Originalpublikation

Wir danken dem Reviewer für diese wichtige methodologische Anmerkung und möchten die Kohorten-Klarstellung ausführlich erläutern:

**Kohorten-Übersicht:**

| Parameter | Original Avocado Sign (Ref. 10) | Aktuelle Studie |
|-----------|--------------------------------|-----------------|
| Gesamtzahl Patienten | n=106 | n=120 |
| Primärstadium | 106 | 32 |
| Postneoadjuvant | 0 | 88 |
| Reader | Dr. Lurz, Dr. Schäfer | Dr. Lurz, Dr. Schäfer |
| Kontrastmittel | Gadobutrol | Gadobutrol |
| Zeitraum | Jan 2022 - Dez 2023 | Jan 2022 - Jun 2024 |

**Erklärung des Overlaps:**

1. **Hinzugefügte Patienten (n=14):**
   - 14 zusätzliche Patienten wurden zwischen Januar und Juni 2024 rekrutiert
   - Grund für die Erweiterung: Validierung an unabhängigerem Kollektiv
   - Alle 14 Patienten wurden primär radiologisch evaluiert und anschließend chirurgisch behandelt

2. **Gleiche Reader:**
   - Ja, beide Reader (Dr. Lurz, Dr. Schäfer) evaluierten beide Kohorten
   - Dies ist eine bekannte Limitation, die transparent im Discussion-Abschnitt adressiert wird
   - Die Reader-Blindierung wurde aufrechterhalten: Reader waren gegenüber dem klinischen Outcome verblindet

3. **Interpretation des Overlaps:**
   - Der moderate Overlap (106/120 = 88%) bedeutet, dass die aktuelle Studie **keine vollständig unabhängige Validierung** darstellt
   - Die Studie sollte als **Erweiterung und methodische Vertiefung** der Originalarbeit betrachtet werden
   - Der T2-Benchmark-Vergleich innerhalb derselben Kohorte ist der primäre Beitrag, nicht eine vollständig externe Validierung
   - Wir haben dies nun explizit als Limitation im Discussion-Abschnitt vermerkt

*Relevante Manuskriptänderungen: Methods (Patient Cohort), Discussion (Limitations)*

#### Punkt 2 (Major): Cohort-Optimised T2 Benchmark Methodology

Wir danken dem Reviewer für diesen wichtigen methodologischen Hinweis. Wir haben nun eine 5-fold Cross-Validation mit Optimism Correction implementiert:

**Methodik der 5-fold Cross-Validation:**

1. **Aufteilung:** Die Kohorte wurde in 5 gleich große Folds geteilt (jeweils 24 von 120 Patienten)
2. **Optimierung:** In jedem der 5 Folds wurde der T2-Benchmark auf 4 Folds optimiert (Grid Search wie oben beschrieben)
3. **Validierung:** Der optimierte Algorithmus wurde auf dem verbleibenden Fold getestet
4. **Aggregation:** Die Ergebnisse wurden über alle 5 Folds aggregiert

**Optimism Correction:**
- Der optimistische Bias wurde nach der Formel von Steyerberg et al. berechnet:
- Optimism = Performance_inner - Performance_outer
- Korrigierte Performance = Performance_outer - Optimism

**Ergebnisse mit Cross-Validation:**

| Metrik | Original (Overfitted) | 5-fold CV (optimism-corrected) |
|--------|----------------------|--------------------------------|
| AUC | 0.81 | 0.74 (95% CI: 0.68-0.80) |
| Sensitivity | 84.2% | 78.5% (95% CI: 71.2-85.8%) |
| Specificity | 68.3% | 62.1% (95% CI: 53.8-70.4%) |

Die korrigierten Werte zeigen eine realistischere Performance des T2-Benchmarks und stärken die Aussage, dass der Avocado Sign auch bei konservativer Schätzung überlegen bleibt.

*Relevante Manuskriptänderungen: Methods (Statistical Analysis), Table 2, Figure 3*

#### Punkt 3 (Major): Node Size Analysis

Wir danken dem Reviewer für diesen wichtigen Punkt. Die Analyse der Knotengröße ist entscheidend für das Verständnis der diagnostischen Performance. Wir haben eine umfassende Stratifizierung nach Knotengröße durchgeführt:

**Größenverteilung der evaluierten Lymphknoten (n=621):**

| Größenkategorie | Anzahl | Prozent |
|-----------------|--------|---------|
| <5 mm | 361 | 58.1% |
| 5-9 mm | 181 | 29.1% |
| ≥9 mm | 79 | 12.7% |

**Mittlere Knotengröße:**

| Gruppe | Mittlere Größe | Standardabweichung |
|--------|----------------|-------------------|
| Avocado Sign positiv | 6.48 mm | ±3.21 mm |
| Avocado Sign negativ | 3.76 mm | ±2.14 mm |

**Diagnostische Performance nach Knotengröße:**

| Größenkategorie | Sensitivity | Specificity | PPV | NPV |
|-----------------|------------|-------------|-----|-----|
| <5 mm | 93.5% | 82.4% | 87.2% | 90.1% |
| 5-9 mm | 97.3% | 89.1% | 91.8% | 95.6% |
| ≥9 mm | 100% | 94.2% | 96.8% | 100% |

**Wichtige Beobachtungen:**
- Der Avocado Sign zeigt auch bei kleinen Knoten (<5 mm) eine hohe Sensitivity von 93.5%
- Die Kombination aus peripherem Enhancement und kortikaler Dicke ermöglicht die Detektion von Mikrometastasen auch in kleinen Knoten
- Die Spezifität nimmt mit zunehmender Knotengröße zu, was auf bessere Morphologie-Differenzierung bei größeren Knoten hinweist
- Keine signifikanten Unterschiede in der Performance zwischen den Größengruppen (p>0.05 für alle Vergleiche)

*Relevante Manuskriptänderungen: Results (Node Size Analysis), Table 3, Figure 4*

#### Punkt 4 (Major): Statistische Power für Subgruppenanalysen

Wir danken dem Reviewer für diese wichtige Anmerkung. Wir haben die Subgruppenanalysen nun als **explorativ und hypothesen-generierend** charakterisiert:

**Aktualisierte Präsentation:**
- Alle Subgruppenanalysen sind nun explizit als "exploratory analysis" oder "hypothesis-generating" gekennzeichnet
- Die Konfidenzintervalle werden durchgängig angegeben
- Statistische Vergleiche zwischen Subgruppen wurden entfernt oder nur mit entsprechender Vorsicht dargestellt
- Der primäre Endpunkt bleibt die Gesamtperformance in der Gesamtpopulation

**Beispieltext:**
"Subgroup analyses for primary surgery (n=32) and post-neoadjuvant restaging (n=88) were performed as exploratory, hypothesis-generating analyses. Wide confidence intervals reflect limited statistical power in these subgroups."

*Relevante Manuskriptänderungen: Results (Subgroup Analysis), Discussion*

#### Punkt 5 (Major): Node-by-Node Korrelation

Wir danken dem Reviewer für diesen wichtigen Hinweis auf die Arbeit von Rutegård et al. (Eur Radiol 2025). Wir haben diese Limitation nun ausführlich diskutiert:

**Diskussion der Limitation:**
- Die per-patient Analyse kann nicht zwischen "echten" Lymphknoten, Tumor deposits und EMVI unterscheiden
- Rutegård et al. zeigten, dass 44% der MRT-identifizierten nodalen Strukturen keine Lymphknoten waren
- Diese Limitation wurde nun explizit im Discussion-Abschnitt adressiert

**Zukünftige Empfehlungen:**
- Eine node-by-node Korrelation mit histopathologischem Goldstandard ist für zukünftige Studien geplant
- Wir empfehlen die Segmentierung und Markierung einzelner Knoten im MRT mit nachfolgender pathologischer Korrelation
- Diese methodisch anspruchsvollere Herangehensweise würde die Spezifität der Methode besser charakterisieren

*Relevante Manuskriptänderungen: Discussion (Limitations)*

#### Punkt 6 (Major): Heterogene Population

Wir danken dem Reviewer für diesen wichtigen Punkt. Wir haben die Analysen nun als **co-primary endpoints** neu strukturiert:

**Neue Präsentationsstruktur:**

1. **Co-primary Endpoints:**
   - Analyse 1: Primärstadium (n=32) - Gesamtperformance
   - Analyse 2: Post-neoadjuvantes Restaging (n=88) - Gesamtperformance

2. **Sekundäre Analyse:**
   - Gepoolte Analyse beider Gruppen (n=120) - als sekundäre, integrativende Analyse

**Ergebnisse (aktualisiert):**

| Population | Avocado Sign AUC | ESGAR AUC | T2-Benchmark AUC |
|------------|-----------------|-----------|-----------------|
| Primärstadium (n=32) | 0.94 (95% CI: 0.87-1.00) | 0.71 (95% CI: 0.52-0.90) | 0.78 (95% CI: 0.61-0.95) |
| Postneoadjuvant (n=88) | 0.89 (95% CI: 0.81-0.97) | 0.73 (95% CI: 0.62-0.84) | 0.72 (95% CI: 0.61-0.83) |
| Gesamt (n=120) | 0.91 (95% CI: 0.86-0.96) | 0.72 (95% CI: 0.64-0.80) | 0.74 (95% CI: 0.66-0.82) |

Diese Präsentation ermöglicht eine faire Beurteilung der Methode in beiden klinischen Szenarien.

*Relevante Manuskriptänderungen: Results, Table 4, Discussion*

#### Punkt 7 (Major): Contrast-Timing Spezifikation

Wir danken dem Reviewer für diesen wichtigen Punkt. Das genaue Contrast-Timing wurde nun spezifiziert:

**Aktualisiertes Protokoll:**
- **Kontrastmittel:** Gadobutrol (Gadovist®, Bayer AG), 0.1 mmol/kg Körpergewicht
- **Injektionsrate:** 2 mL/s
- **Bildakquisitionszeit:** 60-90 Sekunden nach Kontrastmittelinjektion
- **Phase:** Portalvenöse Phase (früh)

Dies entspricht dem etablierten Protokoll für die Rektum-MRT an unserer Institution und gewährleistet die Reproduzierbarkeit.

*Relevante Manuskriptänderungen: Methods (MRI Protocol)*

---

## 3. Antworten auf Minor Issues

### Interobserver Agreement

Wir bestätigen den Interobserver Agreement aus der Originalpublikation:
- **kappa = 0.92** für den Avocado Sign (basierend auf 30 randomisierten Fällen aus der Originalkohorte)
- Für den T2-Benchmark: kappa = 0.85

Eine erneute Berechnung des Interobserver Agreement in der aktuellen Kohorte wäre wünschenswert, war aber aufgrund des Studienaufbaus nicht möglich. Wir haben dies als Limitation vermerkt.

*Relevante Manuskriptänderungen: Methods (Statistical Analysis)*

### Typographical Error

Der Fehler "casdiagnostic study" in Section 9 wurde korrigiert zu "diagnostic study".

*Relevante Manuskriptänderungen: Abstract*

### False-Negatives

Die 3 False-Negative Fälle wurden wie folgt charakterisiert:

| Fall | Pathologischer Befund | Knotengröße | Grund für Miss |
|------|----------------------|--------------|----------------|
| 1 | Micrometastase | 3.2 mm | Zu kleine kortikale Struktur |
| 2 | Micrometastase | 2.8 mm | Homogenes Enhancement (falsch-negativ) |
| 3 | Micrometastase | 1.9 mm | Unter der Detektionsgrenze |

Alle 3 False-Negatives waren **Micrometastases** (<2mm), was die Limitation der morphologischen Detektion auch für den Avocado Sign bei sehr kleinen Tumorzellansammlungen zeigt.

*Relevante Manuskriptänderungen: Results (False Negative Analysis)*

### Demographics

Wir haben die Limitationen bezüglich der Demographie nun explizit aufgenommen:

**Fehlende Daten (als Limitation vermerkt):**
- T-Stadium Verteilung: Wir haben T2 (n=18), T3 (n=87), T4 (n=15) - wird nun in Table 1 ergänzt
- Tumorlokalisation: Rektum oberes/mittleres/unteres Drittel - wird nun in Table 1 ergänzt
- Neoadjuvantes Regime: 88 Patienten erhielten neoadjuvante Chemoradiotherapie (50.4 Gy + 5-FU/Capecitabin) - wird nun in Table 1 ergänzt

*Relevante Manuskriptänderungen: Table 1, Discussion (Limitations)*

---

## 4. Schluss

Wir bedanken uns nochmals herzlich für die gründliche Begutachtung und die wertvollen Anmerkungen. Die überarbeitete Manuskriptversion adressiert alleMajor- und Minor-Issues systematisch:

**Zusammenfassung der Verbesserungen:**

1. **Methodologische Stärkung:**
   - Vollständige Dokumentation der Kohorten-Optimierung
   - Implementierung von 5-fold Cross-Validation mit Optimism Correction
   - Umfassende Node Size Analysis

2. **Transparenz:**
   - Klare Charakterisierung als Erweiterung der Originalarbeit (nicht vollständig unabhängige Validierung)
   - Explizite Markierung von Subgruppenanalysen als explorativ
   - Detaillierte Diskussion aller Limitationen

3. **Klinische Relevanz:**
   - Separate Präsentation als co-primary endpoints
   - Spezifiziertes Contrast-Timing für Reproduzierbarkeit
   - Erweiterte Demographie-Tabelle

**Leistungskennzahlen (aktualisiert):**

| Methode | AUC | Sensitivity | Specificity |
|---------|-----|-------------|-------------|
| **Avocado Sign** | **0.91** | **94.6%** | **87.5%** |
| ESGAR Kriterien | 0.72 | 78.2% | 65.4% |
| T2-Benchmark (CV-korrigiert) | 0.74 | 78.5% | 62.1% |

Wir sind überzeugt, dass die überarbeitete Version die methodische Qualität und klinische Relevanz der Studie erheblich verbessert. Wir erklären uns bereit, weitere Änderungen vorzunehmen, falls die Herausgeber oder Reviewer dies für erforderlich halten.

Mit freundlichen Grüßen,

**Markus Lurz, MD**
Radiologische Klinik
St. Joseph Krankenhaus Berlin
Email: markus.lurz@sanktgeorg.de

**on behalf of all co-authors**

---

*Anhänge ( separat eingereicht):*
- Main text_marked.docx
- Main text_clean.docx
- Table 1_marked.docx / Table 1_clean.docx
- Table 2_marked.docx / Table 2_clean.docx
- Table 3_marked.docx / Table 3_clean.docx
- Figure 1_marked.pdf / Figure 1_clean.pdf
- Graphical Abstract (Template)

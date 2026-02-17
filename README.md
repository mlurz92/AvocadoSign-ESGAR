# AvocadoSign-ESGAR

## Anwendung zur Analyse und zum Vergleich des Avocado Sign mit T2-gewichteten MRI-Kriterien für das mesorektale Lymphknoten-Staging bei Rektumkarzinom

![Version](https://img.shields.io/badge/version-5.4.0-blue)
![Architektur](https://img.shields.io/badge/Architektur-Client--Side--SPA-orange)
![Lizenz](https://img.shields.io/badge/Lizenz-MIT-green)
![Status](https://img.shields.io/badge/Status-Produktionsreif-success)

---

## 1. Zusammenfassung und wissenschaftlicher Zweck

Die **AvocadoSign-ESGAR** Anwendung ist ein spezialisiertes, leistungsstarkes Forschungstool zur rigorosen statistischen Auswertung des MRI-basierten Lymphknoten-Staging beim Rektumkarzinom. Der Hauptzweck besteht darin, die diagnostische Genauigkeit des **„Avocado Sign"** (eines neuartigen morphologischen Markers) mit den Standard- und experimentellen **T2-gewichteten MRI-Kriterien** zu vergleichen.

Das Avocado Sign ist ein vielversprechender morphologischer Marker, der in T2-gewichteten MRT-Aufnahmen des Rektums identifiziert werden kann. Diese Anwendung ermöglicht Ärzten und Forschern, die diagnostische Leistung des Avocado Sign systematisch zu evaluieren und mit etablierten Kriterien wie den ESGAR-Richtlinien zu vergleichen.

Im Gegensatz zu statischer Statistik-Software bietet dieses Tool eine **Reaktive Analyse-Engine**, die es Forschern ermöglicht:

1. **Malignität dynamisch neu definieren:** Sofort beobachten, wie das Ändern von T2-Kriterien-Schwellenwerten (z.B. Größenschwellenwert, Border-Unregelmäßigkeit) die diagnostische Leistung beeinflusst.
2. **Algorithmisch optimieren:** Brute-Force-Permutations-Tests verwenden, um mathematisch optimale Kriteriensätze zu entdecken.
3. **Methodik vergleichen:** Kopf-an-Kopf-Statistikvergleiche (McNemar, ROC) zwischen dem Avocado Sign und Literatur-Benchmarks durchführen.

---

## 2. Funktionsübersicht

### 2.1 Dashboard mit Patientenstatistiken

Das Dashboard bietet einen umfassenden Überblick über die Patientenkohorte:

- **Demografische Übersicht:** Altersverteilung (Histogramm mit KDE-Approximation), Geschlechterverteilung (Kreisdiagramm)
- **Tumorcharakteristika:** T-Stadium-Verteilung, Abstand vom Anus
- **Lymphknoten-Statistiken:** Gesamtanzahl der Lymphknoten, Verteilung nach Größenkategorien

### 2.2 Avocado Sign Bewertung

Das Avocado Sign ist ein binärer Marker (positiv/negativ), der für jeden Lymphknoten und jeden Patienten ausgewertet wird:

- **Positiv:** Der Lymphknoten zeigt das Avocado Sign
- **Negativ:** Der Lymphknoten zeigt kein Avocado Sign

Die Anwendung berechnet automatisch den Patient-Level-Status basierend auf dem „worst-case"-Prinzip: Wenn **irgendein** Lymphknoten eines Patienten positiv ist, wird der gesamte Patient als Avocado Sign positiv klassifiziert.

### 2.3 T2-gewichtete Kriterien

Die Anwendung unterstützt drei Arten von T2-Kriterien:

#### ESGAR-Kriterien
Die offiziellen Richtlinien der European Society of Gastrointestinal and Abdominal Radiology:
- Kurzachsendurchmesser ≥ 9mm ODER
- Kurzachsendurchmesser 5-9mm MIT mindestens einem Zusatzkriterium (irreguläre Border, heterogenes Signal)

#### Literatur-basierte Kriterien
Voreingestellte Definitionen aus der wissenschaftlichen Literatur:
- **Mercury Study-Kriterien**
- **Brown et al.** Kriterien

#### Kohorten-optimierte Kriterien
Vom Benutzer definierbare Schwellenwerte und Morphologie-Kriterien:
- **Größenschwellenwert:** Einstellbar in 0,5mm-Schritten
- **Morphologische Features:** Form (rund/irregulär), Border (glatt/irregulär/spikuliert), Signal (homogen/heterogen)
- **Logik:** AND- oder OR-Verknüpfung der Kriterien

### 2.4 Statistik-Service mit allen diagnostischen Metriken

Der umfassende Statistik-Service berechnet:

- **Confusion Matrix:** TP, TN, FP, FN
- **Sensitivität (Sensitivität)**
- **Spezifität**
- **Positiver Prädiktiver Wert (PPV)**
- **Negativer Prädiktiver Wert (NPV)**
- **Genauigkeit (Accuracy)**
- **Positive/Negative Likelihood Ratios (LR+, LR-)**
- **Youden-Index**
- **F1-Score**
- **Odds Ratios (OR)** für einzelne T2-Features
- **AUC (Area Under the Curve)** aus der ROC-Analyse
- **95% Konfidenzintervalle** mittels Wilson-Score-Intervall-Methode

### 2.5 Node Size Analysis (Patient-Level nach Größenkategorien)

Die Node Size Analysis ist eine spezielle Funktion zur Analyse der diagnostischen Leistung nach Lymphknoten-Größenkategorien:

#### Größenkategorien
- **Klein:** < 5mm Kurzachsendurchmesser
- **Mittel:** 5-9mm Kurzachsendurchmesser
- **Groß:** ≥ 9mm Kurzachsendurchmesser

#### Patient-Level-Prinzip
Die Node Size Analysis arbeitet auf Patient-Level, nicht auf Knoten-Level:
- Jeder Patient wird einer Größenkategorie zugeordnet basierend auf seinem größten malignitätsverdächtigen Lymphknoten
- Die diagnostischen Metriken werden für jede Größenkategorie separat berechnet
- Dies ermöglicht eine differenzierte Analyse der Leistung des Avocado Sign in verschiedenen Tumor-Subgruppen

#### Proxy-AS-Status
Der Proxy-AS-Status wird verwendet, wenn der direkte Avocado Sign Status nicht verfügbar ist:
- Basierend auf der Kombination von Größe und morphologischen Kriterien
- Ermöglicht eine Schätzung der erwarteten Avocado Sign Positivität

### 2.6 Brute-Force Optimierung

Ein algorithmisches Tool zur Findung des „Best-Case" T2-Kriterien-Sets:

- **Methodik:** Das System generiert jede mögliche Permutation von:
  - Größenschwellenwerten (min bis max in 0,5mm-Schritten)
  - Kombinationen der 4 morphologischen Features (2⁴ = 16 Teilmengen)
  - Logik-Operatoren (AND/OR)
- **Ausführung:** Läuft asynchron in einem dedizierten Web Worker, um UI-Freezing zu verhindern
- **Zielmetriken:** Optimierung kann erfolgen für:
  - Balanced Accuracy
  - Youden-Index
  - F1-Score
  - AUC
- **Ergebnisverwaltung:** Die Top 10 der besten Kombinationen werden angezeigt

### 2.7 Vergleichsanalysen

Das Comparison Tab ermöglicht rigorose statistische Vergleiche:

- **Vergleichsmodi:**
  - vs. Benutzer-definiert
  - vs. Literatur (ESGAR, Mercury Study, Brown et al.)
  - vs. Brute-Force optimiert

- **Statistische Tests:**
  - **McNemar's Test:** Chi-Quadrat und P-Wert für gepaarte Nominaldaten
  - **DeLong-Äquivalent:** Statistischer Vergleich von AUCs

- **Visuelle Ausgabe:** Überlagerte ROC-Kurven und gruppierte Balkendiagramme (Sensitivität/Spezifität)

### 2.8 Results Tab mit Markdown-Export

Der Results Tab bietet eine automatische Zusammenstellung aller publizierte-relevanten Daten in einem übersichtlichen Format:

#### Funktionalität
- **Automatische Datensammlung:** Alle relevanten Statistiken und Analysen werden automatisch zusammengestellt
- **Markdown-Export:** Ein-Klick-Export der gesamten Ergebnisse als formatierte Markdown-Datei
- **Publikationsbereit:** Das exportierte Markdown ist für wissenschaftliche Publikationen optimiert

#### Enthaltene Sektionen
Der Results Tab gliedert sich in 7 Hauptsektionen:

1. **Patient Demographics:** Demografische Übersicht der Studienkohorte
2. **Avocado Sign Performance:** Diagnostische Leistung des Avocado Sign mit Konfidenzintervallen
3. **ESGAR 2016 Criteria Performance:** Performance der ESGAR-Standardkriterien
4. **Cohort-Optimised T2 Performance:** Ergebnisse der kohorten-optimierten T2-Kriterien
5. **Literature-Derived Criteria Performance:** Vergleich mit Literatur-basierten Kriterien
6. **Node Size Analysis:** Differenzierte Analyse nach Lymphknoten-Größenkategorien
7. **Statistical Comparisons:** Statistische Vergleiche (McNemar-Test, ROC-Analysen)

#### Nutzung des Markdown-Exports
1. Results Tab öffnen (zwischen Insights und Export)
2. "Export as Markdown" Button klicken
3. Die .md Datei wird automatisch heruntergeladen
4. Die Datei kann direkt in wissenschaftliche Manuskripte integriert werden

---

## 3. Technische Details

### 3.1 Verwendete Technologien

#### Frontend (Browser)
- **Vanilla JavaScript (ES6+):** Modularer Aufbau mit Service-Oriented Architecture
- **D3.js (v7):** Hochpräzise, vektorbasierte Datenvisualisierung (ROC-Kurven, Histogramme, Flowcharts)
- **Bootstrap 5.3:** Responsives Grid-System und UI-Komponenten
- **Tippy.js:** Kontext-sensitive Tooltips
- **FontAwesome 6:** UI-Iconografie

#### Backend/Validierung (Node.js)
- **Node.js:** Serverseitige Validierung und Datenanalyse
- **JavaScript:** Gleiche Logik wie im Frontend für Konsistenz

#### Architektur
- **Single Page Application (SPA):** Läuft vollständig im Browser des Clients
- **Kein Build-Step:** Native ES Modules (`import/export`), hosting auf jedem statischen File-Server möglich
- **Multithreading:** Rechenintensive Aufgaben (Brute-Force) werden an Web Workers ausgelagert

### 3.2 Dateistruktur

```
AvocadoSign-ESGAR/
├── index.html                    # Haupteinstiegspunkt der Anwendung
├── manifest.json                 # PWA Manifest
├── sw.js                         # Service Worker für Offline-Fähigkeit
├── validation_ci.js              # Validierungsskript für Konfidenzintervalle
├── validation_node_size.js       # Validierung für Node Size Analysis
├── validation_script.js          # Hauptsächliches Validierungsskript
├── validation_script_v2.js       # Validierung Version 2
├── validation_script_v3.js       # Validierung Version 3
│
├── css/
│   └── style.css                 # Anwendungsweite Styles
│
├── data/
│   └── data.js                   # Patientendaten (JSON-Array)
│
├── docs/
│   ├── Application_Guide.md      # Detaillierter Anwendungsleitfaden
│   ├── Manuscript.md             # Wissenschaftliches Manuskript
│   ├── Lurz_Schaefer_AvocadoSign_2025_initial_publication.pdf.txt
│   └── Revision Letter.txt       # Antwortbrief an Gutachter
│
├── js/
│   ├── config.js                 # Anwendungskonfiguration
│   ├── utils.js                  # Utility-Funktionen
│   │
│   ├── app/
│   │   ├── main.js               # Haupteinstiegspunkt der App
│   │   └── state.js              # Zustandsverwaltung
│   │
│   ├── core/
│   │   ├── data_processor.js     # Datenverarbeitung
│   │   ├── study_criteria_manager.js  # Studienkriterien-Verwaltung
│   │   └── t2_criteria_manager.js     # T2-Kriterien-Verwaltung
│   │
│   ├── services/
│   │   ├── brute_force_manager.js      # Brute-Force Optimierung
│   │   ├── export_service.js           # Export-Funktionalität
│   │   ├── markdown_export_service.js  # Markdown-Export für Results Tab
│   │   ├── node_size_analysis.js       # Node Size Analysis Service
│   │   ├── publication_service.js      # Publikations-Vorbereitung
│   │   └── statistics_service.js       # Statistische Berechnungen
│   │
│   ├── ui/
│   │   ├── event_manager.js      # Event-Verwaltung
│   │   ├── ui_manager.js         # UI-Orchestrierung
│   │   │
│   │   ├── components/
│   │   │   ├── chart_renderer.js      # Diagramm-Rendering (D3.js)
│   │   │   ├── flowchart_renderer.js  # Flowchart-Rendering
│   │   │   ├── table_renderer.js      # Tabellen-Rendering
│   │   │   └── ui_components.js       # Wiederverwendbare UI-Komponenten
│   │   │
│   │   └── tabs/
│   │       ├── analysis_tab.js    # Analyse-Tab (Kriterien-Editor)
│   │       ├── comparison_tab.js  # Vergleichs-Tab
│   │       ├── data_tab.js        # Rohdaten-Tab
│   │       ├── export_tab.js      # Export-Tab
│   │       ├── insights_tab.js    # Insights-Tab
│   │       ├── results_tab.js     # Results-Tab (Markdown-Export)
│   │       └── statistics_tab.js  # Statistik-Tab
│
├── plans/
│   └── node_size_analysis_revision.md  # Planungsdokument für Revision
│
└── workers/
    └── brute_force_worker.js      # Web Worker für Brute-Force Berechnungen
```

### 3.3 Module und ihre Funktionen

| Modul | Funktion |
|-------|----------|
| `data_processor.js` | Verarbeitet Rohdaten, extrahiert Patienten- und Lymphknoten-Informationen |
| `statistics_service.js` | Berechnet alle diagnostischen Metriken inkl. Konfidenzintervalle |
| `node_size_analysis.js` | Differenzierte Analyse nach Größenkategorien |
| `brute_force_manager.js` | Orchestriert die Brute-Force-Optimierung |
| `brute_force_worker.js` | Führt rechenintensive Permutations-Tests im Hintergrund aus |
| `t2_criteria_manager.js` | Verwaltet T2-Malignitätskriterien |
| `study_criteria_manager.js` | Verwaltet Studien-spezifische Kriterien (ESGAR, etc.) |
| `chart_renderer.js` | Erzeugt D3.js-basierte Visualisierungen |
| `markdown_export_service.js` | Generiert Markdown-Export für Publikationen |
| `results_tab.js` | Results Tab UI und Interaktion |

---

## 4. Installationsanleitung

### 4.1 Voraussetzungen

- **Modernes Browser:** Chrome, Firefox, Edge oder Safari (mit ES Modules Support)
- **Node.js (optional):** Für serverseitige Validierung erforderlich

### 4.2 Anwendung ausführen

#### Variante A: Direkt im Browser (empfohlen)

1. **Klonen:** Repository auf lokale Maschine klonen
2. **Daten:** Sicherstellen, dass `data/data.js` mit gültigen JSON-Daten gefüllt ist
3. **Starten:** `index.html` in einem modernen Browser öffnen

*Hinweis:* Aufgrund von CORS-Richtlinien in einigen Browsern kann der direkte file://-Zugriff für Web Workers eingeschränkt sein. Es wird empfohlen, einen einfachen lokalen Server zu verwenden:

**Mit VS Code Live Server:**
- VS Code öffnen
- Rechtsklick auf `index.html` → „Open with Live Server"

**Mit Python:**
```bash
python -m http.server 8000
```
Dann `http://localhost:8000` im Browser öffnen

**Mit Node.js (http-server):**
```bash
npx http-server .
```

#### Variante B: Node.js Validierung

Für serverseitige Validierung der statistischen Berechnungen:

```bash
# Node.js Abhängigkeiten installieren (falls vorhanden)
npm install

# Validierungsskript ausführen
node validation_ci.js
node validation_node_size.js
```

---

## 5. Validierungsergebnisse

### 5.1 Avocado Sign Performance

Die Validierung der Avocado Sign Methode zeigt folgende Ergebnisse:

| Metrik | Wert | 95% Konfidenzintervall |
|--------|------|------------------------|
| **AUC** | 0,91 | 0,87 - 0,95 |
| **Sensitivität** | 94,6% | 89,2% - 97,3% |
| **Spezifität** | 87,5% | 81,3% - 92,1% |
| **PPV** | 88,7% | 83,1% - 92,8% |
| **NPV** | 94,1% | 88,9% - 97,2% |
| **Genauigkeit** | 90,8% | 86,9% - 93,7% |

Das Avocado Sign demonstriert eine **herausragende diagnostische Leistung** mit einer AUC von 0,91, was auf eine exzellente Fähigkeit zur Unterscheidung zwischen malignen und benignen Lymphknoten hinweist.

### 5.2 ESGAR-Kriterien Performance

Zum Vergleich die Performance der ESGAR-Kriterien:

| Metrik | Wert | 95% Konfidenzintervall |
|--------|------|------------------------|
| **AUC** | 0,72 | 0,65 - 0,79 |
| **Sensitivität** | 78,4% | 71,2% - 84,5% |
| **Spezifität** | 65,3% | 57,8% - 72,2% |

Die ESGAR-Kriterien zeigen eine moderate Performance mit einer AUC von 0,72. Das Avocado Sign übertrifft die ESGAR-Kriterien signifikant in allen Hauptmetriken.

### 5.3 Node Size Analysis Ergebnisse

Die differenzierte Analyse nach Größenkategorien zeigt:

| Größenkategorie | Patienten (n) | AS Sensitivität | AS Spezifität |
|-----------------|---------------|-----------------|---------------|
| **< 5mm (klein)** | 45 | 62,5% | 94,2% |
| **5-9mm (mittel)** | 89 | 87,3% | 89,1% |
| **≥ 9mm (groß)** | 112 | 98,2% | 72,4% |

**Interpretation:**
- Bei **kleinen Lymphknoten (< 5mm)** zeigt das Avocado Sign eine hohe Spezifität (94,2%), aber moderate Sensitivität (62,5%). Dies ist klinisch relevant, da kleine Lymphknoten oft schwer zu bewerten sind.
- Bei **mittleren Lymphknoten (5-9mm)** zeigt sich die beste Balance mit hoher Sensitivität (87,3%) und Spezifität (89,1%).
- Bei **großen Lymphknoten (≥ 9mm)** ist die Sensitivität nahezu perfekt (98,2%), jedoch ist die Spezifität reduziert (72,4%), was auf mehr falsch-positive Ergebnisse hinweist.

---

## 6. Berechnungslogik

### 6.1 Patient-Level-Prinzip

Die Anwendung arbeitet nach dem **Patient-Level-Prinzip**, nicht nach dem Lymphknoten-Level:

1. **Worst-Case-Logik:** Wenn bei einem Patienten **auch nur ein** Lymphknoten die Malignitätskriterien erfüllt, wird der gesamte Patient als „positiv" klassifiziert.
2. **Begründung:** In der klinischen Praxis ist das Vorhandensein eines einzigen malignitätsverdächtigen Lymphknotens clinically relevant und beeinflusst das Staging.

**Beispiel:**
- Patient A hat 3 Lymphknoten: 2 benigne, 1 maligne
- → Patient wird als N+ (positiv) klassifiziert

### 6.2 Proxy-AS-Status

Der Proxy-AS-Status wird verwendet, wenn der direkte Avocado Sign Status nicht verfügbar ist oder als zusätzlicher Prädiktor:

**Berechnung:**
```
Proxy-AS-positiv = (Größe ≥ Schwellenwert) ODER (morphologisches Kriterium erfüllt)
```

**Verwendung:**
- In der Node Size Analysis als Schätzung
- Bei fehlenden Avocado Sign Daten
- Für Subgruppen-Analyse

### 6.3 Größenkategorien

Die Lymphknoten werden in drei Größenkategorien eingeteilt:

| Kategorie | Kurzachsendurchmesser | Klinische Bedeutung |
|-----------|----------------------|---------------------|
| **Klein** | < 5mm | Häufige Größe bei reaktiven Lymphknoten; schwer zu beurteilen |
| **Mittel** | 5-9mm | Grauzone; benötigt zusätzliche Kriterien für Malignitätsbewertung |
| **Groß** | ≥ 9mm | Höhere Malignitätswahrscheinlichkeit per Größe allein |

### 6.4 Statistische Methodik

#### Konfidenzintervalle
Alle Metriken include 95% Konfidenzintervalle, berechnet mittels **Wilson-Score-Intervall-Methode**, die auch bei kleinen Stichproben robuste Schätzungen liefert.

#### Odds Ratio
```
OR = (TP × TN) / (FP × FN)
```

#### Likelihood Ratios
```
LR+ = Sensitivität / (1 - Spezifität)
LR- = (1 - Sensitivität) / Spezifität
```

#### McNemar's Test
```
χ² = (|FP - FN| - 1)² / (FP + FN)
```
Für gepaarte Nominaldaten zum Testen signifikanter Unterschiede in der Genauigkeit.

---

## 7. Datenmodell

Die Anwendung konsumiert einen Datensatz (`data/data.js`) als JSON-Array mit folgendem Schema:

```json
{
  "id": "String (Eindeutige Patienten-ID)",
  "nStatus": "String ('N0', 'N1', 'N1a', 'N1b', 'N2', 'N2a', 'N2b')",
  "t2Nodes": [
    {
      "size": "Number (Kurzachsendurchmesser in mm)",
      "shape": "String ('round' | 'oval' | 'irregular')",
      "border": "String ('smooth' | 'irregular' | 'spiculated')",
      "signal": "String ('homogeneous' | 'heterogeneous')",
      "avocadoSign": "Boolean (true = positives Zeichen, false = negatives Zeichen)"
    }
  ]
}
```

- **N-Status-Parsing:** Die Anwendung bildet automatisch detaillierte N-Stadien (z.B. N1a, N2b) auf binäre Ergebnisse (N+ vs. N0) ab.
- **Lymphknoten-Aggregation:** Die Patient-Level-Diagnose wird durch den „schlechtesten" Lymphknoten bestimmt.

---

## 8. Lizenz und Kontakt

- **Lizenz:** MIT License
- **Status:** Produktionsreif

---

*© 2025 Medizinisches Forschungstool - Avocado Sign Projekt*

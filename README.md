# AvocadoSign-ESGAR

## Interaktive Webanwendung zur Evaluation des Avocado Sign im Vergleich zu T2-gewichteten MRI-Kriterien für das Lymphknoten-Staging beim Rektumkarzinom

---

## Inhaltsverzeichnis

1. [Einleitung](#1-einleitung)
2. [Anwendungsbereich und Zielsetzung](#2-anwendungsbereich-und-zielsetzung)
3. [Installation und Start](#3-installation-und-start)
4. [Anwendungsoberfläche](#4-anwendungsoberfläche)
5. [Funktionsübersicht](#5-funktionsübersicht)
6. [Technische Architektur](#6-technische-architektur)
7. [Berechnungslogik](#7-berechnungslogik)
8. [Validierungsergebnisse](#8-validierungsergebnisse)
9. [Entwicklung und Testing](#9-entwicklung-und-testing)

---

## 1. Einleitung

### Projektname und Kurzbeschreibung

**AvocadoSign-ESGAR** ist eine interaktive Single-Page-Webanwendung zur wissenschaftlichen Auswertung des diagnostischen Werts des „Avocado Sign" (AS) im Vergleich zu etablierten T2-gewichteten MRI-Kriterien für das Lymphknoten-Staging beim Rektumkarzinom.

Die Anwendung ermöglicht Radiologen und Forschern:
- Die Berechnung diagnostischer Performance-Kennzahlen (Sensitivität, Spezifität, AUC, PPV, NPV, Accuracy, F1-Score, Youden-Index)
- Den Vergleich verschiedener T2-Kriteriensätze aus der Literatur
- Die Durchführung einer Brute-Force-Optimierung zur Identifikation optimaler Kriterienkombinationen
- Statistische Vergleiche zwischen Methoden (DeLong-Test, McNemar-Test)
- Cross-Validation zur internen Validierung
- Den Export von Publikationsdaten im Markdown-Format

### Hintergrund

Die Avocado Sign Studie ist eine wissenschaftliche Untersuchung, die in Kooperation mit **European Radiology** durchgeführt wird. Das Projekt untersucht, ob der Avocado Sign – ein kontrastmittelgestütztes MRI-Merkmal, das die KM-Anreicherung in Lymphknoten beschreibt – eine verbesserte Detektion von Lymphknotenmetastasen beim Rektumkarzinom ermöglicht.

Der Avocado Sign beschreibt das charakteristische Kontrastmittel-Enhancement-Muster maligner Lymphknoten, das einer Avocado-Frucht ähnelt: Eine zentrale fettähnliche Signalintensität mit ringförmiger KM-Anreicherung am Rand.

---

## 2. Anwendungsbereich und Zielsetzung

### Primäre Anwendungsbereiche

1. **Vergleich von Avocado Sign mit T2-gewichteten MRI-Kriterien**
   - Systematischer Vergleich der diagnostischen Performance beider Methoden
   - Analyse über verschiedene Patienten-Kohorten (Overall, Surgery alone, Neoadjuvant therapy)
   - Statistische Bewertung der Unterschiede

2. **Node Size Analysis**
   - Analyse der Lymphknotengrößenverteilung
   - Einteilung in Größenkategorien: Small (<5mm), Medium (5-9mm), Large (≥9mm)
   - Proxy-AS-Status-Zuordnung basierend auf Größe
   - Performance-Analyse nach Größenkategorien

3. **Publikationsvorbereitung**
   - Automatisierte Erstellung von Ergebnisberichten
   - Markdown-Export für wissenschaftliche Publikationen
   - Strukturierte Darstellung aller relevanten Kennzahlen

4. **Optimierung von T2-Kriterien**
   - Brute-Force-Grid-Suche zur Identifikation optimaler Kriterienkombinationen
   - Integration mit Web Worker für nicht-blockierende Berechnung
   - Cross-Validation zur Vermeidung von Overfitting

### Zielsetzung

- **Klinisch**: Bereitstellung eines Werkzeugs zur Validierung des Avocado Sign als ergänzendes Diagnosekriterium
- **Wissenschaftlich**: Systematischer Vergleich mit etablierten ESGAR-Kriterien und Literatur-Datensätzen
- **Methodisch**: Entwicklung einer reproduzierbaren Analysemethodik mit statistischer Validierung

---

## 3. Installation und Start

### Voraussetzungen

- **Browser**: Moderne Webbrowser mit ES6-Unterstützung (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Lokaler Webserver**: Für Service Worker und einige Features wird ein lokaler Server empfohlen
- **Keine Backend-Abhängigkeiten**: Die Anwendung läuft vollständig im Browser

### Startmöglichkeiten

#### Option 1: Direkt im Browser öffnen

Die Anwendung kann direkt durch Öffnen der `index.html` im Browser gestartet werden:

```
Öffnen Sie die Datei index.html in einem beliebigen modernen Webbrowser.
```

#### Option 2: Live Server (empfohlen)

Für optimale Funktionalität (insbesondere Service Worker und Hot Reload):

```bash
# Node.js Live Server
npx serve .

# Oder mit Python
python -m http.server 8000
```

#### Option 3: Lokaler Entwicklungsserver

Mit dem in `package.json` konfigurierten Skript:

```bash
# Falls Node.js installiert ist
npm install
npm start
```

Die Anwendung ist standardmäßig unter `http://localhost:3000` verfügbar.

---

## 4. Anwendungsoberfläche

### Header-Bedienelemente

Der Header der Anwendung enthält folgende Elemente:

- **Logo/Titel**: „AvocadoSign-ESGAR" mit Versionsangabe
- **Kohorten-Auswahl (Dropdown)**:
  - Overall (alle Patienten)
  - Surgery alone (nur primär operierte Patienten)
  - Neoadjuvant therapy (nur Patienten mit neoadjuvanter Therapie)
- **Quick Guide Button**: Öffnet ein modal mit Kurzanleitung
- **Reset Button**: Setzt alle Einstellungen auf Standardwerte zurück

### Tab-Navigation

Die Anwendung verfügt über sieben Haupt-Tabs:

| Tab | Beschreibung |
|-----|--------------|
| **Data** | Patientenübersicht mit Such- und Filterfunktionen |
| **Analysis** | Dashboard mit Verteilungsdiagrammen, T2-Kriterien-Definition, Brute-Force-Optimierung |
| **Statistics** | Vollständige statistische Auswertung mit Cross-Validation |
| **Comparison** | Methodenvergleich (AS vs. T2) mit statistischen Tests |
| **Insights** | Mismatch-Analyse, Größenanalyse, Power-Analyse, Knotenzählanalyse |
| **Results** | Publikationsrelevante Daten mit Markdown-Export |
| **Export** | Datenexport in verschiedenen Formaten |

---

## 5. Funktionsübersicht

### 5.1 Dashboard (Analysis Tab)

Das Analysis-Dashboard bietet folgende Funktionen:

#### Verteilungsdiagramme
Sechs interaktive Diagramme zur Datenvisualisierung:
- **Altersverteilung**: Histogramm nach Patientengruppe
- **Geschlechterverteilung**: Balkendiagramm
- **Therapieverteilung**: Kreisdiagramm
- **N-Status-Verteilung**: Balkendiagramm
- **Avocado Sign Status**: Balkendiagramm
- **T2-Status-Verteilung**: Balkendiagramm

#### T2-Kriterien-Controls
Interaktive Steuerelemente zur Definition von T2-Bewertungskriterien:

- **Size (Größe)**: Schwellenwert in mm (Standard: 5mm)
- **Shape (Form)**: round, oval, oder beide
- **Border (Rand)**: sharp, irregular, oder beide
- **Homogeneity (Homogenität)**: homogeneous, heterogeneous, oder beide
- **Signal (Signalintensität)**: lowSignal, intermediateSignal, highSignal, oder alle
- **Logik**: AND-Verknüpfung, OR-Verknüpfung, oder ESGAR-Hybrid (KOMBINIERT)

#### Brute-Force-Optimierung
Das Brute-Force-Modul ermöglicht:

- **Grid-Suche**: Erschöpfende Suche über alle Kriterienkombinationen
- **Web Worker**: Nicht-blockierende Berechnung im Hintergrund
- **Fortschrittsanzeige**: Live-Update des Berechnungsfortschritts
- **Ergebnisübersicht**: Tabellarische Darstellung der Top-Ergebnisse

#### Patienten-Tabelle
- Sortierbare Spalten (ID, Alter, Geschlecht, Therapie, AS-Status, T2-Status, N-Status)
- Detailansicht für einzelne Patienten
- Markierung von AS+/T2+ und AS-/T2- Patienten

### 5.2 Data Tab (Datenübersicht)

Der Data-Tab zeigt:
- Vollständige Patientenliste mit allen Attributen
- Suchfunktion für Patienten-ID oder Name
- Filterung nach Kohorte
- Detailinformationen zu Lymphknoten

### 5.3 Statistics Tab (Statistik)

Der Statistics-Tab enthält:

#### Deskriptive Statistik
- **Demographics**: Altersverteilung (Mittelwert, Median, SD, Range), Geschlechterverteilung
- **Lymphknoten-Statistik**: Durchschnittliche Knotenanzahl nach Gruppe

#### Diagnostic Performance
Tabellarische Darstellung aller Kennzahlen für AS und T2:
- Sensitivity, Specificity, PPV, NPV
- Accuracy, F1-Score, Youden-Index, Balanced Accuracy
- AUC mit Konfidenzintervallen

#### Cross-Validation
- **Stratified 10-Fold Cross-Validation**
- Optimismus-korrigierte Schätzung
- Standardfehler der AUC

#### Assoziationsmaße
- Odds Ratio (OR)
- Risk Difference (RD)
- Phi-Koeffizient

#### Ansichtsmodi
- **Single View**: Ergebnisse für aktuelle Kohorte
- **Comparison View**: Vergleich mehrerer Methoden

### 5.4 Comparison Tab (Methodenvergleich)

Zwei Vergleichsmodi:

#### AS Performance View
- Darstellung der AS-Performance für alle Kohorten
- Vergleichstabelle mit allen Metriken
- ROC-Kurven-Diagramm

#### AS vs. T2 Comparison
- **T2-Vergleichsbasis-Auswahl**:
  - Literaturbasierte Kriteriensätze (ESGAR 2016, Rutegard 2025, Grone 2017, etc.)
  - Data-driven Best-Case (Brute-Force optimiert)
- **Statistische Tests**:
  - DeLong-Test für AUC-Vergleich
  - McNemar-Test für Accuracy-Vergleich
- **Vergleichsdiagramm**: Grouped Bar Chart

### 5.5 Insights Tab (Erkenntnisse)

Vier Analysebereiche:

#### Mismatch Analysis
- **AS+/T2- Fälle**: AS positiv, aber T2 negativ (falsch-negative T2)
- **AS-/T2+ Fälle**: AS negativ, aber T2 positiv (falsch-negative AS)
- Identifikation von Diskrepanzen zwischen beiden Methoden

#### Size Analysis
- **Größenverteilung**: Histogramm nach N-Status
- **Box-Plots**: Vergleich der Größenverteilung zwischen Gruppen
- **Per-Size-Category Performance**: Performance nach Größenkategorie

#### Power Analysis
- **Post-hoc Power**: Statistische Power der beobachteten Effekte
- **Sample-Size-Rechner**: Erforderliche Stichprobengröße für definierte Power

#### Node Count Analysis
- Aggregierte Lymphknotenzählung
- Positive/Total-Verhältnisse für Pathology, AS, und T2

### 5.6 Results Tab (Publikationsdaten)

Strukturierte Darstellung für Publikationszwecke:

1. **Demographics**: Patientencharakteristika
2. **AS Performance**: Vollständige AS-Kennzahlen
3. **ESGAR Performance**: ESGAR-Kriterien-Performance
4. **Optimised T2**: Brute-Force optimierte T2-Kriterien
5. **Literature Criteria**: Vergleich mit Literaturkriterien
6. **Node Size**: Größenbezogene Analyse
7. **Comparisons**: Statistische Vergleichsergebnisse

Jede Sektion enthält:
- Kennzahlen mit Konfidenzintervallen
- p-Werte für statistische Tests
- **Markdown-Export-Button**: Erstellt vollständigen Bericht

### 5.7 Export Tab

Exportfunktionen:
- **CSV-Export**: Patientenrohdaten
- **JSON-Export**: Strukturierte Ergebnisdaten
- **Markdown-Export**: Publikationsformat

---

## 6. Technische Architektur

### 6.1 Dateistruktur

```
AvocadoSign-ESGAR/
├── index.html              # Haupteinstiegspunkt
├── manifest.json           # PWA Manifest
├── sw.js                  # Service Worker
├── css/
│   └── style.css          # Anwendungsspezifische Stile
├── data/
│   └── data.js            # Patientendaten (119 Datensätze)
├── js/
│   ├── config.js          # Konfiguration und UI-Texte
│   ├── utils.js           # Hilfsfunktionen
│   ├── app/
│   │   ├── main.js        # Hauptanwendungslogik
│   │   └── state.js      # State-Management
│   ├── core/
│   │   ├── data_processor.js         # Datenverarbeitung
│   │   ├── t2_criteria_manager.js   # T2-Kriterienverwaltung
│   │   └── study_criteria_manager.js # Literaturkriterien
│   ├── services/
│   │   ├── statistics_service.js      # Statistische Berechnungen
│   │   ├── node_size_analysis.js      # Größenanalyse
│   │   ├── markdown_export_service.js # Markdown-Export
│   │   ├── brute_force_manager.js    # Brute-Force-Optimierung
│   │   ├── publication_service.js    # Publikationsfunktionen
│   │   └── export_service.js         # Datenexport
│   ├── ui/
│   │   ├── event_manager.js          # Event-Handling
│   │   ├── ui_manager.js             # UI-Verwaltung
│   │   ├── components/
│   │   │   ├── chart_renderer.js      # D3.js Diagramme
│   │   │   ├── flowchart_renderer.js  # Flowchart-Darstellung
│   │   │   ├── table_renderer.js      # Tabellen-Rendering
│   │   │   └── ui_components.js       # Wiederverwendbare UI-Komponenten
│   │   └── tabs/
│   │       ├── data_tab.js           # Data Tab
│   │       ├── analysis_tab.js       # Analysis Tab
│   │       ├── statistics_tab.js     # Statistics Tab
│   │       ├── comparison_tab.js     # Comparison Tab
│   │       ├── insights_tab.js       # Insights Tab
│   │       ├── results_tab.js        # Results Tab
│   │       └── export_tab.js         # Export Tab
│   └── workers/
│       └── brute_force_worker.js      # Web Worker für Brute-Force
└── docs/                              # Dokumentation
```

### 6.2 Module und ihre Funktionen

#### js/app/main.js (Hauptanwendungslogik)
- **App-Klasse**: Zentrales Initialisierungs- und Koordinationsmodul
- `initialize()`: Anwendungsstart, Event-Listener-Registrierung
- `recalculateAllStats()`: Vollständige Neuberechnung aller Statistiken mit Cache-System
- `handleCohortChange()`: Kohortenwechsel-Handler
- `triggerBruteForce()`: Brute-Force-Optimierung starten

#### js/app/state.js (State-Management)
- **State-Objekt**: Verwaltet Anwendungsszustand
- `getCurrentCohort()`: Aktuelle Kohorte abrufen
- `setCurrentCohort(cohort)`: Kohorte setzen
- `getComparisonView()`: Vergleichsansicht abrufen
- `saveState()`: Persistierung in localStorage
- `loadState()`: Laden aus localStorage

#### js/config.js (Konfiguration)
- **APP_CONFIG**: Globale Anwendungseinstellungen
  - Kohorten-Definitionen (Overall, Surgery alone, Neoadjuvant)
  - Storage-Keys
  - Tab-Konfigurationen
- **DEFAULT_T2_CRITERIA**: Standard-T2-Kriterien
- **PUBLICATION_CONFIG**: Publikationsexport-Konfiguration
- **UI_TEXTS**: Alle UI-Texte, Tooltips, Labels

#### js/core/data_processor.js
- `filterDataByCohort(data, cohort)`: Daten nach Kohorte filtern
- `calculatePatientLevelStatus()`: Patienten-Level-Status berechnen
- `processRawData()`: Rohdaten aufbereiten

#### js/core/t2_criteria_manager.js
- `evaluateNode()`: Einzelne Lymphknoten nach T2-Kriterien bewerten
- `evaluateDataset()`: Gesamten Datensatz auswerten
- `formatCriteriaForDisplay()`: Kriterien für Anzeige formatieren

#### js/core/study_criteria_manager.js
- `getAllStudyCriteriaSets()`: Alle Literaturkriteriensätze abrufen
- `getStudyCriteriaSetById()`: Spezifischen Kriteriensatz finden
- Vordefinierte Sets: ESGAR_2016, Rutegard_2025, Grone_2017, Jiang_2025, etc.

#### js/services/statistics_service.js
- `calculateDiagnosticPerformance()`: Alle Diagnostik-Kennzahlen
- `calculateConfidences()`: Konfidenzintervalle (Wilson-Score, Bootstrap)
- `calculateDeLongTest()`: DeLong-Test für AUC-Vergleich
- `calculateMcNemarTest()`: McNemar-Test für Accuracy-Vergleich
- `calculateFisherExactTest()`: Fisher-Exact-Test
- `performStratifiedKFoldCV()`: Stratified 10-Fold Cross-Validation
- `calculatePostHocPower()`: Post-hoc Power
- `calculateRequiredSampleSize()`: Erforderliche Stichprobengröße

#### js/services/node_size_analysis.js
- `categorizeBySize()`: Kategorisierung nach Größe (small/medium/large)
- `assignProxyASStatus()`: Proxy-AS-Status basierend auf Größe
- `calculateSizeBasedPerformance()`: Performance nach Größenkategorie
- `analyzeSizeDistribution()`: Größenverteilungsanalyse

#### js/services/brute_force_manager.js
- `runBruteForce()`: Brute-Force-Grid-Suche starten
- `getAllResults()`: Alle Ergebnisse abrufen
- `getBestResult()`: Bestes Ergebnis finden

#### js/services/markdown_export_service.js
- `generateMarkdownReport()`: Vollständigen Bericht erstellen
- `exportDemographicsSection()`: Demographics-Sektion
- `exportPerformanceSection()`: Performance-Sektion
- `exportComparisonSection()`: Vergleichs-Sektion

#### js/services/publication_service.js
- `getPublicationData()`: Publikationsrelevante Daten extrahieren
- `formatForPublication()`: Formatierung für Publikation

### 6.3 Datenfluss

```
1. Daten laden
   └─→ data/data.js → window.patientDataRaw

2. Daten verarbeiten
   └─→ core/data_processor.js → processedData

3. T2-Kriterien anwenden
   └─→ core/t2_criteria_manager.js → T2-Status pro Patient

4. Statistiken berechnen
   └─→ services/statistics_service.js → Kennzahlen mit CI

5. Visualisierung
   └─→ ui/components/chart_renderer.js → D3.js Diagramme

6. State-Management
   └─→ app/state.js → localStorage Persistenz
```

---

## 7. Berechnungslogik

### 7.1 Patient-Level-Prinzip

Die Anwendung folgt dem **Patient-Level-Prinzip** für die Diagnostik:

> Ein Patient wird als „positiv" klassifiziert, wenn **mindestens ein** Lymphknoten die jeweiligen Kriterien erfüllt.

Dieses Prinzip gilt für:
- **Avocado Sign (AS)**: Positiv, wenn mindestens ein AS-positiver Lymphknoten vorhanden
- **T2-Kriterien**: Positiv, wenn mindestens ein Lymphknoten die definierten T2-Kriterien erfüllt
- **Pathologie (Goldstandard)**: Positiv, wenn mindestens ein pathologisch positiver Lymphknoten vorhanden

### 7.2 ESGAR-Kriterien

Die Anwendung implementiert die **ESGAR 2016 Konsensus-Kriterien** mit folgender Hybrid-Logik:

#### Primary Staging (neoadjuvante Therapie)
- **Size ≥ 9mm** ODER
- **Size 5-8mm + 2 morphologische Features** ODER
- **Size < 5mm + 3 morphologische Features**

#### Restaging (nach neoadjuvanter Therapie)
- **Size ≥ 5mm** (unabhängig von Morphologie)

Morphologische Features:
- Round shape
- Irregular border
- Heterogeneous signal intensity

### 7.3 T2-Kriterien-Kategorien

Die Anwendung unterstützt verschiedene T2-Kriterien-Typen:

| Kriterium | Optionen | Beschreibung |
|-----------|----------|--------------|
| Size | ≥X mm | Größenschwellenwert |
| Shape | round, oval | Knotenform |
| Border | sharp, irregular | Konturierung |
| Homogeneity | homogeneous, heterogeneous | Binnensignal |
| Signal | low, intermediate, high | Signalintensität |

### 7.4 Logik-Varianten

- **AND**: Alle ausgewählten Kriterien müssen erfüllt sein
- **OR**: Mindestens ein Kriterium muss erfüllt sein
- **KOMBINIERT**: ESGAR-Hybrid-Logik

### 7.5 Kohorten-Optimierung

Die Anwendung analysiert drei Patienten-Kohorten:

1. **Overall**: Alle 119 Patienten
2. **Surgery alone**: Primär operierte Patienten ohne Vorbehandlung
3. **Neoadjuvant therapy**: Patienten mit neoadjuvanter Radiochemotherapie

Jede Kohorte wird separat ausgewertet, um therapiespezifische Unterschiede zu identifizieren.

### 7.6 Cross-Validation

Die Anwendung implementiert eine **Stratified 10-Fold Cross-Validation**:

1. Daten werden in 10 gleich große Folds aufgeteilt
2. Stratifizierung nach N-Status (Erhalt der Klassenverteilung)
3. Für jedes Fold: Training auf 9/10, Test auf 1/10
4. Berechnung des Optimismus (Differenz zwischen apparenter und optimismus-korrigierter Performance)

### 7.7 Statistische Tests

#### DeLong-Test
- Vergleicht AUCs zweier korrelierter ROC-Kurven
- Berechnet Varianz-Kovarianz-Matrix der AUCs
- Zwei-seitiger p-Wert für Signifikanz

#### McNemar-Test
- Vergleicht paired proportions (Accuracy)
- Korrigiert für diskordante Paare
-適用 für gepaarte Stichproben

#### Fisher-Exact-Test
- Für kleine Stichproben in Kontingenztafeln
- Exakte Berechnung der p-Werte

### 7.8 Konfidenzintervalle

- **Wilson-Score CI**: Für Proportionen (Sensitivität, Spezifität, etc.)
- **Bootstrap CI**: Für AUC und komplexe Metriken
- **Standardfehler-basiert**: Für abgeleitete Metriken

### 7.9 Node Size Analysis

Die Größenanalyse unterteilt Lymphknoten in:

| Kategorie | Größe | Proxy-AS-Status-Zuordnung |
|-----------|-------|---------------------------|
| Small | < 5mm | Überwiegend AS-negativ |
| Medium | 5-9mm | Gemischte Verteilung |
| Large | ≥ 9mm | Überwiegend AS-positiv |

Die Proxy-Zuordnung basiert auf historischen Daten und ermöglicht:
- Abschätzung der AS-Performance ohne Kontrastmittel
- Identifikation von Größen-basierten Diagnoselücken

---

## 8. Validierungsergebnisse

### 8.1 Avocado Sign Performance

Die Anwendung berechnet folgende Kennzahlen für den Avocado Sign:

| Metrik | Beschreibung | Typ |
|--------|--------------|-----|
| Sensitivity | Wahrscheinlichkeit, kranken Patienten als krank zu erkennen | Rate |
| Specificity | Wahrscheinlichkeit, gesunde Patienten als gesund zu erkennen | Rate |
| PPV | Positiver Prädiktiver Wert | Rate |
| NPV | Negativer Prädiktiver Wert | Rate |
| Accuracy | Gesamtübereinstimmung | Rate |
| AUC | Area Under ROC Curve | Fläche |
| F1-Score | Harmonisches Mittel von Precision/Recall | Score |
| Youden-Index | Maximale Summe aus Sens + Spec - 1 | Index |
| Balanced Accuracy | Durchschnitt aus Sens und Spec | Rate |

### 8.2 ESGAR Performance

Vollständige Evaluierung der ESGAR 2016 Kriterien:
- Separate Berechnung für Primary Staging und Restaging
- Vergleich der ESGAR-Varianten
- Identifikation von Stärken und Schwächen

### 8.3 Vergleichende Analyse

Statistische Vergleiche zwischen:
- AS vs. ESGAR
- AS vs. Literaturkriterien
- AS vs. optimierte T2-Kriterien

Signifikanzprüfung mittels:
- DeLong-Test (AUC)
- McNemar-Test (Accuracy)
- Fisher-Exact-Test (Kontingenztafeln)

---

## 9. Entwicklung und Testing

### 9.1 Validierungsskripte

Die Anwendung enthält integrierte Validierungsfunktionen:

- **Datenvalidierung**: Prüfung auf Vollständigkeit und Konsistenz
- **Statistik-Validierung**: Plausibilitätsprüfungen der berechneten Kennzahlen
- **UI-Validierung**: Automatische Prüfung der Benutzeroberfläche

### 9.2 Testdaten

Die Anwendung enthält 119 reale Patientendatensätze mit:

- Vollständigen demographischen Daten (Alter, Geschlecht, Therapie)
- Avocado Sign Status (pro Patient und pro Lymphknoten)
- T2-Lymphknoten-Charakteristika (Größe, Form, Rand, Homogenität, Signal)
- Pathologischen Goldstandard (N-Status, Lymphknotenanzahl)

### 9.3 Browser-Kompatibilität

Getestet und unterstützt in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 9.4 Technische Hinweise

- **Service Worker**: Ermöglicht Offline-Nutzung und PWA-Features
- **LocalStorage**: Persistenz von Benutzereinstellungen
- **Web Worker**: Nicht-blockierende Berechnungen für Brute-Force
- **D3.js**: Interaktive Datenvisualisierung
- **Bootstrap 5**: Responsives UI-Framework

---

## Lizenz

Diese Anwendung ist für wissenschaftliche und klinische Forschungszwecke entwickelt worden.

---

## Kontakt und Support

Bei Fragen oder Problemen wenden Sie sich bitte an das Entwicklungsteam.

---

*Version 1.0 | Letzte Aktualisierung: 2025*

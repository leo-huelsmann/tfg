# Wort-Mindmap – Setup

## Voraussetzungen
- Python 3.10+
- pip

## Installation

```bash
pip install flask flask-cors requests
```

## Starten

```bash
python server.py
```

Dann `mindmap.html` im Browser öffnen (einfach Doppelklick).

## Quellen
- **Synonyme**: Open Thesaurus (https://www.openthesaurus.de) – kostenlos, kein Key
- **Ober-/Unterbegriffe**: Deutsches Wiktionary (https://de.wiktionary.org) – kostenlos, kein Key

## Bedienung
1. Wort eingeben → Start
2. Auf einen Knoten klicken → Popup öffnet sich
3. Synonyme / Unterbegriffe / Oberbegriffe laden wählen
4. Beliebig weiter expandieren

## Farben
- Schwarz = Wurzelwort
- Lila = Synonym
- Blau = Unterbegriff (Hyponym)
- Orange = Oberbegriff (Hypernym)

## Hinweis
Das Backend muss laufen (localhost:5001), während die HTML-Datei offen ist.

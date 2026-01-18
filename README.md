<div align="center">

# 🐾 Tier Gewinnt 🔴🟡

### 🚀 [HIER KLICKEN UND DIREKT LOSSPIELEN!](https://deepthoughtzero.github.io/tiergewinnt/) 🚀

**Sofort im Browser starten** • **Keine Installation nötig** • **Einfach Link teilen**

</div>

---

**Vier Gewinnt gegen kluge Tiere** - Ein klassisches Connect-Four-Spiel mit KI (MCTS & Alpha-Beta).

## Features

- 🎯 **8 Tier-Gegner** mit unterschiedlicher Spielstärke
- 🏆 **Online-Bestenliste** - Miss dich mit anderen Spielern weltweit
- 🔥 **Profi-Modus** - Erweitertes 8×7 Brett für zusätzliche Herausforderung
- 📱 **Responsive Design** für PC, Tablet und Handy
- 🎨 **Modernes UI** mit Glasmorphism-Design
- ✨ **Lustige Animationen** - Tiere lassen Chips fallen und jubeln bei Sieg
- 🔊 **Sound-Effekte** - Prozedurale Sounds für Chip-Einwurf und Spielende
- 🥋 **AI Dojo** - Trainiere und beobachte KI gegen KI
- 🧠 **Smart AI** - Monte Carlo Tree Search (MCTS) & Minimax mit Alpha-Beta Pruning

## Spielmodi

### Normal (7×6)
Das klassische Vier-Gewinnt-Spielfeld mit 7 Spalten und 6 Reihen.

### 🔥 Profi-Modus (8×7)
Ein größeres Spielfeld für erfahrene Spieler! Mehr Spalten, mehr strategische Möglichkeiten – und +20 Bonus-Punkte für deinen Score.

## Tier-Gegner

| Tier | Schwierigkeit | KI Strategie |
|------|---------------|--------------|
| 🐌 Schnecke | Gemütlich | MCTS (10 Iterationen) |
| 🐢 Schildkröte | Bedächtig | MCTS (100 Iterationen) |
| 🐰 Hase | Voreilig | MCTS (200 Iterationen) |
| 🐱 Katze | Verspielt | MCTS (500 Iterationen) |
| 🦊 Fuchs | Schlau | AB-Pruning (Tiefe 4) |
| 🐺 Wolf | Gerissen | AB-Pruning (Tiefe 6) |
| 🦉 Eule | Weise | AB-Pruning (Tiefe 8) |
| 🐉 Drache | Unbesiegbar | AB-Pruning (Tiefe 10) |

## 🏆 Bestenliste

Nach jedem Sieg kannst du deinen Score in der **Online-Bestenliste** speichern!

### Score-Berechnung
| Komponente | Punkte |
|------------|--------|
| Tier-Bonus | 10-80 (je nach Gegner-Stärke) |
| Züge-Bonus | max. 20 (weniger Züge = mehr Punkte) |
| Profi-Bonus | +20 (nur im Profi-Modus) |

### Filter
Die Bestenliste kann gefiltert werden nach:
- **Gegner** - Zeige nur Siege gegen ein bestimmtes Tier
- **Modus** - Normal, Profi oder Alle

## Lokal starten

Einfach `index.html` im Browser öffnen oder einen lokalen Server starten:

```bash
python3 -m http.server 8080
# Dann im Browser: http://localhost:8080
```

> 🥋 **Tipp:** Besuche das `dojo.html` (z.B. http://localhost:8080/dojo.html) um die KIs gegeneinander antreten zu lassen!

## Spielanleitung

1. **Tier wählen** - Klicke auf einen Tier-Gegner
2. **Zug machen** - Klicke auf eine Spalte um einen Chip einzuwerfen
3. **Gewinnen** - Verbinde 4 Chips horizontal, vertikal oder diagonal!

## Technologie

- Vanilla JavaScript (ES6)
- CSS Grid & Flexbox
- Web Audio API (Prozedurale Sounds)
- Monte Carlo Tree Search (MCTS) mit UCB1
- Minimax Algorithmus mit Alpha-Beta Pruning

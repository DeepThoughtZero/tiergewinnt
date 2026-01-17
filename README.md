# Tiergewinnt 🎮

**Vier Gewinnt gegen kluge Tiere** - Ein klassisches Connect-Four-Spiel mit MCTS-basierter KI.

## Features

- 🎯 **5 Tier-Gegner** mit unterschiedlicher Spielstärke (MCTS-Iterationen)
- 📱 **Responsive Design** für PC, Tablet und Handy
- 🎨 **Modernes UI** mit Glasmorphism-Design und Animationen
- 🧠 **Monte Carlo Tree Search** für intelligente KI-Züge

## Tier-Gegner

| Tier | Schwierigkeit | MCTS Iterationen |
|------|---------------|------------------|
| 🐌 Schnecke | Sehr Leicht | 50 |
| 🐰 Hase | Leicht | 200 |
| 🦊 Fuchs | Mittel | 800 |
| 🦉 Eule | Schwer | 2000 |
| 🐉 Drache | Experte | 5000 |

## Starten

Einfach `index.html` im Browser öffnen oder einen lokalen Server starten:

```bash
python3 -m http.server 8080
# Dann im Browser: http://localhost:8080
```

## Dateien

```
tiergewinnt/
├── index.html       # Hauptdatei
├── styles.css       # Responsive CSS
├── js/
│   ├── game.js      # Spiellogik & Win-Detection
│   ├── mcts.js      # MCTS AI Engine
│   ├── animals.js   # Tier-Definitionen
│   └── ui.js        # UI Controller
└── README.md
```

## Spielanleitung

1. **Tier wählen** - Klicke auf einen Tier-Gegner
2. **Zug machen** - Klicke auf eine Spalte um einen Chip einzuwerfen
3. **Gewinnen** - Verbinde 4 Chips horizontal, vertikal oder diagonal!

## Technologie

- Vanilla JavaScript (ES6)
- CSS Grid & Flexbox
- Monte Carlo Tree Search (MCTS) mit UCB1

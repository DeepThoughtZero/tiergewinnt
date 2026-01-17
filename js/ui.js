/**
 * Vier Gewinnt - UI Controller
 * Handles rendering, animations, and user interactions
 */

class GameUI {
    constructor() {
        this.game = new GameState();
        this.mcts = null;
        this.currentAnimal = null;
        this.isAIThinking = false;
        this.animationInProgress = false;

        this.initElements();
        this.initEventListeners();
        this.renderAnimalSelection();
    }

    initElements() {
        this.boardEl = document.getElementById('game-board');
        this.statusEl = document.getElementById('game-status');
        this.animalSelectEl = document.getElementById('animal-select');
        this.animalInfoEl = document.getElementById('animal-info');
        this.restartBtn = document.getElementById('restart-btn');
        this.thinkingEl = document.getElementById('thinking-indicator');
    }

    initEventListeners() {
        this.restartBtn.addEventListener('click', () => this.restartGame());

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '7') {
                this.handleColumnClick(parseInt(e.key) - 1);
            }
        });
    }

    renderAnimalSelection() {
        const animals = getAllAnimals();
        this.animalSelectEl.innerHTML = '';

        animals.forEach(animal => {
            const card = document.createElement('div');
            card.className = 'animal-card';
            card.dataset.animal = animal.id;
            card.innerHTML = `
                <span class="animal-emoji">${animal.emoji}</span>
                <span class="animal-name">${animal.name}</span>
                <span class="animal-difficulty">${animal.difficulty}</span>
            `;
            card.addEventListener('click', () => this.selectAnimal(animal.id));
            this.animalSelectEl.appendChild(card);
        });
    }

    selectAnimal(animalId) {
        this.currentAnimal = getAnimal(animalId);
        this.mcts = new MCTS(this.currentAnimal.iterations);

        // Update UI
        document.querySelectorAll('.animal-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.animal === animalId);
        });

        this.animalInfoEl.innerHTML = `
            <span class="selected-emoji">${this.currentAnimal.emoji}</span>
            <span class="selected-name">Gegen ${this.currentAnimal.name} spielen</span>
            <span class="selected-desc">${this.currentAnimal.description}</span>
        `;

        this.restartGame();
    }

    restartGame() {
        if (!this.currentAnimal) {
            this.updateStatus('Wähle zuerst einen Gegner!');
            return;
        }

        this.game.reset();
        this.renderBoard();
        this.updateStatus('Dein Zug! Klicke auf eine Spalte.');
    }

    renderBoard() {
        this.boardEl.innerHTML = '';

        // Create column containers for click handling
        for (let col = 0; col < this.game.COLS; col++) {
            const colEl = document.createElement('div');
            colEl.className = 'board-column';
            colEl.dataset.col = col;

            // Render cells from top to bottom (row 5 to 0)
            for (let row = this.game.ROWS - 1; row >= 0; row--) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.col = col;
                cell.dataset.row = row;

                const chip = document.createElement('div');
                chip.className = 'chip';

                const value = this.game.getCell(col, row);
                if (value === this.game.PLAYER) {
                    chip.classList.add('player');
                } else if (value === this.game.AI) {
                    chip.classList.add('ai');
                }

                cell.appendChild(chip);
                colEl.appendChild(cell);
            }

            colEl.addEventListener('click', () => this.handleColumnClick(col));
            colEl.addEventListener('mouseenter', () => this.highlightColumn(col, true));
            colEl.addEventListener('mouseleave', () => this.highlightColumn(col, false));

            this.boardEl.appendChild(colEl);
        }
    }

    highlightColumn(col, highlight) {
        const colEl = this.boardEl.children[col];
        if (colEl) {
            colEl.classList.toggle('highlight', highlight);
        }
    }

    async handleColumnClick(col) {
        if (!this.currentAnimal || this.game.gameOver || this.isAIThinking || this.animationInProgress) {
            return;
        }

        if (this.game.currentPlayer !== this.game.PLAYER) {
            return;
        }

        if (!this.game.isValidMove(col)) {
            return;
        }

        // Player move
        await this.makeMove(col, 'player');

        // Check game end
        if (this.game.gameOver) {
            this.handleGameEnd();
            return;
        }

        // AI move
        await this.makeAIMove();
    }

    async makeMove(col, type) {
        this.animationInProgress = true;

        // Find target row before making move
        let targetRow = 0;
        while (targetRow < this.game.ROWS && this.game.getCell(col, targetRow) !== this.game.EMPTY) {
            targetRow++;
        }

        // Make the move in game state
        this.game.makeMove(col);

        // Animate the chip drop
        await this.animateChipDrop(col, targetRow, type);

        this.animationInProgress = false;
    }

    async animateChipDrop(col, row, type) {
        const colEl = this.boardEl.children[col];
        const visualRow = this.game.ROWS - 1 - row;
        const cellEl = colEl.children[visualRow];
        const chipEl = cellEl.querySelector('.chip');

        chipEl.classList.add(type === 'player' ? 'player' : 'ai');
        chipEl.classList.add('drop-animation');

        await new Promise(resolve => setTimeout(resolve, 300));

        chipEl.classList.remove('drop-animation');
    }

    async makeAIMove() {
        this.isAIThinking = true;
        this.showThinking(true);
        this.updateStatus(getThinkingMessage(this.currentAnimal.id));

        // Small delay to show thinking message
        await new Promise(resolve => setTimeout(resolve, 500));

        // Run MCTS in chunks to prevent UI freezing
        const bestMove = await this.runMCTSAsync();

        this.showThinking(false);

        if (bestMove !== null && !this.game.gameOver) {
            await this.makeMove(bestMove, 'ai');

            if (this.game.gameOver) {
                this.handleGameEnd();
            } else {
                this.updateStatus('Dein Zug!');
            }
        }

        this.isAIThinking = false;
    }

    async runMCTSAsync() {
        // Use setTimeout to run MCTS without blocking UI
        return new Promise(resolve => {
            setTimeout(() => {
                const move = this.mcts.findBestMove(this.game);
                resolve(move);
            }, 10);
        });
    }

    showThinking(show) {
        this.thinkingEl.classList.toggle('visible', show);
        this.thinkingEl.innerHTML = show ?
            `<span class="thinking-emoji">${this.currentAnimal.emoji}</span> ${this.currentAnimal.name} denkt nach...` : '';
    }

    handleGameEnd() {
        let message = '';
        let statusClass = '';

        if (this.game.winner === this.game.PLAYER) {
            message = `🎉 Du hast gewonnen! ${this.currentAnimal.loseMessage}`;
            statusClass = 'win';
        } else if (this.game.winner === this.game.AI) {
            message = `${this.currentAnimal.emoji} ${this.currentAnimal.winMessage}`;
            statusClass = 'lose';
        } else {
            message = `🤝 Unentschieden! ${this.currentAnimal.drawMessage}`;
            statusClass = 'draw';
        }

        this.statusEl.className = 'game-status ' + statusClass;
        this.updateStatus(message);

        // Highlight winning line if applicable
        if (this.game.winner && this.game.lastMove) {
            this.highlightWinningLine();
        }
    }

    highlightWinningLine() {
        const lastMove = this.game.lastMove;
        if (!lastMove) return;

        const directions = [
            [1, 0], [0, 1], [1, 1], [1, -1]
        ];

        for (const [dx, dy] of directions) {
            const line = this.getWinningLine(lastMove.col, lastMove.row, dx, dy, lastMove.player);
            if (line.length >= 4) {
                line.forEach(pos => {
                    const colEl = this.boardEl.children[pos.col];
                    const visualRow = this.game.ROWS - 1 - pos.row;
                    const cellEl = colEl.children[visualRow];
                    cellEl.classList.add('winning-cell');
                });
                break;
            }
        }
    }

    getWinningLine(col, row, dx, dy, player) {
        const line = [{ col, row }];

        // Positive direction
        let x = col + dx, y = row + dy;
        while (x >= 0 && x < this.game.COLS && y >= 0 && y < this.game.ROWS &&
            this.game.getCell(x, y) === player) {
            line.push({ col: x, row: y });
            x += dx;
            y += dy;
        }

        // Negative direction
        x = col - dx;
        y = row - dy;
        while (x >= 0 && x < this.game.COLS && y >= 0 && y < this.game.ROWS &&
            this.game.getCell(x, y) === player) {
            line.push({ col: x, row: y });
            x -= dx;
            y -= dy;
        }

        return line;
    }

    updateStatus(message) {
        this.statusEl.textContent = message;
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.gameUI = new GameUI();
});

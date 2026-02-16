/**
 * Vier Gewinnt - Game Logic
 * Core game state management and win detection
 */

// Zobrist hash table (initialized once, shared across all GameState instances)
const ZobristTable = {
    _initialized: false,
    table: null,  // [col][row][player] -> random 32-bit int
    init(maxCols, maxRows) {
        if (this._initialized) return;
        this.table = [];
        for (let col = 0; col < maxCols; col++) {
            this.table[col] = [];
            for (let row = 0; row < maxRows; row++) {
                this.table[col][row] = [];
                for (let p = 0; p < 3; p++) { // 0=empty, 1=player1, 2=player2
                    this.table[col][row][p] = (Math.random() * 0xFFFFFFFF) >>> 0;
                }
            }
        }
        this._initialized = true;
    }
};

class GameState {
    constructor(rows = 6, cols = 7) {
        this.ROWS = rows;
        this.COLS = cols;
        this.EMPTY = 0;
        this.PLAYER = 1;
        this.AI = 2;
        ZobristTable.init(cols, rows);
        this.reset();
    }

    reset() {
        // Create empty board (column-major for easy drop)
        this.board = Array(this.COLS).fill(null).map(() => Array(this.ROWS).fill(this.EMPTY));
        this.currentPlayer = this.PLAYER;
        this.gameOver = false;
        this.winner = null;
        this.lastMove = null;
        this.moveCount = 0;
        this.moveHistory = [];
        this.hash = 0;
        // Column heights for fast drop (avoids scanning)
        this.colHeights = new Array(this.COLS).fill(0);
    }

    clone() {
        const copy = new GameState(this.ROWS, this.COLS);
        copy.board = this.board.map(col => [...col]);
        copy.currentPlayer = this.currentPlayer;
        copy.gameOver = this.gameOver;
        copy.winner = this.winner;
        copy.lastMove = this.lastMove ? { ...this.lastMove } : null;
        copy.moveCount = this.moveCount;
        copy.moveHistory = [...this.moveHistory];
        copy.hash = this.hash;
        copy.colHeights = [...this.colHeights];
        return copy;
    }

    getValidMoves() {
        const moves = [];
        for (let col = 0; col < this.COLS; col++) {
            if (this.colHeights[col] < this.ROWS) {
                moves.push(col);
            }
        }
        return moves;
    }

    isValidMove(col) {
        return col >= 0 && col < this.COLS && this.colHeights[col] < this.ROWS;
    }

    makeMove(col) {
        if (this.gameOver || !this.isValidMove(col)) {
            return false;
        }

        const row = this.colHeights[col];
        this.board[col][row] = this.currentPlayer;
        this.colHeights[col]++;
        this.lastMove = { col, row, player: this.currentPlayer };
        this.moveCount++;

        // Update Zobrist hash
        this.hash ^= ZobristTable.table[col][row][this.currentPlayer];

        // Save state for undo
        this.moveHistory.push({ col, row, player: this.currentPlayer, gameOver: false, winner: null });

        // Check for win/draw
        if (this.checkWin(col, row)) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
        } else if (this.checkDraw()) {
            this.gameOver = true;
            this.winner = null; // Draw
        } else {
            // Switch player
            this.currentPlayer = this.currentPlayer === this.PLAYER ? this.AI : this.PLAYER;
        }

        return true;
    }

    undoMove() {
        if (this.moveHistory.length === 0) return false;

        const last = this.moveHistory.pop();

        // Remove piece
        this.board[last.col][last.row] = this.EMPTY;
        this.colHeights[last.col]--;

        // Undo Zobrist hash
        this.hash ^= ZobristTable.table[last.col][last.row][last.player];

        // Restore state
        this.currentPlayer = last.player;
        this.gameOver = false;
        this.winner = null;
        this.moveCount--;

        // Restore lastMove
        if (this.moveHistory.length > 0) {
            const prev = this.moveHistory[this.moveHistory.length - 1];
            this.lastMove = { col: prev.col, row: prev.row, player: prev.player };
        } else {
            this.lastMove = null;
        }

        return true;
    }

    checkWin(col, row) {
        const player = this.board[col][row];
        if (player === this.EMPTY) return false;

        const directions = [
            [1, 0],  // horizontal
            [0, 1],  // vertical
            [1, 1],  // diagonal up-right
            [1, -1]  // diagonal down-right
        ];

        for (const [dx, dy] of directions) {
            let count = 1;

            // Count in positive direction
            let x = col + dx;
            let y = row + dy;
            while (x >= 0 && x < this.COLS && y >= 0 && y < this.ROWS && this.board[x][y] === player) {
                count++;
                x += dx;
                y += dy;
            }

            // Count in negative direction
            x = col - dx;
            y = row - dy;
            while (x >= 0 && x < this.COLS && y >= 0 && y < this.ROWS && this.board[x][y] === player) {
                count++;
                x -= dx;
                y -= dy;
            }

            if (count >= 4) return true;
        }

        return false;
    }

    checkDraw() {
        return this.moveCount >= this.ROWS * this.COLS;
    }

    // Get cell at position (for rendering)
    getCell(col, row) {
        return this.board[col][row];
    }

    // Evaluate board position for AI (simple heuristic)
    evaluate() {
        if (this.winner === this.AI) return 1000;
        if (this.winner === this.PLAYER) return -1000;
        if (this.gameOver) return 0; // Draw

        let score = 0;

        // Center column preference
        const centerCol = Math.floor(this.COLS / 2);
        for (let row = 0; row < this.ROWS; row++) {
            if (this.board[centerCol][row] === this.AI) score += 3;
            if (this.board[centerCol][row] === this.PLAYER) score -= 3;
        }

        return score;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameState };
}

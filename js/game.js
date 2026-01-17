/**
 * Vier Gewinnt - Game Logic
 * Core game state management and win detection
 */

class GameState {
    constructor() {
        this.ROWS = 6;
        this.COLS = 7;
        this.EMPTY = 0;
        this.PLAYER = 1;
        this.AI = 2;
        this.reset();
    }

    reset() {
        // Create empty 7x6 board (column-major for easy drop)
        this.board = Array(this.COLS).fill(null).map(() => Array(this.ROWS).fill(this.EMPTY));
        this.currentPlayer = this.PLAYER;
        this.gameOver = false;
        this.winner = null;
        this.lastMove = null;
        this.moveCount = 0;
    }

    clone() {
        const copy = new GameState();
        copy.board = this.board.map(col => [...col]);
        copy.currentPlayer = this.currentPlayer;
        copy.gameOver = this.gameOver;
        copy.winner = this.winner;
        copy.lastMove = this.lastMove ? { ...this.lastMove } : null;
        copy.moveCount = this.moveCount;
        return copy;
    }

    getValidMoves() {
        const moves = [];
        for (let col = 0; col < this.COLS; col++) {
            if (this.board[col][this.ROWS - 1] === this.EMPTY) {
                moves.push(col);
            }
        }
        return moves;
    }

    isValidMove(col) {
        return col >= 0 && col < this.COLS && this.board[col][this.ROWS - 1] === this.EMPTY;
    }

    makeMove(col) {
        if (this.gameOver || !this.isValidMove(col)) {
            return false;
        }

        // Find lowest empty row in column
        let row = 0;
        while (row < this.ROWS && this.board[col][row] !== this.EMPTY) {
            row++;
        }

        if (row >= this.ROWS) return false;

        this.board[col][row] = this.currentPlayer;
        this.lastMove = { col, row, player: this.currentPlayer };
        this.moveCount++;

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

/**
 * Vier Gewinnt - Alpha-Beta Pruning AI Engine
 * Minimax with Alpha-Beta pruning, Transposition Table, Killer Moves
 */

// Transposition table entry types
const TT_EXACT = 0;
const TT_LOWER = 1; // Alpha cutoff (score >= beta)
const TT_UPPER = 2; // Beta cutoff (score <= alpha)

class AlphaBetaAI {
    constructor(depth = 6) {
        this.depth = depth;
        this.nodesEvaluated = 0;
        this.ttHits = 0;
        this.transpositionTable = new Map();
        // Killer moves: store best cutoff move per depth level
        this.killerMoves = new Array(depth + 1).fill(-1);
    }

    findBestMove(gameState) {
        const state = gameState.clone();
        const validMoves = state.getValidMoves();
        this.nodesEvaluated = 0;
        this.ttHits = 0;

        // Clear TT if it's getting too large (prevent memory issues)
        if (this.transpositionTable.size > 500000) {
            this.transpositionTable.clear();
        }
        this.killerMoves.fill(-1);

        // Immediate win check
        for (const move of validMoves) {
            state.makeMove(move);
            if (state.winner === state.moveHistory[state.moveHistory.length - 1].player) {
                state.undoMove();
                console.log(`[AB] Winning move: Column ${move}`);
                return move;
            }
            state.undoMove();
        }

        // Immediate block check
        const opponent = state.currentPlayer === 1 ? 2 : 1;
        for (const move of validMoves) {
            // Temporarily switch to opponent to test their win
            const savedPlayer = state.currentPlayer;
            state.currentPlayer = opponent;
            state.makeMove(move);
            const won = state.winner === opponent;
            state.undoMove();
            state.currentPlayer = savedPlayer;
            if (won) {
                console.log(`[AB] Blocking move: Column ${move}`);
                return move;
            }
        }

        // Alpha-Beta search
        let bestScore = -Infinity;
        const moveScores = [];

        // Move ordering: prefer center columns for better pruning
        const orderedMoves = this.orderMoves(validMoves, 0);

        for (const move of orderedMoves) {
            state.makeMove(move);
            const score = this.minimax(state, this.depth - 1, -Infinity, Infinity, false, state.moveHistory[state.moveHistory.length - 1].player);
            state.undoMove();

            moveScores.push({ move, score });

            if (score > bestScore) {
                bestScore = score;
            }
        }

        // Small randomness: pick randomly among moves within a small threshold of the best score
        const RANDOMNESS_THRESHOLD = 5;
        const topMoves = moveScores.filter(m => m.score >= bestScore - RANDOMNESS_THRESHOLD);
        const chosen = topMoves[Math.floor(Math.random() * topMoves.length)];

        console.log(`[AB] Depth: ${this.depth}, Nodes: ${this.nodesEvaluated}, TT Hits: ${this.ttHits}, Best: Column ${chosen.move} (score: ${chosen.score}, candidates: ${topMoves.length})`);
        return chosen.move;
    }

    orderMoves(moves, depth) {
        const center = 3;
        const killer = this.killerMoves[depth];
        return [...moves].sort((a, b) => {
            // Killer move gets highest priority
            if (a === killer) return -1;
            if (b === killer) return 1;
            // Then center preference
            return Math.abs(a - center) - Math.abs(b - center);
        });
    }

    minimax(state, depth, alpha, beta, isMaximizing, aiPlayer) {
        this.nodesEvaluated++;

        // Terminal conditions
        if (state.gameOver) {
            if (state.winner === aiPlayer) return 10000 + depth; // Win (prefer faster wins)
            if (state.winner !== null) return -10000 - depth;    // Loss
            return 0; // Draw
        }

        if (depth === 0) {
            return this.evaluate(state, aiPlayer);
        }

        // Transposition table lookup
        const ttKey = state.hash;
        const ttEntry = this.transpositionTable.get(ttKey);
        if (ttEntry && ttEntry.depth >= depth) {
            this.ttHits++;
            if (ttEntry.type === TT_EXACT) return ttEntry.score;
            if (ttEntry.type === TT_LOWER && ttEntry.score >= beta) return ttEntry.score;
            if (ttEntry.type === TT_UPPER && ttEntry.score <= alpha) return ttEntry.score;
        }

        const validMoves = state.getValidMoves();
        const orderedMoves = this.orderMoves(validMoves, depth);
        const origAlpha = alpha;

        if (isMaximizing) {
            let maxScore = -Infinity;
            for (const move of orderedMoves) {
                state.makeMove(move);
                const score = this.minimax(state, depth - 1, alpha, beta, false, aiPlayer);
                state.undoMove();

                if (score > maxScore) {
                    maxScore = score;
                }
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    // Store killer move for this depth
                    this.killerMoves[depth] = move;
                    break;
                }
            }

            // Store in transposition table
            let ttType = TT_EXACT;
            if (maxScore <= origAlpha) ttType = TT_UPPER;
            else if (maxScore >= beta) ttType = TT_LOWER;
            this.transpositionTable.set(ttKey, { score: maxScore, depth, type: ttType });

            return maxScore;
        } else {
            let minScore = Infinity;
            for (const move of orderedMoves) {
                state.makeMove(move);
                const score = this.minimax(state, depth - 1, alpha, beta, true, aiPlayer);
                state.undoMove();

                if (score < minScore) {
                    minScore = score;
                }
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    this.killerMoves[depth] = move;
                    break;
                }
            }

            let ttType = TT_EXACT;
            if (minScore <= origAlpha) ttType = TT_UPPER;
            else if (minScore >= beta) ttType = TT_LOWER;
            this.transpositionTable.set(ttKey, { score: minScore, depth, type: ttType });

            return minScore;
        }
    }

    evaluate(state, aiPlayer) {
        const opponent = aiPlayer === 1 ? 2 : 1;
        let score = 0;

        // Center column preference
        const centerCol = Math.floor(state.COLS / 2);
        for (let row = 0; row < state.ROWS; row++) {
            if (state.board[centerCol][row] === aiPlayer) score += 3;
            if (state.board[centerCol][row] === opponent) score -= 3;
        }

        // Evaluate all possible lines of 4
        score += this.evaluateLines(state, aiPlayer, opponent);

        return score;
    }

    evaluateLines(state, aiPlayer, opponent) {
        let score = 0;

        // Horizontal
        for (let row = 0; row < state.ROWS; row++) {
            for (let col = 0; col < state.COLS - 3; col++) {
                score += this.evaluateWindow(state, col, row, 1, 0, aiPlayer, opponent);
            }
        }

        // Vertical
        for (let col = 0; col < state.COLS; col++) {
            for (let row = 0; row < state.ROWS - 3; row++) {
                score += this.evaluateWindow(state, col, row, 0, 1, aiPlayer, opponent);
            }
        }

        // Diagonal (up-right)
        for (let col = 0; col < state.COLS - 3; col++) {
            for (let row = 0; row < state.ROWS - 3; row++) {
                score += this.evaluateWindow(state, col, row, 1, 1, aiPlayer, opponent);
            }
        }

        // Diagonal (down-right)
        for (let col = 0; col < state.COLS - 3; col++) {
            for (let row = 3; row < state.ROWS; row++) {
                score += this.evaluateWindow(state, col, row, 1, -1, aiPlayer, opponent);
            }
        }

        return score;
    }

    evaluateWindow(state, startCol, startRow, dCol, dRow, aiPlayer, opponent) {
        let aiCount = 0;
        let oppCount = 0;

        for (let i = 0; i < 4; i++) {
            const col = startCol + i * dCol;
            const row = startRow + i * dRow;
            const cell = state.board[col][row];

            if (cell === aiPlayer) aiCount++;
            else if (cell === opponent) oppCount++;
        }

        // Score the window
        if (aiCount === 4) return 1000;
        if (oppCount === 4) return -1000;

        if (oppCount === 0) {
            if (aiCount === 3) return 50;
            if (aiCount === 2) return 10;
        }

        if (aiCount === 0) {
            if (oppCount === 3) return -50;
            if (oppCount === 2) return -10;
        }

        return 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AlphaBetaAI };
}

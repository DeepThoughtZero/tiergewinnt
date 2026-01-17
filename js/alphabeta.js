/**
 * Vier Gewinnt - Alpha-Beta Pruning AI Engine
 * Minimax with Alpha-Beta pruning for optimal play
 */

class AlphaBetaAI {
    constructor(depth = 6) {
        this.depth = depth;
        this.nodesEvaluated = 0;
    }

    findBestMove(gameState) {
        const state = gameState.clone();
        const validMoves = state.getValidMoves();
        this.nodesEvaluated = 0;

        // Immediate win check
        for (const move of validMoves) {
            const testState = state.clone();
            testState.makeMove(move);
            if (testState.winner === state.currentPlayer) {
                console.log(`[AB] Winning move: Column ${move}`);
                return move;
            }
        }

        // Immediate block check
        const opponent = state.currentPlayer === 1 ? 2 : 1;
        for (const move of validMoves) {
            const testState = state.clone();
            testState.currentPlayer = opponent;
            testState.makeMove(move);
            if (testState.winner === opponent) {
                console.log(`[AB] Blocking move: Column ${move}`);
                return move;
            }
        }

        // Alpha-Beta search
        let bestMove = validMoves[0];
        let bestScore = -Infinity;
        const isMaximizing = true;

        // Move ordering: prefer center columns for better pruning
        const orderedMoves = this.orderMoves(validMoves);

        for (const move of orderedMoves) {
            const newState = state.clone();
            newState.makeMove(move);

            const score = this.minimax(newState, this.depth - 1, -Infinity, Infinity, !isMaximizing, state.currentPlayer);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        console.log(`[AB] Depth: ${this.depth}, Nodes: ${this.nodesEvaluated}, Best: Column ${bestMove} (score: ${bestScore})`);
        return bestMove;
    }

    orderMoves(moves) {
        // Center columns first for better pruning
        const center = 3;
        return [...moves].sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
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

        const validMoves = state.getValidMoves();
        const orderedMoves = this.orderMoves(validMoves);

        if (isMaximizing) {
            let maxScore = -Infinity;
            for (const move of orderedMoves) {
                const newState = state.clone();
                newState.makeMove(move);
                const score = this.minimax(newState, depth - 1, alpha, beta, false, aiPlayer);
                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break; // Pruning
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for (const move of orderedMoves) {
                const newState = state.clone();
                newState.makeMove(move);
                const score = this.minimax(newState, depth - 1, alpha, beta, true, aiPlayer);
                minScore = Math.min(minScore, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) break; // Pruning
            }
            return minScore;
        }
    }

    evaluate(state, aiPlayer) {
        const opponent = aiPlayer === 1 ? 2 : 1;
        let score = 0;

        // Center column preference
        const centerCol = 3;
        for (let row = 0; row < 6; row++) {
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
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 4; col++) {
                score += this.evaluateWindow(state, col, row, 1, 0, aiPlayer, opponent);
            }
        }

        // Vertical
        for (let col = 0; col < 7; col++) {
            for (let row = 0; row < 3; row++) {
                score += this.evaluateWindow(state, col, row, 0, 1, aiPlayer, opponent);
            }
        }

        // Diagonal (up-right)
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 3; row++) {
                score += this.evaluateWindow(state, col, row, 1, 1, aiPlayer, opponent);
            }
        }

        // Diagonal (down-right)
        for (let col = 0; col < 4; col++) {
            for (let row = 3; row < 6; row++) {
                score += this.evaluateWindow(state, col, row, 1, -1, aiPlayer, opponent);
            }
        }

        return score;
    }

    evaluateWindow(state, startCol, startRow, dCol, dRow, aiPlayer, opponent) {
        let aiCount = 0;
        let oppCount = 0;
        let emptyCount = 0;

        for (let i = 0; i < 4; i++) {
            const col = startCol + i * dCol;
            const row = startRow + i * dRow;
            const cell = state.board[col][row];

            if (cell === aiPlayer) aiCount++;
            else if (cell === opponent) oppCount++;
            else emptyCount++;
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

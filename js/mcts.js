/**
 * Vier Gewinnt - MCTS AI Engine
 * Monte Carlo Tree Search with configurable iterations
 */

class MCTSNode {
    constructor(state, parent = null, move = null) {
        this.state = state;
        this.parent = parent;
        this.move = move; // The move that led to this state
        this.children = [];
        this.wins = 0;
        this.visits = 0;
        this.untriedMoves = state.getValidMoves();
    }

    // UCB1 formula for node selection
    ucb1(explorationParam = 1.414) {
        if (this.visits === 0) return Infinity;
        return (this.wins / this.visits) + explorationParam * Math.sqrt(Math.log(this.parent.visits) / this.visits);
    }

    isFullyExpanded() {
        return this.untriedMoves.length === 0;
    }

    isTerminal() {
        return this.state.gameOver;
    }

    bestChild(explorationParam = 1.414) {
        return this.children.reduce((best, child) =>
            child.ucb1(explorationParam) > best.ucb1(explorationParam) ? child : best
        );
    }
}

class MCTS {
    constructor(iterations = 1000) {
        this.iterations = iterations;
    }

    findBestMove(gameState) {
        const rootState = gameState.clone();
        const root = new MCTSNode(rootState);

        for (let i = 0; i < this.iterations; i++) {
            let node = this.select(root);

            if (!node.isTerminal() && node.visits > 0) {
                node = this.expand(node);
            }

            const result = this.simulate(node.state.clone());
            this.backpropagate(node, result, rootState.currentPlayer);
        }

        // Choose move with most visits (most robust)
        if (root.children.length === 0) {
            const moves = rootState.getValidMoves();
            return moves[Math.floor(Math.random() * moves.length)];
        }

        const bestChild = root.children.reduce((best, child) =>
            child.visits > best.visits ? child : best
        );

        return bestChild.move;
    }

    select(node) {
        while (!node.isTerminal()) {
            if (!node.isFullyExpanded()) {
                return node;
            }
            node = node.bestChild();
        }
        return node;
    }

    expand(node) {
        const moveIndex = Math.floor(Math.random() * node.untriedMoves.length);
        const move = node.untriedMoves.splice(moveIndex, 1)[0];

        const newState = node.state.clone();
        newState.makeMove(move);

        const childNode = new MCTSNode(newState, node, move);
        node.children.push(childNode);

        return childNode;
    }

    simulate(state) {
        while (!state.gameOver) {
            const moves = state.getValidMoves();
            if (moves.length === 0) break;

            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            state.makeMove(randomMove);
        }

        return state.winner;
    }

    backpropagate(node, winner, aiPlayer) {
        while (node !== null) {
            node.visits++;

            if (winner === aiPlayer) {
                node.wins += 1;
            } else if (winner !== null) {
                node.wins -= 1; // Loss
            }
            // Draw = 0.5 could be added for more nuanced play

            node = node.parent;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MCTS, MCTSNode };
}

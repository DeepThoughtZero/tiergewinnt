/**
 * Vier Gewinnt - Leaderboard Logic
 * Handles communication with Google Apps Script backend and leaderboard UI
 */

const LEADERBOARD_CONFIG = {
    // URL for the Google Apps Script Web App
    url: 'https://script.google.com/macros/s/AKfycbyi96eLk8BQOlwoGsj79T2HUtKKOqAwZ-tIFopfq-JZE7DiYbDB8TB6QZ3pZJrV3Md9/exec',
    sheet: 'TierGewinnt_Leaderboard'
};

/**
 * Load leaderboard entries from the backend
 * @returns {Promise<Array>} List of leaderboard entries
 */
async function loadLeaderboard() {
    try {
        const url = `${LEADERBOARD_CONFIG.url}?sheet=${LEADERBOARD_CONFIG.sheet}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.entries || [];
    } catch (error) {
        console.error("Fehler beim Laden der Bestenliste:", error);
        return [];
    }
}

/**
 * Save a new highscore to the backend
 * @param {string} name - Player name
 * @param {number} score - Calculated score
 * @param {number} moves - Number of moves taken
 * @param {string} difficulty - Difficulty level (e.g., "Mittel")
 * @returns {Promise<boolean>} Success status
 */
async function saveHighscore(name, score, moves, difficulty) {
    const params = new URLSearchParams({
        action: 'add',
        sheet: LEADERBOARD_CONFIG.sheet,
        name: name,
        score: score,
        moves: moves,
        difficulty: difficulty
    });

    try {
        // Using GET as requested for simpler Apps Script handling
        await fetch(`${LEADERBOARD_CONFIG.url}?${params}`, {
            method: 'GET',
            mode: 'cors'
        });
        return true;
    } catch (error) {
        console.error("Fehler beim Speichern:", error);
        return false;
    }
}

/**
 * Render the score visualization badges
 * @param {string} difficulty 
 * @param {number} moves 
 * @param {number} finalScore 
 */
function showScoreVisualization(difficulty, moves, finalScore, details = '') {
    const calcDiv = document.getElementById('score-calculation');
    if (!calcDiv) return;

    calcDiv.innerHTML = `
        <div style="display:flex; gap:12px; align-items:center; width:100%; flex-wrap:wrap;">
            <span class="score-part base">
                <span>🎯</span> Gegner: ${difficulty}
            </span>
            
            <span class="score-part penalty">
                <span>🐾</span> Züge: ${moves}
            </span>
            
            <span class="score-part result">
                <span>🏆</span> Score: ${finalScore}
            </span>
        </div>
        ${details ? `<div style="width:100%; font-size:0.85em; color:#64748b; margin-top:8px; padding-left:4px;">ℹ️ ${details}</div>` : ''}
    `;

    calcDiv.style.display = 'flex';
    calcDiv.style.flexWrap = 'wrap';
}

/**
 * Security helper to prevent XSS
 * @param {string} text 
 * @returns {string} Escaped HTML
 */
function escapeHtml(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Render the leaderboard table
 * @param {Array} entries - Leaderboard entries
 */
function renderLeaderboard(entries) {
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;

    // Limit to top 10 for display cleanliness
    const topEntries = entries.slice(0, 10);

    tbody.innerHTML = topEntries.map((entry, index) => {
        const rank = index + 1;
        let rankClass = '';
        if (rank === 1) rankClass = 'rank-1';
        else if (rank === 2) rankClass = 'rank-2';
        else if (rank === 3) rankClass = 'rank-3';

        // Format date if available (assuming ISO or similar string)
        let dateStr = entry.date || '';
        try {
            if (dateStr) {
                const d = new Date(dateStr);
                dateStr = d.toLocaleDateString('de-DE');
            }
        } catch (e) { /* ignore date parsing errors */ }

        // Sanitize sensitive fields
        const safeName = escapeHtml(entry.name || 'Anonym');
        const safeDiff = escapeHtml(entry.difficulty || '-');
        const safeScore = escapeHtml(entry.score);
        const safeMoves = escapeHtml(entry.moves || '-');
        const safeDate = escapeHtml(dateStr);

        return `
            <tr>
                <td class="${rankClass}">#${rank}</td>
                <td style="font-weight: 500">${safeName}</td>
                <td>${safeDiff}</td>
                <td style="font-weight: bold">${safeScore}</td>
                <td style="color: #6b7280">${safeMoves}</td>
                <td style="font-size: 0.85em; color: #9ca3af">${safeDate}</td>
            </tr>
        `;
    }).join('');
}

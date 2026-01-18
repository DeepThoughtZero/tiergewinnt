/**
 * Vier Gewinnt - Leaderboard Logic
 * Handles communication with Google Apps Script backend and leaderboard UI
 */

const LEADERBOARD_CONFIG = {
    // URL for the Google Apps Script Web App
    url: 'https://script.google.com/macros/s/AKfycbyi96eLk8BQOlwoGsj79T2HUtKKOqAwZ-tIFopfq-JZE7DiYbDB8TB6QZ3pZJrV3Md9/exec',
    sheet: 'TierGewinnt_Leaderboard'
};

// Cache for all leaderboard entries (for filtering)
let allLeaderboardEntries = [];

// Initialize filter listeners on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const opponentFilter = document.getElementById('opponent-filter');
    const modeFilter = document.getElementById('mode-filter');

    const applyFilters = () => {
        const opponentValue = opponentFilter ? opponentFilter.value : '';
        const modeValue = modeFilter ? modeFilter.value : '';
        filterAndRenderLeaderboard(opponentValue, modeValue);
    };

    if (opponentFilter) opponentFilter.addEventListener('change', applyFilters);
    if (modeFilter) modeFilter.addEventListener('change', applyFilters);
});

/**
 * Filter and re-render leaderboard based on selected filters
 * @param {string} filterEmoji - Emoji to filter by, or empty string for all
 * @param {string} filterMode - 'normal', 'profi', or empty for all
 */
function filterAndRenderLeaderboard(filterEmoji, filterMode) {
    let filtered = allLeaderboardEntries;

    // Filter by opponent
    if (filterEmoji) {
        filtered = filtered.filter(entry => {
            const difficultyRaw = entry.difficulty || '';
            const animalName = difficultyRaw.replace(' Profi', '').trim();
            const entryEmoji = getAnimalEmoji(animalName);
            return entryEmoji === filterEmoji;
        });
    }

    // Filter by mode
    if (filterMode === 'profi') {
        filtered = filtered.filter(entry => (entry.difficulty || '').includes('Profi'));
    } else if (filterMode === 'normal') {
        filtered = filtered.filter(entry => !(entry.difficulty || '').includes('Profi'));
    }

    renderLeaderboard(filtered);
}

/**
 * Load leaderboard entries from the backend
 * @returns {Promise<Array>} List of leaderboard entries
 */
async function loadLeaderboard() {
    try {
        const url = `${LEADERBOARD_CONFIG.url}?sheet=${LEADERBOARD_CONFIG.sheet}`;
        const response = await fetch(url);
        const data = await response.json();
        const entries = data.entries || [];

        // Store in cache for filtering
        allLeaderboardEntries = entries;

        // Reset filters to "All" when loading fresh data
        const opponentFilter = document.getElementById('opponent-filter');
        const modeFilter = document.getElementById('mode-filter');
        if (opponentFilter) opponentFilter.value = '';
        if (modeFilter) modeFilter.value = '';

        return entries;
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
 * Helper to get animal emoji by name
 * @param {string} name 
 */
function getAnimalEmoji(name) {
    // Assuming ANIMALS object is available globally from animals.js
    if (typeof ANIMALS !== 'undefined') {
        const animal = Object.values(ANIMALS).find(a => a.name === name);
        if (animal) return animal.emoji;
    }
    // Fallback mapping if ANIMALS is not available or name not found
    const map = {
        'Schnecke': '🐌', 'Schildkröte': '🐢', 'Hase': '🐰',
        'Katze': '🐱', 'Fuchs': '🦊', 'Wolf': '🐺',
        'Eule': '🦉', 'Drache': '🐉'
    };
    return map[name] || name;
}

/**
 * Render the leaderboard table
 * @param {Array} entries - Leaderboard entries
 */
function renderLeaderboard(entries) {
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;

    // Show up to 100 entries (scrolling handled by CSS)
    const topEntries = entries.slice(0, 100);

    tbody.innerHTML = topEntries.map((entry, index) => {
        const rank = index + 1;

        let rankDisplay = rank;
        let rankClass = '';

        if (rank === 1) {
            rankDisplay = `🥇 ${rank}`;
            rankClass = 'rank-1';
        } else if (rank === 2) {
            rankDisplay = `🥈 ${rank}`;
            rankClass = 'rank-2';
        } else if (rank === 3) {
            rankDisplay = `🥉 ${rank}`;
            rankClass = 'rank-3';
        }

        // Format date if available (assuming ISO or similar string)
        let dateStr = entry.date || '';
        try {
            if (dateStr) {
                const d = new Date(dateStr);
                dateStr = d.toLocaleDateString('de-DE', {
                    day: 'numeric', month: 'numeric', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });
            }
        } catch (e) { /* ignore date parsing errors */ }

        // Sanitize sensitive fields
        const safeName = escapeHtml(entry.name || 'Anonym');

        // 'difficulty' contains the animal name (e.g. "Fuchs" or "Fuchs Profi")
        // Check if it's a Profi entry
        const difficultyRaw = entry.difficulty || '-';
        const isProfi = difficultyRaw.includes('Profi');
        const animalName = difficultyRaw.replace(' Profi', '').trim();
        const animalIcon = getAnimalEmoji(animalName);

        // Build opponent display: animal icon + flame if Profi
        let opponentDisplay = animalIcon;
        if (isProfi) {
            opponentDisplay = `${animalIcon}<span class="profi-flame" title="Profi-Modus">🔥</span>`;
        }

        // We still sanitize the name if it fell back to text, just in case
        const safeOpponentTitle = escapeHtml(animalName) + (isProfi ? ' (Profi)' : '');

        const safeScore = escapeHtml(entry.score);
        const safeMoves = escapeHtml(entry.moves || '-');
        const safeDate = escapeHtml(dateStr);

        return `
            <tr>
                <td class="${rankClass}" style="font-size: 1.1em;">${rankDisplay}</td>
                <td style="font-weight: 500">${safeName}</td>
                <td title="${safeOpponentTitle}" style="font-size: 1.5em;">${opponentDisplay}</td>
                <td style="font-weight: bold">${safeScore}</td>
                <td style="color: #6b7280">${safeMoves}</td>
                <td style="font-size: 0.85em; color: #9ca3af">${safeDate}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Vier Gewinnt - Animal Opponents
 * Different animals with varying MCTS difficulty levels
 */

const ANIMALS = {
    snail: {
        id: 'snail',
        name: 'Schnecke',
        emoji: '🐌',
        iterations: 50,
        difficulty: 'Sehr Leicht',
        color: '#8B4513',
        description: 'Gemütlich und oft unaufmerksam',
        thinkingMessages: [
            'Hmm... lass mich nachdenken...',
            '*kriecht langsam zum Spielfeld*',
            'Keine Eile...'
        ],
        winMessage: 'Oh! Ich hab gewonnen? Wie schön!',
        loseMessage: 'Das war trotzdem gemütlich!',
        drawMessage: 'Unentschieden ist auch nett!'
    },
    rabbit: {
        id: 'rabbit',
        name: 'Hase',
        emoji: '🐰',
        iterations: 200,
        difficulty: 'Leicht',
        color: '#DEB887',
        description: 'Schnell aber manchmal voreilig',
        thinkingMessages: [
            '*hoppelt aufgeregt*',
            'Moment, Moment!',
            'Ähm... da vielleicht?'
        ],
        winMessage: 'Hoppla! Ich hab gewonnen!',
        loseMessage: 'Nächstes Mal hüpf ich besser!',
        drawMessage: 'Hui, das war knapp!'
    },
    fox: {
        id: 'fox',
        name: 'Fuchs',
        emoji: '🦊',
        iterations: 800,
        difficulty: 'Mittel',
        color: '#D2691E',
        description: 'Schlau und taktisch',
        thinkingMessages: [
            '*überlegt listig*',
            'Interessant...',
            'Ich sehe was du vor hast!'
        ],
        winMessage: 'Der Klügere gewinnt! 🦊',
        loseMessage: 'Du bist schlauer als du aussiehst!',
        drawMessage: 'Ein würdiges Unentschieden!'
    },
    owl: {
        id: 'owl',
        name: 'Eule',
        emoji: '🦉',
        iterations: 2000,
        difficulty: 'Schwer',
        color: '#4A4A4A',
        description: 'Weise und vorausschauend',
        thinkingMessages: [
            '*blinzelt weise*',
            'Ich analysiere...',
            'Schuhu... interessante Lage!'
        ],
        winMessage: 'Weisheit siegt! Schuhu!',
        loseMessage: 'Du überraschst mich, Mensch!',
        drawMessage: 'Gleichwertige Gegner!'
    },
    dragon: {
        id: 'dragon',
        name: 'Drache',
        emoji: '🐉',
        iterations: 5000,
        difficulty: 'Experte',
        color: '#8B0000',
        description: 'Mächtig und nahezu unbesiegbar',
        thinkingMessages: [
            '*schnaubt Rauch*',
            'Du wagst es, mich herauszufordern?',
            '*berechnet alle Möglichkeiten*'
        ],
        winMessage: 'Niemand besiegt einen Drachen!',
        loseMessage: '...das war nur Aufwärmen!',
        drawMessage: 'Du bist würdig, Mensch!'
    }
};

// Get animal by ID
function getAnimal(id) {
    return ANIMALS[id] || ANIMALS.fox;
}

// Get all animals as array
function getAllAnimals() {
    return Object.values(ANIMALS);
}

// Get random thinking message for animal
function getThinkingMessage(animalId) {
    const animal = getAnimal(animalId);
    const messages = animal.thinkingMessages;
    return messages[Math.floor(Math.random() * messages.length)];
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ANIMALS, getAnimal, getAllAnimals, getThinkingMessage };
}

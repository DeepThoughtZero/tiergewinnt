/**
 * Vier Gewinnt - Animal Opponents
 * Different animals with varying MCTS difficulty levels
 */

const ANIMALS = {
    snail: {
        id: 'snail',
        name: 'Schnecke',
        emoji: '🐌',
        algorithm: 'mcts',
        iterations: 50,
        difficulty: 'Gemütlich',
        color: '#8B4513',
        description: 'Gemütlich und oft unaufmerksam',
        thinkingMessages: [
            'Hmm... lass mich nachdenken...',
            'Kriecht langsam zum Spielfeld...',
            'Keine Eile...',
            'Schleimi macht sich Gedanken...',
            'Mein Haus ist schwer, mein Hirn auch...',
            'Gleich... nur noch 5 Minuten...',
            'Ich komme, ich komme!',
            'Schleim-Power aktiviert!',
            'Meine Fühler zittern vor Anstrengung...',
            'Ein Schritt nach dem anderen...',
            'Wer braucht schon Geschwindigkeit?',
            'Ich hinterlasse eine Schleimspur der Weisheit...',
            'Langsam kriechend zur Entscheidung...',
            'Mein Häuschen knarzt beim Denken...',
            'Geduld ist meine Superkraft!',
            'Schneckentempo ist auch ein Tempo!',
            'Zzzzz... oh, bin ich dran?',
            'Schleimige Grüße aus der Denkpause!',
            'Moment, muss erst ankommen...',
            'Der Weg ist das Ziel... und der Zug auch!'
        ],
        winMessage: 'Oh! Ich hab gewonnen? Wie schön!',
        loseMessage: 'Das war trotzdem gemütlich!',
        drawMessage: 'Unentschieden ist auch nett!'
    },
    turtle: {
        id: 'turtle',
        name: 'Schildkröte',
        emoji: '🐢',
        algorithm: 'mcts',
        iterations: 100,
        difficulty: 'Bedächtig',
        color: '#2E8B57',
        description: 'Langsam aber bedacht',
        thinkingMessages: [
            'Zieht Kopf ein zum Nachdenken...',
            'Eins nach dem anderen...',
            'Gut Ding will Weile haben!',
            'In 200 Jahren werde ich darüber lachen...',
            'Mein Panzer schützt auch meine Gedanken!',
            'Langsam ist das neue schnell!',
            'Schildi denkt in Ruhe nach...',
            'Ich trage mein Haus, nicht meine Entscheidungen...',
            'Schildkröten-Weisheit wird geladen...',
            'Meine Vorfahren haben Dinosaurier überlebt!',
            'Panzer hoch, Konzentration!',
            'Zeit ist relativ... besonders für mich!',
            'Ein Schritt näher zum Sieg...',
            'Ich denke in Äonen, nicht in Sekunden!',
            'Ruhe bewahren, Schildi!',
            'Mein Panzer glänzt vor Stolz...',
            'Streckt vorsichtig den Kopf raus...',
            'Beständigkeit schlägt Hektik!',
            'Ich hab das Spiel erfunden... vor 150 Jahren!',
            'Schildkröten-Logik: Wer wartet, gewinnt!'
        ],
        winMessage: 'Langsam aber sicher zum Sieg!',
        loseMessage: 'Du warst schneller... diesmal!',
        drawMessage: 'Geduld führt zu Ausgeglichenheit!'
    },
    rabbit: {
        id: 'rabbit',
        name: 'Hase',
        emoji: '🐰',
        algorithm: 'mcts',
        iterations: 200,
        difficulty: 'Voreilig',
        color: '#DEB887',
        description: 'Schnell aber manchmal voreilig',
        thinkingMessages: [
            'Hoppelt aufgeregt...',
            'Moment, Moment!',
            'Ähm... da vielleicht?',
            'Möhre? Nein, Spielzug!',
            'Hoppel-di-hopp... ähm...',
            'Meine Ohren zittern vor Aufregung!',
            'Karotte links oder rechts?',
            'Springt nervös hin und her...',
            'Huiiii, so viele Möglichkeiten!',
            'Meine Nase zuckt... gutes Zeichen!',
            'Hüpf, hüpf, denk, denk!',
            'Wo ist meine Möhre? Ach ja, Spielzug!',
            'Flauschige Gedanken werden gesammelt...',
            'Meine Hinterbeine jucken vor Ungeduld!',
            'Ein Hase denkt schnell... manchmal zu schnell!',
            'Löffel gespitzt, Gehirn an!',
            'Hopp oder top?',
            'Kaninchen-Kalkulation läuft...',
            'Fluffiger Fokus aktiviert!',
            'Mümmel, mümmel... ENTSCHEIDUNG!'
        ],
        winMessage: 'Hoppla! Ich hab gewonnen!',
        loseMessage: 'Nächstes Mal hüpf ich besser!',
        drawMessage: 'Hui, das war knapp!'
    },
    cat: {
        id: 'cat',
        name: 'Katze',
        emoji: '🐱',
        algorithm: 'mcts',
        iterations: 500,
        difficulty: 'Verspielt',
        color: '#FF8C00',
        description: 'Verspielt aber aufmerksam',
        thinkingMessages: [
            'Schnurrt nachdenklich...',
            'Miau... interessant!',
            'Beobachtet das Spielfeld...',
            'Kratzt sich am Ohr...',
            'Stupst den Spielstein an...',
            'Gähnt erstmal ausgiebig...',
            'Leckt die Pfote und denkt nach...',
            'Ein rotes Lichtpunkt! Oh, Spielzug!',
            'Rollt sich zusammen zum Denken...',
            'Miez miez... strategisches Schnurren!',
            'Schaut gelangweilt, denkt aber hart!',
            'Meine Schnurrhaare vibrieren...',
            'Kätzchen-Konzentration!',
            'Wo ist mein Laserpointer? Ach, Spiel...',
            'Streckt und gähnt... dann Genie-Zug!',
            'Pfotenpower wird aktiviert...',
            'Schnurr-Strategem lädt...',
            'Ignoriert dich demonstrativ beim Denken...',
            'Miau-sterplan wird geschmiedet!',
            'Katzen gewinnen immer... irgendwie!'
        ],
        winMessage: 'Schnurr... das war zu einfach!',
        loseMessage: 'Gähn... Du hattest Glück!',
        drawMessage: 'Miau... noch eine Runde?'
    },
    fox: {
        id: 'fox',
        name: 'Fuchs',
        emoji: '🦊',
        algorithm: 'alphabeta',
        depth: 4,
        difficulty: 'Schlau',
        color: '#D2691E',
        description: 'Schlau und berechnet Züge voraus',
        thinkingMessages: [
            'Überlegt listig...',
            'Interessant...',
            'Ich sehe was du vor hast!',
            'Reineke hat einen Plan...',
            'Mein buschiger Schwanz wedelt vor Freude!',
            'Ein kluger Fuchs prüft zweimal...',
            'Das riecht nach einer Falle... für dich!',
            'Fuchsig, fuchsig...',
            'Meine Schnauze wittert den Sieg!',
            'Listig, listig, kleiner Mensch...',
            'Der schlaue Fuchs denkt drei Züge voraus!',
            'Fuchsbau-Taktik wird angewandt...',
            'Mein Fell sträubt sich vor Aufregung!',
            'Ein Fuchs hat immer einen Plan B!',
            'Rotpelz-Raffinesse!',
            'Die Bauern unterschätzen mich...',
            'Schnüffel, schnüffel... Siegesduft!',
            'Fuchs du hast den Zug gestohlen!',
            'Eleganter Gedankensprung...',
            'Niemand überlistet den Fuchs!'
        ],
        winMessage: 'Der Klügere gewinnt! 🦊',
        loseMessage: 'Du bist schlauer als du aussiehst!',
        drawMessage: 'Ein würdiges Unentschieden!'
    },
    wolf: {
        id: 'wolf',
        name: 'Wolf',
        emoji: '🐺',
        algorithm: 'alphabeta',
        depth: 6,
        difficulty: 'Gerissen',
        color: '#4B4B4B',
        description: 'Berechnet viele Züge im Voraus',
        thinkingMessages: [
            'Heult leise beim Denken...',
            'Das Rudel rät mir...',
            'Fixiert das Spielfeld...',
            'Auuuu... ich hab eine Idee!',
            'Der Wolf jagt... Siege!',
            'Meine Instinkte sagen mir...',
            'Das Mondlicht inspiriert mich...',
            'Die Beute... äh, der Spielzug!',
            'Meine gelben Augen sehen alles!',
            'Ein Wolf wartet auf den perfekten Moment...',
            'Rudelstrategie wird berechnet...',
            'Knurrt leise vor Konzentration...',
            'Der Alpha denkt für alle!',
            'Wolfsinstinkt sagt: DA!',
            'Meine Pranken zucken ungeduldig...',
            'Im Rudel ist man stark... auch allein!',
            'Heult den Mond an für Inspiration...',
            'Die Wildnis lehrt Geduld...',
            'Grrrr... strategisches Knurren!',
            'Ein Wolf vergisst nie eine Niederlage!'
        ],
        winMessage: 'Das Rudel ist stark! Auuuu!',
        loseMessage: 'Du bist ein würdiger Jäger!',
        drawMessage: 'Wir respektieren uns gegenseitig!'
    },
    owl: {
        id: 'owl',
        name: 'Eule',
        emoji: '🦉',
        algorithm: 'alphabeta',
        depth: 8,
        difficulty: 'Weise',
        color: '#4A4A4A',
        description: 'Analysiert tief und präzise',
        thinkingMessages: [
            'Blinzelt weise...',
            'Ich analysiere alle Möglichkeiten...',
            'Schuhu... interessante Lage!',
            'Die Weisheit der Nacht spricht zu mir...',
            'Mein Kopf kann sich 360° drehen!',
            'Wer? Wer wird gewinnen? Ich!',
            'Schuhuuu... ich sehe alles!',
            'Nachtschicht im Denk-Labor...',
            'Eulen-Intelligenz ist unübertroffen!',
            'Meine Augen durchbohren das Spielfeld...',
            'Flauschige Federn, messerscharfer Verstand!',
            'Die Dunkelheit birgt keine Geheimnisse...',
            'Uhu-ltimative Analyse läuft!',
            'Ein weiser Vogel eilt nicht...',
            'Mäuse... ähm, Züge werden gejagt!',
            'Stille macht klug!',
            'Dreht den Kopf nachdenklich...',
            'Die Nacht gehört mir!',
            'Eulen-Blick: aktiviert!',
            'Wer schuhu-ld am Sieg ist? ICH!'
        ],
        winMessage: 'Weisheit siegt! Schuhu!',
        loseMessage: 'Du überraschst mich, Mensch!',
        drawMessage: 'Gleichwertige Gegner!'
    },
    dragon: {
        id: 'dragon',
        name: 'Drache',
        emoji: '🐉',
        algorithm: 'alphabeta',
        depth: 10,
        difficulty: 'Unbesiegbar',
        color: '#8B0000',
        description: 'Berechnet bis zum Spielende',
        thinkingMessages: [
            'Schnaubt Rauch...',
            'Du wagst es, mich herauszufordern?',
            'Berechnet alle Möglichkeiten...',
            'Meine Schuppen glühen vor Konzentration!',
            'Ich habe Ritter zum Frühstück gegessen...',
            'Ein Drache vergisst nie... einen Zug!',
            'Feuer und Flamme für diesen Zug!',
            'Tausend Jahre Erfahrung arbeiten...',
            'GRRRR... gleich wird es heiß!',
            'Mein Hort an Wissen ist unendlich!',
            'Flammen-Fokus aktiviert!',
            'Du bist mutig... oder dumm!',
            'Drachenfeuer schmiedet Siege!',
            'Meine Flügel zucken vor Ungeduld...',
            'Ich bin älter als deine Zivilisation!',
            'Schatz? Nein, SIEG sammle ich!',
            'Ein Drache plant in Jahrhunderten...',
            'Meine Klauen kratzen am Spielbrett...',
            'ROOOAR der Strategie!',
            'Legenden sagen, ich verliere nie!'
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

// Create AI instance for animal
function createAI(animalId) {
    const animal = getAnimal(animalId);
    if (animal.algorithm === 'alphabeta') {
        return new AlphaBetaAI(animal.depth);
    } else {
        return new MCTS(animal.iterations);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ANIMALS, getAnimal, getAllAnimals, getThinkingMessage, createAI };
}

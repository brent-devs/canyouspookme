export class Phobia {
    constructor(name, description, sounds, difficulty, fearThreshold = 40, fearIncrement = 33.4) {
        this.name = name;
        this.description = description;
        this.sounds = sounds;
        this.difficulty = difficulty;
        this.fearThreshold = fearThreshold;
        this.fearIncrement = fearIncrement;
    }
}

export const PHOBIAS = {
    AQUAPHOBIA: new Phobia(
        'Aquaphobia',
        'Fear of water',
        ['waterdrip1', 'waterdrip2', 'waves', 'rain'],
        'easy',
        25,
        33.4,
    ),
    AICHMOPHOBIA: new Phobia(
        'Aichmophobia',
        'Fear of sharp objects',
        ['knife', 'axe'],
        'medium',
        25,
        50
    ),
    ANTHROPOPHOBIA: new Phobia(
        'Anthropophobia',
        'Fear of people',
        ['whispers', 'footsteps', 'laugh', 'hospital'],
        'medium',
        25,
        33.4
    ),
    ORNITHOPHOBIA: new Phobia(
        'Ornithophobia',
        'Fear of birds',
        ['birds', 'crow'],
        'medium',
        40,
        50,
    ),
    BIOPHOBIA: new Phobia(
        'Biophobia',
        'Fear of nature',
        ['mountain', 'haunted_wind'],
        'medium',
        25,
        33.4
    ),
    PHOTOPHOBIA: new Phobia(
        'Photophobia',
        'Fear of light',
        ['campfire', 'lightning'],
        'easy',
        25,
        50
    )
};

export function getPhobiaByName(name) {
    return Object.values(PHOBIAS).find(phobia => phobia.name === name);
}

export function getAllPhobias() {
    return Object.values(PHOBIAS);
}

export function getPhobiasByDifficulty(difficulty) {
    return Object.values(PHOBIAS).filter(phobia => phobia.difficulty === difficulty);
}

export function getRandomPhobiaByDifficulty(difficulty) {
    const phobias = getPhobiasByDifficulty(difficulty);
    if (phobias.length === 0) return null;
    return phobias[Math.floor(Math.random() * phobias.length)];
}

export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

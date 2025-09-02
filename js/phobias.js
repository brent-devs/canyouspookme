export class Phobia {
    constructor(id, name, description, sounds, difficulty, fearThreshold = 40, fearIncrement = 33.4, ghostName) {
        this.id = id,
        this.name = name;
        this.description = description;
        this.sounds = sounds;
        this.difficulty = difficulty;
        this.fearThreshold = fearThreshold;
        this.fearIncrement = fearIncrement;
        this.ghostName = ghostName;
    }
}

export const PHOBIAS = {
    AQUAPHOBIA: new Phobia(
        0,
        'Aquaphobia',
        'Fear of water',    
        ['waterdrip1', 'waterdrip2', 'waves', 'rain'],
        'easy',
        25,
        33.4,
        'Aqua'
    ),
    AICHMOPHOBIA: new Phobia(
        1,
        'Aichmophobia', 
        'Fear of sharp objects',
        ['knife', 'axe'],
        'medium',
        25,
        50,
        'Axel'
    ),
    ANTHROPOPHOBIA: new Phobia(
        2,
        'Anthropophobia',
        'Fear of people',
        ['whispers', 'footsteps', 'laugh', 'hospital'],
        'medium',
        25,
        33.4,
        'Annie'
    ),
    ORNITHOPHOBIA: new Phobia(
        3,
        'Ornithophobia',
        'Fear of birds',
        ['birds', 'crow'],
        'medium',
        40,
        50,
        'Oscar'
    ),
    BIOPHOBIA: new Phobia(
        4,
        'Biophobia',
        'Fear of nature',
        ['mountain', 'haunted_wind'],
        'medium',
        25,
        33.4,
        'Bella'
    ),
    PHOTOPHOBIA: new Phobia(
        5,
        'Photophobia',
        'Fear of light',
        ['campfire', 'lightning'],
        'easy',
        25,
        50,
        'Phoebe'
    ),
    BRONTOPHOBIA: new Phobia(
         6, 
         'Brontophobia', 
         'Fear of thunder and storms',
          ['lightning', 'waves'],
        'medium', 
        20, 
        50,
        'Boris'
    ),
    PYROPHOBIA: new Phobia(
        7, 
        'Pyrophobia', 
        'Fear of fire or flames',
         ['campfire'],
       'easy', 
       40, 
       100,
       'Phoenix'
   ),
   NOSOCOPHOBIA: new Phobia(
        8,
        'Nosocomephobia',
        'Fear of hospitals or medical settings',
        ['hospital'],
        'hard',
        25,
        100,
        'Nora'
   ),
   CHRONOPHOBIA : new Phobia(
        9,
        'Chronophobia',   
        'Fear of time',
        ['clock'],
        'easy',
        25,
        100,
        'Charlie'
   ),
   KAMPANAPHOBIA: new Phobia(
        10,
        'Kampanaphobia',
        'Fear of bells',
        ['bell'],
        'medium',
        25,
        100,
        'Kai'
   ),
   MELOPHOBIA: new Phobia(
        11,
        'Melophobia',
        'Fear of music',
        ['bell', 'piano'],
        'medium',
        25,
        50,
        'Melody'
   ),
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

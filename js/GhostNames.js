export const GHOST_NAMES = [
    "Casper",
    "Phantom",
    "Wraith",
    "Shadow",
    "Emma",
    "Liam",
    "Olivia",
    "Noah",
    "Ava",
    "Ethan",
    "Isabella",
    "Lucas",
    "Sophia",
    "Mason",
    "Mia",
    "Oliver",
    "Charlotte",
    "Elijah",
    "Amelia",
    "James",
    "Harper",
    "Benjamin",
    "Evelyn",
    "Sebastian",
    "Abigail",
    "Michael",
    "Emily",
    "Daniel",
    "Elizabeth",
    "Henry",
    "Sofia",
    "Jackson",
    "Avery",
    "Samuel",
    "Ella",
    "David",
    "Madison",
    "Nathan",
    "Scarlett",
    "Isaac",
    "Victoria",
    "Jayden",
    "Luna",
    "Carter",
    "Grace",
    "Owen",
    "Chloe",
    "Dylan",
    "Penelope",
    "Luke",
    "Layla"
];

export function getRandomGhostName() {
    return GHOST_NAMES[Math.floor(Math.random() * GHOST_NAMES.length)];
}

export function getRandomGhostNames(count) {
    const shuffled = [...GHOST_NAMES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

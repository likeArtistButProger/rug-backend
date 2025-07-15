const RANDOM_FIRST_PARTS = [
    "Alpha",
    "Beta",
    "Gamma",
    "Delta",
    "Epsilon",
    "Zeta",
    "Eta",
    "Theta",
    "Iota",
    "Kappa",
]

const RANDOM_SECOND_PARTS = [
    "Rug",
    "Moe",
    "Bot",
    "AI",
    "Tech",
    "Lab",
    "Core",
    "Net",
    "Hub",
    "Zone",
]

export const generateRandomName = (): string => {
    const firstPart = RANDOM_FIRST_PARTS[Math.floor(Math.random() * RANDOM_FIRST_PARTS.length)];
    const secondPart = RANDOM_SECOND_PARTS[Math.floor(Math.random() * RANDOM_SECOND_PARTS.length)];
    return `${firstPart}${secondPart}`;
}
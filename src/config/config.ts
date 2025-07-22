import * as dotenv from "dotenv";

dotenv.config({
    quiet: true,
});

export const CONFIG = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    PRICE_CHANGE_TICK_MS: process.env.PRICE_CHANGE_TICK_MS
        ? parseInt(process.env.PRICE_CHANGE_TICK_MS, 10)
        : 250,
    ROUND_START_DELAY_MS: process.env.ROUND_START_DELAY_MS ? parseInt(process.env.ROUND_START_DELAY_MS, 10) : 10000,
    DRIFT_MIN: process.env.DRIFT_MIN ? parseFloat(process.env.DRIFT_MIN) : -0.03,
    DRIFT_MAX: process.env.DRIFT_MAX ? parseFloat(process.env.DRIFT_MAX) : 0.4,
    BIG_MOVE_CHANCE: process.env.BIG_MOVE_CHANCE ? parseFloat(process.env.BIG_MOVE_CHANCE) : 0.1,
    BIG_MOVE_MIN: process.env.BIG_MOVE_MIN ? parseFloat(process.env.BIG_MOVE_MIN) : -2,
    BIG_MOVE_MAX: process.env.BIG_MOVE_MAX ? parseFloat(process.env.BIG_MOVE_MAX) : 2,
    VERSION: process.env.VERSION || 'v3',
}

export const validateConfig = () => {
    if (isNaN(CONFIG.PORT) || CONFIG.PORT <= 0) {
        throw new Error("Invalid PORT env");
    }
    if (isNaN(CONFIG.PRICE_CHANGE_TICK_MS) || CONFIG.PRICE_CHANGE_TICK_MS <= 0) {
        throw new Error("Invalid PRICE_CHANGE_TICK_MS env");
    }
    if (isNaN(CONFIG.ROUND_START_DELAY_MS) || CONFIG.ROUND_START_DELAY_MS <= 0) {
        throw new Error("Invalid ROUND_START_DELAY_MS env");
    }
    if (isNaN(CONFIG.DRIFT_MIN) || isNaN(CONFIG.DRIFT_MAX) || CONFIG.DRIFT_MIN >= CONFIG.DRIFT_MAX) {
        throw new Error("Invalid DRIFT_MIN or DRIFT_MAX env");
    }
    if (isNaN(CONFIG.BIG_MOVE_CHANCE) || CONFIG.BIG_MOVE_CHANCE < 0 || CONFIG.BIG_MOVE_CHANCE > 1) {
        throw new Error("Invalid BIG_MOVE_CHANCE env");
    }
    if (isNaN(CONFIG.BIG_MOVE_MIN) || isNaN(CONFIG.BIG_MOVE_MAX) || CONFIG.BIG_MOVE_MIN >= CONFIG.BIG_MOVE_MAX) {
        throw new Error("Invalid BIG_MOVE_MIN or BIG_MOVE_MAX env");
    }
    if (!['v1', 'v3'].includes(CONFIG.VERSION)) {
        throw new Error("Invalid VERSION env, must be 'v1' or 'v3'");
    }
}
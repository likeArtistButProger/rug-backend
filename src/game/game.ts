import { CONFIG } from "@root/config/config";
import { bet, cashout, scheduleRound } from "@root/db/actions";
import { dbState, Round } from "@root/db/state";
import { sleep } from "@root/utils/sleep";
import { Server } from "socket.io";

function driftPrice(
    price: number,
    DRIFT_MIN: number,
    DRIFT_MAX: number,
    BIG_MOVE_CHANCE: number,
    BIG_MOVE_MIN: number,
    BIG_MOVE_MAX: number,
    randFn: () => number,
    version = 'v3',
    GOD_CANDLE_CHANCE = 0.00001,
    GOD_CANDLE_MOVE = 10.0,
    STARTING_PRICE = 1.0
) {
    // v3 adds God Candle feature - rare massive price increase
    if (version === 'v3' && randFn() < GOD_CANDLE_CHANCE && price <= 100 * STARTING_PRICE) {
        return price * GOD_CANDLE_MOVE;
    }
    
    let change = 0;
    
    if (randFn() < BIG_MOVE_CHANCE) {
        const moveSize = BIG_MOVE_MIN + randFn() * (BIG_MOVE_MAX - BIG_MOVE_MIN);
        change = randFn() > 0.5 ? moveSize : -moveSize;
    } else {
        const drift = DRIFT_MIN + randFn() * (DRIFT_MAX - DRIFT_MIN);
        
        // Version difference is in this volatility calculation
        const volatility = version === 'v1'
            ? 0.005 * Math.sqrt(price)
            : 0.005 * Math.min(10, Math.sqrt(price));
            
        change = drift + (volatility * (2 * randFn() - 1));
    }
    
    let newPrice = price * (1 + change);

    if (newPrice < 0) {
        newPrice = 0;
    }

    return Number(newPrice.toFixed(4));
}

const getNextPrice = (price: number): number => {
    return driftPrice(
        price,
        CONFIG.DRIFT_MIN,
        CONFIG.DRIFT_MAX,
        CONFIG.BIG_MOVE_CHANCE,
        CONFIG.BIG_MOVE_MIN,
        CONFIG.BIG_MOVE_MAX,
        Math.random,
        CONFIG.VERSION,
    );
}

export const startGameLoop = async (io: Server) => {
    const tick = (round: Round) => {
        round.price = getNextPrice(round.price);
        io.emit("priceUpdated", { price: round.price });
    }

    io.on("placeBet", ({ userId, amount }) => {
        bet(userId, amount, dbState.round.price);

        io.emit("betPlaced", { userId, amount, price: dbState.round.price });
    });

    io.on("cashout", ({ userId }) => {
        const user = cashout(userId, dbState.round.price);
        if (user) {
            io.emit("cashoutSuccess", { userId, coins: user.coins });
        } else {
            io.emit("cashoutError", { userId, message: "Cashout failed" });
        }
    })

    const playRound = async () => {
        const startTime = new Date(Date.now() + CONFIG.ROUND_START_DELAY_MS);
        const round = scheduleRound(startTime);

        // TODO(Nikita): Send UTC Time to clients
        io.emit("roundScheduled", { startTime });
        await sleep(CONFIG.ROUND_START_DELAY_MS);

        return new Promise((resolve) => {
            io.emit("roundStarted", { price: round.price });

            const interval = setInterval(() => {
                tick(round);

                if(round.price === 0) {
                    round.ended = true;
                    io.emit("roundEnded", { price: round.price });
                    resolve("");
                    clearInterval(interval);
                }
            }, CONFIG.PRICE_CHANGE_TICK_MS);
        })
    }

    while (true) {
        await playRound();
        // Wait for the next round to start
        await sleep(CONFIG.ROUND_START_DELAY_MS);
    }
}
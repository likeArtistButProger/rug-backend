import { randomUUID } from "crypto";
import { generateRandomName } from "@root/utils/names";
import { Bet, dbState, Round, User } from "./state";

const checkIfUserExists = (users: User[], id: string): boolean => {
    return users.some(user => user.id === id);
}

export const createUser = (): User => {
    let id = randomUUID();

    while (checkIfUserExists(dbState.users, id)) {
        id = randomUUID();
    }

    const name = generateRandomName();

    const user: User = {
        id,
        name,
        coins: 100,
    }

    dbState.users.push(user);
    return user;
}

export const getUser = (id: string): User | undefined => {
    return dbState.users.find(user => user.id === id);
}

export const addCoins = (id: string, amount: number): User | undefined => {
    const user = getUser(id);
    if (user) {
        user.coins += amount;
        return user;
    }
    return undefined;
}

export const subtractCoins = (id: string, amount: number): User | undefined => {
    const user = getUser(id);
    if (user && user.coins >= amount) {
        user.coins -= amount;
        return user;
    }
    return undefined;
}

export const scheduleRound = (startTime: Date): Round => {
    const round: Round = {
        price: 1.00,
        startTime,
        bets: [],
        ended: false,
    }

    dbState.round = round;
    return round;
}

export const getRound = (): Round => {
    return dbState.round;
}

export const bet = (userId: string, amount: number, startPrice: number): Bet | undefined => {
    const user = getUser(userId);
    const round = dbState.round;

    if (!user) {
        return undefined;
    }

    if(round.startTime.getTime() > Date.now()) {
        return undefined;
    }

    if (user.coins < amount) {
        return undefined;
    }

    const bet: Bet = {
        userId,
        amount,
        startPrice,
    };

    dbState.round.bets.push(bet);
    user.coins = user.coins - amount;
    return bet;
}

export const cashout = (userId: string, exitPrice: number): User | undefined => {
    const user = getUser(userId);
    const round = dbState.round;

    if (!user) {
        return undefined;
    }

    if(round.startTime.getTime() > Date.now()) {
        return undefined;
    }

    const bets = round.bets.filter(bet => bet.userId === userId);
    if (bets.length === 0) {
        return user;
    }

    const totalAmount = bets.reduce((total, bet) => {
        const profit = (exitPrice - bet.startPrice) / bet.startPrice * bet.amount;
        return total + bet.amount + profit;
    }, 0);

    user.coins += totalAmount;
    round.bets = round.bets.filter(bet => bet.userId !== userId);

    return user;
}

export const getBets = (): Bet[] => {
    return dbState.round?.bets ?? [];
}

export const clearBets = (): void => {
    if (!dbState.round) {
        return;
    }

    dbState.round.bets = [];
}
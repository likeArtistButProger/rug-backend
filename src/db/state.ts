export type User = {
    id: string;
    name: string;
    coins: number;
}

export type Bet = {
    userId: string;
    amount: number;
    startPrice: number;
}

export type Round = {
    price: number;
    startTime: Date;
    bets: Bet[];
    ended: boolean;
}

export type DbState = {
    users: User[];
    round: Round;
}

export const dbState: DbState = {
    users: [],
    round: {
        price: 1.00,
        startTime: new Date(),
        bets: [],
        ended: false,
    },
}
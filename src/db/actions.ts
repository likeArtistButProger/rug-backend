import { randomUUID } from "crypto";
import { generateRandomName } from "@root/utils/names";
import { dbState, User } from "./state";

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
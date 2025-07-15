export type User = {
    id: string;
    name: string;
    coins: number;
}

export type DbState = {
    users: User[];
}

export const dbState: DbState = {
    users: [],
}
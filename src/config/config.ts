import * as dotenv from "dotenv";

dotenv.config({
    quiet: true,
});

export const CONFIG = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
}
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { CONFIG, validateConfig } from "./config/config";
import { userRouter } from "./routers/user";
import { startGameLoop } from "./game/game";

validateConfig();

const app = express();
app.use(express.json());

app.use(cors({
        credentials: true,
        origin: (origin, callback) => {
              callback(null, true);
        },
        allowedHeaders: ["Content-Type"],
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
));

app.use("/api/v0/user", userRouter)

const server = createServer(app);
const io = new Server(server);

startGameLoop(io);

server.listen(CONFIG.PORT, () => {
    console.log(`Server is running on port ${CONFIG.PORT}`);
});
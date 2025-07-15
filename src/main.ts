import express from "express";
import cors from "cors";
import { CONFIG } from "./config/config";
import { userRouter } from "./routers/user";

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

app.listen(CONFIG.PORT, () => {
    console.log(`Server is running on port ${CONFIG.PORT}`);
});
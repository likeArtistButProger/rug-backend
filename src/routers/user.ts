import { createUser, getUser } from "@root/db/actions";
import { Router } from "express";

const userRouter = Router();

userRouter.post("/create", (req, res) => {
    try {
        const user = createUser();

        res.json({
            user
        })
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

userRouter.get("/:id", (req, res) => {
    const { id } = req.params;

    try {
        const user = getUser(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json({
            user
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
})

export {
    userRouter
}
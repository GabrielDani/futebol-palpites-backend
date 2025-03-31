import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerOptions from "../swaggerOptions.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import guessRoutes from "./routes/guessRoutes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();
const specs = swaggerJSDoc(swaggerOptions);

app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/groups", groupRoutes);
app.use("/teams", authMiddleware, teamRoutes);
app.use("/matches", matchRoutes);
app.use("/guesses", guessRoutes);

app.use(errorMiddleware);

export default app;

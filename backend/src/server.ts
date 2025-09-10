import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import dashRoutes from "./routes/dash.routes";
import userRoutes from "./routes/user.routes";
import todoRoutes from "./routes/todo.routes";
import { errorMiddleware } from "./middleware";
import { loadData } from "./dataStore";

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use("", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashRoutes);
app.use("/api/todos", todoRoutes);
app.use(errorMiddleware);

dotenv.config();

function startServer() {
  try {
    loadData();

    app.listen(port, () => {
      console.log(`Spotz server is running at http://localhost:${port}`);
    });

    // Routes & middleware
    app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

// closing the server
process.on("SIGINT", () => {
  console.log("Shutting down server.");
  process.exit();
});

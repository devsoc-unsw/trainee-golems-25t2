import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middleware";
import { loadData, connectToDatabase } from "./dataStore";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

dotenv.config();

async function startServer() {
  try {
    await connectToDatabase();
    await loadData();

    app.listen(port, () => {
      console.log(`Spotz server is running at http://localhost:${port}`);
    });

    // Routes & middleware
    app.use(express.json());
    app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );
    app.use("", authRoutes);
    app.use(errorMiddleware);
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

startServer();

// closing the server
process.on("SIGINT", async () => {
  console.log("Shutting down server.");
  // dbDisconnect();
  process.exit();
});

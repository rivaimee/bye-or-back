import express from "express";
import { connectToDatabase } from "./db/connection.js";
import seasonalRouter from "./routes/seasonal.js";
import discontinuedRouter from "./routes/discontinued.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
// Serve frontend files
app.use(express.static("public"));
app.use("/api/seasonal", seasonalRouter);
app.use("/api/discontinued", discontinuedRouter);

// Unknown API routes answer in JSON instead of the default HTML page
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Keeps stack traces in the log and out of the response
app.use((error, req, res, next) => {
  console.error("Unhandled request error:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(error.status || 500).json({ error: "Something went wrong" });
});

try {
  await connectToDatabase();
  console.log("Successfully connected to MongoDB!");

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Failed to connect to MongoDB:", error.message);
  process.exit(1);
}

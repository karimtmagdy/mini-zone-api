import express, { type Application } from "express";
import { GlobalErrorHandler } from "./global/GlobalErrorHandler";
const app: Application = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello TypeScript + Express 🚀");
});
GlobalErrorHandler(app);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { app };

import express from "express";
import cors from "cors";
import { checkLocation } from "./controllers/locationController.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/check-location", checkLocation);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

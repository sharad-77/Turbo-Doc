
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import exampleRouter from "./routes/example.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/example", exampleRouter);

app.get("/", (req, res) => {
  res.send("API is running");
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

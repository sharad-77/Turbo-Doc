import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ message: "OK" }));

app.listen(5000, () => console.log("API running on http://localhost:5000"));

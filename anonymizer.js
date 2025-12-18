import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createAnonymizeRouter } from "./anonymize.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 9628;
const PRESIDIO_ANALYZER_URL =
  process.env.PRESIDIO_ANALYZER_URL || "http://localhost:5002";
const PRESIDIO_ANONYMIZER_URL =
  process.env.PRESIDIO_ANONYMIZER_URL || "http://localhost:5001";

app.use(express.json({ limit: "2mb" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Serve built assets (React bundle, compiled CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/api",
  createAnonymizeRouter({
    analyzerUrl: PRESIDIO_ANALYZER_URL,
    anonymizerUrl: PRESIDIO_ANONYMIZER_URL,
  }),
);

// Root page that will host the Anonymizer React app.
app.get(["/", "/anonymizer"], (_req, res) => {
  res.render("template", { title: "Anonymizer by Law Law" });
});

app.listen(PORT, HOST, () => {
  console.log(`Anonymizer server listening on http://${HOST}:${PORT}`);
});

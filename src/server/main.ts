import express from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { logger } from "./logger.js";
import { httpLogger } from "./httpLogger.js";
import multer from "multer";
import dotenv from "dotenv";
import RequestHandler from "./RequestHandler.js";
import { IHandleDatabase } from "./IHandleDatabase.js";
import { MySqlDbHandler } from "./MySqlDbHandler.js";
import { fileURLToPath } from "url";

const start = async () => {
  dotenv.config();

  // const upload = multer({ dest: "uploads/" });
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  const PORT = process.env.PORT || 8000;
  const DB = process.env.DB || "sqlite";

  let dbHandler: IHandleDatabase;

  if (DB === "mysql") {
    dbHandler = await MySqlDbHandler.getInstance();
  } else {
    throw new Error("Invalid DB! Supported DBs: mysql");
  }

  const requestHandler: RequestHandler = new RequestHandler(dbHandler);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(httpLogger);
  app.use(express.static(path.join(__dirname, "..", "..", "public")));

  app
    .route("/api/*")
    .get(requestHandler.handleRequest.bind(requestHandler))
    .post(
      upload.array("Media"),
      requestHandler.handleRequest.bind(requestHandler)
    );

  app.listen(PORT, () =>
    logger.info("Server listening: " + `http://localhost:${PORT}`)
  );
};

start();

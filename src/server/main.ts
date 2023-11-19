import express from "express";
import * as bodyParser from "body-parser";
import path from "path";
import { logger } from "./logger";
import { httpLogger } from "./httpLogger";
import multer from "multer";
import dotenv from "dotenv";
import RequestHandler from "./RequestHandler";
import { IHandleDatabase } from "./IHandleDatabase";
import { MySqlDbHandler } from "./MySqlDbHandler";

const start = async () => {
  dotenv.config();

  // const upload = multer({ dest: "uploads/" });
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  const PORT = process.env.PORT || 8000;
  const DB = process.env.DB || "sqlite";

  let dbHandler: IHandleDatabase;

  if (DB === "mysql") {
    dbHandler = await MySqlDbHandler.getInstance();
  } else {
    throw new Error("Invalid DB! Supported DBs: mysql");
  }

  const requestHandler: RequestHandler = new RequestHandler(dbHandler);

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(httpLogger);
  app.use(express.static(path.join(__dirname, "..", "..", "public")));

  app
    .route("/api/*")
    .get(requestHandler.handleRequest)
    .post(upload.array("Media"), requestHandler.handleRequest);

  app.listen(PORT, () =>
    logger.info("Server listening: " + `http://localhost:${PORT}`)
  );
};

start();

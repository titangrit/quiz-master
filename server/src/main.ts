import express from 'express';
import * as bodyParser from "body-parser";
const path = require('path');
import logger from "./logger";
const httpLogger = require('./httpLogger');
import { PostRequestHandler, GetRequestHandler } from './requestHandler';

require('dotenv').config();
const PORT = process.env.PORT || 8000

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(httpLogger);
app.use(express.static(path.join(__dirname, "..", "..", "public")))

app.route('/quiz/*').get(GetRequestHandler.handleGET).post(PostRequestHandler.handlePOST);

app.listen(PORT, () => logger.info('Express.js listening on port ' + PORT))

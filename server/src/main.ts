import express from 'express';
import * as bodyParser from "body-parser";
const path = require('path');
import logger from "./logger";
const httpLogger = require('./httpLogger');
import { RequestHandler } from './requestHandler/Requesthandler';

require('dotenv').config();
const PORT = process.env.PORT || 8000

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(httpLogger);
app.use(express.static(path.join(__dirname, "..", "..", "public")))

// app.get('/', (req, res, next) => {
//     res.sendFile(path.join(__dirname, "..", "..", "public"))
// })

// app.post('/quiz/*', (req: Request, res: Response) => {
//     requestHandler.handleRequest(req, res);
//     res.status(404).send('8')
// })

// app.get('/quiz/*', (req: Request, res: Response) => {
//     requestHandler.handleRequest(req, res);
//     res.status(404).send('8')
// })

const requestHandler = new RequestHandler();
app.route('/quiz/*').get(requestHandler.handleGET).post(requestHandler.handlePOST);

app.listen(PORT, () => logger.info('Express.js listening on port ' + PORT))

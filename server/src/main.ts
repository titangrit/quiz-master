import express, { Request, Response } from 'express';

require('dotenv').config();

const path = require('path')
const logger = require('./logger')
const httpLogger = require('./httpLogger')

const app = express()
const PORT = process.env.PORT || 3000

app.use(httpLogger)
app.use(express.static(path.join(__dirname, "..", "..", "public")))

// app.get('/', (req, res, next) => {
//     res.sendFile(path.join(__dirname, "..", "..", "public"))
// })

app.post('/quiz/*', (req: Request, res: Response) => {
    res.status(404).send('8')
})

app.get('/quiz/*', (req: Request, res: Response) => {
    res.status(404).send('8')
})

app.listen(PORT, () => logger.info('Express.js listening on port ' + PORT))

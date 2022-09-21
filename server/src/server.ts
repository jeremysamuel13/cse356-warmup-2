import 'ignore-styles'

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { TTTRequest, TTTResponse } from './interface';
import { advance } from './ttt';
import fs from 'fs'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import App from '../../src/App'
import TTTBoard from '../../src/TTTBoard';
import TTTForm from '../../src/TTTForm';

// Allow for interaction with dotenv
dotenv.config();

// Setup express
const APP: Express = express();
const PORT = process.env.PORT;

// JSON Middleware
APP.use(express.json())

APP.get('/', (req, res) => res.send("Welcome from server!"))

// TTT API
APP.post('/ttt/play', (req: Request<TTTRequest>, res: Response<TTTResponse>) => {
    console.log(req.body)

    const resBody = advance(req.body.grid)

    console.log(resBody)

    res.send(resBody)
});

APP.use('/', express.static(path.resolve(__dirname, '../../build')))

APP.get('/ttt', (req, res, next) => {
    fs.readFile(path.resolve(__dirname, '../../build/index.html'), 'utf-8', (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Unexpected error!")
        }

        const name = req.query.name
        const isForm = !name

        console.log(`Query param: ${name}, isForm: ${isForm}`)

        const element = isForm ? React.createElement(TTTForm) : React.createElement(TTTBoard, { name: `${name}`, date: new Date() })

        const rootHTML = ReactDOMServer.renderToString(element)

        console.log(rootHTML)

        return res.send(data.replace(`<div id="root"></div>`, `<div id="root">${rootHTML}</div>`))
    })

})

// APP.use((err, req, res, next) => {
//     if (req.xhr) {
//         console.log(err)
//         res.status(500).send({ error: 'Something failed!' })
//     } else {
//         next(err)
//     }
// })

// Start server
APP.listen(PORT, () => console.log(`Server started on port ${PORT}`));
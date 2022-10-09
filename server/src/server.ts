import 'ignore-styles'
import dotenv from 'dotenv';

// Allow for interaction with dotenv
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;


import express, { Express, Request, Response } from 'express';
import { TTTRequest, TTTResponse } from './ttt/interface';
import { advance } from './ttt/ttt';
import fs from 'fs'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from '../../src/App';
import { initDB } from './db/db';
import * as ttt_db from './db/ttt'
import { authenticateJWT, registerUser } from './auth/user'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { Game, User } from './db/models';
import { createTransport } from 'nodemailer'
import { UserGame } from './db/models'

import { v4 as uuidv4 } from 'uuid';


// Setup express
const APP: Express = express();
const PORT = process.env.PORT;

// JSON Middleware
APP.use(express.json())

APP.use(express.urlencoded({ extended: true }));

APP.use(cookieParser());


// Set Header
APP.use((req, res, next) => {
    if (req.method === 'POST') {
        res.setHeader("X-CSE356", "63094ca6047a1139b66d985a")
    }

    next()
})

APP.get('/', (req, res) => res.send("Welcome from server!"))

// TTT API
APP.post('/ttt/play', async (req: Request<TTTRequest>, res: Response<TTTResponse>) => {
    console.log(req.body)

    const { username, password } = req.cookies;
    if (!username || !password) {
        return res.json({ status: 'ERROR' });
    }
    const user = await User.findOne({ username: username, password: password });
    if (!user) {
        console.log("User not found")
        return res.json({ status: 'ERROR' });
    }

    const resBody = await advance(user, req.body.move)

    console.log(resBody)

    res.send(resBody)
});

APP.use('/', express.static(path.resolve(__dirname, '../../build'), { index: false }))

APP.get('/ttt', (req, res, next) => {
    fs.readFile(path.resolve(__dirname, '../../build/index.html'), 'utf-8', (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Unexpected error!")
        }

        const name = req.query.name
        const isForm = !name

        console.log(`Query param: ${name}, isForm: ${isForm}`)

        const initialState = { isHome: isForm, name: name as string, date: new Date() }

        const element = React.createElement(App, initialState)
        const rootHTML = ReactDOMServer.renderToString(element)

        const afterState = data.replace(`<script>window.__APP_INITIAL_STATE__=""</script>`, `<script>window.__APP_INITIAL_STATE__=${JSON.stringify(initialState)}</script>`)
        const afterHTML = afterState.replace(`<div id="root"></div>`, `<div id="root">${rootHTML}</div>`)

        console.log(JSON.stringify(initialState))
        console.log(afterHTML)

        return res.send(afterHTML)
    })

})

APP.post('/adduser', async (req: Request<{ username: string, password: string, email: string }>, res: Response) => {
    const { email, username, password } = req.body

    if (!email || !username || !password || await User.findOne({ username })) {
        return res.json({ status: 'ERROR' })
    }

    const dups = await User.find({ $or: [{ email }, { username }] })

    if (dups && dups.length > 0) {
        console.log("User already created!")
        return res.json({ status: 'ERROR' })
    }

    const verificationKey = uuidv4();

    await ttt_db.putUser(username, email, password, verificationKey)

    const verificationLink = `http://mahirjeremy.cse356.compas.cs.stonybrook.edu/verify?email=${encodeURIComponent(email)}&verificationKey=${verificationKey}`

    const transport = createTransport({
        sendmail: true,
        path: '/usr/sbin/sendmail',
        newline: 'unix'
    })

    transport.sendMail({
        from: 'root@mahirjeremy.cse356.compas.cs.stonybrook.edu',
        to: email,
        subject: 'Verfiy!!!',
        text: verificationLink
    }, (err, info) => console.log)

    res.json({ status: "OK" })
})

APP.get('/verify', async (req, res) => {
    const { email, verificationKey } = req.query;

    if (!email || !verificationKey) {
        return res.json({ status: "ERROR" })
    }

    const user = await User.findOne({ email })

    if (!user || user.isVerified) {
        return res.json({ status: "ERROR" })
    }

    if (verificationKey === user.verificationKey) {
        await User.findOneAndUpdate({ email }, { isVerified: true })
        return res.json({ status: 'OK' });
    }

    return res.json({ status: "ERROR" })
})

APP.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.json({ status: "ERROR" })
    }

    const user = await User.findOne({ username, password })

    if (!user || !user.isVerified) {
        return res.json({ status: "ERROR" })
    }

    res.cookie('username', username, { maxAge: 1000 * 60 * 30 })
    res.cookie('password', password, { maxAge: 1000 * 60 * 30 })

    return res.json({ status: "OK" })
})

APP.post('/logout', async (req, res) => {
    if (req.cookies && req.cookies.username && req.cookies.password) {
        res.clearCookie('username')
        res.clearCookie('password')
        return res.json({ status: 'OK' });

    }
    return res.json({ status: 'ERROR' });
})

APP.post('/listgames', async (req, res) => {
    console.log("List games")

    const { username, password } = req.cookies;
    if (!username || !password) {
        return res.json({ status: 'ERROR' });
    }
    const user = await User.findOne({ username: username, password: password });
    if (!user) {
        console.log("User not found")
        return res.json({ status: 'ERROR' });
    }


    console.log("Fetching games")


    const games = await Promise.all(user.games.map(async (x) => {
        console.log(x)
        const userGame = await UserGame.findById(x)
        return { start_date: userGame.start_date, id: userGame.game_id }
    }))

    return res.json({ status: 'OK', games })

})

APP.post('/getgame', async (req, res) => {
    const { username, password } = req.cookies;
    if (!username || !password) {
        return res.json({ status: 'ERROR' });
    }
    const user = await User.findOne({ username: username, password: password });
    if (!user || !req.body.id) {
        return res.json({ status: 'ERROR' });
    }

    const game = await Game.findById(req.body.id)

    return res.json({ status: 'OK', grid: game.grid, winner: game.winner })
})

APP.post('/getscore', async (req, res) => {
    const { username, password } = req.cookies;
    if (!username || !password) {
        return res.json({ status: 'ERROR' });
    }
    const user = await User.findOne({ username: username, password: password });
    if (!user || !req.body.id) {
        return res.json({ status: 'ERROR' });
    }


    const games = await Promise.all(user.games.map(async (x) => {
        console.log(x)
        const userGame = await UserGame.findById(x)
        const game = await Game.findById(userGame.game_id)


        return game;
    }))

    const record = {
        human: 0,
        wopr: 0,
        tie: 0
    }

    games.forEach(game => {
        if (game.winner === 'X') {
            record.human++;
        } else if (game.winner === 'O') {
            record.wopr++;
        } else if (game.winner === 'T') {
            record.tie++;
        }
    })

    return { ...record, status: 'OK' }
})


// Init db then start server
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS

initDB(DB_USER, DB_PASS, DB_HOST, DB_PORT);

APP.listen(PORT, () => console.log(`Server started on port ${PORT}`))
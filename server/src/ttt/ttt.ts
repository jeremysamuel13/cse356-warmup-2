import { Game, IGame, IUser, IUserGame, UserGame } from "../db/models"
import { TTTGrid, TTTResponse, RESULT_NO_WINNER, PLAYER_SERVER, Winner, EMPTY_ELEMENT, TTTElement, RESULT_TIE, Move } from "./interface"
import { Document } from "mongoose"

export const advance = async (inpUser: Document<unknown, any, IUser> & IUser, move: Move): Promise<TTTResponse> => {
    const user = inpUser.toObject()

    //get current grid or make a new game
    const lastGameId = user.games[user.games.length - 1]
    let userGame = await UserGame.findById(lastGameId).exec()

    let game: Document<unknown, any, IGame> & IGame;

    if (!userGame) {
        userGame = await UserGame.create({
            start_date: Date.now(),
            user_id: user._id,
            game_id: user._id
        })

        const emptyGrid: TTTGrid = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']

        game = await Game.create({
            grid: emptyGrid,
            winner: ' ',
            user_game_id: userGame.id
        })

        userGame.game_id = game.id
        await userGame.save()

        inpUser.games = [...inpUser.games, userGame.id]
        await inpUser.save()
    } else {
        game = await Game.findOne({ user_game_id: userGame.id })

        if (game.winner !== ' ') {
            userGame = await UserGame.create({
                start_date: Date.now(),
                user_id: user._id,
                game_id: user._id
            })

            const emptyGrid: TTTGrid = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']

            game = await Game.create({
                grid: emptyGrid,
                winner: ' ',
                user_game_id: userGame.id
            })

            userGame.game_id = game.id
            await userGame.save()

            inpUser.games = [...inpUser.games, userGame.id]
            await inpUser.save()
        }
    }

    const gameObj = game.toObject()

    const body = gameObj.grid as TTTGrid

    if (move && body[move] === ' ' && move >= 0 || move < 9) {
        body[move] = 'X'
    } else if (move) {
        console.log("Invalid Move")
        return { status: 'ERROR' }
    }

    let winner = determineWinner(body)

    // if user won or user didnt make a move
    if (move === null || winner !== RESULT_NO_WINNER) {
        game.grid = body
        game.winner = winner
        await game.save()
        return { winner, grid: body, status: 'OK' }
    }

    // otherwise, server makes move
    const resp = makeMove(body)

    game.grid = resp.grid ?? game.grid
    game.winner = resp.winner ?? game.winner

    await game.save()

    return resp
}

export const makeMove = (body: TTTGrid): TTTResponse => {
    // choose move
    const legalMoveIndices = getAvailableSpaces(body)

    if (legalMoveIndices.length === 0) {
        return { grid: body, winner: RESULT_TIE, status: 'OK' }
    }

    const randomIndex = Math.floor(Math.random() * legalMoveIndices.length)

    const grid = body
    grid[legalMoveIndices[randomIndex]] = PLAYER_SERVER

    //determine winner
    const winner = determineWinner(grid)

    return { grid, winner, status: 'OK' }
}

export const determineWinner = (grid: TTTGrid): Winner => {
    // check rows and columns
    for (let i = 0; i < 3; i++) {
        //Column
        if (grid[i] === grid[i + 3] && grid[i + 3] === grid[i + 6] && grid[i + 6] !== EMPTY_ELEMENT) {
            return grid[i]
        }

        //row
        const j = i * 3
        if (grid[j] === grid[j + 1] && grid[j + 1] === grid[j + 2] && grid[j + 2] !== EMPTY_ELEMENT) {
            return grid[j]
        }

    }

    //check diagonals
    if (grid[0] === grid[4] && grid[4] === grid[8] && grid[8] !== EMPTY_ELEMENT) {
        return grid[0]
    } else if (grid[2] === grid[4] && grid[4] === grid[6] && grid[6] !== EMPTY_ELEMENT) {
        return grid[2]
    }

    const legalMoveIndices = getAvailableSpaces(grid)

    if (legalMoveIndices.length === 0) {
        return RESULT_TIE
    }

    return RESULT_NO_WINNER

}


export const getAvailableSpaces = (grid: TTTGrid): Array<number> =>
    grid.map((value: TTTElement, index: number) => value === EMPTY_ELEMENT ? index : null).filter(Boolean) as Array<number>

import { TTTGrid, TTTResponse, RESULT_NO_WINNER, PLAYER_SERVER, Winner, EMPTY_ELEMENT, TTTElement, RESULT_TIE } from "./interface"

export const advance = (body: TTTGrid): TTTResponse => {

    let winner = determineWinner(body)

    // if user won
    if (winner !== RESULT_NO_WINNER) {
        return { winner, grid: body }
    }

    // otherwise, server makes move
    return makeMove(body)
}

export const makeMove = (body: TTTGrid): TTTResponse => {
    // choose move
    const legalMoveIndices = getAvailableSpaces(body)

    if (legalMoveIndices.length === 0) {
        return { grid: body, winner: RESULT_TIE }
    }

    const randomIndex = Math.floor(Math.random() * legalMoveIndices.length)

    const grid = body
    grid[legalMoveIndices[randomIndex]] = PLAYER_SERVER

    //determine winner
    const winner = determineWinner(grid)

    return { grid, winner }
}

export const determineWinner = (grid: TTTGrid): Winner => {
    const legalMoveIndices = getAvailableSpaces(grid)

    if (legalMoveIndices.length === 0) {
         return RESULT_TIE
    }   
       
	// check rows and columns
    for (let i = 0; i < 3; i++) {
        const rowIsWinner = grid[i] === grid[i + 1] && grid[i + 1] === grid[i + 2] && grid[i + 2] !== EMPTY_ELEMENT
        const columnisWinner = grid[i] === grid[i + 3] && grid[i + 3] === grid[i + 6] && grid[i + 6] !== EMPTY_ELEMENT

        if (rowIsWinner || columnisWinner) {
            return grid[i]
            break
        }
    }

    //check diagonals
    if (grid[0] === grid[4] && grid[4] === grid[8] && grid[8] !== EMPTY_ELEMENT) {
        return grid[0]
    } else if (grid[2] === grid[4] && grid[4] === grid[6] && grid[6] !== EMPTY_ELEMENT) {
        return grid[2]
    }

    return RESULT_NO_WINNER

}


export const getAvailableSpaces = (grid: TTTGrid): Array<number> =>
    grid.map((value: TTTElement, index: number) => value === EMPTY_ELEMENT ? index : null).filter(Boolean) as Array<number>

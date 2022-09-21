import { useState, useEffect } from "react"
import { Players, TTTElement, TTTGrid, TTTRequest, TTTResponse, Winner } from "../server/src/interface"
import "./TTTBoard.css"


const TTTBoard = () => {
    const [grid, setGrid] = useState<TTTGrid>([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '])
    const [winner, setWinner] = useState<Winner>(' ')
    const [turn, setTurn] = useState<Players>('X')
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (turn === 'O') {
            console.log("CPU Turn")

            setLoading(true)
            // Have CPU make turn
            fetch("/ttt/play", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ grid })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data.grid)
                    setGrid(data.grid);
                    setWinner(data.winner);
                })
                .catch((err) => console.log(err))
                .finally(() => {
                    setLoading(false);
                    setTurn('X');
                })
        } else {
            console.log("User Turn")
        }
    }, [turn, grid])

    useEffect(() => {
        console.log({ msg: "grid changed", grid })
    }, [grid])

    const elToButton = (gridIndex: number) => <button className="ttt-element" key={`ttt-element-${gridIndex}`} onClick={!loading && winner === ' ' && grid[gridIndex] === ' ' ? () => {
        const cloned: TTTGrid = [...grid]
        cloned[gridIndex] = 'X'
        setGrid(cloned)
        setTurn('O')
    } : undefined}>{grid[gridIndex] === ' ' ? <span>&nbsp;</span> : <span>{grid[gridIndex]}</span>}</button>

    return <div className="ttt-board">
        {Array.from(Array(3).keys()).map((idx) => <div key={`ttt-row-${idx}`} className="ttt-row" >
            {Array.from(Array(9).keys()).slice(idx * 3, (idx + 1) * 3).map((val) => elToButton(val))}
        </div>)}

        {winner !== ' ' && <div>
            Winner: {winner}
        </div>}
    </div>


}

export default TTTBoard;
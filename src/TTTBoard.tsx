import { useState, useEffect } from "react"
import {Players, TTTGrid, TTTRequest, TTTResponse, Winner} from "../server/src/interface"

const TTTBoard = () => {
    const [grid, setGrid] = useState<TTTGrid>([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '])
    const [winner, setWinner] = useState<Winner>(' ')
    const [turn, setTurn] = useState<Players>('X')

    useEffect(() => {
        if(turn === 'O'){
            // Have CPU make turn
            fetch("http://209.151.152.56/ttt/play", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ grid })
            })
            .then(response => response.json())
            .then(data => {
                setGrid(data.grid);  
                setWinner(data.winner);
            })

            setTurn('X')
        }
    }, [turn])

    return <div className="ttt-board">
        {grid.map((el, index) => <div id={`el-${index}`} className="ttt-element" onClick={(e) => {
            const cloned: TTTGrid = [...grid]
            cloned[index] = 'X'
            setGrid(cloned)
        }}>{el}</div>)}
    </div>


}

export default TTTBoard;
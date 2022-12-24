import React, { useRef, useState } from 'react'
import Cell from "./Cell";
import Chess from "../utils/Chess";
import "../styles/Board.css";

function useGame() {
    const gameRef = useRef();
    if (!gameRef.current) {
        gameRef.current = new Chess();
    }
    return gameRef.current;
}

function Board() {
    console.log("render")
    const game = useGame();
    const [board, setBoard] = useState(game.board);

    const clickHandler = () => {
        if (game.move([6,3], [4,3])) {
            setBoard(game.board);
        }
    }

    return (
        <div className="Board">
            {
            [].concat(...board.map(
                (row,i)=>row.map(
                    (piece,j)=><Cell 
                        className={i%2===j%2? "white":"black"}
                        piece={piece} 
                        key={10*i + j}
                    />
                )
            ))
            }
            <button onClick={clickHandler}>Click</button>
        </div>
    )
}

export default Board
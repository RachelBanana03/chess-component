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
    const [mousePos, setMousePos] = useState(null);

    const clickHandler = () => {
        if (game.move([6,3], [4,3])) {
            setBoard(game.board);
        }
    }

    const mouseMoveHandler = (e) => {
        const boardRect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - boardRect.left; 
        const y = e.pageY - boardRect.top; 
        setMousePos([x,y]);
    }

    return (
        <div>
            <div className="Board" onMouseMove={mouseMoveHandler}>
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
            </div>
            <button onClick={clickHandler}>Click</button>
            <p>{mousePos.join(" ")}</p>
        </div>
    )
}

export default Board
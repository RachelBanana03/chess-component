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
    const game = useGame();
    const [board, setBoard] = useState(game.board);
    const [mousePos, setMousePos] = useState(null);
    const [pieceSelected, setPieceSelected] = useState(null);

    const makeMove = (start, end) => {
        if (game.move(start, end)) {
            setBoard(game.board);
        }
    }

    const mouseMoveHandler = (e) => {
        const x = e.clientX; 
        const y = e.clientY; 
        setMousePos([x,y]);
    }

    return (
        <div>
            <div 
                className="Board" 
                onMouseMove={mouseMoveHandler}
            >
                {
                [].concat(...board.map(
                    (row,i)=>row.map(
                        (piece,j)=><Cell 
                            className={i%2===j%2? "white":"black"}
                            piece={piece} 
                            pieceSelected={pieceSelected}
                            setPieceSelected={setPieceSelected}
                            makeMove={makeMove}
                            mousePos={mousePos}
                            pos={[i,j]}
                            key={10*i + j}
                        />
                    )
                ))
                }
            </div>
            <p>{mousePos?.join(" ")}</p>
        </div>
    )
}

export default Board
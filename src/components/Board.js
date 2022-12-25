import React, { useRef, useState } from 'react'
import Cell from "./Cell";
import Chess from "../utils/Chess";
import "../styles/Board.css";
import moveSfxFile from "../sounds/move-self.mp3";

const moveSfx = new Audio(moveSfxFile);

function playAudio(audio) {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
}

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
        const moveResult = game.move(start, end);
        if (!moveResult) return;
        playAudio(moveSfx);
        setBoard(game.board);
    }

    const mouseMoveHandler = (e) => {
        const x = e.clientX; 
        const y = e.clientY; 
        setMousePos([x,y]);
    }

    const mouseUpHandler = e => {
        const dropCell = document.elementsFromPoint(mousePos[0], mousePos[1])[1];
        if (dropCell?.dataset?.pos && pieceSelected) {
            const newPos = dropCell.dataset.pos.split(",").map(c=>Number(c));
            makeMove(pieceSelected.pos, newPos);
        }
        pieceSelected?.setIsPicked?.(false);
        setPieceSelected(null);
    }

    return (
            <div 
                className="Board" 
                onMouseMove={mouseMoveHandler}
                onMouseUp={mouseUpHandler}
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
    )
}

export default Board
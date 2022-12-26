import React, { useRef, useState } from 'react'
import Cell from "./Cell";
import Chess, { ChessSymbols as CSym } from "../utils/Chess";
import "../styles/Board.css";
import moveSfxFile from "../sounds/move-self.mp3";
import captureSfxFile from "../sounds/capture.mp3";
import castleSfxFile from "../sounds/castle.mp3";
import checkSfxFile from "../sounds/check.mp3";

const moveSfx = new Audio(moveSfxFile);
const captureSfx = new Audio(captureSfxFile);
const castleSfx = new Audio(castleSfxFile);
const checkSfx = new Audio (checkSfxFile);

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

        // play audio according to symbol
        switch(moveResult) {
            case CSym.CHECKMATE:
                console.log("checkmate!");
                break;
            case CSym.CHECK:
                playAudio(checkSfx);
                break;
            case CSym.CASTLE:
                playAudio(castleSfx);
                break;
            case CSym.CAPTURE:
            case CSym.EN_PASSANT:
                playAudio(captureSfx);
                break;
            default:
                playAudio(moveSfx);
        }
        
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
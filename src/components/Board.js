import React, { useRef, useState } from 'react'
import Cell from "./Cell";
import Chess, { ChessSymbols as CSym } from "../utils/Chess";
import "../styles/Board.css";
import { playMoveSfx } from '../utils/chessAudio';

function useGame(notation) {
    const gameRef = useRef();
    if (!gameRef.current) {
        if (typeof notation === "string") {
            notation = notation.trim();
            notation = notation.replace(/\s+/g, " ");
        }
        gameRef.current = new Chess(notation);
    }
    return gameRef.current;
}

function Board({width, height, children}) {
    const game = useGame(children);
    const [board, setBoard] = useState(game.browseBoard(0)[0]);
    const [gameIndex, setGameIndex] = useState(0); 
    const [fenValue, setFenValue] = useState(game.getFEN(0)); 

    const [mousePos, setMousePos] = useState(null);
    const [pieceSelected, setPieceSelected] = useState(null);
    const [promotionOptions, setPromotionOptions] = useState(null);
    

    const makeMove = (start, end, promoPiece = null) => {
        if (gameIndex!==game.movesLength-1) { 
            setGameIndex(game.movesLength-1); 
            setBoard(game.board);
            setFenValue(game.getFEN(game.movesLength-1)); 
            return;
        }

        let moveResult = game.move(start, end, false, promoPiece);
        if (!moveResult) return;

        if (moveResult === CSym.CAN_PROMOTE) {
            setPromotionOptions({
                start,
                end,
                isWhite: Chess.isWhite(board[start[0]][start[1]])
            });
        }

        // play audio according to symbol
        playMoveSfx(moveResult);
        setGameIndex(game.movesLength-1);
        setBoard(game.board);
        setFenValue(game.getFEN(game.movesLength-1)); 
    }

    const getPrevBoard = () => {
        const prevBoardData = game.browseBoard(gameIndex-1); 
        if (!prevBoardData) return;
        playMoveSfx(prevBoardData[2]); // play next move
        setGameIndex(prevIndex=>prevIndex-1);
        setBoard(prevBoardData[0]);
        setFenValue(game.getFEN(gameIndex-1));  
    }

    const getNextBoard = () => {
        const nextBoardData = game.browseBoard(gameIndex+1); 
        if (!nextBoardData) return;
        playMoveSfx(nextBoardData[1]); // play prev move
        setGameIndex(prevIndex=>prevIndex+1);
        setBoard(nextBoardData[0]);
        setFenValue(game.getFEN(gameIndex+1)); 
    }

    const resetBoard = () => {
        const initialFen = game.getFEN(0); 
        game.createBoard(initialFen);
        setGameIndex(0);
        setBoard(game.board);
        setFenValue(game.getFEN(0)); 
    }

    const doPromotion = (piece) => {
        if (!promotionOptions) return;
        if (piece) {
            const { start, end } = promotionOptions;
            makeMove(start, end, piece);
        }
        setPromotionOptions(null);
    }

    const mouseMoveHandler = (e) => {
        // get mouse position relative to view port
        const x = e.clientX;
        const y = e.clientY;
        setMousePos([x, y]);
    }

    const mouseUpHandler = e => {
        const dropCell = document.elementsFromPoint(mousePos[0], mousePos[1])[1];
        // if valid square to drop
        if (dropCell?.dataset?.pos && pieceSelected) {
            const newPos = dropCell.dataset.pos.split(",").map(c => Number(c));
            makeMove(pieceSelected.pos, newPos);
        }
        // drop piece and set selected piece to null
        pieceSelected?.setIsPicked?.(false);
        setPieceSelected(null);
    }

    const fenInputChangeHandler = e => {
        setFenValue(e.target.value);
    }

    const fenInputKeydownHandler = e => {
        if (e.key === "Enter") {
            // if fen equals to current board, return
            if (fenValue === game.getFEN(gameIndex)) return; 
            
            // try create board
            if (game.createBoard(fenValue)) {
                setGameIndex(0);
                setBoard(game.board);
                setFenValue(fenValue);
            };
        }
    }

    const fenInputBlurHandler = e => {
        if (!e.target.value || e.target.value.length === 0) {
            setFenValue(game.getFEN(gameIndex)); 
        }
    }

    return (
        <>
            <div
                className="Board"
                onMouseMove={mouseMoveHandler}
                onMouseUp={mouseUpHandler}
                style={{width, height}}
            >
                {
                    [].concat(...board.map(
                        (row, i) => row.map(
                            (piece, j) => <Cell
                                className={i % 2 === j % 2 ? "white" : "black"}
                                piece={piece}
                                setPieceSelected={setPieceSelected}
                                promotionOptions={promotionOptions}
                                doPromotion={doPromotion}
                                mousePos={mousePos}
                                pos={[i, j]}
                                key={10 * i + j}
                            />
                        )
                    ))
                }
            </div>
            <input 
                type="text" 
                spellCheck={false} 
                value={fenValue} 
                onChange={fenInputChangeHandler}
                onBlur={fenInputBlurHandler}
                onKeyDown={fenInputKeydownHandler}
            />
            <br/>
            <button onClick={resetBoard}>&#8634;</button>
            <button onClick={getPrevBoard}>&#60;</button>
            <button onClick={getNextBoard}>&#62;</button>
        </>
    )
}

export default Board
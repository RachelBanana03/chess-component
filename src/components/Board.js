import React, { useRef, useState } from 'react'
import Cell from "./Cell";
import Chess, { ChessSymbols as CSym } from "../utils/Chess";
import "../styles/Board.css";
import moveSfxFile from "../sounds/move-self.mp3";
import captureSfxFile from "../sounds/capture.mp3";
import castleSfxFile from "../sounds/castle.mp3";
import checkSfxFile from "../sounds/check.mp3";
import checkmateSfxFile from "../sounds/checkmate.mp3";
import promoteSfxFile from "../sounds/promote.mp3";

const moveSfx = new Audio(moveSfxFile);
const captureSfx = new Audio(captureSfxFile);
const castleSfx = new Audio(castleSfxFile);
const checkSfx = new Audio(checkSfxFile);
const checkmateSfx = new Audio(checkmateSfxFile);
const promoteSfx = new Audio(promoteSfxFile);

function playAudio(audio) {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
}

function playMoveSfx(moveSymbol) {
    switch (moveSymbol) {
        case CSym.CAN_PROMOTE:
            break;
        case CSym.CHECKMATE:
            playAudio(checkmateSfx);
            break;
        case CSym.CHECK:
            playAudio(checkSfx);
            break;
        case CSym.PROMOTE:
            playAudio(promoteSfx);
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
    const [promotionOptions, setPromotionOptions] = useState(null);
    const [gameIndex, setGameIndex] = useState(0);

    const makeMove = (start, end, promoPiece = null) => {
        if (gameIndex) {
            setGameIndex(0);
            setBoard(game.board);
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

        setBoard(game.board);
    }

    const doPromotion = (piece) => {
        if (!promotionOptions) return;
        if (piece) {
            const { start, end } = promotionOptions;
            makeMove(start, end, piece);
        }
        setPromotionOptions(null);
    }

    const getPrevBoard = () => {
        const prevBoard = game.browseBoard(gameIndex-1, true);
        if (!prevBoard) return;
        playMoveSfx(prevBoard[2]); // play next move
        setGameIndex(prevIndex=>prevIndex-1);
        setBoard(prevBoard[0]);
    }

    const getNextBoard = () => {
        const nextBoard = game.browseBoard(gameIndex+1, true);
        if (!nextBoard) return;
        playMoveSfx(nextBoard[1]); // play prev move
        setGameIndex(prevIndex=>prevIndex+1);
        setBoard(nextBoard[0]);
    }

    const mouseMoveHandler = (e) => {
        const x = e.clientX;
        const y = e.clientY;
        setMousePos([x, y]);
    }

    const mouseUpHandler = e => {
        const dropCell = document.elementsFromPoint(mousePos[0], mousePos[1])[1];
        if (dropCell?.dataset?.pos && pieceSelected) {
            const newPos = dropCell.dataset.pos.split(",").map(c => Number(c));
            makeMove(pieceSelected.pos, newPos);
        }
        pieceSelected?.setIsPicked?.(false);
        setPieceSelected(null);
    }

    return (
        <>
            <div
                className="Board"
                onMouseMove={mouseMoveHandler}
                onMouseUp={mouseUpHandler}
            >
                {
                    [].concat(...board.map(
                        (row, i) => row.map(
                            (piece, j) => <Cell
                                className={i % 2 === j % 2 ? "white" : "black"}
                                piece={piece}
                                pieceSelected={pieceSelected}
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
            <input type="text" spellCheck={false} value={game.getFEN(gameIndex, true)} readOnly/>
            <br/>
            <button onClick={getPrevBoard}>Previous</button>
            <button onClick={getNextBoard}>Next</button>
        </>
    )
}

export default Board
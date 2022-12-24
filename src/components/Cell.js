import React from 'react';
import "../styles/Cell.css";
import chess_pieces from "../images/chess_pieces";

function Cell({ piece, className, pieceSelected, setPieceSelected, pos, makeMove }) {

    const mouseDownHandler = () => {
        setPieceSelected({piece, pos: [...pos]});
    }

    const mouseUpHandler = (e) => {
        if (!pieceSelected || !pos) return;
        console.log(pieceSelected, pos)
        makeMove(pieceSelected.pos, pos);
        setPieceSelected(null);
    }


    return (
        <div 
            className={`Cell ${className}`}
            onMouseUp={mouseUpHandler}
        >
            {piece? <img 
                src={chess_pieces[piece]} 
                alt={piece}
                draggable={false}
                onMouseDown={mouseDownHandler}
            />:null}
        </div>
    )
}

export default Cell
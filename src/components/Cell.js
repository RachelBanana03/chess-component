import React from 'react';
import "../styles/Cell.css";
import chess_pieces from "../images/chess_pieces";

function Cell({ piece, className }) {
    return (
        <div className={`Cell ${className}`}>
            {piece? <img 
                src={chess_pieces[piece]} 
                alt={piece}
                draggable={false}
            />:null}
        </div>
    )
}

export default Cell
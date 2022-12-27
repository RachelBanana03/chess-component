import React from 'react';
import "../styles/PromoteMenu.css";
import chess_pieces from "../images/chess_pieces";

const whitePieces = ["Q", "N", "R", "B"];
const blackPieces = ["q", "n", "r", "b"];

function PromoteMenu({ isWhite, isReversed }) {
    return (
        <div className={`PromoteMenu ${isReversed? "reversed":""}`}>
            {(isWhite? whitePieces: blackPieces).map(piece => <img 
                src={chess_pieces[piece]}
                alt={piece}
                draggable={false}
            />)}
        </div>
    )
}

export default PromoteMenu
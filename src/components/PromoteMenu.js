import React from 'react';
import "../styles/PromoteMenu.css";
import chess_pieces from "../images/chess_pieces";

const whitePieces = ["Q", "N", "R", "B"];
const blackPieces = ["q", "n", "r", "b"];

function PromoteMenu({ isWhite, isReversed, doPromotion }) {

    return (
        <div className={`PromoteMenu ${isReversed? "reversed":""}`}>
            {(isWhite? whitePieces: blackPieces).map((piece, i) => <img 
                key={piece+i}
                src={chess_pieces[piece]}
                alt={piece}
                draggable={false}
                onClick={() => doPromotion(piece)}
            />)}
        </div>
    )
}

export default PromoteMenu
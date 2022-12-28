import React, { useRef } from 'react';
import useOutsideClick from './hooks/useOutsideClick.hook';
import "../styles/PromoteMenu.css";
import chess_pieces from "../images/chess_pieces";

const whitePieces = ["Q", "N", "R", "B"];
const blackPieces = ["q", "n", "r", "b"];

function PromoteMenu({ isWhite, isReversed, doPromotion }) {
    const menuRef = useRef(null);
    useOutsideClick(doPromotion, menuRef);

    return (
        <div className={`PromoteMenu ${isReversed? "reversed":""}`} ref={menuRef}>
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
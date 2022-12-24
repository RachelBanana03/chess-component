import React, { useEffect, useRef, useState } from 'react';
import "../styles/Cell.css";
import chess_pieces from "../images/chess_pieces";

function Cell({ piece, className, pieceSelected, setPieceSelected, pos, makeMove, mousePos }) {
    const [isPicked, setIsPicked] = useState(false);
    const cellRef = useRef(null);
    const [cellPos, setCellPos] = useState(null);

    useEffect(() => {
        if (!cellRef?.current?.getBoundingClientRect || !mousePos) return;
        const cellRect = cellRef?.current?.getBoundingClientRect?.();
        setCellPos({
            left: mousePos?.[0] - cellRect?.left - 40,
            top: mousePos?.[1] - cellRect?.top - 40
        })
    },[mousePos]);

    const mouseDownHandler = (e) => {
        setPieceSelected({piece, pos: [...pos]});
        setIsPicked(true);
    }

    const mouseUpHandler = (e) => {
        if (!pieceSelected || !pos) return;
        makeMove(pieceSelected.pos, pos);
        setPieceSelected(null);
        setIsPicked(false);
    }

    return (
        <div 
            className={`Cell ${className}`}
            onMouseUp={mouseUpHandler}
            ref={cellRef}
        >
            {piece? <img 
                src={chess_pieces[piece]} 
                alt={piece}
                draggable={false}
                onMouseDown={mouseDownHandler}
                style={isPicked?cellPos:{}}
            />:null}
        </div>
    )
}

export default Cell
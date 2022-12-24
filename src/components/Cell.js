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
            top: mousePos?.[1] - cellRect?.top - 40,
            "z-index": "2"
        })
    },[mousePos]);

    const mouseDownHandler = (e) => {
        setPieceSelected({piece, pos: [...pos], setIsPicked});
        setIsPicked(true);
    }

    return (
        <div 
            data-pos={pos}
            className={`Cell ${className}`}
            ref={cellRef}
        >
            {piece? <img 
                data-pos={pos}
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
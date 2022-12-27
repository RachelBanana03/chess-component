import React, { useEffect, useRef, useState } from 'react';
import "../styles/Cell.css";
import chess_pieces from "../images/chess_pieces";
import PromoteMenu from './PromoteMenu';

function Cell({ piece, className, setPieceSelected, pos, mousePos }) {
    const [isPicked, setIsPicked] = useState(false);
    const cellRef = useRef(null);
    const [cellPos, setCellPos] = useState(null);

    useEffect(() => {
        if (!cellRef?.current?.getBoundingClientRect || !mousePos) return;
        const cellRect = cellRef?.current?.getBoundingClientRect?.();
        setCellPos({
            left: mousePos?.[0] - cellRect?.left - 40,
            top: mousePos?.[1] - cellRect?.top - 40,
            "zIndex": "2",
            "cursor": "grabbing"
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

            {pos[0]===0 && pos[1]===0? <PromoteMenu isWhite={true} isReversed={false}/>:null}
            {pos[0]===7 && pos[1]===7? <PromoteMenu isWhite={false} isReversed={true}/>:null}
        </div>
    )
}

export default Cell
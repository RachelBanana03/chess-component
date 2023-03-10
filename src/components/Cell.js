import React, { useEffect, useRef, useState } from 'react';
import "../styles/Cell.css";
import chess_pieces from "../images/chess_pieces";
import PromoteMenu from './PromoteMenu';

function Cell({ piece, className, setPieceSelected, pos, mousePos, promotionOptions, doPromotion }) {
    const [isPicked, setIsPicked] = useState(false);
    const cellRef = useRef(null);
    const [grabbedPieceStyle, setGrabbedPieceStyle] = useState(null);
    
    let promoCell = promotionOptions? promotionOptions.end: [-1, -1];

    useEffect(() => {
        // set positioning and style for grabbed piece
        if (!cellRef?.current?.getBoundingClientRect?.() || !mousePos) return;
        const cellRect = cellRef.current.getBoundingClientRect();
        setGrabbedPieceStyle({
            left: mousePos?.[0] - cellRect.left - cellRect.width/2,
            top: mousePos?.[1] - cellRect.top - cellRect.height/2,
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
                style={isPicked?grabbedPieceStyle:{}}
            />:null}

            {pos[0]===promoCell[0] && pos[1]===promoCell[1]? <PromoteMenu 
                isWhite={promotionOptions.isWhite} 
                isReversed={pos[0]===7}
                doPromotion={doPromotion}
            />:null}
        </div>
    )
}

export default Cell
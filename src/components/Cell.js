import React from 'react';
import "../styles/Cell.css";

function Cell({ piece, className }) {
    return (
        <div className={`Cell ${className}`}>{piece}</div>
    )
}

export default Cell
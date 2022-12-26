class Chess {
    #board;
    #moves;
    #isWhiteTurn;
    #enPassantPos;
    #canCastle;
    #kingPos;
    // 50-move rule
    // draw by repetition
    // is in check

    constructor(notation) {
        if (!notation) {
            this.#board = Array.from({length:8}, ()=>Array.from({length:8}, ()=>null));
            this.#board[0] = ["r", "n", "b", "q", "k", "b", "n" ,"r"];
            this.#board[1] = ["p", "p", "p", "p", "p", "p", "p", "p"];
            this.#board[6] = ["P", "P", "P", "P", "P", "P", "P", "P"];
            this.#board[7] = ["R", "N", "B", "Q", "K", "B", "N", "R"];
            this.#moves = [];
            this.#isWhiteTurn = true;
            this.#enPassantPos = null;
            this.#canCastle = {
                "k": [true, true], // queenside, kingside
                "K": [true, true]
            }
            this.#kingPos = {
                "k": [0, 4],
                "K": [7, 4]
            }
        }
    }

    static moveSets = {
        "n": {
            directions: [[1, 2],[2, 1],[2, -1],[1, -2],[-1, -2],[-2, -1],[-2, 1],[-1, 2]],
            longRange: false
        },
        "b": {
            directions: [[1, 1],[1, -1],[-1, -1],[-1, 1]],
            longRange: true
        },
        "r": {
            directions: [[0, 1],[1, 0],[0, -1],[-1, 0]],
            longRange: true
        },
        "q": {
            directions: [
                [0, 1],[1, 0],[0, -1],[-1, 0],
                [1, 1],[1, -1],[-1, -1],[-1, 1]
            ],
            longRange: true
        },
        "k": {
            directions: [
                [0, 1],[1, 0],[0, -1],[-1, 0],
                [1, 1],[1, -1],[-1, -1],[-1, 1]
            ],
            longRange: false
        }
    };

    static inBoard(...positions) {
        return [].concat(...positions).every(i=> i>=0 && i<8);
    }

    static isWhite(piece) {
        return /[PNBRQK]/.test(piece);
    }

    static isFEN(str) {

    }

    static isPGN(str) {
        
    }

    #isAttacked(pos, attackerIsWhite, board) {
        for (let i=0; i<8; i++) {
            for (let j=0; j<8; j++) {
                const piece = board[i][j];
                if (!piece || Chess.isWhite(piece)!==attackerIsWhite) continue;
                const possibleMoves = this.#possibleMoves(piece, [i,j], board);
                if (possibleMoves.some(p=>p[0]===pos[0] && p[1]===pos[1])) return true;
            }
        }
        return false;
    }

    toString() {
        return this.#board.map(row=>"|" + row.map(piece=> piece??"_").join("|") + "|").join("\n");
    }

    get board() {
        return this.#board.map(row => row.slice());
    }

    get turn() {
        return this.#isWhiteTurn? "white": "black";
    }

    move(start, end) {
        const newBoard = this.board;
        const moveSymbol = this.isLegal(start, end, newBoard);
        if (!moveSymbol) return false;
        const piece = newBoard[start[0]][start[1]];

        // ==Mutates only Temporary Board==
        // if castling, move rook
        if (moveSymbol===ChessSymbols.CASTLE) {
            // queenside
            if (end[1]<start[1]) {
                const rookPiece = newBoard[start[0]][0];
                newBoard[start[0]][0] = null;
                newBoard[start[0]][3] = rookPiece;
                // adjust for imprecise king move
                end[1] = 2;
            } else {
                // kingside
                const rookPiece = newBoard[start[0]][7];
                newBoard[start[0]][7] = null;
                newBoard[start[0]][5] = rookPiece;
            }
        }

        // make move
        newBoard[start[0]][start[1]] = null;
        newBoard[end[0]][end[1]] = piece;

        // if en passant, clears en passant position
        if (moveSymbol===ChessSymbols.EN_PASSANT) {
            newBoard[this.#enPassantPos[0]][this.#enPassantPos[1]] = null;
        }

        //check if king is attacked in new pos
        const newKingPos = piece.toLowerCase()==="k"? end: this.#kingPos[Chess.isWhite(piece)? "K": "k"];
        if (this.#isAttacked(newKingPos, !this.#isWhiteTurn, newBoard)) return false;

        // ==Edit Actual States==
        this.#board = newBoard;
        this.#moves.push([start, end]);
        this.#isWhiteTurn = !this.#isWhiteTurn;

         // if king moves, change kingPos and remove castling right
         if (piece.toLowerCase()==="k") {
            this.#kingPos[piece] = end;
            this.#canCastle[piece] = [false, false];
        }

        // if rook moves, remove specific castling right
        if (piece.toLowerCase()==="r") {
            // black
            if (start[0]===0) {
                if (start[1]===0) {
                    // queenside
                    this.#canCastle["k"][0] = false;
                } else if (start[1]===7) {
                    // kingside
                    this.#canCastle["k"][1] = false;
                }
            } else if (start[0]===7) {
                // white
                if (start[1]===0) {
                    //queenside
                    this.#canCastle["K"][0] = false;
                } else if (start[1]===7) {
                    // kingside
                    this.#canCastle["K"][1] = false;
                }
            }
        }

        // if pawn advances by two, add end pos, else toggle null
        this.#enPassantPos = moveSymbol===ChessSymbols.ADVANCE? end: null;

        return moveSymbol;
    }

    #possibleMoves(piece, start, board) {
        const moves = [];

        // if piece is pinned
        // if in checked
        // if move causes a check

        // if pawn, different rules
        if (piece.toLowerCase()==="p") {
            const [direction, startRank] = piece==="P"? [-1, 6]: [1, 1];
            // forward direction
            let curPos = [start[0]+direction, start[1]];
            // if forward pos is not in board 
            if (!Chess.inBoard(curPos)) return moves;
            // if forward pos doesn't have piece
            if (!board[curPos[0]][curPos[1]]) {
                moves.push([...curPos, ChessSymbols.MOVE]);
                // if pawn at second/seventh rank
                if (start[0] === startRank) {
                    curPos = [curPos[0]+direction, curPos[1]];
                    if (!board[curPos[0]][curPos[1]]) {
                        moves.push([...curPos, ChessSymbols.ADVANCE]);
                    }
                }
            }
            
            for (const horizontal of [1,-1]) {
                // captures
                curPos = [start[0]+direction,start[1]+horizontal];
                if (!Chess.inBoard(curPos)) continue;
                const opponent = board[curPos[0]][curPos[1]];
                // if opponent exists and is not same color as self
                if (opponent && Chess.isWhite(opponent)!==Chess.isWhite(piece)) {
                    moves.push([...curPos, ChessSymbols.CAPTURE]);
                }

                // en passant
                const passPos = [start[0], start[1]+horizontal];
                if (
                    this.#enPassantPos && 
                    this.#enPassantPos[0]===passPos[0] &&
                    this.#enPassantPos[1]===passPos[1]
                ) {
                    moves.push([...curPos, ChessSymbols.EN_PASSANT]);
                }
            }
            // promotion?

            return moves;
        }

        // all pieces except pawns
        const {directions, longRange} = Chess.moveSets[piece.toLowerCase()];
        for (const dir of directions) {
            let curPos = start;
            do {
                curPos = [curPos[0] + dir[0], curPos[1] + dir[1]];
                // if position is not in board
                if (!Chess.inBoard(curPos)) break;

                // if position has piece of same color
                const opponent = board[curPos[0]][curPos[1]];
                if (opponent && Chess.isWhite(opponent) === Chess.isWhite(piece)) break;

                moves.push([...curPos, opponent? ChessSymbols.CAPTURE: ChessSymbols.MOVE]);

                // if position already has a blockade
                if (opponent) break;
            } while (longRange)
        }

        // castling (allow unprecise king move)
        if (piece.toLowerCase()==="k") {
            // queenside castling 
            if (this.#canCastle[piece][0]) {
                moves.push(
                    [start[0], 1, ChessSymbols.CASTLE],
                    [start[0], 2, ChessSymbols.CASTLE]
                );
            }
            // kingside castling
            if (this.#canCastle[piece][1]) {
                moves.push([start[0], 6, ChessSymbols.CASTLE]);
            }
        }

        return moves;
    }

    isLegal(start, end, board) {
        // check if positions are in board
        if (!Chess.inBoard(start, end)) return false;
        // if start and end are the same
        if (start[0]===end[0] && start[1]===end[1]) return false;
        const piece = board[start[0]][start[1]];
        // if there is no piece or if piece does not belong to player
        if (!piece || Chess.isWhite(piece) !== this.#isWhiteTurn) return false;
        // if end is own piece
        const opponent = board[end[0]][end[1]];
        if (opponent && Chess.isWhite(opponent) === this.#isWhiteTurn) return false;
        // check if piece moveset can move to end legally
        const possibleMoves = this.#possibleMoves(piece, start, board);
        
        for (const possibleMove of possibleMoves) {
            if (possibleMove[0]!==end[0] || possibleMove[1]!==end[1]) continue;
            return possibleMove[2];
        }

        return false;
    }
}

const ChessSymbols = {
    MOVE: Symbol(0),
    CAPTURE: Symbol(1),
    CHECK: Symbol(2),
    CASTLE: Symbol(3),
    ADVANCE: Symbol(4), //pawn's two-square advance
    EN_PASSANT: Symbol(5),
    PROMOTE: Symbol(6),
    CHECKMATE: Symbol(7)
}

export default Chess;
export { ChessSymbols };
// !!! bugs: capturing a corner rook doesn't turn castling off

class Chess {
    #board;
    #moves;
    #isWhiteTurn;
    #enPassantPos;
    #canCastle;
    #kingPos;
    #halfmoveClock;
    #fullmoveNum;
    // 50-move rule
    // draw by repetition

    constructor(notation) {
        this.createBoard(notation);
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
        if (!str || typeof str!=="string") return false;

        // 6 fields
        const fields = str.split(" ");
        if (fields.length !== 6) return false;
        const [boardFen, turn, castling, enpassant, halfmove, fullmove] = fields;

        // 2nd: turn
        // w or b
        if (turn!=="w" && turn!=="b") return false;

        // 3rd: castling
        // KQkq in order or -
        if (castling!=="-" && !/^K?Q?k?q?$/.test(castling)) return false;
        
        // 4th: en passant
        // coordinate (only 3rd or 6th ranks) or -
        if (enpassant!=="-" && !/^[a-h][36]$/.test(enpassant)) return false;

        // 5th: half moves (digits)
        // 6th full moves (digits)
        if (!/^\d+$/.test(halfmove) || !/^\d+$/.test(fullmove)) return false;

        // 1st: board
        const board = boardFen.split("/");
        // 8 ranks
        if (board.length !== 8) return false;
        const pieceCounter = {
            k: 0,
            K: 0,
            p: 0,
            P: 0,
            black: 0,
            white: 0
        }
        for (const rank of board) {
            let fileCount = 0;
            let lastCharWasDigit = false;
            for (const c of rank) {
                if (/[1-8]/.test(c)) {
                    // check if consecutive digits
                    if (lastCharWasDigit) return false;
                    lastCharWasDigit = true;
                    // empty space
                    fileCount += Number(c);
                } else if (/[PNBRQK]/i.test(c)) {
                    lastCharWasDigit = false;
                    // a piece
                    fileCount += 1;
                    pieceCounter[Chess.isWhite(c)? "white": "black"] += 1;
                    if (/[KP]/i.test(c)) pieceCounter[c] += 1;
                } else {
                    // invalid character
                    return false;
                }
            }

            // 8 files
            if (fileCount !== 8) return false;
        }

        // one king
        // at most 8 pawns per side
        // at most 16 pieces per side
        return pieceCounter["k"] === 1 && 
            pieceCounter["K"] === 1 &&
            pieceCounter["p"] <= 8 &&
            pieceCounter["P"] <= 8 &&
            pieceCounter["white"] <= 16 &&
            pieceCounter["black"] <= 16;
    }

    static isPGN(str) {
        
    }

    static toNotation(pos) {
        return "abcdefgh"[pos[1]] + (8-pos[0]);
    }

    static toPos(notation) {
        return [8-Number(notation[1]), "abcdefgh".indexOf(notation[0])];
    }

    // internal to board, doesn't check for valid fen or return states
    // createBoard should be used on a new Chess instance for external fen-to-board
    static #toBoard(fen) {
        let board = fen.split(" ")[0].split("/");
        board = board.map(str => {
            const rank = [...str.replace(/\d/g, x=>" ".repeat(Number(x)))];
            return rank.map(c=>c===" "? null: c);
        });
        return board;
    }

    browseBoard(index, reversed=false) {
        index = reversed? this.#moves.length-1+index: index;
        if (index<0 || index>=this.#moves.length) return false;
        const [fen, prevMoveSymbol] = this.#moves[index];
        const nextMoveSymbol = this.#moves[index+1]?.[1] || null;
        return [Chess.#toBoard(fen), prevMoveSymbol, nextMoveSymbol];
    }

    createBoard(notation) {
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
            this.#halfmoveClock = 0;
            this.#fullmoveNum = 1;

            this.#moves.push([this.#toFEN(), null]);
            return true;
        }
        if (Chess.isFEN(notation)) {
            const [boardFen, turn, castling, enpassant, halfmove, fullmove] = notation.split(" ");
            this.#board = Chess.#toBoard(boardFen);
            this.#moves = [];
            this.#isWhiteTurn = turn === "w";

            if (enpassant==="-") {
                this.#enPassantPos = null;
            } else {
                const epPos = Chess.toPos(enpassant);
                this.#enPassantPos = [epPos[0]===5? 4: 3, epPos[1]];
            }

            this.#canCastle = {
                "k": [castling.includes("q"), castling.includes("k")],
                "K": [castling.includes("Q"), castling.includes("K")]
            };
            this.#kingPos = {
                "k": [0, 4],
                "K": [7, 4]
            }
            for (let i=0; i<8; i++) {
                for (let j=0; j<8; j++) {
                    const piece = this.#board[i][j];
                    if (piece && piece.toLowerCase()==="k") {
                        this.#kingPos[piece] = [i, j];
                    }
                }
            }
            this.#halfmoveClock = Number(halfmove);
            this.#fullmoveNum = Number(fullmove);

            this.#moves.push([this.#toFEN(), null]);

            return true;
        }
        return false;
    }

    #toFEN() {
        // describe board
        let fen = this.#board.map(rank=>{
            let count = 0;
            let rankFen = "";
            for (const piece of rank) {
                if (piece) {
                    rankFen += count? count+piece: piece;
                    count = 0;
                } else {
                    count++;
                }
            }
            if (count) rankFen += count;
            return rankFen;
        }).join("/");

        // add states
        const turn = this.#isWhiteTurn? "w": "b";
        const castlingRights = [
            this.#canCastle["K"][1]? "K": "",
            this.#canCastle["K"][0]? "Q": "",
            this.#canCastle["k"][1]? "k": "",
            this.#canCastle["k"][0]? "q": ""
        ].join("") || "-";
        const enPassantTarget = this.#enPassantPos? Chess.toNotation([
            this.#enPassantPos[0]===4? 5:2, // fen ep position is one square behind pawn
            this.#enPassantPos[1]
        ]): "-";

        return [fen, turn, castlingRights, enPassantTarget, this.#halfmoveClock, this.#fullmoveNum].join(" ");
    }

    getFEN(index = 0, reversed = true) {
        index = reversed? this.#moves.length-1+index: index;
        if (index<0 || index>=this.#moves.length) return false;
        return this.#moves[index][0];
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

    move(start, end, forwardCheck=false, promotePiece=null) {
        const newBoard = this.board;
        let moveSymbol = this.isLegal(start, end, newBoard);
        if (!moveSymbol) return false;
        const piece = newBoard[start[0]][start[1]];

        // ==Mutates only Temporary Board==
        // if castling
        if (moveSymbol===ChessSymbols.CASTLE) {
            // if king is under attack, disable castling
            if (this.#isAttacked(start, !Chess.isWhite(piece), newBoard)) {
                return false;
            }

            // check if king is castling through check
            // else, move castling rook
            if (end[1]<start[1]) {
                // queenside
                if (this.#isAttacked([start[0], 3], !Chess.isWhite(piece), newBoard)) {
                    return false;
                }

                const rookPiece = newBoard[start[0]][0];
                newBoard[start[0]][0] = null;
                newBoard[start[0]][3] = rookPiece;
                // adjust for imprecise king move
                end[1] = 2;
            } else {
                // kingside
                if (this.#isAttacked([start[0], 5], !Chess.isWhite(piece), newBoard)) {
                    return false;
                }

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

        // check if king is attacked in new pos
        const newKingPos = piece.toLowerCase()==="k"? end: this.#kingPos[Chess.isWhite(piece)? "K": "k"];
        if (this.#isAttacked(newKingPos, !this.#isWhiteTurn, newBoard)) return false;

        // return without editing anything
        if (forwardCheck) return moveSymbol;

        // check for promotion
        if (moveSymbol===ChessSymbols.CAN_PROMOTE) {
            // check if promote piece is legit
            if (!promotePiece) return moveSymbol;
            if (Chess.isWhite(promotePiece)!==Chess.isWhite(piece) || 
                !/[NBRQ]/i.test(promotePiece)) return false;

            // change piece at board to promote piece
            newBoard[end[0]][end[1]] = promotePiece;
            moveSymbol = ChessSymbols.PROMOTE;
        }

        // ==Edit Actual States==
        this.#board = newBoard;
        // if black's turn, increment fullmove
        if (!this.#isWhiteTurn) this.#fullmoveNum++;
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

        // if piece is pawn, or a capture is performed, reset halfmove clock
        if (piece.toLowerCase()==="p" || moveSymbol===ChessSymbols.CAPTURE) {
            this.#halfmoveClock = 0;
        } else {
            this.#halfmoveClock++;
            // 50-move draw?
        }

        // ==Checks and Mates | Record fen/symbol==
        // if opponent king is checked, check if checkmate and return check symbol
        const opponentKingPos = this.#kingPos[Chess.isWhite(piece)? "k": "K"];
        if (this.#isAttacked(opponentKingPos, Chess.isWhite(piece), this.#board)) {
            // check if checkmate
            // for each possible opponent move, 
            let notCheckmate = false;
            for (let i=0; i<8; i++) {
                for (let j=0; j<8; j++) {
                    const opponentPiece = this.#board[i][j];
                    // if not opponent piece, skip
                    if (!opponentPiece || Chess.isWhite(piece)===Chess.isWhite(opponentPiece)) continue;
                    // try making a move, break if a move exists
                    const possibleMoves = this.#possibleMoves(opponentPiece, [i,j], this.#board);
                    for (const possibleMove of possibleMoves) {
                        const newSymbol = this.move([i,j], possibleMove.slice(0,2), true);
                        if (newSymbol) {
                            notCheckmate = true;
                            break;
                        }
                    }
                    if (notCheckmate) break;
                }
                if (notCheckmate) break;
            }

            // else change to check symbol
            moveSymbol = notCheckmate? ChessSymbols.CHECK: ChessSymbols.CHECKMATE;
        }

        // record fen and moveSymbol
        this.#moves.push([this.#toFEN(), moveSymbol]);
        return moveSymbol;
    }

    #possibleMoves(piece, start, board) {
        const moves = [];
        // stalemate?

        // if pawn, different rules
        if (piece.toLowerCase()==="p") {
            const [direction, startRank, endRank] = piece==="P"? [-1, 6, 0]: [1, 1, 7];
            // forward direction
            let curPos = [start[0]+direction, start[1]];
            // if forward pos is not in board 
            if (!Chess.inBoard(curPos)) return moves;
            // if forward pos doesn't have piece
            if (!board[curPos[0]][curPos[1]]) {
                // if pawn can promote
                const moveSymbol = curPos[0] === endRank? ChessSymbols.CAN_PROMOTE: ChessSymbols.MOVE;
                moves.push([...curPos, moveSymbol]);
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
                    // if pawn can promote
                    const moveSymbol = curPos[0] === endRank? ChessSymbols.CAN_PROMOTE: ChessSymbols.CAPTURE;
                    moves.push([...curPos, moveSymbol]);
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
                // !! check if path is clear
                const queensidePath = board[start[0]].slice(1,4);
                if (!queensidePath.some(piece=>piece)) {
                    moves.push(
                        [start[0], 1, ChessSymbols.CASTLE],
                        [start[0], 2, ChessSymbols.CASTLE]
                    );
                }
            }
            // kingside castling
            if (this.#canCastle[piece][1]) {
                // !! check if path is clear
                const kingsidePath = board[start[0]].slice(5,7);
                if (!kingsidePath.some(piece=>piece)) {
                    moves.push([start[0], 6, ChessSymbols.CASTLE]);
                }
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
    CAN_PROMOTE: Symbol(6),
    PROMOTE: Symbol(7),
    CHECKMATE: Symbol(8),
    DRAW: Symbol(9)
}

export default Chess;
export { ChessSymbols };
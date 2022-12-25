class Chess {
    #board;
    #moves;
    #turn;
    // 50-move rule
    // castling
    // en passant
    // is in check

    constructor(notation) {
        if (!notation) {
            this.#board = Array.from({length:8}, ()=>Array.from({length:8}, ()=>null));
            this.#board[0] = ["r", "n", "b", "q", "k", "b", "n" ,"r"];
            this.#board[1] = ["p", "p", "p", "p", "p", "p", "p", "p"];
            this.#board[6] = ["P", "P", "P", "P", "P", "P", "P", "P"];
            this.#board[7] = ["R", "N", "B", "Q", "K", "B", "N", "R"];
            this.#moves = [];
            this.#turn = true;
        }
    }

    static moveSets = {
        "n": {
            moves: [[1, 2],[2, 1],[2, -1],[1, -2],[-1, -2],[-2, -1],[-2, 1],[-1, 2]],
            longRange: false
        },
        "b": {
            moves: [[1, 1],[1, -1],[-1, -1],[-1, 1]],
            longRange: true
        },
        "r": {
            moves: [[0, 1],[1, 0],[0, -1],[-1, 0]],
            longRange: true
        },
        "q": {
            moves: [
                [0, 1],[1, 0],[0, -1],[-1, 0],
                [1, 1],[1, -1],[-1, -1],[-1, 1]
            ],
            longRange: true
        },
        "k": {
            moves: [
                [0, 1],[1, 0],[0, -1],[-1, 0],
                [1, 1],[1, -1],[-1, -1],[-1, 1]
            ],
            longRange: false
        }
    };

    static isFEN(str) {

    }

    static isPGN(str) {
        
    }

    toString() {
        return this.#board.map(row=>"|" + row.map(piece=> piece??"_").join("|") + "|").join("\n");
    }

    get board() {
        return this.#board.map(row => row.slice());
    }

    get turn() {
        return this.#turn? "black": "white";
    }

    move(start, end) {
        if (!this.isLegal(start, end)) return false;
        const piece = this.#board[start[0]][start[1]];
        // if piece is pawn and en passant piece is close

        // make move
        this.#board[start[0]][start[1]] = null;
        this.#board[end[0]][end[1]] = piece;
        this.#moves.push([start, end]);
        this.#turn = !this.#turn;
        return true;
    }

    #possibleMoves(piece, start, end) {
        // if pawn, different rules
        // also castling?

        //
        const {moves, longRange} = Chess.moveSets[piece.toLowerCase()];
    }

    isLegal(start, end) {
        // check if positions are in board
        if ([...start, ...end].some(i=> i<0 || i>7)) return false;
        // if start and end are the same
        if (start[0]===end[0] && start[1]===end[1]) return false;
        const piece = this.#board[start[0]][start[1]];
        // if there is no piece or if piece does not belong to player
        if (!piece || /[PNBRQK]/.test(piece) !== this.#turn) return false;
        // if end is own piece
        const opponent = this.#board[end[0]][end[1]];
        if (opponent && /[PNBRQK]/.test(opponent) === this.#turn) return false;
        
        // check if piece moveset can move to end legally
        // check if path is blocked
        // if the move cause own king to be checked// if there's a need to stop check
        return true;
    }
}

export default Chess;
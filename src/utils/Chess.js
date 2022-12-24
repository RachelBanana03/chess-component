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

    isLegal(start, end) {
        // check if positions are in board
        if ([...start, ...end].some(i=> i<0 || i>7)) return false;
        const piece = this.#board[start[0]][start[1]];
        // if there is no piece or if piece does not belong to player
        if (!piece || /[PNBRQK]/.test(piece) !== this.#turn) return false;
        // check if piece moveset can move to end legally
        // check if path is blocked
        // if end is own piece
        // if the move cause own king to be checked
        return true;
    }
}

export default Chess;
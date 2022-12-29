import Chess from "../utils/Chess";

describe("isFen", ()=> {
    it("Should return false for wrong types and empty strings", () => {
        const invalids = [undefined, null, 123, Symbol(), [], ""];
        for (const invalid of invalids) {
            expect(Chess.isFEN(invalid)).toEqual(false);
        }
    });

    it("Should return false for missing fields", () => {
        const invalids = [
            "w KQkq - 0 1",
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR KQkq - 0 1",
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - 0 1",
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 0 1",
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 1",
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0"
        ];
        for (const invalid of invalids) {
            expect(Chess.isFEN(invalid)).toEqual(false);
        }
    });

    it("Should work on basic fens", () => {
        const fens = [
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // start
            "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
            "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
            "rnbqkbnr/pp1ppppp/8/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2",
            "6k1/qqqqqqqq/8/QQQQQQQQ/3K4/8/8/8 w - - 0 1", // promoted queens
            "8/3k4/8/8/3K4/8/8/8 w - - 0 1" // kings left
        ];
        for (const fen of fens) {
            expect(Chess.isFEN(fen)).toEqual(true);
        }
    });

    it("Should return false on incorrect rank counts", () => {
        const invalidFens = [
            "rnbqkbnr/pppppppp/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1"
        ]
        for (const invalidFen of invalidFens) {
            expect(Chess.isFEN(invalidFen)).toEqual(false);
        }
    });

    it("Should return false on incorrect file counts", () => {
        const invalidPieces = [
            "rnbqkbnr/pppppppp/7/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "rnbqkbnrp/ppppppp/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "rnbqkbnr/pppppppp/8/8/8//PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "rnbqkbnr/pppppppp/8/8/8//8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        ];
        for (const invalidPiece of invalidPieces) {
            expect(Chess.isFEN(invalidPiece)).toEqual(false);
        }
    })

    it("Should return false on invalid symbols/digits", () => {
        const invalidSymbols = [
            "rnbqkbnr/pppppppt/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "rnbqkbnr/pppppppp/8/8/8/08/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNS w KQkq - 0 1"
        ]
        for (const invalidSymbol of invalidSymbols) {
            expect(Chess.isFEN(invalidSymbol)).toEqual(false);
        }
    });

    it("Should return false for consecutive digits in board", () => {
        const consecutiveDigits = [
            "rnbqkbnr/pppppppt/8/8/8/44/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "rnbqk11r/pppppppt/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        ];
        for (const consecutiveDigit of consecutiveDigits) {
            expect(Chess.isFEN(consecutiveDigit)).toEqual(false);
        }
    });

    it("Should return false if incorrect king counts", () => {
        const incorrectKingCounts = [
            "8/2k1k3/8/8/8/2K5/8/8 w - - 0 1",
            "8/8/8/8/8/2K5/8/8 w - - 0 1",
            "K7/8/8/3k4/8/8/8/7K w - - 0 1",
            "8/8/8/8/8/8/8/8 w - - 0 1"
        ];
        for (const incorrectKingCount of incorrectKingCounts) {
            expect(Chess.isFEN(incorrectKingCount)).toEqual(false);
        }
    });

    it("Should return false if pawn counts exceed 8 per side", () => {
        const incorrectPawnCounts = [
            "1k6/p1p1p1p1/1p1p1p1p/8/8/1P1P1PPP/P1P1P1P1/1K6 w - - 0 1",
            "1k6/pppppppp/p3p3/8/8/1P1P1P1P/P1P1P1P1/1K6 w - - 0 1"
        ];
        for (const incorrectPawnCount of incorrectPawnCounts) {
            expect(Chess.isFEN(incorrectPawnCount)).toEqual(false);
        }
    });

    it("Should work for different pieces counts within limit", () => {
        const validFens = [
            "rkn1q1nr/pppnnppp/2b2b2/8/2B5/1PNPBPNP/P1P1P1P1/RK3Q1R w - - 0 1",
            "rkn1qQnr/pppnnppp/1QbQQb2/5QQQ/2B5/2N1B1N1/Q7/RK3Q1R w - - 0 1"
        ];
        for (const validFen of validFens) {
            expect(Chess.isFEN(validFen)).toEqual(true);
        }
    });

    it("Should return false for pieces counts  more than 16 per side", () => {
        const invalidPiecesCounts = [
            "rkn1q1nr/pppnnppp/2b2bp1/8/2B5/1PNPBPNP/P1P1P1P1/RK3Q1R w - - 0 1",
            "rkn1qQnr/pppnnppp/1QbQQb2/Q4QQQ/2B5/2N1B1N1/Q7/RK3Q1R w - - 0 1"
        ];
        for (const invalidPiecesCount of invalidPiecesCounts) {
            expect(Chess.isFEN(invalidPiecesCount)).toEqual(false);
        }
    });

    it("Should return false on wrong fields symbols", () => {
        const invalidFields = [
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR W KQkq - 0 1",
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR wb KQkq - 0 1",
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w pppp - 0 1",
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0.0 1",
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq e1 0 1",
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0.0"
        ]
        for (const invalidField of invalidFields) {
            expect(Chess.isFEN(invalidField)).toEqual(false);
        }
    });

    it("Should return false on incorrect castling orders", () => {
        const invalidCastlings = [
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kqKQ - 0 1",
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w qK - 0 1"
        ]
        for (const invalidCastling of invalidCastlings) {
            expect(Chess.isFEN(invalidCastling)).toEqual(false);
        }
    });

    it("Should return false if invalid en passant location", () => {
        const invalidEnPassants = [
            "rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq d2 0 3",
            "rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq i6 0 3"
        ]
        for (const invalidEnPassant of invalidEnPassants) {
            expect(Chess.isFEN(invalidEnPassant)).toEqual(false);
        }
    });
})
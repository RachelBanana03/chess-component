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
    })

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
    })
})
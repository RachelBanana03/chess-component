import './App.css';
import Board from './components/Board';

function App() {
  return (
    <div className="App">
      {/* <Board width="720px" height="720px">rnbqkbnr/pppp2pp/5p2/4p3/4PP2/8/PPPP2PP/RNBQKBNR w KQkq - 0 3</Board> */}
      <Board>
        {`[Event "?"]
        [Site "?"]
        [Date "????.??.??"]
        [Round "?"]
        [White "?"]
        [Black "?"]
        [Result "*"]
        [FEN "r2qk2r/pPpp3p/1p3n2/3PN3/8/nPP1R3/P5KP/3Q4 b kq - 0 1"]
        [SetUp "1"]

        1...Nc2 ( 1...O-O 2.Rg3+ Kh8 3.Qd2 ( 3.Qc1 $4 Ng8 ) ( 3.Qd4 d6 4.Nc6 Qe8 )
        3...Qe8 ( 3...Nh5 4.Qd4 Ng7 5.Nc6 Qf6 ( 5...Rg8 6.Nxd8 Raxd8 ) 6.Qxf6 Rxf6
        7.bxa8=Q+ Ne8 8.Qxe8+ Rf8 9.Qxf8# ) ( 3...Ng8 4.Qd4 ) 4.Qg5 Nh5 5.bxa8=Q
        { win line } 5...Qxa8 ) 2.Qxc2 Nxd5 3.Nc6+ ( 3.Re4 O-O 4.Rg4+ ( 4.Qd2 Nf6 )
        4...Kh8 5.Qd2 { draw } 5...Nf6 6.Rg3 Qe8 7.Qg5 Nh5 8.bxa8=Q Qxa8+ 9.Rf3 ) *`}
      </Board>
    </div>
  );
}

export default App;

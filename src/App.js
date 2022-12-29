import './App.css';
import Board from './components/Board';

function App() {
  return (
    <div className="App">
      <Board width="720px" height="720px">rnbqkbnr/pppp2pp/5p2/4p3/4PP2/8/PPPP2PP/RNBQKBNR w KQkq - 0 3</Board>
      <Board/>
    </div>
  );
}

export default App;

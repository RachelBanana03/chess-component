import './App.css';
import Board from './components/Board';

function App() {
  return (
    <div className="App">
      <Board width="720px" height="720px"/>
      <Board/>
    </div>
  );
}

export default App;

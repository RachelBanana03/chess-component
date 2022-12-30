import './App.css';
import Board from './components/Board';

function App() {
  return (
    <div className="App">
      {/* <Board width="720px" height="720px">rnbqkbnr/pppp2pp/5p2/4p3/4PP2/8/PPPP2PP/RNBQKBNR w KQkq - 0 3</Board> */}
      <Board>
        {`[Event "FIDE World Chess Championship 2021"]
[Site "?"]
[Date "2021.12.03"]
[Round "6"]
[White "Carlsen, Magnus"]
[Black "Nepomniachtchi, Ian"]
[Result "1-0"]
[Annotator "samsh"]
[BlackElo "2782"]
[ECO "D02"]
[EventDate "2021.??.??"]
[SourceVersionDate "2021.12.03"]
[WhiteElo "2855"]

1.d4 Nf6 2.Nf3 d5 3.g3 e6 4.Bg2 Be7 5.O-O O-O 6.b3 c5 7.dxc5 Bxc5 8.c4 dxc4
9.Qc2 Qe7 10.Nbd2 Nc6 11.Nxc4 b5 12.Nce5 Nb4 13.Qb2 Bb7 14.a3 Nc6 15.Nd3 Bb6
16.Bg5 Rfd8 17.Bxf6 gxf6 18.Rac1 Nd4 19.Nxd4 Bxd4 20.Qa2 Bxg2 21.Kxg2 Qb7+
22.Kg1 Qe4 23.Qc2 a5 24.Rfd1 Kg7 25.Rd2 Rac8 26.Qxc8 Rxc8 27.Rxc8 Qd5 28.b4
a4 29.e3 Be5 30.h4 h5 31.Kh2 Bb2 32.Rc5 Qd6 33.Rd1 Bxa3 34.Rxb5 Qd7 35.Rc5 e5
36.Rc2 Qd5 37.Rdd2 Qb3 38.Ra2 e4 39.Nc5 Qxb4 40.Nxe4 Qb3 41.Rac2 Bf8 42.Nc5
Qb5 43.Nd3 a3 44.Nf4 Qa5 45.Ra2 Bb4 46.Rd3 Kh6 47.Rd1 Qa4 48.Rda1 Bd6 49.Kg1
Qb3 50.Ne2 Qd3 51.Nd4 Kh7 52.Kh2 Qe4 53.Rxa3 Qxh4+ 54.Kg1 Qe4 55.Ra4 Be5
56.Ne2 Qc2 57.R1a2 Qb3 58.Kg2 Qd5+ 59.f3 Qd1 60.f4 Bc7 61.Kf2 Bb6 62.Ra1 Qb3
63.Re4 Kg7 64.Re8 f5 65.Raa8 Qb4 66.Rac8 Ba5 67.Rc1 Bb6 68.Re5 Qb3 69.Re8 Qd5
70.Rcc8 Qh1 71.Rc1 Qd5 72.Rb1 Ba7 73.Re7 Bc5 74.Re5 Qd3 75.Rb7 Qc2 76.Rb5 Ba7
77.Ra5 Bb6 78.Rab5 Ba7 79.Rxf5 Qd3 80.Rxf7+ Kxf7 81.Rb7+ Kg6 82.Rxa7 Qd5
83.Ra6+ Kh7 84.Ra1 Kg6 85.Nd4 Qb7 86.Ra2 Qh1 87.Ra6+ Kf7 88.Nf3 Qb1 89.Rd6
Kg7 90.Rd5 Qb2+ 91.Rd2 Qb1 92.Re2 Qb6 93.Rc2 Qb1 94.Nd4 Qh1 95.Rc7+ Kf6
96.Rc6+ Kf7 97.Nf3 Qb1 98.Ng5+ $6 { 0.00/58 } ( 98.Ne1 { +0.41/49 } 98...Qb2+
99.Rc2 Qb1 100.Rd2 Qb4 101.Re2 Qe4 102.Nf3 Kf6 103.Nd4 Qd3 104.Rb2 Qd1
105.Rb5 Kg6 106.Re5 Kf6 107.Rg5 Qh1 108.Nf3 Qc1 109.Ng1 Qd1 110.Rc5 Kf7
111.Ne2 Qh1 112.Rc1 Qh3 113.Rg1 Kg6 114.Nd4 Kf6 115.Nf3 Qc8 116.Rd1 Qc2+
117.Rd2 Qc6 118.Nd4 Qc5 119.Rd1 Qa3 120.Nf3 Qc3 121.e4 Qc2+ 122.Rd2 Qxe4 )
98...Kg7 $6 { +0.41/60 } ( 98...Ke7 { 0.00/58 } 99.Re6+ Kd7 100.Kf3 Qh1+
101.Ke2 Qg2+ 102.Kd3 Qd5+ 103.Kc3 Qc5+ 104.Kb3 Qb5+ 105.Kc2 Qc5+ ) 99.Ne6+
Kf7 100.Nd4 Qh1 101.Rc7+ Kf6 102.Nf3 Qb1 103.Rd7 Qc2+ 104.Rd2 Qb1 105.Ng1 Qb4
106.Rd1 Qb3 107.Rd6+ Kg7 108.Rd4 Qb2+ 109.Ne2 Qb1 110.e4 Qh1 111.Rd7+ Kg8
112.Rd4 Qh2+ 113.Ke3 h4 114.gxh4 Qh3+ 115.Kd2 Qxh4 116.Rd3 Kf8 117.Rf3 Qd8+
118.Ke3 Qa5 $6 { +0.50/55 } ( 118...Qb6+ { +0.23/59 } 119.Nd4 Qb2 120.e5 Kf7
121.Ne2 Qb6+ 122.Kd2 Ke6 123.Ng3 Qc5 124.Ke2 Qg1 125.Re3 Qg2+ 126.Ke1 Qg1+
127.Kd2 Qf2+ 128.Ne2 Ke7 129.Rg3 Ke6 130.Rd3 Kf7 131.Rc3 Ke6 132.Rg3 Kd7
133.Rg5 Ke7 134.Rg6 Kf7 135.Rc6 Ke8 136.Rc7 Qg2 137.Rc8+ Kd7 138.Rc3 Qf2
139.Rc4 Ke7 140.Rb4 Kf7 141.Re4 Ke6 142.Kc2 Qg2 143.Kd3 Ke7 144.Nc3 Ke6
145.f5+ Kxf5 ) 119.Kf2 Qa7+ 120.Re3 Qd7 121.Ng3 Qd2+ 122.Kf3 Qd1+ 123.Re2
Qb3+ 124.Kg2 Qb7 125.Rd2 Qb3 126.Rd5 Ke7 127.Re5+ Kf7 128.Rf5+ Ke8 129.e5
Qa2+ 130.Kh3 Qe6 $2 { +3.17/36 } ( 130...Qb1 { +0.91/56 } 131.Rf6 Qd1 132.Kh4
Qe1 133.Rd6 Qf2 134.Kg4 Qg1 135.Rd2 Qe1 136.Rd5 Qg1 137.Rd6 Qg2 138.Rd3 Kf8
139.Rd7 Qg1 140.Rd8+ Kf7 141.Rd3 Ke6 142.Rd6+ Ke7 143.Rg6 Kf7 144.Rf6+ Ke8
145.Rf5 Qg2 146.Rg5 Kf7 147.Rh5 Kf8 148.Rh1 Ke8 149.Rh7 Qg1 150.Rg7 Kf8
151.Rg5 Kf7 152.Rh5 Qd1+ 153.Kh4 Qe1 154.Rh6 Qf2 155.Kg4 Qg2 156.Rf6+ Ke8 )
131.Kh4 Qh6+ $2 { +6.75/28 } ( 131...Qa2 { +2.75/46 } 132.Nh5 Ke7 133.Kg5 Qc2
134.Rf6 Qg2+ 135.Kh6 Qh3 136.Rg6 Kf7 137.Rg7+ Ke6 138.Rg3 Qh1 139.Rg5 Qe4
140.Ng7+ Ke7 141.Rf5 Qh1+ 142.Nh5 Ke6 143.Rf6+ Ke7 144.Rg6 Kf8 145.Rd6 Qh4
146.Rf6+ Kg8 147.Rg6+ Kh8 148.Rd6 Qe7 149.Kg6 Qe8+ 150.Kg5 Qe7+ 151.Kg4 Qc7
152.Rh6+ Kg8 153.Kg5 Qc1 154.Nf6+ Kf8 155.Rh8+ Kf7 156.Rh7+ Ke6 157.Ng4 Qd2
158.Rh6+ Ke7 159.Rc6 Qd5 160.Rd6 ) 132.Nh5 Qh7 $2 { +10.88/28 } ( 132...Qh8
{ +6.32/31 } 133.Rf6 ) 133.e6 Qg6 $4 { #20/58 } ( 133...Qb7 { +9.50/35 }
134.Kg5 Qe7+ 135.Kg4 Qb7 136.Rd5 Qb1 137.Rd7 Qg1+ 138.Kf5 Qb1+ 139.Kg5 Qg1+
140.Kh6 Qh1 141.Rd3 Ke7 142.f5 Qc1+ 143.Kg6 Qg1+ 144.Rg3 Qd1 145.f6+ Kxe6
146.f7 Qb1+ 147.Kg7 Qb7 148.Re3+ Kd6 149.Kg8 Qd5 150.Ng7 Kc6 151.Re6+ Kb5
152.f8=Q Qc4 153.Qe7 Ka4 154.Qf7 Kb4 155.Re3 Qc8+ 156.Re8 Qc4 157.Qxc4+ Kxc4
158.Re3 Kb5 159.Re4 ) 134.Rf7 Kd8 135.f5 Qg1 136.Ng7 1-0

`}
      </Board>
    </div>
  );
}

export default App;

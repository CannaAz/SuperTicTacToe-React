import { use, useEffect, useRef, useState } from 'react'

import './Assets/CSS_files/App.css'
import { TicTacToe } from './Components/TicTacToe'

function SuperTicTacToe()
{
  const [nextPosition, setNextPosition] = useState(0);
  const [forceExecution, setForceExecutions] = useState(true);
  const [SuperBoard, setSuperBoard] = useState(Array(9).fill(null));
  const [myMap, setMyMap] = useState(new Map(
    [
      [1, true],
      [2, true],
      [3, true],
      [4, true],
      [5, true],
      [6, true],
      [7, true],
      [8, true],
      [9, true],
    ]
  ));
  const filledBoardsMap = useRef(new Map(
    [
      [1, false],
      [2, false],
      [3, false],
      [4, false],
      [5, false],
      [6, false],
      [7, false],
      [8, false],
      [9, false]
    ]
  ));
  let newMap = new Map();

  const SuperWinner = useRef(null);
  const ThereIsASuperWinner = useRef(false);
  let NextTurn = useRef('x');
  const superTictacToeRef = useRef(null);
  const firstUpdate = useRef(true);
  const ThereWasADoubleWinner = useRef(false);

  const Supper_Winner_Combos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

  
  let ChangePlayablePosition = (value)=>
  {
    //this conditional check if the board we will be changing the playable position is filled or has already be winned by any of the 2 players
    //if that is the case, the playable position will be the same board
    if(filledBoardsMap.current.get(value) == false)
    {
      setNextPosition(value);
    }
    CheckForDoubleWinner(value);
    setForceExecutions(!forceExecution);
    firstUpdate.current = false;
  }

  const updateSuperBoard = (idx, BoardValue) => {

    if (SuperBoard[idx]) return;

    const NewSuperBoard = [...SuperBoard];
    NewSuperBoard[idx] = BoardValue;
    setSuperBoard(NewSuperBoard);

    
    SuperWinner.current = CheckForSuperTicTacToe(NewSuperBoard);
  };

  const CheckForSuperTicTacToe = (receivedBoard) => {
    for (const combo of Supper_Winner_Combos) {
      const [a, b, c] = combo;
      if (receivedBoard[a] != null && receivedBoard[a] == receivedBoard[b] && receivedBoard[a] == receivedBoard[c]) {
        ThereIsASuperWinner.current = true;
        return receivedBoard[a];
      }
    }
    return null;
  };

  const MakeAllNonWinnedBoardsPlayable = ()=>
  {
    for(let i = 0; i < 9; i++)
    {
      if(filledBoardsMap.current.get(i + 1) == false)
      {
        let NewBurnerMap = myMap;
        NewBurnerMap.set(i + 1, true);
        setMyMap(NewBurnerMap);
        ThereWasADoubleWinner.current = true;
        //NextTurn.current = NextTurn.current == 'x' ? 'o' : 'x';
      }
    }
  }

  const CheckForDoubleWinner = (nextPositionToPlay) => {
    if (filledBoardsMap.current.get(nextPositionToPlay) == true) {
      MakeAllNonWinnedBoardsPlayable();
    }
  };

  useEffect(()=>
  {
    if (firstUpdate.current) return;

    if(ThereWasADoubleWinner.current == false)
    {
      for(let [key, value] of myMap)
        {
          if(key != nextPosition) value = false;
          else value = true;
    
          newMap.set(key, value);
        }
    
      setMyMap(newMap);
    }

    
    NextTurn.current = NextTurn.current == 'x' ? 'o' : 'x';
    ThereWasADoubleWinner.current = false;
  },[nextPosition, forceExecution])

  

  // x color: D9C1AB
  // o color: ABCFD9
  return (
    <div className='super-container'>

      <p className='SuperWinner'
        style={
          {
            opacity: ThereIsASuperWinner.current ? 1 : 0,
            color: SuperWinner.current == 'x' ? '#D9C1AB': '#ABCFD9'
          }
        }
      >
        super winer is:
        <b>
        {ThereIsASuperWinner.current ? ' ' + SuperWinner.current : ''}
        </b>
      </p>

      <div className='supertictactoe' ref={superTictacToeRef}>
        
        {Array.from({ length: 9 }, (_, i) => (
          <TicTacToe
          key={i + 1}
          Position={i + 1} 
          NextPosition={ChangePlayablePosition} 
          NextPositionToPlay={nextPosition}
          canPlay={myMap.get(i + 1)} 
          NextTurn={NextTurn}
          updateSuperBoard={updateSuperBoard} 
          filledBoardMap={filledBoardsMap.current}
          ></TicTacToe>
        ))}
       
      </div>

      <button className='clear-board' 
        onClick={
          ()=> {
            window.location.reload('false');
          }
        }
      >Clear</button>
    </div>
  );
}



function App() {

  

  return (
    <>
      <h1 id='main-tittle'>SUPER TIC-TAC-TOE</h1>

      <div className='main-container'>
        <SuperTicTacToe></SuperTicTacToe>
      </div>

      <footer id='footer'>
        <p>Copyright© 2025 Canna_Az</p>
        <a href='https://github.com/cannaAz'>github.com/cannaAz</a>
      </footer>
    </>
  )
}

export default App

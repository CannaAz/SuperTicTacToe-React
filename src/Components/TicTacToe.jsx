import React, { use, useRef, useState } from "react";

function TicTacToeCell({cellPosition, NextPosition, canPlay, NextTurn, FillCell, updateBoard})
{
    const [value, setValue] = useState('');

    // x color: D9C1AB
    // o color: ABCFD9
    return(
        <div className={"TicTacToeCell "} 
        style=
        {    
            {
                backgroundColor : !canPlay ? '#13071F' : '',
                border : !canPlay ? '1px solid #635985' : '',
                color: value == 'x' ? '#D9C1AB': ' #ABCFD9'
            }
            // !canPlay ? {backgroundColor : '#13071F', border : '1px solid #635985' } : {}   
        }  
        onClick={()=> 
            {;
                if(!canPlay) return
                if(value == '')
                {
                    setValue(NextTurn.current);
                    FillCell();
                    NextPosition(cellPosition);
                    updateBoard(cellPosition - 1);
                }
            }
        }>
            {value}
        </div>
    );
}

export function TicTacToe({Position, NextPosition, canPlay, NextTurn, updateSuperBoard, filledBoardMap})
{
    const FilledCells = useRef(0);
    const Winner = useRef('');
    const ThereIsAWinner = useRef(false); 
    const [board, setBoard] = useState(Array(9).fill(null))
    let FillCell = ()=>
    {
        if(FilledCells.current < 9) FilledCells.current += 1;
    };

    const Winner_Combos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    const updateBoard = (idx)=>
    {
        if(board[idx]) return;

        const NewBoard = [...board];
        NewBoard[idx] = NextTurn.current;
        setBoard(NewBoard);


        Winner.current = CheckForTicTacToe(NewBoard);
        
        if(Winner.current != null)
        {
            filledBoardMap.set(Position, true);
            updateSuperBoard(Position - 1, Winner.current);
        }
        else if (FilledCells.current == 9) {
            filledBoardMap.set(Position, true);
        }
        
    };

    const CheckForTicTacToe = (receivedBoard)=>
    {
        for(const combo of Winner_Combos)
        {
            const [a, b, c] = combo;
            if(receivedBoard[a] != null && receivedBoard[a] == receivedBoard[b] && receivedBoard[a] == receivedBoard[c])
            {
                ThereIsAWinner.current = true;
                
                return receivedBoard[a];
            }
        }
        return null;
    };

    
    
    const CellsArray = [];
    for(let i = 0; i < 9; i++)
    {
        CellsArray.push(
        <TicTacToeCell
        
        key={i} 
        cellPosition={i+1} 
        NextPosition={NextPosition} 
        canPlay={FilledCells.current < 9 ? canPlay : false} 
        NextTurn={NextTurn} 
        FillCell={FillCell}
        updateBoard={updateBoard}
        
        ></TicTacToeCell>)
    };

    return (
        <div className="tictactoe">
            {CellsArray}

            {
                ThereIsAWinner.current == true 
                ? 
                <p className="WinSing"
                    style={
                        {
                            color: Winner.current == 'x' ? '#D9C1AB' : '#ABCFD9'
                        }
                    }
                >{Winner.current}</p>
                : ''
            }
            {
                FilledCells.current == 9 && Winner.current == null ? <p className="WinSing" >!</p> : ''
            }
        </div>
    );
}
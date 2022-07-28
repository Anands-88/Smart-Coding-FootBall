import { useRef, useState} from "react";
import { TextField,Box, Button,styled} from "@mui/material";
import {Table,TableBody,TableContainer,
        TableHead,TableRow,Paper} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import "./football.css"

const Head = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: "red",
  padding: theme.spacing(1),
  color:"white",
  fontSize:20
}));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.white,
//     color: theme.palette.common.black,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 15,
//   },
// }));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor:"orange",
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const Football = () =>
{
  const smallLetters = "abcdefghijklmnopqrstuvwxyz"; // Random player names
  const capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Random team Name

  const [result,setResult] = useState({
    player:"",
    team:"",
    result:""
  })
  
  const [inputValues,setInputValues] = useState({
    from:0,
    to:0,
    inputTeam:0,
    playerInput:0,
    rounds:0
  })

  let teamsList = useRef([]);

  function submitInputs(inputPara)
  {
    
  let {from,to,inputTeam,playerInput,rounds} = inputPara 

    let {player,team,result} = football(from,to,inputTeam,playerInput,rounds) // input arguments to Functions

    setResult({player,team,result})

  }

  function football(rangeFrom,rangeTo,inputTeam,playerInput,round)
  {
    let [teamCount,totalTeams,teamRes] = [0,[],""]; 

    while(teamCount !== inputTeam)
    {
      let teamName = {} // Adding TeamName from Capital Letters Collection
      teamName[capitalLetters[teamCount]] = {}; // with empty array for players with goal/amount
      let playerNames = {} 

      for(let num = 0; num < playerInput; num++)
        {
          playerNames[smallLetters[num]] = 0; // Adding players name from Small Letters collections
      
          for(let r = 0; r < round; r++)
            {
              let randomNumber = Math.round(Math.random(100)*100) // Random Numbers from 0 to 100;

              if(randomNumber >= rangeFrom && randomNumber <= rangeTo)
              {
                playerNames[smallLetters[num]]+=100 // Rupees 100 per goal if random numbers are in given range from and to
              }
      
            }
          // teamName[capitalLetters[teamCount]].push(playerNames) // Pushing player with amount to the respective Team
        }
      teamName[capitalLetters[teamCount]] = playerNames
      totalTeams.push(teamName) // Pushing all Team
      teamCount++
    }

    let [teamMax,maxSum_TeamName,] = [0,0,]; // Teams money sum, team name,
    let finalSentence = {}; // Result with some Sentence
    let [playerMax,playerName,playerFromTeam] = [0,"",""]; // Players Money sum , name , team name
    teamsList.current = []

    for(let teams of totalTeams) // teams is object with team name 
    {
      for(let teamname in teams) // teamname is array with players obj with value as amount
        {
          highestMoney(teams[teamname],teamname); // Passing to function to find max amount 
        }
    }
      
    function highestMoney(singleTeam,teamName) // Teams array and team name
    {
      let teamSum = 0;
      let playersList = [];

    
      for(let player in singleTeam) // person is key and amount as value
      {
        playersList.push(`${player}${singleTeam[player]}`)

          teamSum+= singleTeam[player] // Adding all players money for total team amount

          if(singleTeam[player] > playerMax) // comparing each players amount to find player with highest money
          {
            playerMax = singleTeam[player] // player Money
            playerName = player // Player name
            playerFromTeam = teamName // Team of the player
          }
      }

      teamsList.current.push({teamName,playersList})

      if(teamMax <= teamSum) // max Team amount 
      {
        if(teamMax < teamSum)
        {
          teamMax = teamSum // Total team sum - MAX
          maxSum_TeamName = teamName // Name of the team with highest money
          teamRes = teamName
        }
        else if(teamMax === teamSum)
        {
            teamRes = false
        }
       
      }
    }
    
    finalSentence = {
      player:` ${playerMax?"":"No"} Player ${playerName||""} 
                from Team ${playerFromTeam||""} has highest money
                ${playerMax?`having Rs ${playerMax}`:". Money=0"}.`, 
      team: `${teamMax?"":"No"} Team ${maxSum_TeamName || ""} 
              has highest money${teamMax?`having Rs ${teamMax}`:". Money=0"}.`,
      result:teamRes
    }

    return finalSentence
  }

    let teamsArr = teamsList.current

      return <>
          <div style={{display:"flex"}}>
            <Box className="inputBox" component="div" sx={{ p:3, width:300, border: '4px ridge black' }}>
              <TextField onChange={(e)=>{
                    setInputValues({...inputValues,from:+e.target.value})}
                  }
                  label="Goal Range From" variant="filled" 
                  color="info" type="number" focused />
              <TextField onChange={(e)=>{
                    setInputValues({...inputValues,to:+e.target.value})}
                }
                  label="Goal Range To" variant="standard" 
                  color="warning" type="number" focused />
              <TextField onChange={(e)=>{
                    setInputValues({...inputValues,inputTeam:+e.target.value})}
                }
                  label="No. of totalTeams" variant="standard" 
                  color="success" type="number" focused />
              <TextField onChange={(e)=>{
                    setInputValues({...inputValues,playerInput:+e.target.value})}
                }
                  label="No. of Players in Each Team" variant="standard" 
                  color="error" type="number" focused />
              <TextField onChange={(e)=>{
                    setInputValues({...inputValues,rounds:+e.target.value})}
                }
                  label="Total Rounds" variant="standard" 
                  color="secondary" type="number" focused />

                <Button
                onClick={()=>submitInputs(inputValues)}
                color="warning" variant="contained" >Submit</Button>
            </Box>
            <TableContainer className="Table" sx={{maxWidth:"72%",marginLeft:"2%"}} component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Teams</StyledTableCell>
                    <StyledTableCell className="playerHead" align="right">Players</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamsArr.map(({teamName,playersList},index) => {
                    return <StyledTableRow key={index}>
                          <StyledTableCell className="teamHeads" component="th" scope="row">
                            {teamName}
                          </StyledTableCell>
                          {playersList.map((str,index)=>{
                            let [name,...money] = str
                             return <StyledTableCell key={index} align="center">
                                    <h3>{name}</h3>
                                    <h3> ₹ {money.join("")}</h3>
                                </StyledTableCell>
                          })}
                    </StyledTableRow>
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <Box component="div">
              <Head>{result.result?` Team ${result.result} Won`:"Its a Tie"}</Head>
              <Head>{result.player}</Head>
              <Head>{result.team}</Head>
              
          </Box>

      </>
}





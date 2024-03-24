// App.js
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; // Import PapaParse
import './App.css'; // Assuming you have a separate CSS file for styling
import { Grid, Button, makeStyles, FormControl, InputLabel, NativeSelect,
Box, Toolbar, AppBar, Typography, Divider } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1),
    width: '100%'
  }
}));

function App() {
  const [dropdown1Value, setDropdown1Value] = useState('');
  const [allPlayersData, setAllPlayersData] = useState([]);
  const [team1Players, setTeam1Players] = useState([[],[],[]]);
  const [team2Players, setTeam2Players] = useState([[],[],[]]);
  const [battersDivCount, setBattersDivCount] = useState(0);
  const [bowlersDivCount, setBowlersDivCount] = useState(0);
  const [allRoundersDivCount, setAllRoundersDivCount] = useState(0);
  
  const classes = useStyles();

  useEffect(() => {
    // Fetch CSV data when component mounts
    fetchData();
  }, []);


  function getListOfPlayersBasedOnTeamName(teamName) {
    const batters=[],bowlers=[],allrounders=[];
    for(const obj of allPlayersData) {
      if(obj.Team === teamName) {
        if(obj.Role === 'Batter' || obj.Role === 'WK Keeper - Batter')
          batters.push([obj.Name,obj.ImageUrl,obj.IsCaptain,obj.IsForeignPlayer]);
        else if(obj.Role === 'Bowler')
          bowlers.push([obj.Name,obj.ImageUrl,obj.IsCaptain,obj.IsForeignPlayer]);
        else if(obj.Role === 'All-Rounder')
          allrounders.push([obj.Name,obj.ImageUrl,obj.IsCaptain,obj.IsForeignPlayer]);
      }
    }
    return [batters, bowlers, allrounders];
  }

  const fetchData = async () => {
    try {
      const response = await fetch('currentsquads.csv'); // Assuming your CSV file is named data.csv
      const csvData = await response.text();
      const players = [];
      Papa.parse(csvData, { header: true , complete: function(results) {
      for (let i=0;i<results.data.length;i++) {
        players.push({'Team': results.data[i]['Team'], 'Name': results.data[i]['Name'], 'Role': results.data[i]['Role'], 'ImageUrl': results.data[i]['ImageUrl'], 'IsCaptain': results.data[i]['IsCaptain'], 'IsForeignPlayer': results.data[i]['IsForeignPlayer']});
      }
      setAllPlayersData(players); 
      }});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDropdown1Change = (event) => {
    setDropdown1Value(event.target.value);
  };

  const handleClick = async (value, type) => {
    console.log(`Button ${value} clicked`);
    // Add your logic here to handle button click with value
    if(type === 0) {
      setBattersDivCount(battersDivCount+1);
      setTeam2Players(team2Players[0].push(value));
    }
    else if(type === 1) {
      setAllRoundersDivCount(allRoundersDivCount+1);
      setTeam2Players(team2Players[1].push(value));
    }
    else if(type === 2) {
      setBowlersDivCount(bowlersDivCount+1);
      setTeam2Players(team2Players[2].push(value));
    }
    console.log(team2Players);
  };

  useEffect(() => {
    // Fetch CSV data when component mounts
    console.log(team1Players);
  }, [team2Players]);

  const renderBatterDivs = () => {
    const divs = [];
    for (let i = 0; i < battersDivCount; i++) {
      divs.push(<div key={i}> ${team2Players[0][i]} </div>);
    }
    return divs;
  }

  const renderAllrounderDivs = () => {
    const divs = [];
    for (let i = 0; i < battersDivCount; i++) {
      divs.push(<div key={i}>Div {i + 1}</div>);
    }
    return divs;
  }

  const renderBowlerDivs = () => {
    const divs = [];
    for (let i = 0; i < battersDivCount; i++) {
      divs.push(<div key={i}>Div {i + 1}</div>);
    }
    return divs;
  }

  const handleFetchPlayers = () => {
    const team1Players = getListOfPlayersBasedOnTeamName(dropdown1Value);
    //const team2Players = getListOfPlayersBasedOnTeamName(dropdown2Value);
    setTeam1Players(team1Players);
    //setTeam2Players(team2Players);
  };

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }} className='flexBox'>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h5" color="inherit" component="div">
              Our Playing 11
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Grid container spacing={4} justifyContent='center' alignItems='center' style={{ minHeight: '10vh', marginBottom: '30px' }} >
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="team1">
              Team 1
            </InputLabel>
            <NativeSelect
              defaultValue={'default'}
              inputProps={{
                name: 'team1',
                id: 'team1',
              }}
              onChange={handleDropdown1Change}
            >
            <option value="default">Select an option</option>
            <option value="Chennai Super Kings">Chennai Super Kings</option>
            <option value="Delhi Capitals">Delhi Capitals</option>
            <option value="Gujarat Titans">Gujarat Titans</option>
            <option value="Kolkata Knight Riders">Kolkata Knight Riders</option>
            <option value="Lucknow Super Giants">Lucknow Super Giants</option>
            <option value="Mumbai Indians">Mumbai Indians</option>
            <option value="Punjab Kings">Punjab Kings</option>
            <option value="Rajasthan Royals">Rajasthan Royals</option>
            <option value="Royal Challengers Bangalore">Royal Challengers Bengaluru</option>
            <option value="Sunrisers Hyderabad">Sunrisers Hyderabad</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
        <Button variant="contained" className='fetchButton' color="primary" onClick={() => handleFetchPlayers()}>Fetch Players</Button>
        </Grid>
      </Grid>
      
      <Grid container spacing={2} className='playercontainer' style={{ minHeight: '100vh' }}>
        <Grid item xs={2} >
          <Grid item xs={12}>
            <Box sx={{p: 2}}>
              <Typography gutterBottom variant="h5" component="div">
                Batters
              </Typography>
              <Divider />
            </Box>
            <Grid item xs={12}>
              <div>
                {team1Players[0].map((value, index) => (
                  <Button variant="contained" color="primary" className={classes.button} key={index} id={value[0]} onClick={() => handleClick(value[0], 0)}>
                    {value[0]}
                    {value[3]==='Y' && <img src={'foreign.svg'} alt="" style={{ marginLeft: 5 }} />}
                  </Button>
                ))}
              </div>
            </Grid>
          </Grid> 
        </Grid>

        <Grid item xs={2}>
          <Grid item xs={12}>
            <Box sx={{p: 2}}>
              <Typography gutterBottom variant="h5" component="div">
                All-Rounders
              </Typography>
              <Divider />
            </Box>
            <Grid item xs={12}>
              <div className={classes.buttonContainer}>
                {team1Players[2].map((value, index) => (
                  <Button variant="contained" color="primary" className={classes.button} key={index} onClick={() => handleClick(value[0])}>
                    {value[0]}
                    {value[3]==='Y' && <img src={'foreign.svg'} alt="" style={{ marginLeft: 5 }} />}
                  </Button>
                ))}
              </div>
            </Grid>
          </Grid> 
        </Grid>

        <Grid item xs={2}>
          <Grid item xs={12}>
            <Box sx={{p: 2}}>
              <Typography gutterBottom variant="h5" component="div">
                Bowlers
              </Typography>
              <Divider />
            </Box>
            <Grid item xs={12}>
              <div className={classes.buttonContainer}>
                {team1Players[1].map((value, index) => (
                  <Button variant="contained" color="primary" className={classes.button} key={index} onClick={() => handleClick(value[0])}>
                    {value[0]}
                    {value[3]==='Y' && <img src={'foreign.svg'} alt="" style={{ marginLeft: 5 }} />}
                  </Button>
                ))}
              </div>
            </Grid>
          </Grid> 
        </Grid>

        <Grid item xs={2} >
          <Grid item xs={12}>
            <Box sx={{p: 2}}>
              <Typography gutterBottom variant="h5" component="div">
                Batters
              </Typography>
              <Divider />
            </Box>
            <Grid item xs={12}>
              <div>
                {team1Players[0].map((value, index) => (
                  <Button variant="contained" color="primary" className={classes.button} key={index} id={value[0]} onClick={() => handleClick(value[0], 0)}>
                    {value[0]}
                    {value[3]==='Y' && <img src={'foreign.svg'} alt="" style={{ marginLeft: 5 }} />}
                  </Button>
                ))}
              </div>
            </Grid>
          </Grid> 
        </Grid>

        <Grid item xs={2}>
          <Grid item xs={12}>
            <Box sx={{p: 2}}>
              <Typography gutterBottom variant="h5" component="div">
                All-Rounders
              </Typography>
              <Divider />
            </Box>
            <Grid item xs={12}>
              <div className={classes.buttonContainer}>
                {team1Players[2].map((value, index) => (
                  <Button variant="contained" color="primary" className={classes.button} key={index} onClick={() => handleClick(value[0])}>
                    {value[0]}
                    {value[3]==='Y' && <img src={'foreign.svg'} alt="" style={{ marginLeft: 5 }} />}
                  </Button>
                ))}
              </div>
            </Grid>
          </Grid> 
        </Grid>

        <Grid item xs={2}>
          <Grid item xs={12}>
            <Box sx={{p: 2}}>
              <Typography gutterBottom variant="h5" component="div">
                Bowlers
              </Typography>
              <Divider />
            </Box>
            <Grid item xs={12}>
              <div className={classes.buttonContainer}>
                {team1Players[1].map((value, index) => (
                  <Button variant="contained" color="primary" className={classes.button} key={index} onClick={() => handleClick(value[0])}>
                    {value[0]}
                    {value[3]==='Y' && <img src={'foreign.svg'} alt="" style={{ marginLeft: 5 }} />}
                  </Button>
                ))}
              </div>
            </Grid>
          </Grid> 
        </Grid>
        

        
      </Grid>
    </div>
  );
}

export default App;

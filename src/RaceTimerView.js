import React from 'react';
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography} from "@material-ui/core";
import LoginDialog from "./LoginDialog";

function RaceTimerView(props){

    const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);

    function formatDuration (seconds) {
        return new Date(1000 * seconds).toISOString().substr(11, 8)
    }

    const startOrLogin = () => {
        if(props.authenticated){
            props.start()
        }else{
            setLoginDialogOpen( true)
        }
    }

    const handleLoginClose = () => {
        setLoginDialogOpen( false)
    }

    function startButton (props){
        return(
            <TableRow>
                <TableCell align="center" colspan={2} >
                    <Button onClick={() => startOrLogin()} variant="contained" color="primary">
                        { props.authenticated ? 'Start' : 'Login'}
                    </Button>
                </TableCell>
            </TableRow>
        );
    }

    function syncAndStopButtons (props){
        return(
            <TableRow>
                <TableCell align="center">
                    <Button onClick={() => props.sync()} variant="contained" color="primary">
                        Sync
                    </Button>
                </TableCell>
                <TableCell align="center">
                    <Button onClick={() => props.stop()} variant="contained" color="primary">
                        Stop
                    </Button>
                </TableCell>
            </TableRow>
        );
    }

    if( props.loading ) {
        return (<div>Connecting to the server...</div>)
    } else {
        return (
            <div>
            <TableContainer component={Paper}>
                <Table size={'small'} >
                    <TableBody>
                        <TableRow>
                            <TableCell colspan={2} align="center">
                                <Typography variant="h1">{formatDuration(props.timeToStart)}</Typography>
                            </TableCell>
                        </TableRow>
                        {props.raceState === 'preparatory' ? syncAndStopButtons(props) : startButton(props)}
                    </TableBody>
                </Table>
            </TableContainer>
                <LoginDialog onLoginSubmit={props.onLoginSubmit} open={loginDialogOpen} handleClose={handleLoginClose}/>
            </div>
        );
    }
}

export default RaceTimerView;

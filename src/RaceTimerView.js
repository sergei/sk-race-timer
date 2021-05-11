import React from 'react';
import {
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from "@material-ui/core";
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import LoginDialog from "./LoginDialog";

function RaceTimerView(props){

    const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);

    function formatDuration (seconds) {
        return new Date(1000 * seconds).toISOString().substr(11, 8)
    }

    const handleLoginClose = () => {
        setLoginDialogOpen( false)
    }

    function loginButton(props){
        return(
            <TableRow>
                <TableCell align="center" colspan={2} >
                    <Button onClick={() => setLoginDialogOpen( true)} variant="contained" color="primary">
                        Login
                    </Button>
                </TableCell>
            </TableRow>
        );
    }

    function logoutButton(props){
        return(
            <IconButton aria-label="delete" onClick={() => { props.onLogout() }}>
                <ExitToAppOutlinedIcon />
            </IconButton>
        );
    }

    function startButton(props){
        return(
            <TableRow>
                <TableCell align="center" colspan={2} >
                    <Button onClick={() => props.start()} variant="contained" color="primary">
                        Start
                    </Button>
                </TableCell>
            </TableRow>
        );
    }

    function syncAndStopButtons(props){
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
                        <LoginDialog onLoginSubmit={props.onLoginSubmit} open={loginDialogOpen} handleClose={handleLoginClose}/>
                        {!props.authenticated ? loginButton(props) : props.raceState === 'preparatory' ? syncAndStopButtons(props) : startButton(props)}
                        {props.authenticated ? logoutButton(props) : ''}
                    </TableBody>
                </Table>
            </TableContainer>
            </div>
        );
    }
}

export default RaceTimerView;

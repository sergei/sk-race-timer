import './App.css';
import {createMuiTheme, makeStyles, Paper} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import RaceTimer from "./RaceTimer";

function App() {
  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });

  const useStyles = makeStyles({
    paper: {
      width: "100%",
      minHeight: "100vh",
    },
  });
  const classes = useStyles();

  return (
      <ThemeProvider theme={darkTheme}>
        <Paper className={classes.paper}>
          <RaceTimer/>
        </Paper>
      </ThemeProvider>
  );
}

export default App;

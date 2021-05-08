import React, {Component} from 'react';
import RaceTimerView from "./RaceTimerView";
import Client from '@signalk/client'

class RaceTimer extends Component {

    // State of this component
    state = {
        loading: true,
        timer: null,
    };

    componentDidMount() {
        let timer = setInterval(this.updateRaceTimerStatus, 750);
        this.setState({
            timer: timer,
        });

        // Listen to the "delta" event to get the stream data
        this.client = new Client({
            hostname: 'localhost',
            port: 3000,
            useTLS: false,
            reconnect: true,
            autoConnect: true,
            notifications: false,
            useAuthentication: true,
            username: 'test',
            password: 'test',
            subscriptions: [
                {
                    context: 'vessels.*',
                    subscribe: [
                        {
                            path: 'navigation.racing.timeToStart',
                            policy: 'instant',
                        },
                        {
                            path: 'navigation.racing.state',
                            policy: 'instant',
                        },
                    ],
                },
            ],
        })

        this.client.on('delta', (delta) => {
            let state = {}
            delta.updates.forEach( update => {
                update.values.forEach(value => {
                    if(value.path === 'navigation.racing.timeToStart'){
                        state.loading = false
                        state.timeToStart = value.value
                    } else if(value.path === 'navigation.racing.state'){
                        console.log('raceState', value.value)
                        state.raceState = value.value
                    }
                })
            })
            this.setState(state)
        })
    }

    componentWillUnmount() {
        if ( typeof clearInterval === "function")
            clearInterval(this.state.timer);
    }

    putTimeToStart = (tts) => {
        this.client
            .API()
            .then((api) => api.put('/vessels/self/navigation/racing/timeToStart', {value: tts}))
            .then((result) => {
                console.log(result)
            })
            .catch((err) => console.error(err))
    }

    start = () => {
        console.log('Start timer');
        this.putTimeToStart(300);
    }

    stop = () => {
        console.log('Stop timer');
        this.putTimeToStart(0);
    }

    sync = () => {
        console.log('Sync timer');
        this.putTimeToStart(-1);
    }

    render() {
        return (
            <RaceTimerView {...this.state} start={this.start} stop={this.stop} sync={this.sync}
            />
        );
    }
}

export default RaceTimer;

import React, {Component} from 'react';
import RaceTimerView from "./RaceTimerView";
import Client from '@signalk/client'

class RaceTimer extends Component {

    // State of this component
    state = {
        loading: true,
        timer: null,
        authenticated: false
    };

    componentDidMount() {
        let timer = setInterval(this.updateRaceTimerStatus, 750);
        this.setState({
            timer: timer,
        });

        // Listen to the "delta" event to get the stream data
        let params = {
            hostname: 'localhost',
            port: 3000,
            useTLS: false,
            reconnect: true,
            autoConnect: true,
            notifications: false,
            useAuthentication: false,
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
        }
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');

        if( username &&  password){
            params.username = username
            params.password = password
            params.useAuthentication = true
            console.log('use cached credentials')
        }

        this.client = new Client(params)

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

        this.client.on('authenticated', (authData) => {
            console.log('authenticated')
            this.setState({authenticated: true})
        })

        // The 'authenticated' is not emitted if we specify credentials when creating the client,
        // so listen for this event and check if we requested the authenticated connection
        this.client.on('connect', (authData) => {
            console.log('connect')
            if( params.useAuthentication )
                this.setState({authenticated: true})
        })

        this.client.on('error', (error) => {
            console.log(`error ${error}`)
            this.setState({authenticated: false})
        })

    }

    componentWillUnmount() {
        if ( typeof clearInterval === "function")
            clearInterval(this.state.timer);
    }

    onLoginSubmit = (username, password) => {
        this.client.authenticate(username, password)
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
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
            <RaceTimerView {...this.state} start={this.start} stop={this.stop} sync={this.sync} onLoginSubmit={this.onLoginSubmit}
            />
        );
    }
}

export default RaceTimer;

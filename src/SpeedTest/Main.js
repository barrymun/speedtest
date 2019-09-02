import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import uuid from "uuid";

import withStyles from "@material-ui/core/styles/withStyles";

import {sleep} from "../utils";

const styles = theme => ({});
const hosts = [
    "https://google.com",
];

class Main extends React.Component {
    state = {
        ping: 0,
    };


    async componentDidMount() {
        this.sumDownloadSpeed();
        // this.sumPing();
    }

    sumDownloadSpeed = async () => {
        console.log('A')
        await this.getDownloadSpeed(res => console.log(res));
        console.log('B')
        // for (let index = 0; index < 20; index++) {
        //     console.log('A')
        //     await this.getDownloadSpeed(res => console.log(res));
        //     console.log('B')
        //     await sleep(50);
        // }
    };

    getDownloadSpeed = async callback => {
        let imageAddr = "https://hdqwalls.com/download/chicago-city-waterfall-8k-x1-7680x4320.jpg";
        let downloadSize = 6937258;  // bytes
        let startTime, endTime;
        let download = new Image();

        download.onload = function () {
            endTime = (new Date()).getTime();
            let duration = (endTime - startTime) / 1000;
            let bitsLoaded = downloadSize * 8;
            let speedBps = (bitsLoaded / duration).toFixed(2);
            let speedKbps = (speedBps / 1024).toFixed(2);
            let speedMbps = (speedKbps / 1024).toFixed(2);
            // console.log({speedBps, speedKbps, speedMbps})
            callback({speedBps, speedKbps, speedMbps});
        };

        download.onerror = function (err, msg) {
        };

        startTime = (new Date()).getTime();
        download.src = `${imageAddr}?cacheCleaner=${startTime}`;
    };

    sumPing = async () => {
        for (let index = 0; index < 100; index++) {
            hosts.forEach(async host => {
                await this.getPing(host, ping => this.setState({ping}));
            });
            await sleep(50);
        }
    };

    /**
     *
     */
    getPing = async (host, callback) => {
        let startTime = new Date().getTime();
        let xhr = new XMLHttpRequest();

        xhr.open("GET", `${host}?cacheCleaner=${uuid()}`, true);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Pragma", "no-cache");
        xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
        xhr.onload = function () {
            // callback(null, xhr.response);
            callback(null, 0);
        };
        xhr.onerror = function () {
            let endTime = new Date().getTime();
            let ping = endTime - startTime;
            callback(ping);
        };
        xhr.send();
    };

    render() {
        const {ping} = this.state;

        return (
            <div>{ping}</div>
        )
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const c = connect()(withStyles(styles, {withTheme: true})(Main));
export {c as Main};
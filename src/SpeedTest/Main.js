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
        speedMbps: [],
        averageSpeedMbps: 0.0,
    };

    async componentDidMount() {
        await this.sumDownloadSpeed(10);
        await this.sumPing(100);

        // this.getUploadSpeed(30, (speed, average) => console.log({speed, average}))
    }

    /**
     *
     * @returns {Promise<void>}
     */
    sumDownloadSpeed = async iterations => {
        for (let index = 0; index < iterations; index++) {
            await this.getDownloadSpeed()
                .then(r => {
                    let speedMbps = [...this.state.speedMbps, r];
                    this.setState(prevState => ({
                        speedMbps,
                        averageSpeedMbps: (speedMbps.reduce((a, b) => a + b)) / speedMbps.length,
                    }), () => console.log(this.state.averageSpeedMbps))
                });
            await sleep(50);
        }
    };

    /**
     *
     * @returns {Promise<any>}
     */
    getDownloadSpeed = async () => {
        let imageAddr = "https://hdqwalls.com/download/chicago-city-waterfall-8k-x1-7680x4320.jpg";
        let downloadSize = 6937258;  // bytes
        let startTime, endTime;
        let download = new Image();

        let promise = new Promise(resolve => {
            download.onload = function () {
                endTime = (new Date()).getTime();
                let duration = (endTime - startTime) / 1000;
                let bitsLoaded = downloadSize * 8;
                let speedBps = (bitsLoaded / duration).toFixed(2);
                let speedKbps = (speedBps / 1024).toFixed(2);
                let speedMbps = (speedKbps / 1024).toFixed(2);
                // resolve({speedBps, speedKbps, speedMbps});
                resolve(parseFloat(speedMbps));
            };
        });
        download.onerror = function (err, msg) {
        };
        startTime = (new Date()).getTime();
        download.src = `${imageAddr}?cacheCleaner=${startTime}`;
        return promise;
    };

    /**
     *
     * @returns {Promise<void>}
     */
    sumPing = async iterations => {
        for (let index = 0; index < iterations; index++) {
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

    getUploadSpeed = (iterations, callback) => {
        let average = 0,
            index = 0,
            timer = window.setInterval(check, 2000); //check every 5 seconds
        check();

        function check() {
            let xhr = new XMLHttpRequest(),
                url = '?cache=' + Math.floor(Math.random() * 10000), //prevent url cache
                data = getRandomString(1), //1 meg POST size handled by all servers
                startTime,
                speed = 0;

            xhr.onreadystatechange = function (event) {
                if (xhr.readyState === 4) {
                    speed = Math.round(1024 / ((new Date() - startTime) / 1000));
                    average === 0
                        ? average = speed
                        : average = Math.round((average + speed) / 2);
                    callback(speed, average);
                    index++;
                    if (index === iterations) {
                        window.clearInterval(timer);
                    }
                }
            };
            xhr.open('POST', url, true);
            startTime = new Date();
            xhr.send(data);
        }

        function getRandomString(sizeInMb) {
            let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+`-=[]{}|;':,./<>?", //random data prevents gzip effect
                iterations = sizeInMb * 1024 * 1024, //get byte count
                result = '';
            for (let index = 0; index < iterations; index++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }
    };

    render() {
        const {
            ping,
            averageSpeedMbps,
        } = this.state;

        return (
            <div>
                <div>{averageSpeedMbps}</div>
                <div>{ping}</div>
            </div>
        )
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const c = connect()(withStyles(styles, {withTheme: true})(Main));
export {c as Main};
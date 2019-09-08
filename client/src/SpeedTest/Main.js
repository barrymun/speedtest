import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import uuid from "uuid";
import axios from "axios";

import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTachometerAlt, faRedoAlt} from '@fortawesome/free-solid-svg-icons'

import {
    findIP,
    sleep,
} from "../utils";
import {
    testPing,
    clientInfo,
    testUploadSpeed,
} from "../constants";

import "./static/css/Main.css";

const styles = theme => ({});
const hosts = [
    testPing,
];
const defaultState = {
    ping: [],
    averagePing: 0.0,
    downloadSpeedMbps: [],
    averageDownloadSpeedMbps: 0.0,
    uploadSpeedMbps: [],
    averageUploadSpeedMbps: 0.0,
    showMoreInfo: false,
    clientIp: '',
    clientCity: '',
    clientIsoCode: '',
};

class Main extends React.Component {
    state = defaultState;

    setStateAsync = state => {
        return new Promise(resolve => this.setState(state, resolve));
    };

    async componentDidMount() {
        await this.run();
    }

    /**
     * the speed test calculations
     *
     * @returns {Promise<void>}
     */
    run = async () => {
        await this.getAverageDownloadSpeed(10);
        await this.getAveragePing(100);
        await this.getAverageUploadSpeed(10);
        await this.getClientInfo();
    };

    /**
     * reset the state to its default value
     *
     * @returns {Promise<void>}
     */
    resetMetrics = async () => {
        return this.setStateAsync({...defaultState});
    };

    /**
     * get the ip address and rough physical location of the client
     *
     * @returns {Promise<void>}
     */
    getClientInfo = async () => {
        let ip = await findIP();
        let r = await axios.get(clientInfo, {params: {ip}});
        await this.setStateAsync({
            clientIp: ip,
            clientCity: r.data.city,
            clientIsoCode: r.data.isoCode,
        });
    };

    /**
     *
     * @returns {Promise<void>}
     */
    getAverageDownloadSpeed = async iterations => {
        for (let index = 0; index < iterations; index++) {
            let r = await this.getDownloadSpeed();
            let downloadSpeedMbps = [...this.state.downloadSpeedMbps, r];
            let averageDownloadSpeedMbps = (downloadSpeedMbps.reduce((a, b) => a + b)) / downloadSpeedMbps.length;

            this.setState(prevState => ({
                downloadSpeedMbps,
                averageDownloadSpeedMbps,
            }), () => console.log(this.state.averageDownloadSpeedMbps))
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
    getAveragePing = async iterations => {
        for (const host of hosts) {
            for (let index = 0; index < iterations; index++) {
                let r = await this.getPing(host);
                let ping = [...this.state.ping, r];
                let averagePing = (ping.reduce((a, b) => a + b)) / ping.length;

                this.setState(prevState => ({
                    ping,
                    averagePing,
                }));
                await sleep(50);
            }
        }
    };

    /**
     *
     */
    getPing = async host => {
        let startTime;
        let xhr = new XMLHttpRequest();

        xhr.open("GET", `${host}?cacheCleaner=${uuid()}`, true);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Pragma", "no-cache");
        xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
        let promise = new Promise(resolve => {
            xhr.onload = function () {
                let endTime = new Date().getTime();
                let speedMs = endTime - startTime;
                resolve(speedMs);
            };
        });
        startTime = new Date().getTime();
        xhr.send();
        return promise;
    };

    /**
     *
     * @param iterations
     * @returns {Promise<void>}
     */
    getAverageUploadSpeed = async iterations => {
        for (let index = 0; index < iterations; index++) {
            let r = await this.getUploadSpeed();
            let uploadSpeedMbps = [...this.state.uploadSpeedMbps, r];
            let averageUploadSpeedMbps = (uploadSpeedMbps.reduce((a, b) => a + b)) / uploadSpeedMbps.length;

            this.setState(prevState => ({
                uploadSpeedMbps,
                averageUploadSpeedMbps,
            }), () => console.log(this.state.averageUploadSpeedMbps));
            await sleep(1000);
        }
    };

    /**
     *
     * @returns {Promise<number>}
     */
    getUploadSpeed = async () => {
        let url = `${testUploadSpeed}?cacheCleaner=${uuid()}`,  // prevent cache
            data = getRandomString(1),  // 1 MB POST size handled by all servers
            startTime,
            endTime,
            duration,
            bitsLoaded,
            speedBps,
            speedKbps,
            speedMbps;

        startTime = new Date().getTime();
        await axios.post(url, {data});
        endTime = new Date().getTime();
        duration = (endTime - startTime) / 1000;
        bitsLoaded = data.length * 8;
        speedBps = (bitsLoaded / duration).toFixed(2);
        speedKbps = (speedBps / 1024).toFixed(2);
        speedMbps = (speedKbps / 1024).toFixed(2);
        return parseFloat(speedMbps);

        /**
         * generate large payload
         *
         * @param sizeInMb
         * @returns {string}
         */
        function getRandomString(sizeInMb) {
            let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+`-=[]{}|;':,./<>?",  // random data prevents gzip effect
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
            averagePing,
            showMoreInfo,
            averageUploadSpeedMbps,
            averageDownloadSpeedMbps,
            clientIp,
            clientCity,
            clientIsoCode,
        } = this.state;

        return (
            <div className={`container`}>
                <div className={`logo`}>
                    <FontAwesomeIcon
                        icon={faTachometerAlt}
                        size="6x"
                        className={`logoSVG`}
                    />
                </div>
                <div className={`download`}>
                    <div className={`banner`}>
                        Your internet speed is
                    </div>
                    <div className={`downloadDisplay`}>
                        <span className={`downloadText`}>
                            {averageDownloadSpeedMbps.toFixed()}
                        </span>
                        <span className={`downloadMetric`}>
                            <span className={`mbps`}>
                                Mbps
                            </span>
                            <span className={`refresh`}>
                                <IconButton
                                    className={`refreshBtn`}
                                    onClick={async () => {
                                        await this.resetMetrics();
                                        await this.run();
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faRedoAlt}
                                        className={`refreshIcon`}
                                    />
                                </IconButton>
                            </span>
                        </span>
                    </div>
                </div>

                <div className={`moreInfoContainer`}>
                    {!showMoreInfo
                        ? (
                            <Button
                                variant="outlined"
                                className={`moreInfo`}
                                onClick={() => this.setState({showMoreInfo: true})}
                            >
                                Show more info
                            </Button>
                        )
                        : (
                            <div className={`latencyUploadSect`}>
                                <div className={``}>
                                    <div className={`latency`}>
                                        Latency
                                    </div>
                                    <div className={`lmLabel`}>
                                        Unloaded
                                    </div>
                                    <div>
                                        <span className={`lmMetric`}>
                                            {averagePing.toFixed()}
                                        </span>
                                        <span className={`lmInfo`}>
                                            ms
                                        </span>
                                    </div>
                                    <div className={`clientInfo`}>
                                        <span>
                                            <b>Client</b>
                                        </span>
                                        <span className={`clientLocation`}>
                                            {clientCity} {clientIsoCode}
                                        </span>
                                        <span className={`clientIp`}>
                                            {clientIp}
                                        </span>
                                    </div>
                                </div>
                                <div className={`spacer`}/>
                                <div className={``}>
                                    <div className={`upload`}>
                                        Upload
                                    </div>
                                    <div className={`lmLabel`}>
                                        Speed
                                    </div>
                                    <div>
                                        <span className={`lmMetric`}>
                                            {averageUploadSpeedMbps.toFixed()}
                                        </span>
                                        <span className={`lmInfo`}>
                                            Mbps
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const c = connect()(withStyles(styles, {withTheme: true})(Main));
export {c as Main};
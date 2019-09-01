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
        this.getDownloadSpeed();
        // this.sumPing();

    }

    sumPing = async () => {
        for (let index = 0; index < 100; index++) {
            hosts.forEach(async host => {
                await this.getPing(host, ping => this.setState({ping}));
            });
            await sleep(50);
        }
    };

    getDownloadSpeed = () => {
        // var imageAddr = "/test.jpg";
        // var imageAddr = "https://i.pinimg.com/originals/5c/f7/39/5cf7390adae7111d1ccc7b0f6625fc9d.jpg";
        var imageAddr = "https://hdqwalls.com/download/chicago-city-waterfall-8k-x1-7680x4320.jpg";
        // var downloadSize = 4995374; //bytes
        var downloadSize = 6937258;  // bytes

        function ShowProgressMessage(msg) {
            if (console) {
                if (typeof msg == "string") {
                    console.log(msg);
                } else {
                    for (var i = 0; i < msg.length; i++) {
                        console.log(msg[i]);
                    }
                }
            }

            var oProgress = document.getElementById("progress");
            if (oProgress) {
                var actualHTML = (typeof msg == "string") ? msg : msg.join("<br />");
                oProgress.innerHTML = actualHTML;
            }
        }

        function InitiateSpeedDetection() {
            // ShowProgressMessage("Loading the image, please wait...");
            window.setTimeout(MeasureConnectionSpeed, 1);
        }

        if (window.addEventListener) {
            window.addEventListener('load', InitiateSpeedDetection, false);
        } else if (window.attachEvent) {
            window.attachEvent('onload', InitiateSpeedDetection);
        }

        function MeasureConnectionSpeed() {
            var startTime, endTime;
            var download = new Image();
            download.onload = function () {
                endTime = (new Date()).getTime();
                showResults();
            };

            download.onerror = function (err, msg) {
                // ShowProgressMessage("Invalid image, or error downloading");
            };

            startTime = (new Date()).getTime();
            var cacheCleaner = "?cacheCleaner=" + startTime;
            download.src = `${imageAddr}${cacheCleaner}`;

            function showResults() {
                var duration = (endTime - startTime) / 1000;
                var bitsLoaded = downloadSize * 8;
                var speedBps = (bitsLoaded / duration).toFixed(2);
                var speedKbps = (speedBps / 1024).toFixed(2);
                var speedMbps = (speedKbps / 1024).toFixed(2);
                console.log({speedBps, speedKbps, speedMbps})
                // ShowProgressMessage([
                //     "Your connection speed is:",
                //     speedBps + " bps",
                //     speedKbps + " kbps",
                //     speedMbps + " Mbps"
                // ]);
            }
        }
    };

    /**
     *
     */
    getPing = async (host, callback) => {
        let started = new Date().getTime();
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
            let ended = new Date().getTime();
            let ping = ended - started;
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
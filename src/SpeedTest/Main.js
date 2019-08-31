import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({});

class Main extends React.Component {
    state = {};

    async componentDidMount() {
        this.getPing("google.com")
    }


    getDownloadSpeed = () => {
        // var imageAddr = "/test.jpg";
        // var imageAddr = "https://i.pinimg.com/originals/5c/f7/39/5cf7390adae7111d1ccc7b0f6625fc9d.jpg";
        var imageAddr = "https://hdqwalls.com/download/chicago-city-waterfall-8k-x1-7680x4320.jpg";
        var downloadSize = 4995374; //bytes

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
        };

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
            }

            download.onerror = function (err, msg) {
                // ShowProgressMessage("Invalid image, or error downloading");
            }

            startTime = (new Date()).getTime();
            var cacheBuster = "?nnn=" + startTime;
            download.src = imageAddr + cacheBuster;

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


    getPing = (ip) => {
        var started = new Date().getTime();

        var http = new XMLHttpRequest();

        http.open("GET", ip, true);
        http.onreadystatechange = function() {
            if (http.readyState == 4) {
                var ended = new Date().getTime();

                var milliseconds = ended - started;
                console.log({milliseconds})

                // if (pong != null) {
                //     pong(milliseconds);
                // }
            }
        };
        try {
            http.send(null);
        } catch(exception) {
            // this is expected
        }

    };


    render() {
        return <div/>
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const c = connect()(withStyles(styles, {withTheme: true})(Main));
export {c as Main};
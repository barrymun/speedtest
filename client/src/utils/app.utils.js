import axios from "axios";

/**
 *
 * @param m
 * @returns {Promise<any>}
 */
export const sleep = m => new Promise(r => setTimeout(r, m));


// export const findIP = () => new Promise(r => {
//     let w = window,
//         a = new (w.RTCPeerConnection || w.mozRTCPeerConnection || w.webkitRTCPeerConnection)({iceServers: []}),
//         b = () => {
//         };
//     a.createDataChannel("");
//     a.createOffer(c => a.setLocalDescription(c, b, b), b);
//     a.onicecandidate = c => {
//         try {
//             c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r)
//         } catch (e) {
//         }
//     }
// });


/**
 *
 * @returns {Promise<string>}
 */
export const findIP = async () => {
    let r = await axios.get("https://api6.ipify.org?format=json");
    return r.data.ip;
};
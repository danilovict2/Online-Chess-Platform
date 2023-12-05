import axios from "axios";

export function sendPostRequest(url, data) {
    axios.post(url, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
}
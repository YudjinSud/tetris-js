import {setCurrentPlayerIntoDOM, setCookie, CURRENT_LOGGED_PLAYER, createJson, getLastNameIndex} from "./utils.js";

const form = document.getElementById("form");
const name = document.getElementById("name");

window.onload = (evt) => {
  setCurrentPlayerIntoDOM(name);
};


form.addEventListener("submit", appendCookies);


function appendCookies() {
    let points = 0;
    if (document.cookie === "") {
        setCookie(name.value, createJson(name.value), {});
    }
    else {
        const cookies = document.cookie.split(";");
        const cookiesJSONs = cookies.map(c => c.split("=")[1]);
        const entries = cookiesJSONs.map(entry => JSON.parse(decodeURIComponent(entry)));
        const player = entries.find(entry => entry.name === name.value)
        if (!player) {
            setCookie(name.value, createJson(name.value), {});
        } else {
            points = player.points;
        }
    }
    setCookie(CURRENT_LOGGED_PLAYER, createJson(name.value, points), {});
}

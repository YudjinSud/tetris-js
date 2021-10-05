
export const CURRENT_LOGGED_PLAYER = "currentLoggedPlayer";

export function setCurrentPlayerIntoDOM(domNode, key = "value") {
    let lastLogged = getCookie(CURRENT_LOGGED_PLAYER);
    if (lastLogged) {
        domNode[key] += lastLogged.name;
        return;
    }
}

export function createJson(name, points = 0) {
    return {
        name: name,
        points: points,
    }
}

export function getLastNameIndex() {
    const cookies = document.cookie.split(";");
    return cookies.length-1;
}


export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? JSON.parse(decodeURIComponent(matches[1])) : undefined;
}

export function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(JSON.stringify(value));

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

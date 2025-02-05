"use strict";
let version = "0.0.0A";
let debug = true;
let host = "http://192.168.0.26:5000/api";
print("loading...");
init();
function print(...input) {
    if (debug === false) {
        return;
    }
    const log = input[0];
    input.splice(0, 1);
    if (input.length <= 0) {
        console.log(log);
    }
    else {
        console.log(log, input);
    }
}
function warn(...input) {
    const log = input[0];
    input.splice(0, 1);
    console.warn(log, input);
}
function error(...input) {
    const log = input[0];
    input.splice(0, 1);
    console.error(log, input);
}
function init() {
    print('initializing (version: ' + version + ')...');
    listen();
    reload();
    waitForElement("#navbar", (element) => {
        loadnavbar(element);
    });
    waitForElement("#footer", (element) => {
        loadfooter(element);
    });
}
function waitForElement(selector, callback) {
    function startObserver() {
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                obs.disconnect();
            }
        });
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
        else {
            error("document.body is not available");
        }
        const existingElement = document.querySelector(selector);
        if (existingElement) {
            callback(existingElement);
        }
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startObserver);
    }
    else {
        startObserver();
    }
}
function loadnavbar(element) {
    print("loading navbar...");
    element.innerHTML = '';
    element.classList.add("roboto");
    element.appendChild(buildNavitem('Home', '/', 'house.png'));
    element.appendChild(buildNavitem('Apps', '/apps.html', 'book.png'));
    element.appendChild(buildNavitem('News', '/feed.html', 'newspaper.png'));
    element.appendChild(buildNavitem('Status', '/status.html', 'signal.png'));
}
function buildNavitem(name, path, icon) {
    const div = document.createElement('div');
    div.classList.add("roboto", "navbar-item");
    var same = getPath() === path.replace('.html', '');
    print("building nav-item (" + name + ")... (same: " + same + ")");
    if (same) {
        div.classList.add("nav-item-highlight");
    }
    const image = `<img class="invert" src="/images/icons/nav/${icon}" height="20">`;
    div.innerHTML = `${image}<span>${name}</span>`;
    div.onclick = function (event) {
        if (same) {
            return;
        }
        window.location.href = path;
    };
    return div;
}
function getPath() {
    var path = window.location.pathname;
    path = path.replace('.html', '');
    if (path === '/index') {
        path = '/';
    }
    print("detected path as " + path + " (from " + window.location.pathname + ")");
    return path;
}
function loadfooter(element) {
    print("loading footer...");
    element.classList.add("roboto");
    element.innerHTML = "<p>&copy; 2025 Calebh101</p>";
}
function listen() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        reload();
    });
}
function reload() {
    print('reloading...');
    var theme = '';
    var isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode) {
        theme = 'dark';
    }
    else {
        theme = 'light';
    }
    const path = "/styles/" + theme + ".css";
    const link = document.createElement("link");
    print('setting stylesheet to ' + path);
    link.rel = "stylesheet";
    link.href = path;
    document.head.appendChild(link);
}
function getDefaultStatusMessage(status) {
    let message = 'Unknown';
    switch (status) {
        case 0:
            message = 'Operational';
            break;
        case 1:
            message = 'Issues';
            break;
        case 2:
            message = 'Error';
            break;
        case 3:
            message = 'Critical Error';
            break;
    }
    return message;
}

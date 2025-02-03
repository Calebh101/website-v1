"use strict";
let version = "0.0.0A";
let debug = true;
let host = "http://192.168.0.26:5000/api";
print("loading...");
init();
function print(input) {
    if (debug === false) {
        return;
    }
    console.log(input);
}
function warn(input) {
    console.warn(input);
}
function error(input) {
    console.error(input);
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
            console.error("document.body is not available.");
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

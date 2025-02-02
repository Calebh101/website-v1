"use strict";
let version = "0.0.0A";
let debug = true;
let host = "http://192.168.0.26:5000/api";
let feedData = { "catalog": [] };
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
function loadFeed() {
    fetch(host + '/catalog/all')
        .then(response => {
        if (!response.ok) {
            throw new Error('network response was not response.ok');
        }
        return response.json();
    })
        .then(data => {
        print("found data");
        feedData = data;
        const dropdown = document.getElementById("typeSelect");
        const queryField = document.getElementById("feed-query");
        generateFeed(dropdown.value, queryField.value);
    })
        .catch(error => { print(error); });
}
function generateFeed(type, query) {
    print('generating feed... (type: ' + type + ') (query: ' + query + ')');
    const data = feedData;
    const catalog = data.catalog;
    const element = document.querySelector('.feed-container');
    var divs = [];
    catalog.forEach((element, index) => {
        if ((element.type == type || type == "all") && ((query == "" || query == null) || (isMatch(query, element.name) || isMatch(query, element.summary)))) {
            const container = document.createElement('div');
            const div = document.createElement('div');
            div.classList.add('feed-item', 'roboto');
            container.classList.add('feed-item-container');
            var platformText = '';
            var categories = [];
            var urlText = 'Webpage: <a href="' + element.url.website + '" target="_blank">' + element.url.website + '</a>';
            if (element.url.github) {
                urlText = urlText + '<br>GitHub: <a href="' + element.url.github + '" target="_blank">' + element.url.github + '</a>';
            }
            div.onclick = function () {
                window.open(element.url.website, '_blank');
            };
            element.platforms.forEach((platform, i) => {
                platformText = platformText + '<img class="invert" src="images/icons/platforms/' + platform + '.png" alt="' + platform + '" height="20" style="padding: 4px;">';
            });
            element.categories.forEach((category, index) => {
                categories.push(category.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '));
            });
            div.innerHTML = `<h3>${highlightText(query, element.name)}</h3><p>${highlightText(query, element.summary)}</p><p class="small">V. ${element.version}<br>Categories: ${categories.join(', ')}</p><p>${urlText}</p><p>${platformText}</p>`;
            container.appendChild(div);
            divs.push(container);
        }
    });
    element.innerHTML = '';
    divs.forEach(div => {
        element.appendChild(div);
    });
}
function highlightText(query, text) {
    if (query === null) {
        return text;
    }
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="match">$1</span>');
}
function isMatch(query, text) {
    if (query === null) {
        return false;
    }
    const result = highlightText(query, text);
    return text !== result; // true if the query is different from the original
}

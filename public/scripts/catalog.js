"use strict";
let appsData = { "catalog": [] };
let statusData = { "status": {} };
let feedData = {};
function loadApps() {
    fetch(host + '/catalog/all')
        .then(response => {
        if (!response.ok) {
            throw new Error('network response was not response.ok');
        }
        return response.json();
    })
        .then(data => {
        print("apps: found data");
        appsData = data;
        const dropdown = document.getElementById("typeSelect");
        const queryField = document.getElementById("apps-query");
        const platform = document.getElementById("platformSelect");
        generateApps(dropdown.value, queryField.value, [platform.value]);
    })
        .catch(error => { print(error); });
}
function generateApps(type, query, platform) {
    const data = appsData;
    const catalog = data.catalog;
    const element = document.querySelector('.apps-container');
    var divs = [];
    platform !== null && platform !== void 0 ? platform : (platform = []);
    if (platform.includes("all")) {
        platform = [];
    }
    catalog.forEach((element, index) => {
        var platformText = '';
        element.platforms.forEach((platform, i) => {
            platformText = platformText + '<img class="invert" src="images/icons/platforms/' + platform + '.png" alt="' + platform + '" height="20" style="padding: 4px;">';
        });
        if ((element.type == type || type == "all") && (platform.some(item => element.platforms.includes(item)) || JSON.stringify(platform) === "[]") && ((query == "" || query == null) || (isMatch(query, element.name) || isMatch(query, element.summary) || isMatch(query, element.url.website) || (element.url.github ? isMatch(query, element.url.github) : false) || isAnyMatch(query, element.categories) || isMatch(query, element.version)))) {
            const container = document.createElement('div');
            const div = document.createElement('div');
            div.classList.add('apps-item', 'roboto');
            container.classList.add('apps-item-container');
            var urlText = 'Webpage: <a href="' + element.url.website + '" target="_blank">' + highlightText(query, element.url.website) + '</a>';
            var categories = [];
            if (element.url.github) {
                urlText = urlText + '<br>GitHub: <a href="' + element.url.github + '" target="_blank">' + highlightText(query, element.url.github) + '</a>';
            }
            div.onclick = function (event) {
                if (event.target.tagName !== 'A') {
                    print("action: element.url.website.open");
                    window.open(element.url.website, '_blank');
                }
                else {
                    print("action: ignored: element.url.website.open");
                }
            };
            element.categories.forEach((category, index) => {
                categories.push(highlightText(query, category.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')));
            });
            div.innerHTML = `<h3>${highlightText(query, element.name)}</h3><p>${highlightText(query, element.summary)}</p><p class="small">V. ${highlightText(query, element.version)}<br>Categories: ${categories.join(', ')}</p><p>${urlText}</p><p>${platformText}</p>`;
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
    if (query === null || text === null) {
        return false;
    }
    const result = highlightText(query, text);
    return text !== result; // true if the query is different from the original
}
function isAnyMatch(query, text) {
    if (query === null) {
        return false;
    }
    for (let i = 0; i < text.length; i++) {
        if (isMatch(query, text[i])) {
            return true; // true if the query is different from the original
        }
    }
    return false;
}
function loadStatus() {
    fetch(host + '/launch/status')
        .then(response => {
        if (!response.ok) {
            throw new Error('network response was not response.ok');
        }
        return response.json();
    })
        .then(data => {
        print("status: found data");
        statusData = data;
        const queryField = document.getElementById("status-query");
        generateStatus(queryField.value);
    })
        .catch(error => { print(error); });
}
function generateStatus(query) {
    const data = statusData;
    const catalog = Object.keys(data.status);
    const element = document.querySelector('.status-container');
    var divs = [];
    catalog.forEach((item, index) => {
        const element = data.status[item];
        const serviceData = element.services;
        const serviceKeys = Object.keys(serviceData);
        let serviceNames = [];
        serviceKeys.forEach((key, index) => {
            const item = serviceData[key];
            serviceNames.push(item.name);
        });
        if ((query == "" || query == null) || isMatch(query, element.name) || isAnyMatch(query, serviceKeys) || isAnyMatch(query, serviceNames)) {
            const container = document.createElement('div');
            const div = document.createElement('div');
            div.classList.add('status-item', 'roboto');
            container.classList.add('status-item-container');
            let serviceList = [];
            serviceKeys.forEach((key, i) => {
                var _a;
                const item = serviceData[key];
                let color = 'white';
                switch (item.status) {
                    case 0:
                        color = 'green';
                        break;
                    case 1:
                        color = 'yellow';
                        break;
                    case 2:
                        color = 'red';
                        break;
                    case 3:
                        color = 'purple';
                        break;
                }
                serviceList.push(`<tr style="text-align: left;"><th>${highlightText(query, item.name)}</th><th>${highlightText(query, key)}</th><th style="color: ${color};">${(_a = item.message) !== null && _a !== void 0 ? _a : getDefaultStatusMessage(item.status)}</th>`);
            });
            div.innerHTML = `<h3 style="text-align: center;">${highlightText(query, element.name)}</h3><table style="border-spacing: 10px;"><tr><th>Name</th><th>Item</th><th>Status</th></tr>${serviceList.join('')}</table>`;
            container.appendChild(div);
            divs.push(container);
        }
    });
    element.innerHTML = '';
    divs.forEach(div => {
        element.appendChild(div);
    });
}
function getFeedImage(type) {
    return `<a href="${host}/feeds/${type}" target="_blank"><img class="invert" height="40" style="padding: 10px;" src="/images/icons/feed/${type}.png"></a>`;
}
function loadFeed() {
    fetch(host + '/feeds/json')
        .then(response => {
        if (!response.ok) {
            throw new Error('network response was not response.ok');
        }
        return response.json();
    })
        .then(data => {
        print("feed: found data");
        const queryField = document.getElementById("feed-query");
        document.getElementById("feed-title").innerText = data.title;
        document.getElementById("feed-summary").innerText = data.description;
        document.getElementById("feed-subscribe").innerHTML = `${getFeedImage('json')}${getFeedImage('rss')}${getFeedImage('atom')}`;
        feedData = data;
        generateFeed(queryField.value);
    })
        .catch(error => { print(error); });
}
function generateFeed(query) {
    const data = feedData;
    const element = document.querySelector('.feed-container');
    var divs = [];
    data.items.forEach((element, index) => {
        if ((query == "" || query == null) || isMatch(query, element.title) || isMatch(query, element.summary)) {
            const container = document.createElement('div');
            const div = document.createElement('div');
            div.classList.add('feed-item', 'roboto');
            container.classList.add('feed-item-container');
            div.onclick = function (event) {
                if (event.target.tagName !== 'A') {
                    print("action: element.url.open");
                    window.open(element.url, '_blank');
                }
                else {
                    print("action: ignored: element.url.open");
                }
            };
            div.innerHTML = `<h3 style="text-align: center;">${highlightText(query, element.title)}</h3><p>${highlightText(query, element.summary)}</p>`;
            container.appendChild(div);
            divs.push(container);
        }
    });
    element.innerHTML = '';
    divs.forEach(div => {
        element.appendChild(div);
    });
}

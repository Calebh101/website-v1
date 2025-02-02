let version: string = "0.0.0A";
init();

function print(input: any) {
    console.log(input);
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

    var theme: string = '';
    var isDarkMode: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDarkMode) {
        theme = 'dark';
    } else {
        theme = 'light';
    }

    const path = "/styles/" + theme + ".css";
    const link = document.createElement("link");
    print('setting stylesheet to ' + path);
    link.rel = "stylesheet";
    link.href = path;
    document.head.appendChild(link);
}

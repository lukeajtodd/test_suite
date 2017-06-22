(async function() {
    var { Chrome } = require('./Chrome');
    var EventEmitter = require('events');
    var instances = [];
    var urls = [
        '',
        'https:/www.google.com',
        'https://en.wikipedia.org/wiki/China'
    ]


    for (let i = 0; i < 3; i++) {
        let chrome = new Chrome(`inst${i}`);
        instances[i] = {
            chrome: chrome,
            url: urls[i]
        }
    }

    instances.forEach((inst) => {
        let chrome = inst.chrome;
        chrome.EE.on('initialised', () => {
            chrome.Page.navigate({ url: inst.url });

            chrome.Page.loadEventFired(async () => {
                chrome.capture_page();
            });
        });
    })

    // var chrome = new Chrome();

    // chrome.EE.on('initialised', () => {
    //     chrome.Page.navigate({ url: 'https://www.google.com' });

    //     chrome.Page.loadEventFired(async () => {
    //         chrome.capture_page();
    //     });
    // });

    // c.EE.on('initialised', () => {
    //     c.Page.navigate({ url: '' });

    //     c.Page.loadEventFired(async () => {
    //         c.capture_page();
    //     });
    // });

})();
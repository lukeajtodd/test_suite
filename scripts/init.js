(async function() {
    var { Chrome } = require('./Chrome');
    var EventEmitter = require('events');
    var instances = [];
    var urls = [
        'https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes',
        'https://www.google.com',
        'https://en.wikipedia.org/wiki/China'
    ]


    for (let i = 0; i < 3; i++) {
        let chrome = new Chrome();
        instances[i] = {
            chrome: chrome,
            url: urls[i]
        }
        instances[i].chrome.tag = urls[i].split('/')[1];
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

    // var c = new Chrome();

    // c.EE.on('initialised', () => {
    //     c.Page.navigate({ url: 'https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes' });

    //     c.Page.loadEventFired(async () => {
    //         await c.capture_page();
    //     });
    // });

})();
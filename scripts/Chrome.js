export class Chrome {

    constructor() {
        this.fs = require('fs');
        this.path = require('path');
        this.Jimp = require('jimp');
        this.utils = require('./utils');
        this.interface = require('chrome-remote-interface');
        this.launcher = require('lighthouse/chrome-launcher/chrome-launcher');

        let EventEmitter = require('events');
        this.EE = new EventEmitter();

        this.init();
    }

    async init() {
        try {
            this.chrome = await this.launch();
            this.protocol = await this.genProtocol();
            await this.enable_page_and_runtime();
            await this.enable_emulation();
            this.EE.emit('initialised');
        } catch(e) {
            console.error(e);
        }
    }

    async launch(headless = true) {
        return this.launcher.launch({
            chromeFlags: [
                '--window-size=1366, 768',
                '--disable-gpu',
                headless ? '--headless' : ''
            ]
        });
    }

    async genProtocol() {
        return this.interface({ port: this.chrome.port });
    }

    async enable_page_and_runtime() {
        const { Page, Runtime } = this.protocol;
        this.Page = Page;
        this.Runtime = Runtime;

        await this.Page.enable();
        await this.Runtime.enable();
    }

    async enable_emulation() {
        const { Emulation } = this.protocol;
        this.Emulation = Emulation;
    }

    async kill() {
        await this.protocol.close();
        await this.chrome.kill();
    }

    async capture_page() {
        try {

            await this.utils.rmdir(`./screenshots/${this.tag}`);
            await this.utils.mkdir(this.path.resolve(`./screenshots/${this.tag}`));

            await this.clear_cookie_banner();
            await this.Runtime.evaluate({ expression: `document.body.style.overflow = 'hidden'` });

            const RESULT = await this.Runtime.evaluate({ expression: 'document.body.scrollHeight' });
            const DOC_LENGTH = RESULT.result.value;
            const ITER_COUNT = Math.floor(DOC_LENGTH / 768);
            const REMAINS = Math.floor(768 * ((DOC_LENGTH / 768) - Math.floor(ITER_COUNT)));
            let container = [];

            if (ITER_COUNT === 1) {
                let {data} = await this.Page.captureScreenshot();
                this.fs.writeFileSync(`${this.screenshotsDir}/result.jpg`, Buffer.from(data, 'base64'));
            } else {
                for (let i = 1; i <= ITER_COUNT; i++) {
                    let {data} = await this.Page.captureScreenshot();
                    let image = await this.Jimp.read(Buffer.from(data, 'base64'));
                    container.push(image);
                    await this.Runtime.evaluate({ expression: `window.scroll(0, ${768 * i})` });
                }

                await this.Emulation.setVisibleSize({ width: 1366, height: REMAINS });
                await this.Emulation.forceViewport({ x: 0, y: (DOC_LENGTH - REMAINS), scale: 1 });

                let {data} = await this.Page.captureScreenshot();
                let image = await this.Jimp.read(Buffer.from(data, 'base64'));
                container.push(image);
            }

        } catch (err) {

            console.error(err);

        } finally {

            if (ITER_COUNT !== 1) {

                this.stitch_page(ITER_COUNT, container);
            }

            await this.kill();
            
        }
    }

    async clear_cookie_banner() {
        await this.Runtime.evaluate({ expression: `
            let el = document.getElementById("cookieBanner");
            el.parentNode.removeChild(el);
        ` })
    }

    async stitch_page(count, container) {
        let blitted = [];
        if (container.length % 2 === 0) {
            var spare_item = container.pop();
        }
        do {
            await this.stitcher(container[0], container[1], blitted);

            container.splice(0, 1);
            container.splice(0, 1);

            if (container.length === 1) {
                let temp_image = blitted[blitted.length - 1];
                blitted.splice(blitted.length - 1, 1);
                await this.stitcher(temp_image, container[0], blitted);
                container.splice(0, 1);
                container = blitted;
                blitted = [];
            } else if (container.length < 1) {
                container = blitted;
                blitted = [];
            }

        } while (container.length != 1)
        container[0].quality(30).write(`./${this.screenshotsDir}/result.jpg`);
    }

    async stitcher(image1, image2, result_arr) {
        let current_height = image1.bitmap.height;
        image1
            .contain(
                image1.bitmap.width,
                (image1.bitmap.height + image2.bitmap.height),
                this.Jimp.VERTICAL_ALIGN_TOP
            )
            .blit(
                image2,
                0,
                current_height,
                function (err, image) {
                    image
                    result_arr.push(image);
                }
            );
        
    }


}
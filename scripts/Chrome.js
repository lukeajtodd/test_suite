export class Chrome {

    constructor(name = 'unassigned') {
        this.name = name;
        this.fs = require('fs');
        this.path = require('path');
        this.Jimp = require('jimp');
        this.utils = require('./utils');
        this.interface = require('chrome-remote-interface');
        this.launcher = require('lighthouse/chrome-launcher/chrome-launcher');

        this.screenshotsDir = `screenshots-${name}`;

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

            await this.utils.rmdir(`./${this.screenshotsDir}`);
            await this.utils.mkdir(this.path.resolve(`./${this.screenshotsDir}`));

            await this.clear_cookie_banner();

            const RESULT = await this.Runtime.evaluate({ expression: 'document.body.scrollHeight' });
            const DOC_LENGTH = RESULT.result.value;
            const ITER_COUNT = Math.floor(DOC_LENGTH / 768);
            const REMAINS = Math.floor(768 * (ITER_COUNT - Math.floor(ITER_COUNT)));

            if (ITER_COUNT === 1) {
                let {data} = await this.Page.captureScreenshot();
                this.fs.writeFileSync(`${this.screenshotsDir}/result.png`, Buffer.from(data, 'base64'));
            } else {
                for (let i = 1; i < ITER_COUNT; i++) {
                    let {data} = await this.Page.captureScreenshot();
                    this.fs.writeFileSync(`${this.screenshotsDir}/current${i}.png`, Buffer.from(data, 'base64'));
                    await this.Runtime.evaluate({ expression: 'window.scroll(0, 768)' });
                }

                await this.Emulation.setVisibleSize({ width: 1366, height: REMAINS });
                await this.Emulation.forceViewport({ x: 0, y: (DOC_LENGTH - REMAINS), scale: 1 });

                let {data} = await this.Page.captureScreenshot();
                this.fs.writeFileSync(`${this.screenshotsDir}/current${i}.png`, Buffer.from(data, 'base64'));

                this.stitch_page(ITER_COUNT);
            }

        } catch (err) {

            console.error(err);

        } finally {

            await this.kill();
            
        }
    }

    async clear_cookie_banner() {
        await this.Runtime.evaluate({ expression: `
            let el = document.getElementById("cookieBanner");
            el.parentNode.removeChild(el);
        ` })
    }

    async stitch_page(count, imagePath = `./${this.screenshotsDir}/current1.png`) {
        if (count > 10) {
            // WILL MERGE SORT BLIT
            // for () {
            //     let img = stitcher(count, imagePath = `./${this.screenshotsDir}/current1.png`)
            // }
        } else {
            let img = stitcher(count, imagePath = `./${this.screenshotsDir}/current1.png`)
            img.write(`./${this.screenshotsDir}/result.png`);
        }
    }

    async stitcher() {
        let img = await this.Jimp.read(imagePath);
        for (let i = 1; i < count; i++) {
            let next_img;
            this.Jimp.read(`./${this.screenshotsDir}/current${i + 1}.png`, (e, img) => {
                if (e) throw e;
                img.quality(50)
                next_img = img;
            });

            img
                .contain(
                    img.bitmap.width,
                    (img.bitmap.height + next_img.bitmap.height),
                    this.Jimp.VERTICAL_ALIGN_TOP
                )
                .blit(
                    next_img,
                    0,
                    (img.bitmap.height - next_img.bitmap.height)
                );
        }

        return img;
    }


}
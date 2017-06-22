"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Chrome = (function () {
    function Chrome(name) {
        if (name === void 0) { name = 'unassigned'; }
        this.name = name;
        this.fs = require('fs');
        this.path = require('path');
        this.Jimp = require('jimp');
        this.utils = require('./utils');
        this.interface = require('chrome-remote-interface');
        this.launcher = require('lighthouse/chrome-launcher/chrome-launcher');
        this.screenshotsDir = "screenshots-" + name;
        var EventEmitter = require('events');
        this.EE = new EventEmitter();
        this.init();
    }
    Chrome.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        _a = this;
                        return [4 /*yield*/, this.launch()];
                    case 1:
                        _a.chrome = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.genProtocol()];
                    case 2:
                        _b.protocol = _c.sent();
                        return [4 /*yield*/, this.enable_page_and_runtime()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, this.enable_emulation()];
                    case 4:
                        _c.sent();
                        this.EE.emit('initialised');
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _c.sent();
                        console.error(e_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Chrome.prototype.launch = function (headless) {
        if (headless === void 0) { headless = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.launcher.launch({
                        chromeFlags: [
                            '--window-size=1366, 768',
                            '--disable-gpu',
                            headless ? '--headless' : ''
                        ]
                    })];
            });
        });
    };
    Chrome.prototype.genProtocol = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.interface({ port: this.chrome.port })];
            });
        });
    };
    Chrome.prototype.enable_page_and_runtime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, Page, Runtime;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.protocol, Page = _a.Page, Runtime = _a.Runtime;
                        this.Page = Page;
                        this.Runtime = Runtime;
                        return [4 /*yield*/, this.Page.enable()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.Runtime.enable()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Chrome.prototype.enable_emulation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Emulation;
            return __generator(this, function (_a) {
                Emulation = this.protocol.Emulation;
                this.Emulation = Emulation;
                return [2 /*return*/];
            });
        });
    };
    Chrome.prototype.kill = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.protocol.close()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.chrome.kill()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Chrome.prototype.capture_page = function () {
        return __awaiter(this, void 0, void 0, function () {
            var RESULT, DOC_LENGTH, ITER_COUNT, REMAINS, data, i, data_1, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 16, 17, 19]);
                        return [4 /*yield*/, this.utils.rmdir("./" + this.screenshotsDir)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.utils.mkdir(this.path.resolve("./" + this.screenshotsDir))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.clear_cookie_banner()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.Runtime.evaluate({ expression: 'document.body.scrollHeight' })];
                    case 4:
                        RESULT = _a.sent();
                        DOC_LENGTH = RESULT.result.value;
                        ITER_COUNT = Math.floor(DOC_LENGTH / 768);
                        REMAINS = Math.floor(768 * (ITER_COUNT - Math.floor(ITER_COUNT)));
                        if (!(ITER_COUNT === 1)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.Page.captureScreenshot()];
                    case 5:
                        data = (_a.sent()).data;
                        this.fs.writeFileSync(this.screenshotsDir + "/result.png", Buffer.from(data, 'base64'));
                        return [3 /*break*/, 15];
                    case 6:
                        i = 1;
                        _a.label = 7;
                    case 7:
                        if (!(i < ITER_COUNT)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.Page.captureScreenshot()];
                    case 8:
                        data_1 = (_a.sent()).data;
                        this.fs.writeFileSync(this.screenshotsDir + "/current" + i + ".png", Buffer.from(data_1, 'base64'));
                        return [4 /*yield*/, this.Runtime.evaluate({ expression: 'window.scroll(0, 768)' })];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 7];
                    case 11: return [4 /*yield*/, this.Emulation.setVisibleSize({ width: 1366, height: REMAINS })];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, this.Emulation.forceViewport({ x: 0, y: (DOC_LENGTH - REMAINS), scale: 1 })];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, this.Page.captureScreenshot()];
                    case 14:
                        data = (_a.sent()).data;
                        this.fs.writeFileSync(this.screenshotsDir + "/current" + i + ".png", Buffer.from(data, 'base64'));
                        this.stitch_page(ITER_COUNT);
                        _a.label = 15;
                    case 15: return [3 /*break*/, 19];
                    case 16:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 19];
                    case 17: return [4 /*yield*/, this.kill()];
                    case 18:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    Chrome.prototype.clear_cookie_banner = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Runtime.evaluate({ expression: "\n            let el = document.getElementById(\"cookieBanner\");\n            el.parentNode.removeChild(el);\n        " })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Chrome.prototype.stitch_page = function (count, imagePath) {
        if (imagePath === void 0) { imagePath = "./" + this.screenshotsDir + "/current1.png"; }
        return __awaiter(this, void 0, void 0, function () {
            var img;
            return __generator(this, function (_a) {
                if (count > 10) {
                    // WILL MERGE SORT BLIT
                    // for () {
                    //     let img = stitcher(count, imagePath = `./${this.screenshotsDir}/current1.png`)
                    // }
                }
                else {
                    img = stitcher(count, imagePath = "./" + this.screenshotsDir + "/current1.png");
                    img.write("./" + this.screenshotsDir + "/result.png");
                }
                return [2 /*return*/];
            });
        });
    };
    Chrome.prototype.stitcher = function () {
        return __awaiter(this, void 0, void 0, function () {
            var img, _loop_1, this_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Jimp.read(imagePath)];
                    case 1:
                        img = _a.sent();
                        _loop_1 = function (i) {
                            var next_img;
                            this_1.Jimp.read("./" + this_1.screenshotsDir + "/current" + (i + 1) + ".png", function (e, img) {
                                if (e)
                                    throw e;
                                img.quality(50);
                                next_img = img;
                            });
                            img
                                .contain(img.bitmap.width, (img.bitmap.height + next_img.bitmap.height), this_1.Jimp.VERTICAL_ALIGN_TOP)
                                .blit(next_img, 0, (img.bitmap.height - next_img.bitmap.height));
                        };
                        this_1 = this;
                        for (i = 1; i < count; i++) {
                            _loop_1(i);
                        }
                        return [2 /*return*/, img];
                }
            });
        });
    };
    return Chrome;
}());
exports.Chrome = Chrome;

//# sourceMappingURL=sourcemaps/Chrome.js.map

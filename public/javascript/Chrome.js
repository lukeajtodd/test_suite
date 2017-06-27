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
    function Chrome() {
        this.fs = require('fs');
        this.path = require('path');
        this.Jimp = require('jimp');
        this.utils = require('./utils');
        this.interface = require('chrome-remote-interface');
        this.launcher = require('lighthouse/chrome-launcher/chrome-launcher');
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
            var RESULT, DOC_LENGTH, ITER_COUNT, REMAINS, container, data, i, data_1, image_1, data, image, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 19, 20, 22]);
                        return [4 /*yield*/, this.utils.rmdir("./screenshots/" + this.tag)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.utils.mkdir(this.path.resolve("./screenshots/" + this.tag))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.clear_cookie_banner()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.Runtime.evaluate({ expression: "document.body.style.overflow = 'hidden'" })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.Runtime.evaluate({ expression: 'document.body.scrollHeight' })];
                    case 5:
                        RESULT = _a.sent();
                        DOC_LENGTH = RESULT.result.value;
                        ITER_COUNT = Math.floor(DOC_LENGTH / 768);
                        REMAINS = Math.floor(768 * ((DOC_LENGTH / 768) - Math.floor(ITER_COUNT)));
                        container = [];
                        if (!(ITER_COUNT === 1)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.Page.captureScreenshot()];
                    case 6:
                        data = (_a.sent()).data;
                        this.fs.writeFileSync(this.screenshotsDir + "/result.jpg", Buffer.from(data, 'base64'));
                        return [3 /*break*/, 18];
                    case 7:
                        i = 1;
                        _a.label = 8;
                    case 8:
                        if (!(i <= ITER_COUNT)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.Page.captureScreenshot()];
                    case 9:
                        data_1 = (_a.sent()).data;
                        return [4 /*yield*/, this.Jimp.read(Buffer.from(data_1, 'base64'))];
                    case 10:
                        image_1 = _a.sent();
                        container.push(image_1);
                        return [4 /*yield*/, this.Runtime.evaluate({ expression: "window.scroll(0, " + 768 * i + ")" })];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        i++;
                        return [3 /*break*/, 8];
                    case 13: return [4 /*yield*/, this.Emulation.setVisibleSize({ width: 1366, height: REMAINS })];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, this.Emulation.forceViewport({ x: 0, y: (DOC_LENGTH - REMAINS), scale: 1 })];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, this.Page.captureScreenshot()];
                    case 16:
                        data = (_a.sent()).data;
                        return [4 /*yield*/, this.Jimp.read(Buffer.from(data, 'base64'))];
                    case 17:
                        image = _a.sent();
                        container.push(image);
                        _a.label = 18;
                    case 18: return [3 /*break*/, 22];
                    case 19:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 22];
                    case 20:
                        if (ITER_COUNT !== 1) {
                            this.stitch_page(ITER_COUNT, container);
                        }
                        return [4 /*yield*/, this.kill()];
                    case 21:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 22: return [2 /*return*/];
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
    Chrome.prototype.stitch_page = function (count, container) {
        return __awaiter(this, void 0, void 0, function () {
            var blitted, spare_item, temp_image;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blitted = [];
                        if (container.length % 2 === 0) {
                            spare_item = container.pop();
                        }
                        _a.label = 1;
                    case 1: return [4 /*yield*/, this.stitcher(container[0], container[1], blitted)];
                    case 2:
                        _a.sent();
                        container.splice(0, 1);
                        container.splice(0, 1);
                        if (!(container.length === 1)) return [3 /*break*/, 4];
                        temp_image = blitted[blitted.length - 1];
                        blitted.splice(blitted.length - 1, 1);
                        return [4 /*yield*/, this.stitcher(temp_image, container[0], blitted)];
                    case 3:
                        _a.sent();
                        container.splice(0, 1);
                        container = blitted;
                        blitted = [];
                        return [3 /*break*/, 5];
                    case 4:
                        if (container.length < 1) {
                            container = blitted;
                            blitted = [];
                        }
                        _a.label = 5;
                    case 5:
                        if (container.length != 1) return [3 /*break*/, 1];
                        _a.label = 6;
                    case 6:
                        container[0].quality(30).write("./" + this.screenshotsDir + "/result.jpg");
                        return [2 /*return*/];
                }
            });
        });
    };
    Chrome.prototype.stitcher = function (image1, image2, result_arr) {
        return __awaiter(this, void 0, void 0, function () {
            var current_height;
            return __generator(this, function (_a) {
                current_height = image1.bitmap.height;
                image1
                    .contain(image1.bitmap.width, (image1.bitmap.height + image2.bitmap.height), this.Jimp.VERTICAL_ALIGN_TOP)
                    .blit(image2, 0, current_height, function (err, image) {
                    image;
                    result_arr.push(image);
                });
                return [2 /*return*/];
            });
        });
    };
    return Chrome;
}());
exports.Chrome = Chrome;

//# sourceMappingURL=sourcemaps/Chrome.js.map
